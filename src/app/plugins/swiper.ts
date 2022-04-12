/**
 * Swiper
 */

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export const VueSwiper = {
  install(app) {
    app.component('Swiper', Swiper);
    app.component('SwiperSlide', SwiperSlide);
  }
};
