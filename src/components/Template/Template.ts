export const initTemplateBlocks = () => {
  const containers = document.querySelectorAll<HTMLElement>(".template");

  containers.forEach((container) => {
    const tables = container.querySelectorAll<HTMLTableElement>("table");

    tables.forEach((table) => {
      const newContainer = document.createElement("div");
      newContainer.className = "template__table";

      table.insertAdjacentElement("beforebegin", newContainer);
      newContainer.appendChild(table);
    });
  });
};
