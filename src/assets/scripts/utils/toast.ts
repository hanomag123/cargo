export class Toast {
  container: HTMLDivElement;
  list: HTMLDivElement;
  template: HTMLTemplateElement;

  constructor() {
    this.container = document.createElement("div");
    this.list = document.createElement("div");
    this.template = document.createElement("template");

    this.init();
  }

  private init() {
    this.container.className = "toast";

    this.template.innerHTML = `
      <div class="toast-item">
        <div class="toast-item__wrapper">
          <div class="toast-item__container">
            <div class="toast-item__inner">
              <span class="toast-item__title" data-title></span>
              <span class="toast-item__text" data-text></span>
            </div>
            <button type="button" class="toast-item__btn" data-btn>
              <svg astro-icon="menu-close">
                  <use xlink:href="#astroicon:menu-close"></use>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.container);

    (window as any).toast = this;
  }

  new(props: {
    title: string;
    text: string;
    color?: "red" | "greed";
    duration?: number;
    closeable?: boolean;
  }) {
    const toast = this.template.content.children[0].cloneNode(true);

    const title = (toast as HTMLElement).querySelector<HTMLElement>(
      "[data-title]",
    );
    const text = (toast as HTMLElement).querySelector<HTMLElement>(
      "[data-text]",
    );
    const btn = (toast as HTMLElement).querySelector<HTMLButtonElement>(
      "[data-btn]",
    );

    if (title && text && btn) {
      title.textContent = props.title;
      text.textContent = props.text;
      btn.addEventListener(
        "click",
        this.close.bind(this, toast as HTMLElement),
      );

      if (props.color) {
        (toast as HTMLElement).classList.add(props.color);
      }

      if (props.duration) {
        setTimeout(this.close.bind(this, toast as HTMLElement), props.duration);
      }

      if (props.closeable === false) {
        btn.remove();
      }

      this.container.appendChild(toast);
      (toast as HTMLElement).classList.add("toast-in");
    }
  }

  private close(item: HTMLElement) {
    item.addEventListener("animationend", () => {
      item.remove();
    });

    item.classList.add("toast-out");
  }
}
