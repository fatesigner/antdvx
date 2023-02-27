import { computed, defineComponent, onBeforeUnmount, onMounted, PropType, reactive, ref, Teleport, watch } from 'vue';
import { addClass, removeClass } from '@fatesigner/utils/document';
import to from 'await-to-js';
import dayjs from 'dayjs';
import { animationFrameScheduler, fromEvent, merge, Subscription } from 'rxjs';
import { map, subscribeOn, switchMap, takeUntil, tap } from 'rxjs/operators';

import { i18nMessages } from '../../i18n/messages';
import { getBoundaryPosition, getEventArgs, waitTransitionend } from '../../utils';
import { XButton } from '../button';
import { IconCheckLine, IconCloseLine, IconRefreshLine } from '../iconfont';

const defaultImages = [
  require('./assets/1.jpg'),
  require('./assets/2.jpg'),
  require('./assets/3.jpg'),
  require('./assets/4.jpg')
];

/**
 * 验证码弹出层
 */
const SlideModal = defineComponent({
  name: 'SlideModal',
  components: {
    XButton,
    IconCloseLine,
    IconRefreshLine
  },
  props: {
    theme: {
      type: String as PropType<'dark' | 'light'>,
      default: 'light'
    },
    images: {
      required: true,
      type: Array as PropType<string[]>
    },
    backgroundSize: {
      type: String as PropType<'contain' | 'cover'>,
      default: 'cover'
    },
    precision: {
      type: Number as PropType<number>,
      default: 5
    },
    position: {
      type: Object as PropType<{ top: number; left: number }>,
      default: () => ({ top: 0, left: 0 })
    }
  },
  emits: ['close', 'failed', 'successful'],
  setup(props, { emit }) {
    const status = ref<'initial' | 'successful' | 'failed'>('initial');
    const canvasRef = ref<HTMLCanvasElement>(null);
    const canvasChunkRef = ref<HTMLCanvasElement>(null);
    const sliderRef = ref<HTMLElement>(null);
    const sliderBtnRef = ref<HTMLElement>(null);
    const resultRef = ref<HTMLElement>(null);
    const loading = ref(false);

    const wrapStyle = computed(() => {
      return {
        top: props.position.top + 'px',
        left: props.position.left + 'px'
      };
    });

    let drag$: Subscription;

    // drag spended time
    const dragSpendedTime = ref('0');

    const coordinate = {
      x: 0,
      y: 0,
      offset: 6
    };

    const chunk = {
      size: 42,
      radius: 8,
      PI: Math.PI,
      real: 0
    };

    // hide modal
    const close = () => {
      emit('close');
    };

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = function () {
          resolve(image);
        };
        image.onerror = function (err) {
          reject(err);
        };
        image.src = src;
      });
    };

    const randomNumberInRange = (start, end) => {
      return Math.round(Math.random() * (end - start) + start);
    };

    const getChunkStyle = () => {
      const directions = ['top', 'top'];
      const types = ['inner', 'outer'];
      return {
        type: types[randomNumberInRange(0, types.length - 1)],
        direction: directions[randomNumberInRange(0, directions.length - 1)]
      };
    };

    const drawChunk = async (ctx: any, style: any, operation: 'clip' | 'fill') => {
      ctx.beginPath();
      ctx.moveTo(coordinate.x, coordinate.y);

      if (style.direction === 'top') {
        ctx.arc(coordinate.x + chunk.size / 2, coordinate.y, chunk.radius, -chunk.PI, 0, style.type === 'inner');
      }

      ctx.lineTo(coordinate.x + chunk.size, coordinate.y);

      if (style.direction === 'right') {
        ctx.arc(
          coordinate.x + chunk.size,
          coordinate.y + chunk.size / 2,
          chunk.radius,
          1.5 * chunk.PI,
          0.5 * chunk.PI,
          style.type === 'inner'
        );
      }

      ctx.lineTo(coordinate.x + chunk.size, coordinate.y + chunk.size);

      ctx.arc(coordinate.x + chunk.size / 2, coordinate.y + chunk.size, chunk.radius, 0, chunk.PI, true);
      ctx.lineTo(coordinate.x, coordinate.y + chunk.size);

      ctx.arc(coordinate.x, coordinate.y + chunk.size / 2, chunk.radius, 0.5 * chunk.PI, 1.5 * chunk.PI, true);
      ctx.lineTo(coordinate.x, coordinate.y);
      ctx.shadowColor = 'rgba(0, 0, 0, .001)';
      ctx.shadowBlur = 20;
      ctx.lineWidth = 1.5;
      ctx.fillStyle = 'rgba(0, 0, 0, .4)';
      ctx.strokeStyle = 'rgba(255, 255, 255, .8)';
      ctx.stroke();
      ctx.closePath();

      ctx[operation]();
    };

    // 绘制背景
    const drawBackground = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
      if (props.backgroundSize === 'contain') {
        const canvasRatio = canvasRef.value.width / canvasRef.value.height;
        const imgRatio = img.width / img.height;
        let dx, dy, dw, dh;
        if (imgRatio <= canvasRatio) {
          dw = imgRatio * canvasRef.value.width;
          dh = canvasRef.value.height;
          dx = (canvasRef.value.width - dw) / 2;
          dy = 0;
        } else {
          dw = canvasRef.value.width;
          dh = dw / imgRatio;
          dx = 0;
          dy = (canvasRef.value.height - dh) / 2;
        }
        ctx.drawImage(img, dx, dy, dw, dh);
      } else if (props.backgroundSize === 'cover') {
        const canvasRatio = canvasRef.value.width / canvasRef.value.height;
        const imgRatio = img.width / img.height;
        let sx, sy, sw, sh;
        if (imgRatio <= canvasRatio) {
          sw = img.width;
          sh = sw / canvasRatio;
          sx = 0;
          sy = (img.height - sh) / 2;
        } else {
          sh = img.height;
          sw = sh * canvasRatio;
          sx = (img.width - sw) / 2;
          sy = 0;
        }
        // cover 覆盖，dx, dy 均为 0，绘制宽高为 canvas 的高宽
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvasRef.value.width, canvasRef.value.height);
      } else {
        ctx.drawImage(img, 0, 0, canvasRef.value.width, canvasRef.value.height);
      }
    };

    const drawImage = async () => {
      if (canvasRef.value) {
        loading.value = true;

        // Load img from prop images of random
        let [err, img] = await to(loadImage(props.images[randomNumberInRange(0, props.images.length - 1)]));

        loading.value = false;

        if (err) {
          // 若外部提供的 image 加载失败，则加载默认提供的 image
          img = await loadImage(defaultImages[randomNumberInRange(0, defaultImages.length - 1)]);
        }

        const ctx = canvasRef.value.getContext('2d');
        const ctxChunk = canvasChunkRef.value.getContext('2d');

        canvasRef.value.width = canvasRef.value.offsetWidth;
        canvasRef.value.height = canvasRef.value.offsetHeight;
        canvasChunkRef.value.width = canvasRef.value.offsetWidth;
        canvasChunkRef.value.height = canvasRef.value.offsetHeight;

        drawBackground(ctx, img);

        chunk.real = chunk.size + chunk.radius * 2 + 2;

        ctx.beginPath();
        ctx.fillStyle = '#fff';
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.closePath();

        ctxChunk.save();
        ctxChunk.globalCompositeOperation = 'destination-over';

        const x = randomNumberInRange(chunk.real + 20, canvasRef.value.width - (chunk.real + 20));
        const y = randomNumberInRange(55, canvasRef.value.height - 55);

        const style = getChunkStyle();

        coordinate.x = x;
        coordinate.y = y;

        await drawChunk(ctx, style, 'fill');
        await drawChunk(ctxChunk, style, 'clip');

        ctxChunk.drawImage(img, 0, 0, canvasRef.value.width, canvasRef.value.height);

        const coordinateY = coordinate.y - chunk.radius * 2 + 1;
        const imageData = ctxChunk.getImageData(coordinate.x, coordinateY, chunk.real, chunk.real);

        canvasChunkRef.value.width = chunk.real;

        ctxChunk.putImageData(imageData, coordinate.offset, coordinateY);
        ctxChunk.restore();

        loading.value = false;
      }
    };

    const refreshImage = () => {
      const ctx = canvasRef.value.getContext('2d');
      const ctxChunk = canvasChunkRef.value.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
      ctxChunk.clearRect(0, 0, canvasChunkRef.value.width, canvasChunkRef.value.height);
      drawImage();
    };

    const getDrag$ = ($drag: HTMLElement) => {
      const dragArgs = {
        initialPos: {
          left: 0
        },
        timeStart: 0
      };

      const mousedown$ = merge(
        fromEvent($drag, 'mousedown', { capture: false, passive: false }),
        fromEvent($drag, 'touchstart', { capture: false, passive: false })
      );
      const mousemove$ = merge(
        fromEvent(document.body, 'mousemove', { capture: false, passive: false }),
        fromEvent(document.body, 'touchmove', { capture: false, passive: false })
      );
      const mouseup$ = merge(
        fromEvent(document.body, 'mouseup', { capture: false, passive: false }),
        fromEvent(document.body, 'touchend', { capture: false, passive: false })
      );

      return mousedown$
        .pipe(
          tap(() => {
            dragArgs.initialPos.left =
              parseInt(getComputedStyle($drag, null).getPropertyValue('left').replace('px', '')) ?? 0;
            dragArgs.timeStart = Date.now();
            addClass($drag, 'slide-modal-hidden');
          }),
          switchMap((start: any) =>
            mousemove$.pipe(
              map((move: any) => {
                move.preventDefault();
                const startArgs = getEventArgs(start);
                const moveArgs = getEventArgs(move);

                return {
                  left: dragArgs.initialPos.left + moveArgs.points[0][0] - startArgs.points[0][0]
                };
              }),
              takeUntil(
                mouseup$.pipe(
                  tap(async () => {
                    dragSpendedTime.value = dayjs.duration(Date.now() - dragArgs.timeStart).asSeconds() + 's';
                    // validate
                    const _x = Math.round(
                      (parseInt(getComputedStyle($drag, null).getPropertyValue('left').replace('px', '')) ?? 0) +
                        coordinate.offset
                    );
                    removeClass(sliderRef.value, 'slide-modal-hidden');
                    if (coordinate.x - props.precision <= _x && _x <= coordinate.x + props.precision) {
                      // successful
                      status.value = 'successful';
                      removeClass(resultRef.value, 'slide-modal-failed');
                      addClass(resultRef.value, 'slide-modal-successful');
                      addClass(resultRef.value, 'slide-modal-result-show');
                      waitTransitionend(resultRef.value).then(() => {
                        emit('successful', dragSpendedTime.value);
                      });
                    } else {
                      // failed
                      status.value = 'failed';
                      removeClass(resultRef.value, 'slide-modal-successful');
                      addClass(resultRef.value, 'slide-modal-failed');
                      addClass(resultRef.value, 'slide-modal-result-show');
                      waitTransitionend(resultRef.value).then(() => {
                        removeClass(resultRef.value, 'slide-modal-result-show');
                      });
                      addClass(canvasChunkRef.value, 'slide-modal-back-left');
                      waitTransitionend(canvasChunkRef.value).then(() => {
                        canvasChunkRef.value.style.left = '0';
                        removeClass(canvasChunkRef.value, 'slide-modal-back-left');
                      });
                      addClass($drag, 'slide-modal-back-left');
                      waitTransitionend($drag).then(() => {
                        $drag.style.left = '0';
                        removeClass($drag, 'slide-modal-back-left');
                      });
                      emit('failed', dragSpendedTime.value);
                    }
                  })
                )
              )
            )
          )
        )
        .pipe(subscribeOn(animationFrameScheduler));
    };

    onMounted(() => {
      drawImage();

      drag$ = getDrag$(sliderBtnRef.value).subscribe((pos) => {
        const left = getBoundaryPosition(pos.left, 0, sliderRef.value.offsetWidth - sliderBtnRef.value.offsetWidth);
        sliderBtnRef.value.style.left = left + 'px';
        canvasChunkRef.value.style.left = left + 'px';
      });
    });

    onBeforeUnmount(() => {
      if (drag$) {
        drag$.unsubscribe();
      }
    });

    return {
      canvasRef,
      canvasChunkRef,
      sliderRef,
      sliderBtnRef,
      resultRef,
      i18nMessages,
      wrapStyle,
      loading,
      status,
      dragSpendedTime,
      refreshImage,
      close
    };
  },
  render(ctx) {
    return (
      <div
        class={['slide-modal-wrap', ctx.theme === 'dark' ? 'slide-modal-dark' : 'slide-modal-light']}
        style={ctx.wrapStyle}
      >
        <dl class='slide-modal-arrow'>
          <dt />
          <dd />
        </dl>
        <div class='slide-modal-content'>
          <div class='slide-modal-main'>
            <div class='slide-modal-embed'>
              <div class='slide-modal-embed-inner'>
                <div class='slide-modal-loading' v-show={ctx.loading}>
                  <div class='slide-modal-spinner'>
                    <div>
                      <div>
                        <div>
                          <div />
                          <div />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>{ctx.$t(i18nMessages.antd.slideCaptcha.loading)}</div>
                </div>
                <canvas class='slide-modal-background' ref='canvasRef' />
                <canvas class='slide-modal-chunk' ref='canvasChunkRef' />
                <div class='slide-modal-result' ref='resultRef'>
                  {ctx.status === 'failed'
                    ? ctx.$t(i18nMessages.antd.slideCaptcha.result.failed)
                    : ctx.status === 'successful'
                    ? ctx.dragSpendedTime + ' ' + ctx.$t(i18nMessages.antd.slideCaptcha.result.successful)
                    : ''}
                </div>
              </div>
            </div>
            <div class='slide-modal-slider' ref='sliderRef'>
              <div class='slide-modal-text'>{ctx.$t(i18nMessages.antd.slideCaptcha.slider)}</div>
              <div class='slide-modal-btn' ref='sliderBtnRef'>
                <dl class='slide-modal-icon'>
                  <dt />
                  <dd />
                </dl>
              </div>
            </div>
          </div>
          <div class='slide-modal-footer'>
            <div class='slide-modal-actions'>
              <div class='slide-modal-action'>
                <XButton size='mini' type='link' onClick={ctx.close}>
                  <IconCloseLine scale='1.2' />
                </XButton>
              </div>
              <div class='slide-modal-action'>
                <XButton size='mini' type='link' onClick={ctx.refreshImage}>
                  <IconRefreshLine />
                </XButton>
              </div>
            </div>
            <div class='slide-modal-copyright' />
          </div>
        </div>
      </div>
    );
  }
});

