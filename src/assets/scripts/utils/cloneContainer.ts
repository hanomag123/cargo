export const initCloseContainers = () => {
  document
    .querySelectorAll<HTMLElement>("[data-clone-container]")
    .forEach((container) => {
      const item = container.querySelector<HTMLElement>("[data-clone-item]");

      if (!item) return;

      const cloneItem = item.cloneNode(true) as HTMLElement;
      cloneItem.setAttribute("data-clone", "");
      container.appendChild(cloneItem);

      container.setAttribute("data-clone-container", "init");
    });
};
