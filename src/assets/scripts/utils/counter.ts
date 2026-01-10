export class Counter {
  container: HTMLElement;
  input: HTMLInputElement | null = null;
  incBtn: HTMLElement | null = null;
  decBtn: HTMLElement | null = null;

  value: number = 0;
  minValue: number = -Infinity;
  maxValue: number = Infinity;
  step: number = 1;

  changeEvent = new Event("change", { bubbles: true });

  constructor(container: HTMLElement) {
    this.container = container;
    this.input = this.container.querySelector<HTMLInputElement>(
      "[data-counter-input]",
    );
    this.incBtn = this.container.querySelector<HTMLElement>(
      "[data-counter-inc-btn]",
    );
    this.decBtn = this.container.querySelector<HTMLElement>(
      "[data-counter-dec-btn]",
    );

    this.init();
  }

  init() {
    this.initDefaultValues();

    this.incBtn?.addEventListener("click", this.increment.bind(this));
    this.decBtn?.addEventListener("click", this.decrement.bind(this));
    this.input?.addEventListener("change", this.handleInputChange.bind(this));
  }

  initDefaultValues() {
    if (!this.input) return;
    const defaultValueAttr = this.input.getAttribute("value");
    const minValueAttr = this.input.getAttribute("min");
    const maxValueAttr = this.input.getAttribute("max");
    const stepAttr = this.input.getAttribute("step");

    const defaultValue = Number(defaultValueAttr);
    const minValue = Number(minValueAttr);
    const maxValue = Number(maxValueAttr);
    const step = Number(stepAttr);

    this.minValue = Number.isNaN(minValue) ? -Infinity : minValue;
    this.maxValue = Number.isNaN(maxValue) ? Infinity : maxValue;
    this.value = Number.isNaN(defaultValue) ? 0 : defaultValue;
    this.step = Number.isNaN(step) ? 1 : step;
  }

  increment() {
    const newValue = this.value + this.step;
    if (newValue > this.maxValue) {
      this.value = this.maxValue;
    } else {
      this.value = newValue;
    }
    this.updateInputValue();
    this.input?.dispatchEvent(this.changeEvent);
  }

  decrement() {
    const newValue = this.value - this.step;
    if (newValue < this.minValue) {
      this.value = this.minValue;
    } else {
      this.value = newValue;
    }
    this.updateInputValue();
    this.input?.dispatchEvent(this.changeEvent);
  }

  handleInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const value = Number(target.value);

    if (Number.isNaN(value)) {
      this.updateInputValue();
      return;
    }

    if (value < this.minValue) {
      this.value = this.minValue;
    } else if (value > this.maxValue) {
      this.value = this.maxValue;
    } else {
      this.value = value;
    }
    this.updateInputValue();
  }

  updateInputValue() {
    if (!this.input) return;
    this.input.value = this.value.toString();
  }
}

export const initCounterItems = () => {
  document
    .querySelectorAll<HTMLElement>("[data-counter]")
    .forEach((container) => new Counter(container));
};
