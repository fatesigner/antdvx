<template>
  <div :class="[$style.wrap, theme === 'dark' ? $style.dark : $style.light]" :style="style">
    <dl :class="$style.arrow">
      <dt />
      <dd />
    </dl>
    <div :class="$style.content">
      <div :class="$style.main">
        <div :class="$style.embed">
          <div :class="$style['embed-inner']">
            <div :class="$style.loading" v-show="loading">
              <div :class="$style.spinner">
                <div>
                  <div>
                    <div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>
              </div>
              <div>{{ $t(i18nMessages.antd.slideCaptcha.loading) }}</div>
            </div>
            <canvas :class="$style.background" ref="canvasEl" />
            <canvas :class="$style.chunk" ref="canvasChunkEl" />
            <div :class="$style.result" ref="resultEl">
              {{
                status === 'failed'
                  ? $t(i18nMessages.antd.slideCaptcha.result.failed)
                  : status === 'successful'
                  ? dragSpendedTime + ' ' + $t(i18nMessages.antd.slideCaptcha.result.successful)
                  : ''
              }}
            </div>
          </div>
        </div>
        <div :class="$style.slider" ref="sliderEl">
          <div :class="$style.text">
            {{ $t(i18nMessages.antd.slideCaptcha.slider) }}
          </div>
          <div :class="$style.btn" ref="sliderBtnEl">
            <dl :class="$style.icon">
              <dt />
              <dd />
            </dl>
          </div>
        </div>
      </div>
      <div :class="$style.footer">
        <div :class="$style.actions">
          <div :class="$style.action">
            <XButton size="mini" type="link" @click="close"><IconCloseLine scale="1.2" /></XButton>
          </div>
          <div :class="$style.action">
            <XButton size="mini" type="link" @click="refreshImage"><IconRefreshLine /></XButton>
          </div>
        </div>
        <div :class="$style.copyright" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs';
import to from 'await-to-js';
import { addClass, removeClass } from '@fatesigner/utils/document';
import { map, subscribeOn, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Subscription, animationFrameScheduler, fromEvent, merge } from 'rxjs';
import { PropType, defineComponent, onBeforeUnmount, onMounted, ref, useCssModule } from 'vue';

import { i18nMessages } from '../../i18n/messages';
import { getBoundaryPosition, getEventArgs, waitTransitionend } from '../../utils';

import { XButton } from '../button';
import { IconCloseLine, IconRefreshLine } from '../iconfont';

