import { formValidateInit } from "./fv";
import Swiper from "swiper";
import { Navigation, Manipulation } from "swiper/modules";
import { PopupController } from "./utils/popup";
import { initDropdownItems } from "./utils/dropdown";
import { initSelectItems } from "./utils/select";
import VenoBox from "venobox/dist/venobox";
import { initHeader } from "@components/Header/Header";
import { initTabController } from "./utils/tabController";
import { initMainBanner } from "@components/_pageMain/MainBanner/MainBanner";
import { initSectionsNav } from "./utils/sectionsNav";

Swiper.use([Navigation, Manipulation]);

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
  initDropdownItems();
  initSelectItems();
  initTabController();
  initSectionsNav();

  // компоненты
  initHeader();
  initMainBanner();
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
