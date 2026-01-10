export class DropdownController {
  slots: {
    [key: string]: Dropdown[];
  };

  constructor() {
    this.slots = {};
  }

  openHandler(target: Dropdown) {
    if (target.controllerID) {
      this.slots[target.controllerID].forEach((el) => {
        if (el !== target) {
          el.close();
        }
      });
    }
  }
}

const dropdownController = new DropdownController();

export class Dropdown {
  container: HTMLElement;
  dropped: boolean;
  btn: HTMLElement | null;
  controller: DropdownController;
  controllerID: string | null;
  className: null | string = null;
  isCloseble: boolean = false;
  // scrollTo: boolean;

  constructor(container: HTMLElement) {
    this.controller = dropdownController;

    this.container = container;
    this.dropped = false;

    // блок с data-dropdown-btn станет кнопкой
    this.btn = this.container.querySelector<HTMLElement>("[data-dropdown-btn]");
    this.isCloseble = this.container.hasAttribute("data-close");

    // if (this.btn) {
    //   this.btn.addEventListener("click", this.dropStateHandler.bind(this));
    // }

    // data-dropdown-close на контейнере будет закрыть при клике вне контейнера
    // if (this.container.hasAttribute("data-close")) {
    //   document.addEventListener("click", (e) => {
    //     const closestEl = (e.target as HTMLElement).closest("[data-close]");

    //     if (!closestEl || closestEl !== this.container) {
    //       this.close();
    //     }
    //   });
    // }

    document.addEventListener("click", this.clickHandler.bind(this));

    // data-open - открыт изначально
    if (this.container.classList.contains("_dropped")) {
      this.open();
    }

    // data-controller-id={id для группы} при открытии закрывает остальные
    this.controllerID = this.container.getAttribute("data-dropdown-group");
    if (this.controllerID !== null) {
      if (this.controller.slots[this.controllerID]) {
        this.controller.slots[this.controllerID].push(this);
      } else {
        this.controller.slots[this.controllerID] = [];
        this.controller.slots[this.controllerID].push(this);
      }
    }

    // data-scroll-to скрол до блока при открытии
    // this.scrollTo = this.container.hasAttribute("data-scroll-to");
    this.className = this.container.getAttribute("data-class");
  }

  dropStateHandler() {
    if (this.dropped) {
      this.close();
    } else {
      this.open();
    }
  }

  clickHandler(e: Event) {
    const target = e.target as HTMLElement;
    if (this.isCloseble) {
      const closestEl = target.closest("[data-close]");

      if (!closestEl || closestEl !== this.container) {
        this.close();
        return;
      }
    }

    const dropdown = target.closest("[data-dropdown]");
    const select = target.closest("[data-select]");

    if (!select && !dropdown) {
      return;
    }

    if (dropdown && dropdown !== this.container) {
      return;
    }

    if (select && select !== this.container) {
      return;
    }

    const dropdownBtn = target.closest("[data-dropdown-btn]");
    if (dropdownBtn) {
      this.dropStateHandler();
    }

    const closeBtn = target.closest("[data-dropdown-close]");
    if (closeBtn) {
      this.close();
    }
  }

  open() {
    this.dropped = true;
    this.container.classList.add("_dropped");

    if (this.controller) {
      this.controller.openHandler(this);
    }

    if (this.className) {
      document.body.classList.add(this.className);
    }

    // if (this.scrollTo) {
    this.scrollToStart();
    // }
  }

  close() {
    this.dropped = false;
    this.container.classList.remove("_dropped");

    if (this.className) {
      document.body.classList.remove(this.className);
    }
  }

  scrollToStart() {
    if (window.matchMedia("(max-width: 768px)").matches) {
      setTimeout(() => {
        const rect = this.container.getBoundingClientRect();

        if (rect.top < 0) {
          window.scrollTo({
            top: window.scrollY + (rect.top - 60),
            behavior: "smooth",
          });
        }
      }, 500);
    }
  }
}

export const initDropdownItems = (wrapperSelector?: string) => {
  const list = document.querySelectorAll<HTMLElement>(
    `${wrapperSelector || ""} [data-dropdown]`,
  );
  list.forEach((container) => new Dropdown(container));
};
