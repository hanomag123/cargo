class HeaderController {
  wrapper: HTMLElement;
  headerServ: HeaderServ;
  headerMenu: HeaderMenu;

  constructor(wrapper: HTMLElement) {
    this.wrapper = wrapper;
    this.headerServ = new HeaderServ(this.wrapper);
    this.headerMenu = new HeaderMenu(this.wrapper);

    this.init();
  }

  init() {
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;

      const servOpenBtn = target.closest<HTMLElement>(
        "[data-header-serv-open]",
      );
      if (servOpenBtn) {
        this.headerServ.open();
      }

      const servCloseBtn = target.closest<HTMLElement>(
        "[data-header-serv-close]",
      );
      if (servCloseBtn) {
        this.headerServ.close();
      }

      const servCloseItems = target.closest<HTMLElement>(
        "[data-header-serv-close-items]",
      );
      if (servCloseItems) {
        this.headerServ.closeItems();
      }

      const menuOpenBtn = target.closest<HTMLElement>(
        "[data-header-menu-open]",
      );
      if (menuOpenBtn) {
        this.headerMenu.open();
      }

      const menuCloseBtn = target.closest<HTMLElement>(
        "[data-header-menu-close]",
      );
      if (menuCloseBtn) {
        this.headerMenu.close();
      }

      const menuToggleBtn = target.closest<HTMLElement>(
        "[data-header-menu-toggle]",
      );
      if (menuToggleBtn) {
        this.headerMenu.toggle();
      }
    });
  }
}

class HeaderServ {
  wrapper: HTMLElement;
  items: HTMLElement[] = [];

  constructor(wrapper: HTMLElement) {
    this.wrapper = wrapper;
    this.wrapper
      .querySelectorAll<HTMLElement>("[data-header-serv-item]")
      .forEach((container) => {
        const btn = container.querySelector<HTMLElement>(
          "[data-header-serv-item-btn]",
        );

        this.items.push(container);

        if (btn) {
          btn.addEventListener("click", this.openItem.bind(this, container));
        }
      });
  }

  open() {
    this.wrapper.classList.add("_open-serv");
  }

  close() {
    this.wrapper.classList.remove("_open-serv");

    this.items.forEach((item) => {
      item.classList.remove("_active");
    });
  }

  openItem(container: HTMLElement) {
    this.closeItems();

    container.classList.add("_active");
  }

  closeItems() {
    this.items.forEach((item) => {
      item.classList.remove("_active");
    });
  }
}

class HeaderMenu {
  wrapper: HTMLElement;

  constructor(wrapper: HTMLElement) {
    this.wrapper = wrapper;
  }

  open() {
    this.wrapper.classList.add("_open-menu");
  }

  close() {
    this.wrapper.classList.remove("_open-menu");
  }

  toggle() {
    this.wrapper.classList.toggle("_open-menu");
  }
}

export const initHeader = () => {
  const container = document.querySelector<HTMLElement>("[data-header]");

  if (!container) return;

  new HeaderController(container);
};
