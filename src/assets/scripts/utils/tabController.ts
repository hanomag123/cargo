interface ITabBtn {
  id: string;
  el: HTMLElement;
}

export class TabController {
  wrapper: HTMLElement;
  btnsContainer: HTMLElement | null;
  tabs: Map<string, HTMLElement> = new Map();
  btns: Map<string, ITabBtn> = new Map();
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
          this.tabs.set(id, container);
        }
      });
  }

  initBtns() {
    const container = this.btnsContainer || this.wrapper;

    let firstBtn: ITabBtn | null = null;
    let activeBtn: ITabBtn | null = null;
    container
      .querySelectorAll<HTMLElement>("[data-tab-btn]")
      .forEach((btn, index) => {
        const id = btn.getAttribute("data-tab-btn");

        if (id) {
          const tabBtn: ITabBtn = {
            id,
            el: btn,
          };
          this.btns.set(id, tabBtn);

          if (index === 0) {
            firstBtn = tabBtn;
          }

          btn.addEventListener("click", this.switchTab.bind(this, tabBtn));

          if (btn.classList.contains("_tab-active")) {
            activeBtn = tabBtn;
            this.switchTab(tabBtn);
          }
        }
      });

    if (firstBtn && !activeBtn) {
      this.switchTab(firstBtn);
    }
  }

  switchTabByKey(key: string) {
    const tabBtn = this.btns.get(key);
    if (!tabBtn) return;
    this.switchTab(tabBtn);
  }

  switchTab(tabBtn: ITabBtn) {

    this.tabs.forEach((tab, key) => {
      if (key === tabBtn.id) {
        tab.classList.add("_tab-active");
      } else {
        tab.classList.remove("_tab-active");
      }
    });

    this.btns.forEach((btn) => {
      if (btn !== tabBtn) {
        btn.el.classList.remove("_tab-active");
        return;
      } else {
        btn.el.classList.add("_tab-active");
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
