class ShowController {
  wrapper: HTMLElement;
  btn: HTMLElement | null;
  items: Map<number, HTMLElement> = new Map();
  showCount: number = 4;

  constructor(wrapper: HTMLElement) {
    this.wrapper = wrapper;
    this.showCount = Number(this.wrapper.getAttribute("data-show")) || 4;
    this.btn = this.wrapper.querySelector<HTMLElement>("[data-show-btn]");

    this.wrapper
      .querySelectorAll<HTMLElement>("[data-show-item]._hidden")
      .forEach((el, index) => this.items.set(index, el));

    this.btn?.addEventListener("click", this.showHandler.bind(this));

    if (!this.items.size && this.btn) {
      this.btn.classList.add("_hidden");
    }
  }

  showHandler() {
    let counter = 0;
    this.items.forEach((el, key) => {
      if (counter < this.showCount) {
        el.classList.remove("_hidden");
        this.items.delete(key);
        counter++;
      }
    });

    if (!this.items.size && this.btn) {
      this.btn.classList.add("_hidden");
    }
  }
}

export function initShowHandler() {
  document
    .querySelectorAll<HTMLElement>("[data-show]")
    .forEach((el) => new ShowController(el));
}
