import type Swiper from "swiper";

class BlockFilter {
  wrapper: HTMLElement;
  blocks: { id: string; el: HTMLElement }[] = [];
  btns: Map<string, HTMLElement> = new Map();
  swiper: Swiper | null = null;

  constructor(wrapper: HTMLElement) {
    this.wrapper = wrapper;
    this.initBtns();
    this.initBlocks();
    this.initSwiper();

    this.btns.forEach((btn, key) => {
      if (btn.classList.contains("_block-filter-active")) {
        this.clickHandler(key);
      }
    });
  }

  initBtns() {
    this.wrapper
      .querySelectorAll<HTMLElement>("[data-block-filter-btn]")
      .forEach((btn) => {
        const id = btn.getAttribute("data-block-filter-btn");
        if (id) {
          this.btns.set(id, btn);
          btn.addEventListener("click", this.clickHandler.bind(this, id));
        }
      });
  }

  initBlocks() {
    this.wrapper
      .querySelectorAll<HTMLElement>("[data-block-filter-block]")
      .forEach((block) => {
        const id = block.getAttribute("data-block-filter-block");
        if (id) {
          this.blocks.push({ id, el: block });
        }
      });
  }

  initSwiper() {
    const swiperContainer = this.wrapper.querySelector<HTMLElement>(".swiper");
    if (swiperContainer && (swiperContainer as any).swiper) {
      this.swiper = (swiperContainer as any).swiper;
    }
  }

  clickHandler(id: string) {
    if (id === "all") {
      this.blocks.forEach((block) => {
        block.el.classList.remove("_block-filter-hidden");
      });
      this.btns.forEach((btn, key) => {
        if (key === "all") {
          btn.classList.add("_block-filter-active");
        } else {
          btn.classList.remove("_block-filter-active");
        }
      });
    } else {
      this.blocks.forEach((block) => {
        if (block.id === id) {
          block.el.classList.remove("_block-filter-hidden");
        } else {
          block.el.classList.add("_block-filter-hidden");
        }
      });
      this.btns.forEach((btn, key) => {
        if (key === id) {
          btn.classList.add("_block-filter-active");
        } else {
          btn.classList.remove("_block-filter-active");
        }
      });
    }

    if (this.swiper) {
      this.swiper.update();
    }
  }
}

export function initBlockFilter() {
  document
    .querySelectorAll<HTMLElement>("[data-block-filter]")
    .forEach((block) => {
      new BlockFilter(block);
    });
}