/**
 * 验证码
 */
export const SlideCaptcha = defineComponent({
  name: 'SlideCaptcha',
  components: {
    IconCheckLine
  },
  emits: ['update:presented', 'update:valid'],
  inheritAttrs: false,
  props: {
    theme: {
      type: String as PropType<'dark' | 'light'>,
      default: null
    },
    images: {
      type: Array as PropType<string[]>,
      default: () => defaultImages
    },
    backgroundSize: {
      type: String as PropType<'contain' | 'cover'>,
      default: 'cover'
    },
    precision: {
      type: Number as PropType<number>,
      default: 5
    },
    valid: {
      type: Boolean,
      default: false
    },
    presented: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const wrap = ref(null);
    const handing = ref(false);
    const presented = ref(false);
    const valid = ref(false);

    /* const modalOffset = {
      top: 22.5,
      left: 48
    }; */

    const position = reactive({ top: 0, left: 0 });

    watch(
      () => props.presented,
      (val) => {
        if (val) {
          presentCaptchaModal();
        } else {
          if (presented.value) {
            dismissCaptchaModal();
          }
        }
      }
    );

    watch(
      () => props.valid,
      (val) => {
        if (!val) {
          valid.value = false;
        }
      }
    );

    const getCaptchaModalPosition = () => {
      if (wrap.value) {
        const rect = wrap.value.getBoundingClientRect();
        const top = rect.top;
        const left = rect.left;
        return {
          top,
          left
        };
      }
      return {
        top: 0,
        left: 0
      };
    };

    // Present captcha modal
    const presentCaptchaModal = () => {
      if (valid.value) {
        return;
      }
      const _p = getCaptchaModalPosition();
      position.top = _p.top;
      position.left = _p.left;
      if (!presented.value) {
        presented.value = true;
        emit('update:presented', true);
      }
    };

    // Dismiss captcha modal
    const dismissCaptchaModal = () => {
      presented.value = false;
      emit('update:presented', false);
    };

    const onFailed = () => {
      emit('update:valid', false);
      valid.value = false;
    };

    const onSuccessful = () => {
      dismissCaptchaModal();
      emit('update:valid', true);
      valid.value = true;
    };

    return {
      wrap,
      i18nMessages,
      handing,
      presented,
      valid,
      position,
      presentCaptchaModal,
      dismissCaptchaModal,
      onFailed,
      onSuccessful
    };
  },
  render(ctx) {
    let inner;
    if (ctx.valid) {
      inner = [
        <div class='slide-captcha-being'>
          <IconCheckLine scale='1.2' />
        </div>,
        <div class='slide-captcha-tip' title={ctx.$t(i18nMessages.antd.slideCaptcha.validText)}>
          {ctx.$t(i18nMessages.antd.slideCaptcha.validText)}
        </div>
      ];
    } else {
      inner = [
        <div class='slide-captcha-ready'>
          <div class='slide-captcha-ring' />
          <div class='slide-captcha-dot' />
        </div>,
        <div class='slide-captcha-tip'>{ctx.$t(i18nMessages.antd.slideCaptcha.tip)}</div>
      ];
    }
    inner.push(<div class='slide-captcha-successful' />);
    return [
      <div
        ref='wrap'
        {...ctx.$attrs}
        class={['slide-captcha-wrap', ctx.valid ? 'slide-captcha-valid' : undefined]}
        title={
          ctx.valid ? ctx.$t(i18nMessages.antd.slideCaptcha.validText) : ctx.$t(i18nMessages.antd.slideCaptcha.tip)
        }
        onClick={ctx.presentCaptchaModal}
      >
        {inner}
      </div>,
      <Teleport to='body'>
        {ctx.presented
          ? [
              <div class='slide-captcha-mask' onClick={ctx.dismissCaptchaModal} />,
              <SlideModal
                images={ctx.images}
                theme={ctx.theme}
                backgroundSize={ctx.backgroundSize}
                precision={ctx.precision}
                position={ctx.position}
                onClose={ctx.dismissCaptchaModal}
                onFailed={ctx.onFailed}
                onSuccessful={ctx.onSuccessful}
              />
            ]
          : ''}
      </Teleport>
    ];
  }
});
