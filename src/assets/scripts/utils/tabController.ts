interface ITabEl {
  id: string;
  el: HTMLElement;
}

export class TabController {
  wrapper: HTMLElement;
  btnsContainer: HTMLElement | null;
  tabs: ITabEl[] = [];
  btns: Map<string, ITabEl> = new Map();
  calcPos: boolean = false;
  timeoutId: number | undefined = undefined;

  constructor(wrapper: HTMLElement) {
    this.wrapper = wrapper;
    this.btnsContainer = wrapper.querySelector<HTMLElement>("[data-tab-btns]");

    if (this.wrapper.closest('[data-tab-controller="calc"]')) {
      this.calcPos = true;
    }

    window.addEventListener("resize", () => {
      setTimeout(() => {
        this.handleCalcPos();
      }, 500);
    });

    this.initTabs();
    this.initBtns();

    (this.wrapper as any).tabController = this;
  }

  initTabs() {
    this.wrapper
      .querySelectorAll<HTMLElement>("[data-tab]")
      .forEach((container) => {
        const id = container.getAttribute("data-tab");
        if (id) {
          this.tabs.push({
            id: id,
            el: container,
          });
        }
      });
  }

  initBtns() {
    const container = this.btnsContainer || this.wrapper;

    let firstBtn: ITabEl | null = null;
    let activeBtn: ITabEl | null = null;
    container
      .querySelectorAll<HTMLElement>("[data-tab-btn]")
      .forEach((btn, index) => {
        const id = btn.getAttribute("data-tab-btn");

        if (id) {
          const tabBtn: ITabEl = {
            id,
            el: btn,
          };
          this.btns.set(id, tabBtn);

          if (index === 0) {
            firstBtn = tabBtn;
          }

          btn.addEventListener("click", this.switchTab.bind(this, id));

          if (btn.classList.contains("_tab-active")) {
            activeBtn = tabBtn;
            this.switchTab(id);
          }
        }
      });

    if (firstBtn && !activeBtn) {
      this.switchTab(firstBtn);
    }
  }

  switchTab(id: string) {
    if (id == "ALL") {
      this.btns.forEach((btn) => {
        btn.el.classList.add("_tab-active");
      });
      this.tabs.forEach((tab) => {
        tab.el.classList.add("_tab-active");
      });
      return;
    }

    this.btns.forEach((btn) => {
      btn.el.classList.remove("_tab-active");

      if (btn.id === id) {
        btn.el.classList.add("_tab-active");
      }
    });

    this.tabs.forEach((tab) => {
      if (tab.id === id) {
        tab.el.classList.add("_tab-active");
      } else {
        tab.el.classList.remove("_tab-active");
      }
    });

    this.handleCalcPos();
  }

  handleCalcPos() {
    if (!this.calcPos || !this.btnsContainer) return;
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      const containerRect = this.btnsContainer?.getBoundingClientRect();
      if (!containerRect) return;

      this.btns.forEach((btn) => {
        if (!btn.el.classList.contains("_tab-active")) return;

        const rect = btn.el.getBoundingClientRect();
        this.btnsContainer?.style.setProperty("--w", rect.width + "px");
        this.btnsContainer?.style.setProperty("--h", rect.height + "px");
        this.btnsContainer?.style.setProperty("--l", Math.abs(containerRect.left - rect.left) + "px");
        this.btnsContainer?.style.setProperty("--t", Math.abs(containerRect.top - rect.top) + "px");
      });
    }, 50);
  }
}

export function initTabController() {
  document
    .querySelectorAll<HTMLElement>("[data-tab-controller]")
    .forEach((wrapper) => new TabController(wrapper));
}
