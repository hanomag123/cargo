class HeaderMenu {
  menuIsOpen: boolean = false;

  constructor() {
    document.addEventListener("click", this.clickHandler.bind(this));
  }

  clickHandler(e: MouseEvent) {
    const target = e.target as HTMLElement;

    if (target.closest("[data-toggle-menu]")) {
      this.toggleMenu();
      return;
    }

    if (target.closest("[data-open-menu]")) {
      this.openMenu();
      return;
    }

    if (target.closest("[data-close-menu]")) {
      this.closeMenu();
      return;
    }

    if (target.closest("[data-toggle-catalog]")) {
      this.toggleCatalog();
      return;
    }
  }

  closeMenu() {
    document.body.classList.remove("_menu-open");
    this.menuIsOpen = false;
  }

  openMenu() {
    document.body.classList.add("_menu-open");
    this.menuIsOpen = true;
    document.body.classList.remove("_header-hide");
  }

  toggleMenu() {
    if (this.menuIsOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  toggleCatalog() {
    document.body.classList.toggle("_catalog-open");
  }
}

class HeaderScroll {
  scrollY: number = 0;

  constructor() {
    document.addEventListener("scroll", this.scrollHandler.bind(this));
  }

  scrollHandler() {
    const scrollY = window.scrollY;

    if (
      document.body.classList.contains("_menu-open") ||
      document.body.classList.contains("_search-open")
    ) {
      this.scrollY = scrollY;
      return;
    }

    if (scrollY > 300) {
      document.body.classList.add("_header-sticky");
      if (scrollY > this.scrollY) {
        document.body.classList.remove("_header-show");
      } else {
        document.body.classList.add("_header-show");
      }
    } else {
      document.body.classList.remove("_header-sticky");
      document.body.classList.remove("_header-show");
    }

    this.scrollY = scrollY;
  }
}

export const initHeader = () => {
  new HeaderMenu();
  // new HeaderScroll();
};
