interface INavItem {
  link: HTMLElement;
  block: HTMLElement;
}

class SectionsNav {
  observer: IntersectionObserver;
  items: Map<string, INavItem> = new Map();
  offset = 0;
  private rafId: number | null = null;

  constructor(public wrapper: HTMLElement) {
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
          href && id && document.querySelector<HTMLElement>(href);

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
}
