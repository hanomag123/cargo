import VenoBox from "venobox/dist/venobox";

const vboxOptions = {
  overlayColor: "rgba(22, 22, 22, 0.45)",
  bgcolor: null,
  spinner: "grid",
  onContentLoadedEvent: new Event("vBoxContentLoaded", { bubbles: true }),
  onContentLoaded: (): void => {
    document.dispatchEvent(vboxOptions.onContentLoadedEvent);
  },
  onPreOpen: (): void => {
    vBox.isOpen = true;
  },
  onPreClose: (): void => {
    vBox.isOpen = false;
  },
};

const vBox = new VenoBox(vboxOptions);

(window as any).vBox = vBox;
(window as any).openVBox = openVBox;

function openVBox(src: string, vbtype?: string) {
  const link = document.createElement("a");
  link.href = src;
  link.setAttribute("data-vbtype", vbtype ? vbtype : "ajax");
  (link as any).settings = vBox.settings;

  vBox.close();
  setTimeout(() => {
    vBox.open(link);
  }, 500);
}

export function vBoxHandler(e: Event, target: HTMLElement) {
  const closePopup = target.closest("[data-vclose]");
  const vBoxLink = target.closest("[data-vbox]");

  if (vBoxLink) {
    e.preventDefault();

    if (!(vBoxLink as any).settings) {
      (vBoxLink as any).settings = vBox.settings;
    }

    const videoSrc = vBoxLink.getAttribute("data-video");

    if (videoSrc) {
      setVBoxCallback(() => setVideoSrc(videoSrc));
    }

    if (vBox.isOpen) {
      vBox.close();
      setTimeout(() => {
        vBox.open(vBoxLink);
      }, 500);
    } else {
      vBox.open(vBoxLink);
    }
  }

  if (closePopup) {
    vBox.close();
  }
}

export function setVBoxCallback(callback: () => void) {
  const vBoxCallback = () => {
    callback();
    document.removeEventListener("vBoxContentLoaded", vBoxCallback);
  };

  document.addEventListener("vBoxContentLoaded", vBoxCallback);
}

export function setVideoSrc(src: string) {
  const iframe = document.querySelector<HTMLIFrameElement>(
    ".vbox-content iframe[data-iframe]",
  );
  if (iframe) {
    iframe.setAttribute("src", src);
  }
}
