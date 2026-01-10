import interact from "interactjs";
import { clamp } from "./services";
import type Swiper from "swiper";

class Slicer {
  btn: HTMLElement | null = null;
  pos: {
    min: number;
    max: number;
    center: number;
  };
  swiper: Swiper | null = null;
  swiperTouchMove: boolean = false;

  constructor(private container: HTMLElement) {
    this.btn = this.container.querySelector("[data-slicer-btn]");
    const rect = this.container.getBoundingClientRect();
    this.pos = {
      min: rect.width * 0.1,
      max: rect.width * 0.9,
      center: rect.width * 0.5,
    };

    const swiperContainer = this.container.closest(".swiper");
    if (swiperContainer && (swiperContainer as any).swiper) {
      this.swiper = (swiperContainer as any).swiper as Swiper;
    }

    this.init();
  }

  init() {
    if (!this.btn) return;

    this.btn.ontouchstart = (e) => {
      e.preventDefault();
    };
    this.btn.ontouchmove = (e) => {
      e.preventDefault();
    };
    this.btn.ontouchend = (e) => {
      e.preventDefault();
    };

    interact(this.btn).draggable({
      inertia: true,
      listeners: {
        start: () => {
          this.btn && this.btn.classList.add("_drag");

          if (this.swiper) {
            this.swiperTouchMove = this.swiper.allowTouchMove;
            this.swiper.allowTouchMove = false;
          }
        },

        move: (e) => {
          this.pos.center = clamp(
            this.pos.min,
            this.pos.max,
            this.pos.center + e.dx,
          );
          this.setStyles(this.pos.center);
        },
        end: () => {
          this.btn && this.btn.classList.remove("_drag");

          if (this.swiper) {
            this.swiper.allowTouchMove = this.swiperTouchMove;
          }
        },
      },
    });

    let resizeID = 0;
    window.addEventListener("resize", () => {
      clearTimeout(resizeID);

      resizeID = setTimeout(() => {
        const rect = this.container.getBoundingClientRect();
        this.pos = {
          min: rect.width * 0.1,
          max: rect.width * 0.9,
          center: rect.width * 0.5,
        };
        this.setStyles(this.pos.center);
      }, 100);
    });

    this.setStyles(this.pos.center);
  }

  setStyles(value: number) {
    this.container.style.setProperty("--slicer-x", `${value}px`);
    this.container.style.setProperty(
      "--slicer-clip",
      `polygon(${value}px 0%, 100% 0%, 100% 100%, ${value}px 100%)`,
    );
  }
}

export function initSlicers() {
  document
    .querySelectorAll<HTMLElement>("[data-slicer]")
    .forEach((container) => new Slicer(container));
}
