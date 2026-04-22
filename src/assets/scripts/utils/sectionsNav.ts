import { Swiper as swiperInit } from "swiper";
import { HashNavigation, Mousewheel } from "swiper/modules";
import type { Swiper } from "swiper/types";

interface INavItem {
  link: HTMLElement;
  block: HTMLElement;
}

class SectionsNav {
  observer: IntersectionObserver;
  items: Map<string, INavItem> = new Map();
  offset = 0;
  swiper: Swiper | null = null;

  constructor(public wrapper: HTMLElement) {
    if (window.innerWidth > 1024) {
      return;
    }
    this.offset = this.wrapper.dataset.offset
      ? parseInt(this.wrapper.dataset.offset)
      : 0;
    this.observer = new IntersectionObserver(this.observeHandler.bind(this));

    wrapper
      .querySelectorAll<HTMLLinkElement>("a[data-nav-link]")
      .forEach((link) => {
        const href = link.getAttribute("href");
        const id = href && href.split("#").join("");
        const block =
          href &&
          id &&
          document.querySelector<HTMLElement>(
            `[data-hash="${href.replace("#", "")}"]`,
          );

        if (block) {
          this.items.set(id, {
            link,
            block,
          });
          this.observer.observe(block);

          link.addEventListener("click", (e) =>
            this.scrollTo.call(this, e, id),
          );
        }
      });

    if (this.wrapper.hasAttribute("data-sections-nav-scroll")) {
      this.initScrollHandler();
    }

    const swiperContainer = this.wrapper.querySelector<HTMLElement>(".swiper");

    if (!swiperContainer) {
      return;
    }

    new swiperInit(swiperContainer, {
      slidesPerView: "auto",
      centeredSlides: true,
      freeMode: true,
    });

    if (swiperContainer && (swiperContainer as any).swiper) {
      this.swiper = (swiperContainer as any).swiper as Swiper;
    }
  }

  observeHandler() {
    let activeKey = null;

    let minY = Infinity;

    this.items.forEach((item, key) => {
      const rect = item.block.getBoundingClientRect();
      const posY = rect.y + rect.height;
      if (posY >= 0 && posY < minY) {
        minY = posY;
        activeKey = key;
      }
    });

    this.setActive(activeKey);
  }

  setActive(activeKey: string | null) {
    this.items.forEach((item, key) => {
      if (activeKey === key) {
        item.link.classList.add("_active");
        item.block.classList.add("_active");
      } else {
        item.link.classList.remove("_active");
        item.block.classList.remove("_active");
      }
    });
  }

  scrollTo(e: Event, id: string) {
    const item = this.items.get(id);
    if (!item) return;
    e.preventDefault();

    const rect = item.block.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;

    window.scrollTo({
      top: scrollTop,
      behavior: "smooth",
    });
  }

  initScrollHandler() {
    let topBlock: HTMLElement | null = null;
    let topBlockRect: DOMRect | null = null;
    let bottomBlock: HTMLElement | null = null;
    let bottomBlockRect: DOMRect | null = null;

    this.items.forEach((item) => {
      const rect = item.block.getBoundingClientRect();
      if (!topBlockRect) {
        topBlockRect = rect;
        topBlock = item.block;
      } else if (rect.top < topBlockRect.top) {
        topBlockRect = rect;
        topBlock = item.block;
      }

      if (!bottomBlockRect) {
        bottomBlockRect = rect;
        bottomBlock = item.block;
      } else if (rect.bottom > bottomBlockRect.bottom) {
        bottomBlockRect = rect;
        bottomBlock = item.block;
      }
    });

    const update = () => {
      if (!topBlock || !bottomBlock) return;

      const firstRect = topBlock.getBoundingClientRect();
      const lastRect = bottomBlock.getBoundingClientRect();

      const firstBlockTop = firstRect.top + window.scrollY;
      const lastBlockTop = lastRect.top + window.scrollY;
      const totalDistance = lastBlockTop - firstBlockTop;
      const currentPosition = window.scrollY;

      const scrollProgress = Math.min(
        Math.max((currentPosition - firstBlockTop) / totalDistance, 0),
        1,
      );

      this.wrapper.style.setProperty(
        "--scroll-progress",
        scrollProgress.toString(),
      );

      if (this.swiper) {
        if (this.swiper.progress !== scrollProgress) {
          this.swiper.setProgress(scrollProgress);
        }
      }

      requestAnimationFrame(update);
    };

    update();
  }
}

export function initSectionsNav() {
  document
    .querySelectorAll<HTMLElement>("[data-sections-nav]")
    .forEach((container) => {
      new SectionsNav(container);
    });
  const fullpageSwiper =
    document.querySelector<HTMLElement>(".fullpage-swiper");
  if (!fullpageSwiper) {
    return;
  }

  let swiperInstance: null | swiperInit = null;

  function initSwiper() {
    if (window.innerWidth >= 768 && !swiperInstance && fullpageSwiper) {
      swiperInstance = new swiperInit(fullpageSwiper, {
        modules: [Mousewheel, HashNavigation],
        direction: "vertical",
        slidesPerView: 1,
        mousewheel: true,
        speed: 1000,
        hashNavigation: {
          replaceState: true,
          watchState: true,
        },
        on: {
          init: function (swiper) {
            updateActiveLink(swiper);
          },
          slideChange: function (swiper) {
            updateActiveLink(swiper);
          },
        },
      });
    } else if (window.innerWidth < 768 && swiperInstance) {
      swiperInstance.destroy(true, true);
      swiperInstance = null;
    }
  }

  // Initial check
  initSwiper();

  // Listen for resize events
  window.addEventListener("resize", () => {
    initSwiper();
  });

  function updateActiveLink(swiper: swiperInit) {
    // Or get from active slide's data-hash
    const activeSlide = swiper.slides[swiper.activeIndex];
    const activeHash = activeSlide.getAttribute("data-hash");

    // Remove active class from all elements with href="#special"
    const links = document.querySelectorAll(
      `.fullpage-nav a[href="#${activeHash}"]`,
    );
    if (activeHash) {
      document.documentElement.dataset.currentpage = activeHash;
    }
    const oldlinks = document.querySelectorAll(".fullpage-nav a");
    if (oldlinks.length) {
      oldlinks.forEach((el) => el.classList.remove("_active"));
    }
    if (links.length) {
      links.forEach((link) => {
        link.classList.add("_active");
      });
    }
  }
}
