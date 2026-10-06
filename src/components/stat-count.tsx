import { useEffect, useRef, useState } from "react";

export function StatCount({ target, suffix = "", duration = 3200, delay = 250 }: { target: string; suffix?: string; duration?: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const end = Number(target);
    if (isNaN(end)) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let timer = 0;
    let started = false;

    const finish = () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      setValue(end);
    };

    const onMotion = () => {
      if (media.matches) finish();
    };

    const startCounting = () => {
      if (started) return;
      started = true;
      if (media.matches) {
        finish();
        return;
      }
      timer = window.setTimeout(() => {
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          // Gentle, pleasurable count-up curve allowing users to enjoy the animation
          const ease = 1 - Math.pow(1 - progress, 3.2);
          setValue(Math.round(end * ease));
          if (progress < 1) {
            frame = requestAnimationFrame(step);
          } else {
            setValue(end);
          }
        };
        frame = requestAnimationFrame(step);
      }, delay);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!started && entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          startCounting();
        }
      },
      { threshold: 0, rootMargin: "0px 0px 50px 0px" },
    );

    observer.observe(element);

    // If already in viewport on mount, start with gentle delay
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      observer.disconnect();
      startCounting();
    }

    media.addEventListener("change", onMotion);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      media.removeEventListener("change", onMotion);
    };
  }, [target, duration, delay]);

  return (
    <span ref={ref} data-target={target} aria-label={`${target}${suffix}`}>
      <span aria-hidden="true">
        {value}
        {suffix}
      </span>
    </span>
  );
}