export class Tooltip {
  trigger: HTMLElement;
  container: HTMLElement | null;
  static: boolean;

  constructor(trigger: HTMLElement) {
    this.trigger = trigger;
    this.container = this.trigger.querySelector<HTMLElement>(
      "[data-tooltip-container]",
    );

    this.static = this.trigger.hasAttribute("data-static");

    if (this.trigger && this.container) {
      this.trigger.addEventListener("mouseenter", this.show.bind(this));
      this.trigger.addEventListener("mouseleave", this.hide.bind(this));
    }
  }

  show(e: MouseEvent) {
    if (this.container) {
      this.updateSize(e);
      this.container.classList.add("_active");
    }
  }

  hide() {
    if (this.container) {
      this.container.classList.remove("_active");
    }
  }

  resetSize() {
    if (this.container) {
      this.container.style.removeProperty("right");
      this.container.style.removeProperty("width");
    }
  }

  updateSize(e: MouseEvent) {
    if (this.container && !this.static) {
      let pos = this.container.getBoundingClientRect();

      this.container.style.setProperty("top", e.clientY - pos.height + "px");
      this.container.style.setProperty(
        "left",
        e.clientX - pos.width + 10 + "px",
      );

      pos = this.container.getBoundingClientRect();

      if (pos.left < 0) {
        this.container.style.setProperty("left", 5 + "px");
      }

      if (pos.width > window.innerWidth) {
        this.container.style.setProperty(
          "width",
          window.innerWidth - 10 + "px",
        );
      }
    }
  }
}

export const initTooltipItems = (wrapperSelector?: string) => {
  const list = document.querySelectorAll<HTMLElement>(
    `${wrapperSelector || ""} [data-tooltip]`,
  );
  list.forEach((container) => new Tooltip(container));
};
