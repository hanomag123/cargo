interface ITabBtn {
  id: string;
  el: HTMLElement;
}

class TabController {
  wrapper: HTMLElement;
  btnsContainer: HTMLElement | null;
  tabs: Map<string, HTMLElement> = new Map();
  btns: Map<string, ITabBtn> = new Map();
  calcPos: boolean = false;

  constructor(wrapper: HTMLElement) {
    this.wrapper = wrapper;
    this.btnsContainer = wrapper.querySelector<HTMLElement>("[data-tab-btns]");

    if (this.wrapper.closest('[data-tab-controller="calc"]')) {
      this.calcPos = true;
    }

    this.initTabs();
    this.initBtns();
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

  switchTab(tabBtn: ITabBtn) {
    const containerRect = this.btnsContainer?.getBoundingClientRect();

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

      if (this.calcPos) {
        const rect = btn.el.getBoundingClientRect();

        if (!containerRect) {
          return;
        }

        this.btnsContainer?.style.setProperty("--w", rect.width + "px");
        this.btnsContainer?.style.setProperty("--h", rect.height + "px");
        this.btnsContainer?.style.setProperty(
          "--l",
          Math.abs(containerRect.left - rect.left) + "px",
        );
      }
    });
  }
}

export function initTabController() {
  document
    .querySelectorAll<HTMLElement>("[data-tab-controller]")
    .forEach((wrapper) => new TabController(wrapper));
}
