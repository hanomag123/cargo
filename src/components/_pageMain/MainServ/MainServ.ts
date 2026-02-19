export const initMainServNav = () => {
  document.querySelectorAll<HTMLElement>(".main-serv").forEach(container => {
    const targetContainer = container.querySelector<HTMLElement>(".main-serv__list");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          container.classList.add("_visable");
        } else {
          container.classList.remove("_visable");
        }
      })
    });

    targetContainer && observer.observe(targetContainer);
  });
}