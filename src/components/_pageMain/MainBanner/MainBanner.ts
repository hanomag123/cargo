import type { TabController } from "@assets/scripts/utils/tabController";

export const initMainBanner = () => {
  document.querySelectorAll<HTMLElement>(".main-banner").forEach(wrapper => {
    const tabContainer = wrapper.querySelector<HTMLElement>('.order-info[data-tab-controller]');
    const tabController = (tabContainer as any).tabController as TabController;
    if (!tabController) return;

    wrapper.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;

      const tabBtn = target.closest<HTMLElement>('[data-calc-tab]');
      if (!tabBtn) return;
      const key = tabBtn.getAttribute('data-calc-tab');
      if (!key) return;
      tabController.switchTabByKey(key);
    })
  })
}