import { Swiper } from "swiper";

export const initAboutHistory = () => {
  document.querySelectorAll<HTMLElement>(".about-history").forEach((wrapper) => {
    const swiperContainer = wrapper.querySelector<HTMLElement>(".about-history__swiper .swiper");
    const imgSwiperContainer = wrapper.querySelector<HTMLElement>(".swiper.about-history__img-swiper");
    const prevBtn = wrapper.querySelector<HTMLElement>(".about-history__nav-btn[data-prev]");
    const nextBtn = wrapper.querySelector<HTMLElement>(".about-history__nav-btn[data-next]");
    const paginationContainer = wrapper.querySelector<HTMLElement>(".about-history-line");

    if (!swiperContainer || !imgSwiperContainer) return;

    const imgSwiper = new Swiper(imgSwiperContainer, {
      spaceBetween: 50,
      speed: 600,
      allowTouchMove: false,
    });

    new Swiper(swiperContainer, {
      spaceBetween: 50,
      speed: 600,
      navigation: {
        prevEl: prevBtn,
        nextEl: nextBtn,
      },
      pagination: {
        el: paginationContainer,
        clickable: true,
      },
      thumbs: {
        swiper: imgSwiper,
      },
      on: {
        progress(swiper, progress) {
          if (paginationContainer) {
            wrapper.style.setProperty("--progress", progress.toString());
          }
        },
      }
    });
  })
}