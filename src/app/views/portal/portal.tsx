import { defineComponent, onMounted, ref } from 'vue';
import { gsap } from 'gsap';

import './portal.less';

/**
 * 主页
 */
export default defineComponent({
  setup() {
    const slide1Ref = ref<any>();
    const slide2Ref = ref<any>();

    onMounted(() => {
      const bg1Ref = slide1Ref.value.querySelector('.bg-wrap');
      const bg2Ref = slide2Ref.value.querySelector('.bg-wrap');

      const timeline1Active = gsap
        .timeline({ paused: true })
        .to(slide1Ref.value, { translateX: '5%', duration: 0.8, ease: 'none' })
        .to(
          slide1Ref.value.querySelector('.bg'),
          {
            skew: '5deg',
            scale: 1.1,
            duration: 0.8,
            ease: 'none'
          },
          0
        );
      const timeline1Inactive = gsap
        .timeline({ paused: true })
        .to(
          slide1Ref.value,
          {
            translateX: '-5%',
            duration: 0.8,
            ease: 'none'
          },
          0
        )
        .to(
          slide1Ref.value.querySelector('.mask'),
          {
            opacity: 0.7,
            duration: 0.6
          },
          0
        );

      const timeline2Active = gsap
        .timeline({ paused: true })
        .to(slide2Ref.value, { translateX: '-5%', duration: 0.8, ease: 'none' })
        .to(
          slide2Ref.value.querySelector('.bg'),
          {
            skew: '5deg',
            scale: 1.1,
            duration: 0.8,
            ease: 'none'
          },
          0
        );
      const timeline2Inactive = gsap
        .timeline({ paused: true })
        .to(
          slide2Ref.value,
          {
            translateX: '-5%',
            duration: 0.8,
            ease: 'none'
          },
          0
        )
        .to(
          slide2Ref.value.querySelector('.mask'),
          {
            opacity: 0.7,
            duration: 0.6
          },
          0
        );

      // 悬浮事件动画
      const hover1 = gsap.timeline({ paused: true }).add(timeline1Active, 0).add(timeline2Inactive, 0);
      const hover2 = gsap.timeline({ paused: true }).add(timeline2Active, 0).add(timeline1Inactive, 0);

      slide1Ref.value.addEventListener('mouseenter', function () {
        hover1.play();
      });
      slide1Ref.value.addEventListener('mouseleave', function () {
        hover1.timeScale(2).reverse();
      });
      slide2Ref.value.addEventListener('mouseenter', function () {
        hover2.play();
      });
      slide2Ref.value.addEventListener('mouseleave', function () {
        hover2.timeScale(2).reverse();
      });
    });

    return {
      slide1Ref,
      slide2Ref
    };
  },
  render() {
    return (
      <div class='blanner-container'>
        <div class='slide slide1' ref='slide1Ref'>
          <div class='bg-wrap'>
            <div class='bg'></div>
            <div class='mask'></div>
          </div>
          <div class='content'></div>
        </div>
        <div class='slide slide2' ref='slide2Ref'>
          <div class='bg-wrap'>
            <div class='bg'></div>
            <div class='mask'></div>
          </div>
          <div class='content'></div>
        </div>
      </div>
    );
  }
});
