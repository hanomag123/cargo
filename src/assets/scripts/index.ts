import { formValidateInit } from "./fv";
import Swiper from "swiper";
import { Navigation, Manipulation, Pagination, Thumbs, FreeMode } from "swiper/modules";
import { PopupController } from "./utils/popup";
import { initDropdownItems } from "./utils/dropdown";
import { initSelectItems } from "./utils/select";
import VenoBox from "venobox/dist/venobox";
import { initHeader } from "@components/Header/Header";
import { initTabController } from "./utils/tabController";
import { initMainBanner } from "@components/_pageMain/MainBanner/MainBanner";
import { initSectionsNav } from "./utils/sectionsNav";
import { initAboutHistory } from "@components/_pageAbout/AboutHistory/AboutHistory";
import { initSwipers } from "./utils/swiper";

Swiper.use([Navigation, Manipulation, Pagination, Thumbs, FreeMode]);

document.addEventListener("DOMContentLoaded", () => {
  new VenoBox({
    selector: "[data-vb]",
    spinner: "rotating-plane",
  });

  const popupController = new PopupController();
  (window as any).popupController = popupController;

  // Инициализация компонентов и обработчиков
  // общие
  formValidateInit(".fv");
  initSwipers();
  initDropdownItems();
  initSelectItems();
  initTabController();
  initSectionsNav();

  // компоненты
  initHeader();
  initMainBanner();
  initAboutHistory()
  // <--

  // События
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    // vBoxHandler(e, target);

    popupController.clickHandler(e, target);
  });

  document.addEventListener("vBoxContentLoaded", () => {
    formValidateInit(".vbox-content .fv");
  });
});
