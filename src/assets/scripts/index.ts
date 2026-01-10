import { formValidateInit } from "./fv";
import Swiper from "swiper";
import { Navigation, Manipulation } from "swiper/modules";
import { PopupController } from "./utils/popup";
import { initDropdownItems } from "./utils/dropdown";
import { initSelectItems } from "./utils/select";
import VenoBox from "venobox/dist/venobox";

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

  // компоненты
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