export default defineComponent({
  name: 'slide-modal',
  components: {
    IconCloseLine,
    IconRefreshLine,
    XButton
  },
  props: {
    theme: {
      type: String as PropType<'dark' | 'light'>,
      default: 'light'
    },
    images: {
      type: Array as PropType<string[]>,
      default: () => [require('./assets/1.jpg'), require('./assets/2.jpg'), require('./assets/3.jpg'), require('./assets/4.jpg')]
    },
    /*size: {
      type: Object as PropType<{ width: number; height: number }>,
      default: () => ({ width: 260, height: 160 })
    },*/
    position: {
      type: Object as PropType<{ top: number; left: number }>,
      default: () => ({ top: 0, left: 0 })
    }
  },
  computed: {
    style() {
      return {
        top: this.position.top + 'px',
        left: this.position.left + 'px'
      };
    }
  },
  setup(props, { emit }) {
    const $style = useCssModule();

    const status = ref<'initial' | 'successful' | 'failed'>('initial');
    const $canvas = ref<HTMLCanvasElement>(null);
    const $canvasChunk = ref<HTMLCanvasElement>(null);
    const $slider = ref<HTMLElement>(null);
    const $sliderBtn = ref<HTMLElement>(null);
    const $result = ref<HTMLElement>(null);
    const loading = ref(false);

    let drag$: Subscription;

    // drag spended time
    const dragSpendedTime = ref('0');
    const errorLimit = 2;

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
        ctx.arc(coordinate.x + chunk.size, coordinate.y + chunk.size / 2, chunk.radius, 1.5 * chunk.PI, 0.5 * chunk.PI, style.type === 'inner');
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

    const drawImage = async () => {
      if ($canvas.value) {
        loading.value = true;

        // Load img from prop images of random
        let [err, img] = await to(loadImage(props.images[randomNumberInRange(0, props.images.length - 1)]));

        loading.value = false;

        if (err) {
          alert(err);
        } else {
          const ctx = $canvas.value.getContext('2d');
          const ctxChunk = $canvasChunk.value.getContext('2d');

          $canvas.value.width = $canvas.value.offsetWidth;
          $canvas.value.height = $canvas.value.offsetHeight;
          $canvasChunk.value.width = $canvas.value.offsetWidth;
          $canvasChunk.value.height = $canvas.value.offsetHeight;

          ctx.drawImage(img, 0, 0, $canvas.value.width, $canvas.value.height);

          chunk.real = chunk.size + chunk.radius * 2 + 2;

          ctx.beginPath();
          ctx.fillStyle = '#fff';
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.closePath();

          ctxChunk.save();
          ctxChunk.globalCompositeOperation = 'destination-over';

          const x = randomNumberInRange(chunk.real + 20, $canvas.value.width - (chunk.real + 20));
          const y = randomNumberInRange(55, $canvas.value.height - 55);

          const style = getChunkStyle();

          coordinate.x = x;
          coordinate.y = y;

          await drawChunk(ctx, style, 'fill');
          await drawChunk(ctxChunk, style, 'clip');

          ctxChunk.drawImage(img, 0, 0, $canvas.value.width, $canvas.value.height);

          const coordinateY = coordinate.y - chunk.radius * 2 + 1;
          const imageData = ctxChunk.getImageData(coordinate.x, coordinateY, chunk.real, chunk.real);

          $canvasChunk.value.width = chunk.real;

          ctxChunk.putImageData(imageData, coordinate.offset, coordinateY);
          ctxChunk.restore();
        }

        loading.value = false;
      }
    };

    const refreshImage = () => {
      const ctx = $canvas.value.getContext('2d');
      const ctxChunk = $canvasChunk.value.getContext('2d');
      ctx.clearRect(0, 0, $canvas.value.width, $canvas.value.height);
      ctxChunk.clearRect(0, 0, $canvasChunk.value.width, $canvasChunk.value.height);
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
            dragArgs.initialPos.left = parseInt(getComputedStyle($drag, null).getPropertyValue('left').replace('px', '')) ?? 0;
            dragArgs.timeStart = Date.now();
            addClass($drag, $style.hidden);
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
                    let _x = Math.round((parseInt(getComputedStyle($drag, null).getPropertyValue('left').replace('px', '')) ?? 0) + coordinate.offset);
                    removeClass($slider.value, $style.hidden);
                    if (coordinate.x - errorLimit <= _x && _x <= coordinate.x + errorLimit) {
                      // successful
                      status.value = 'successful';
                      removeClass($result.value, $style.failed);
                      addClass($result.value, $style.successful);
                      addClass($result.value, $style.result_show);
                      waitTransitionend($result.value).then(() => {
                        emit('successful', dragSpendedTime.value);
                      });
                    } else {
                      // failed
                      status.value = 'failed';
                      removeClass($result.value, $style.successful);
                      addClass($result.value, $style.failed);
                      addClass($result.value, $style.result_show);
                      waitTransitionend($result.value).then(() => {
                        removeClass($result.value, $style.result_show);
                      });
                      addClass($canvasChunk.value, $style.back_left);
                      waitTransitionend($canvasChunk.value).then(() => {
                        $canvasChunk.value.style.left = '0';
                        removeClass($canvasChunk.value, $style.back_left);
                      });
                      addClass($drag, $style.back_left);
                      waitTransitionend($drag).then(() => {
                        $drag.style.left = '0';
                        removeClass($drag, $style.back_left);
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

      drag$ = getDrag$($sliderBtn.value).subscribe((pos) => {
        let left = getBoundaryPosition(pos.left, 0, $slider.value.offsetWidth - $sliderBtn.value.offsetWidth);
        $sliderBtn.value.style.left = left + 'px';
        $canvasChunk.value.style.left = left + 'px';
      });
    });

    onBeforeUnmount(() => {
      if (drag$) {
        drag$.unsubscribe();
      }
    });

    return {
      canvasEl: $canvas,
      canvasChunkEl: $canvasChunk,
      sliderEl: $slider,
      sliderBtnEl: $sliderBtn,
      resultEl: $result,
      i18nMessages,
      loading,
      status,
      dragSpendedTime,
      refreshImage,
      close
    };
  }
});
</script>

<style lang="less" module>
.wrap {
  position: fixed;
  z-index: 2;
}

.arrow {
  margin-top: -0.625rem;
  margin-left: -1.3125rem;

  > dt {
    position: absolute;
    z-index: 1;
    border-style: solid;
    border-width: 0.6875rem;
  }

  > dd {
    position: absolute;
    z-index: 1;
    margin-top: 0.0625rem;
    margin-right: 0;
    margin-bottom: 0.0625rem;
    margin-left: 0.125rem;
    border-style: solid;
    border-width: 0.625rem;
  }
}

.content {
  position: absolute;
  top: -9.8125rem;
  left: 0;
  width: 17.875rem;
  border-radius: 0.25rem;
}

.main {
  padding: 16px;
}

.embed {
  position: relative;
  padding-bottom: 66%;
}

.embed-inner {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
}

.background,
.chunk {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
}

.background {
  width: 100%;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  border-top: 1px solid rgba(29, 30, 35, 0.1);
  box-shadow: 0 0 2px rgb(255 255 255 / 30%);
}

.result {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 5px 10px;
  color: #fff;
  transition: transform 0.5s ease;
  transform: translate3d(0, 100%, 0);

  &.result_show {
    transform: translate3d(0, 0, 0);
  }

  &.failed {
    background-color: #ed4014;
  }

  &.successful {
    background-color: #2f9688;
  }
}

.slider {
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 50px;
  margin-top: 1rem;
  margin-right: 0;
  margin-bottom: 0.5rem;
  background-color: #fff;
  border: 1px solid #f6ca9d;
  border-radius: 1.25rem;

  .text {
    display: flex;
    align-items: center;
    min-height: 37px;
    line-height: 14px;
    transition: opacity 300ms ease;
  }

  &.hidden {
    .text {
      opacity: 0;
    }
  }

  .btn {
    position: absolute;
    top: 50%;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    padding: 10px;
    margin-left: -1px;
    cursor: pointer;
    background: #fff;
    border: 1px solid #f6ca9d;
    border-radius: 50%;
    transform: translate3d(0, -50%, 0);
  }

  .icon {
    position: relative;
    width: 100%;
    height: 100%;
    border: 2px solid #333;
    border-radius: 0.25rem;
    box-shadow: 0 0 2px #333;

    > dt {
      position: absolute;
      top: -0.25rem;
      bottom: -0.25rem;
      left: 50%;
      width: 4px;
      background-color: #fff;
      transform: translate3d(-50%, 0, 0);
    }

    > dd {
      position: absolute;
      top: 0.6875rem;
      right: 0.125rem;
      left: 0.125rem;
      z-index: 20;
      height: 0.125rem;
      background-color: #333;
      border-radius: 0.25rem;
      box-shadow: 0 0 2px #333;
      transition: all 0.5 ease;
      transform: translate3d(0, -50%, 0);
      animation: mi-anim-scan 1.5s linear infinite;
    }
  }
}

.back_left {
  left: 0 !important;
  transition: left 300ms ease;
}

.loading {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 0.875rem;
  color: #fff;
  background: #636363;
  border-radius: 0.25rem;
}

.spinner {
  display: inline-block;
  width: 5rem;
  height: 5rem;
  overflow: hidden;
  background: 0 0;

  > div {
    position: relative;
    width: 100%;
    height: 100%;
    transform: translateZ(0) scale(0.8);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    transform-origin: 0 0;

    > div {
      transform: scale(0.8);
      transform-origin: 50px 50px;

      > div {
        position: absolute;
        animation: mi-anim-move 1.5s linear infinite;

        div:nth-child(1) {
          width: 2.25rem;
          height: 2.25rem;
          background: 0 0;
          border: 6px solid #f6ca9d;
          border-radius: 50%;
        }

        div:nth-child(2) {
          position: absolute;
          top: 2.125rem;
          left: 2.65625rem;
          width: 0.53125rem;
          height: 1.59375rem;
          background: #f6ca9d;
          border-radius: 0 0 4px 4px;
          transform: rotate(-45deg);
        }
      }
    }
  }
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-right: 5px;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 100ms ease-in;

  &:hover {
    background-color: #f1f1f1;
  }

  &:active {
    background-color: #eee;
  }
}

.dark {
  .content {
    background-color: #1d1e23;
    border: 1px solid #f6ca9d;
    box-shadow: 0 0 10px #1d1e23;
  }

  .arrow {
    > dt {
      border-color: transparent #f6ca9d transparent transparent;
    }

    > dd {
      border-color: transparent #1d1e23 transparent transparent;
    }
  }

  .slider {
    .btn {
      box-shadow: 1px 1px 10px #1d1e23;
    }
  }
}

.light {
  .content {
    background-color: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 0 10px #ddd;
  }

  .arrow {
    > dt {
      border-color: transparent #ddd transparent transparent;
    }

    > dd {
      border-color: transparent #fff transparent transparent;
    }
  }

  .slider {
    .btn {
      box-shadow: 1px 1px 10px #ddd;
    }
  }
}

@keyframes mi-anim-move {
  0% {
    transform: translate(1px, 1px);
  }

  33.33% {
    transform: translate(51px, 1px);
  }

  66.66% {
    transform: translate(21px, 51px);
  }

  100% {
    transform: translate(1px, 1px);
  }
}

@keyframes mi-anim-shake {
  0% {
    transform: translate(0, 0) rotate(0);
  }

  25% {
    transform: translate(-12px, 0) rotate(0);
  }

  50% {
    transform: translate(0, 0) rotate(0);
  }

  75% {
    transform: translate(-12px, 0) rotate(0);
  }

  100% {
    transform: translate(0, 0) rotate(0);
  }
}

@keyframes mi-anim-scan {
  0% {
    top: 34%;
  }

  25% {
    top: 50%;
  }

  50% {
    top: 66%;
  }

  70% {
    top: 50%;
  }

  100% {
    top: 34%;
  }
}
</style>
