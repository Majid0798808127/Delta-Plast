import { useEffect, useMemo, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

export function BrandMarquee({ direction, items }: { direction: "rtl" | "ltr"; items: ReactNode[] }) {
  const [reduced, setReduced] = useState(false);
  const motion = useMemo(() => AutoScroll({ active: !reduced, speed: 0.55, startDelay: 800, stopOnInteraction: false, stopOnMouseEnter: true, stopOnFocusIn: true }), [reduced]);
  const [ref, api] = useEmblaCarousel({ loop: true, dragFree: true, direction, align: "start" }, [motion]);
  useEffect(() => {
    if (!api) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { setReduced(media.matches); if (media.matches) motion.stop(); else motion.play(); };
    const stop = () => { if (media.matches) motion.stop(); };
    api.on("autoScroll:play", stop);
    api.on("reInit", sync);
    media.addEventListener("change", sync);
    sync();
    return () => { api.off("autoScroll:play", stop); api.off("reInit", sync); media.removeEventListener("change", sync); };
  }, [api, motion]);
  return <div className="brand-marquee mt-10" ref={ref} dir={direction}>
    <div className="brand-track">{[0, 1].flatMap(copy => items.map((item, index) =>
      <div className="brand-slide" key={`${copy}-${index}`}>{item}</div>
    ))}</div>
  </div>;
}