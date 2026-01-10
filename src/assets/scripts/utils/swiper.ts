import Swiper from "swiper";

export function initSwipers() {
  document
    .querySelectorAll<HTMLElement>("[data-swiper-init]")
    .forEach((wrapper) => {
      const swiperContainer =
        wrapper.querySelector<HTMLElement>("[data-swiper]") || wrapper;

      const prevBtn = wrapper.querySelector<HTMLElement>("[data-prev]");
      const nextBtn = wrapper.querySelector<HTMLElement>("[data-next]");
      const scrollbarContainer =
        wrapper.querySelector<HTMLElement>("[data-scrollbar]");
      const paginationContainer =
        wrapper.querySelector<HTMLElement>("[data-pagination]");
      const fracContainer = wrapper.querySelector<HTMLElement>("[data-frac]");

      const swiperProps =
        JSON.parse(swiperContainer.getAttribute("data-props") || "{}") || {};

      swiperContainer.removeAttribute("data-props");

      new Swiper(swiperContainer, {
        slidesPerView: "auto",
        scrollbar: {
          el: scrollbarContainer,
          scrollbarDisabledClass: "_disable",
        },
        navigation: {
          prevEl: prevBtn,
          nextEl: nextBtn,
        },
        pagination: !fracContainer
          ? {
              el: paginationContainer,
              clickable: true,
            }
          : {
              type: "fraction",
              el: fracContainer,
              renderFraction: function (currentClass, totalClass) {
                return (
                  '<span class="' +
                  currentClass +
                  '"></span>' +
                  "/" +
                  '<span class="' +
                  totalClass +
                  '"></span>'
                );
              },
            },
        ...swiperProps,
      });
    });
}
