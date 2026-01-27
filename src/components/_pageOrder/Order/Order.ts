import { formValidateInit } from "@assets/scripts/fv";
import Swiper from "swiper";

interface OrderStepItem {
  index: number;
  num: number;
  el: HTMLElement;
}

class OrderController {
  swiper: Swiper | null = null;
  prevBtn: HTMLElement | null = null;
  nextBtn: HTMLElement | null = null;
  submitBtn: HTMLElement | null = null;
  stepBtns: OrderStepItem[] = [];
  stepContainers: OrderStepItem[] = [];
  minStep: number = 1;
  maxStep: number = 0;
  currentStep: number = 0;
  fv: ReturnType<typeof formValidateInit> = formValidateInit(".order-validate");

  constructor(private wrapper: HTMLElement) {
    this.init();
  }

  init() {
    const swiperContainer = this.wrapper.querySelector<HTMLElement>("[data-order-swiper]");
    if (swiperContainer) {
      this.swiper = new Swiper(swiperContainer, {
      })
    }

    this.prevBtn = this.wrapper.querySelector<HTMLElement>("[data-order-prev-btn]");
    this.nextBtn = this.wrapper.querySelector<HTMLElement>("[data-order-next-btn]");
    this.submitBtn = this.wrapper.querySelector<HTMLElement>("[data-order-submit-btn]");

    this.wrapper.querySelectorAll<HTMLElement>("[data-order-step-btn]").forEach((item, index) => {
      const num = Number(item.getAttribute("data-order-step-btn"));
      if (num || num === 0) {
        this.stepBtns.push({
          index,
          num,
          el: item,
        });

        if (item.classList.contains("_order-step-active")) {
          this.currentStep = num;
        }
      }
    });

    this.wrapper.querySelectorAll<HTMLElement>("[data-order-step]").forEach((item, index) => {
      const num = Number(item.getAttribute("data-order-step"));

      if (num || num === 0) {
        this.stepContainers.push({
          index,
          num,
          el: item,
        });

        if (num < this.minStep) {
          this.minStep = num;
        }

        if (num > this.maxStep) {
          this.maxStep = num;
        }
      }
    });

    this.wrapper.addEventListener("click", this.clickHandler.bind(this));

    this.wrapper.addEventListener("change", this.changeHandler.bind(this));
    this.wrapper.addEventListener("submit", this.submitHandler.bind(this));

    this.wrapper.querySelectorAll<HTMLInputElement>("[data-radio-tab-trigger]").forEach(input => {
      const name = input.getAttribute("name");
      const value = input.getAttribute("value");

      if (!name || !value) {
        return;
      }

      this.radioTabHandler(name, value, input.checked);
    })

    this.updateSteps();
  }

  clickHandler(e: MouseEvent) {
    const target = e.target as HTMLElement;

    if (target.closest("[data-order-prev-btn]")) {
      this.stepPrev();
    }

    if (target.closest("[data-order-next-btn]")) {
      this.stepNext();
    }

    if (target.closest("[type='submit']")) {
      this.submitHandler(e);
    }
  }

  changeHandler(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.closest("[data-radio-tab-trigger]")) {
      const name = target.getAttribute("name");
      const value = target.getAttribute("value");

      if (!name || !value) {
        return;
      }

      this.radioTabHandler(name, value, !!target.checked);
    }
  }

  radioTabHandler(name: string, value: string, checked: boolean) {
    this.wrapper.querySelectorAll<HTMLElement>(`[data-radio-tab-input="${name}"]`).forEach(container => {
      const input = container.querySelector<HTMLInputElement>("input");
      const containerValue = container.getAttribute("data-radio-tab-value");

      if (checked && containerValue !== value) {
        container.classList.add("_radio-tab-hidden");
        input?.setAttribute("disabled", "true");
        return;
      }

      if (!checked && containerValue === value) {
        container.classList.add("_radio-tab-hidden");
        input?.setAttribute("disabled", "true");
        return;
      }

      container.classList.remove("_radio-tab-hidden");
      input?.removeAttribute("disabled");
    });
  }

  stepPrev() {
    if (this.currentStep <= this.minStep) {
      return;
    }

    const isValid = this.checkStepValidity(this.currentStep);
    if (!isValid) {
      return;
    }

    this.currentStep--;
    this.updateSteps();
  }

  stepNext() {
    if (this.currentStep >= this.maxStep) {
      return;
    }

    const isValid = this.checkStepValidity(this.currentStep);
    if (!isValid) {
      return;
    }

    this.currentStep++;
    this.updateSteps();
  }

  checkStepValidity(step: number) {
    const targetStepContainer = this.stepContainers.find(item => item.num === step);
    if (!targetStepContainer) {
      return;
    }

    const requiredFields = targetStepContainer.el.querySelectorAll<HTMLInputElement>("[required][data-action]");
    const vlaidList: boolean[] = [];
    Array.from(requiredFields).map((item) => {
      vlaidList.push(this.fv.checkNodeValidity(item));
    });

    if (vlaidList.includes(false)) {
      return;
    }

    return true;
  }

  updateSteps() {
    this.stepBtns.forEach(item => {
      item.el.classList.remove("_order-step-active");
      if (item.num === this.currentStep) {
        item.el.classList.add("_order-step-active");
      }
    });

    this.stepContainers.forEach(item => {
      item.el.classList.remove("_order-step-active");
      if (item.num === this.currentStep) {
        item.el.classList.add("_order-step-active");
      }
    });

    this.wrapper.setAttribute("data-order-stem-num", this.currentStep.toString());
  }

  submitHandler(e: MouseEvent | SubmitEvent) {
    const invalidSteps: number[] = this.stepContainers.reduce((acc: number[], item) => {
      if (!this.checkStepValidity(item.num)) {
        acc.push(item.num);
      }
      return acc;
    }, []);

    if (invalidSteps.length === 0) {
      return;
    }

    const firstInvalidStep = this.stepContainers.find(item => item.num === invalidSteps[0]);
    if (!firstInvalidStep) {
      return;
    }

    e.preventDefault();
    this.swiper?.slideTo(firstInvalidStep.index);
    this.currentStep = firstInvalidStep.num;
    this.updateSteps();
  }
}

export const initOrder = () => {
  document.querySelectorAll<HTMLElement>("[data-order]").forEach(wrapper => {
    new OrderController(wrapper);
  })
}