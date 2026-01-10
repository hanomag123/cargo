import { Dropdown } from "./dropdown";

export class Select extends Dropdown {
  items: NodeListOf<HTMLElement>;
  btnText: HTMLElement | null;
  placeholder: string;

  constructor(container: HTMLElement) {
    super(container);
    this.btnText = this.container.querySelector<HTMLElement>("[data-btn-text]");
    this.items = this.container.querySelectorAll<HTMLElement>("[data-item]");

    this.placeholder = this.btnText?.textContent || "";

    this.btn && this.btn.classList.add("_placeholder");

    this.items.forEach((item) => {
      const input = item.querySelector<HTMLInputElement>("input[type='radio']");
      const text = item.querySelector<HTMLElement>("[data-text]");

      if (input && text) {
        input.addEventListener(
          "change",
          this.selectHandler.bind(this, item, input, text.textContent),
        );

        if (input.checked) {
          this.selectHandler(item, input, text.textContent);
        }
      }
    });

    const form = this.container.closest("form");
    if (form) {
      form.addEventListener("change", this.formChangeHandler.bind(this));
    }
  }

  selectHandler(
    item: HTMLElement | null,
    input: HTMLInputElement,
    text: string | null,
  ) {
    this.items.forEach((el) => {
      if (el === item) {
        el.classList.add("_selected");
        if (this.btn && this.btnText && text) {
          this.btnText.textContent = text;
          this.btn.classList.remove("_placeholder");
        }
        // this.input.value = input.value;
        // this.input.dispatchEvent(this.changeEvent);
      } else {
        el.classList.remove("_selected");
      }
    });
    this.close();
  }

  formChangeHandler(e: Event) {
    let selected = false;
    this.items.forEach((item) => {
      const input = item.querySelector<HTMLInputElement>("input[type='radio']");
      const text = item.querySelector<HTMLElement>("[data-text]");

      if (input && text) {
        input.addEventListener(
          "change",
          this.selectHandler.bind(this, item, input, text.textContent),
        );

        if (input.checked) {
          this.selectHandler(item, input, text.textContent);
          selected = true;
        }
      }
    });

    if (!selected) {
      this.btn?.classList.add("_placeholder");
      if (this.btnText) {
        this.btnText.textContent = this.placeholder;
      }
    }
  }
}

export const initSelectItems = (wrapperSelector?: string) => {
  const list = document.querySelectorAll<HTMLElement>(
    `${wrapperSelector || ""} [data-select]`,
  );
  list.forEach((container) => new Select(container));
};
