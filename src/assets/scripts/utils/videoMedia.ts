export const initVideoMedia = () => {
  const videoList =
    document.querySelectorAll<HTMLVideoElement>("[data-video-media]");

  let id: number | undefined;
  const handler = () => {
    clearTimeout(id);
    id = setTimeout(() => {
      videoList.forEach((video) => {
        const sources = video.querySelectorAll<HTMLSourceElement>("source");

        let mediaSrc: string | null = null;
        for (let i = 0; i < sources.length; i++) {
          const source = sources[i];
          if (window.matchMedia(source.media).matches) {
            mediaSrc = source.src;
            break;
          }
        }
        if (mediaSrc && video.currentSrc !== mediaSrc) {
          video.pause();
          video.src = mediaSrc;
          video.load();
          video.play();
        }

        // console.log("src: ", mediaSrc);
      });
    }, 100);
  };

  const observer = new ResizeObserver(handler);
  observer.observe(document.documentElement);
};
