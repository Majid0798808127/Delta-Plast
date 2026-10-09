import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCount } from "@/components/stat-count";
import { cn } from "@/lib/utils";

import building from "@/assets/factory-building.png";
import injectionLine from "@/assets/slider-injection.jpg";
import packagingLine from "@/assets/slider-packaging.jpg";

type Lang = "ar" | "en";

interface SlideData {
  id: string;
  image: string;
  category: { ar: string; en: string };
  title: { ar: string; en: string };
}

const SLIDES: SlideData[] = [
  {
    id: "complex",
    image: building,
    category: { ar: "المجمع الصناعي الرئيسي — سحاب", en: "Main Industrial Complex — Sahab" },
    title: {
      ar: "صرح صناعي متكامل في مدينة الملك عبدالله الثاني الصناعية",
      en: "State-of-the-Art Complex in King Abdullah II Industrial City",
    },
  },
  {
    id: "automation",
    image: injectionLine,
    category: { ar: "تكنولوجيا التصنيع المتقدمة", en: "Advanced Automation" },
    title: {
      ar: "أحدث خطوط الحقن والنفخ الآلية وهندسة القوالب الدقيقة",
      en: "Cutting-Edge Automated Injection & Precision Tooling",
    },
  },
  {
    id: "packaging",
    image: packagingLine,
    category: { ar: "حلول التعبئة والعبوات الصحية", en: "Certified Packaging Solutions" },
    title: {
      ar: "عبوات غذائية وكيميائية وصيدلانية معتمدة صحياً (ISO 22000)",
      en: "Hygienic Containers for Food & Pharmaceutical Sectors",
    },
  },
];

const AUTOPLAY_INTERVAL = 5500; // 5.5s

const DEFAULT_T_AR = {
  eyebrow: "نصنع المنتجات بدقة عالية",
  h1a: "أهلاً بكم في",
  h1b: "دلتا للبلاستيك",
  sub: "رواد في صناعة العبوات البلاستيكية، الأدوات المنزلية، وهندسة القوالب المخصصة — من مدينة الملك عبدالله الثاني الصناعية.",
  quote: "تواصل معنا",
  secLink: "القطاعات",
  rail: ["قطاعات إنتاجية", "اعتمادات رسمية", "سنة من العطاء والتميز"],
};

const DEFAULT_T_EN = {
  eyebrow: "High precision manufacturing",
  h1a: "Welcome to",
  h1b: "Delta Plast",
  sub: "Pioneers in plastic containers, household goods and precision mold engineering from King Abdullah II Industrial City.",
  quote: "Contact us",
  secLink: "Sectors",
  rail: ["Manufacturing sectors", "Official accreditations", "Years of excellence"],
};

interface HeroSliderProps {
  lang: Lang;
  t?: {
    eyebrow?: string;
    h1a?: string;
    h1b?: string;
    sub?: string;
    quote?: string;
    secLink?: string;
    rail?: string[];
  };
  scrollTo?: (id: string) => (e: React.MouseEvent) => void;
}

export function HeroSlider({ lang, t, scrollTo }: HeroSliderProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const fallback = lang === "ar" ? DEFAULT_T_AR : DEFAULT_T_EN;
  const currentT = {
    eyebrow: t?.eyebrow ?? fallback.eyebrow,
    h1a: t?.h1a ?? fallback.h1a,
    h1b: t?.h1b ?? fallback.h1b,
    sub: t?.sub ?? fallback.sub,
    quote: t?.quote ?? fallback.quote,
    secLink: t?.secLink ?? fallback.secLink,
    rail: t?.rail ?? fallback.rail,
  };

  const handleScroll = (id: string) => (e: React.MouseEvent) => {
    if (scrollTo) {
      scrollTo(id)(e);
    } else {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const direction = lang === "ar" ? "rtl" : "ltr";

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 25,
    direction,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Autoplay and progress bar handling
  useEffect(() => {
    if (!emblaApi) return;

    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    startTimeRef.current = Date.now();
    setProgress(0);

    progressTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / AUTOPLAY_INTERVAL) * 100);
      setProgress(pct);
    }, 50);

    timerRef.current = window.setInterval(() => {
      emblaApi.scrollNext();
      startTimeRef.current = Date.now();
      setProgress(0);
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [emblaApi, isPaused, selectedIndex]);

  const goToSlide = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
      setProgress(0);
      startTimeRef.current = Date.now();
    },
    [emblaApi],
  );

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [emblaApi]);

  const activeSlide = SLIDES[selectedIndex] ?? SLIDES[0]!;

  return (
    <div
      className="w-full flex flex-col select-none relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* 1. Full-Frame Slider with Overlay */}
      <div className="relative w-full h-[500px] sm:h-[560px] md:h-[620px] lg:h-[660px] overflow-hidden bg-[#02130c]">
        {/* Embla Viewport */}
        <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing w-full h-full" dir={direction}>
          <div className="flex touch-pan-y w-full h-full">
            {SLIDES.map((slide, index) => {
              const isActive = index === selectedIndex;
              return (
                <div
                  key={slide.id}
                  className="relative min-w-0 flex-[0_0_100%] h-full overflow-hidden bg-[#02130c]"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${SLIDES.length}: ${slide.title[lang]}`}
                >
                  <img
                    key={slide.id + (isActive ? "-active" : "-idle")}
                    src={slide.image}
                    alt={slide.title[lang]}
                    width={1920}
                    height={1080}
                    loading={index === 0 ? "eager" : "lazy"}
                    className={cn(
                      "w-full h-full object-cover object-center will-change-transform",
                      isActive
                        ? "animate-subtle-zoom"
                        : "scale-100 opacity-90 transition-transform duration-700 ease-out",
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Subtle Top Vignette: light emerald obsidian tint */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#02130c]/50 to-transparent pointer-events-none z-10" />

        {/* Ambient Emerald atmospheric wash across the whole image */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/25 via-transparent to-teal-950/15 pointer-events-none z-10" />

        {/* Soft Lower Emerald-Obsidian Blend (gentle feathering so the factory image is fully visible) */}
        <div className="absolute inset-x-0 bottom-0 h-[36%] sm:h-[30%] bg-gradient-to-t from-[#02140d]/80 via-[#02140d]/25 to-transparent pointer-events-none z-10" />

        {/* Atmospheric Emerald Radial Aura positioned behind text */}
        <div
          className={cn(
            "absolute bottom-0 w-full sm:w-[650px] h-[340px] pointer-events-none z-10",
            direction === "rtl"
              ? "right-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.18)_0%,transparent_70%)]"
              : "left-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.18)_0%,transparent_70%)]",
          )}
        />

        {/* Top Badge: Current Category & Slide Counter */}
        <div className="absolute top-5 inset-x-5 sm:top-7 sm:inset-x-8 flex items-center justify-between pointer-events-none z-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#02140d]/80 backdrop-blur-md border border-emerald-500/35 text-xs font-semibold text-white shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </span>
            <span>{activeSlide.category[lang]}</span>
          </div>

          <div
            className="px-3 py-1.5 rounded-full bg-[#02140d]/80 backdrop-blur-md border border-emerald-500/25 text-xs font-mono tabular-nums font-bold text-emerald-300 shadow-lg"
            dir="ltr"
          >
            {String(selectedIndex + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </div>
        </div>

        {/* Circular Navigation Buttons (< and >) */}
        <button
          type="button"
          onClick={scrollPrev}
          aria-label={lang === "ar" ? "الشريحة السابقة" : "Previous slide"}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 size-11 sm:size-13 rounded-full flex items-center justify-center bg-[#02140d]/60 hover:bg-[#02140d]/90 text-white backdrop-blur-md border border-emerald-500/30 hover:border-emerald-400/80 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(16,185,129,0.45)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          {lang === "ar" ? <ChevronLeft className="size-6" /> : <ChevronLeft className="size-6" />}
        </button>

        <button
          type="button"
          onClick={scrollNext}
          aria-label={lang === "ar" ? "الشريحة التالية" : "Next slide"}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 size-11 sm:size-13 rounded-full flex items-center justify-center bg-[#02140d]/60 hover:bg-[#02140d]/90 text-white backdrop-blur-md border border-emerald-500/30 hover:border-emerald-400/80 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(16,185,129,0.45)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          {lang === "ar" ? <ChevronRight className="size-6" /> : <ChevronRight className="size-6" />}
        </button>

        {/* Main Hero Text directly positioned over the image with complete transparency so the photo behind it is fully visible */}
        <div className="absolute bottom-5 sm:bottom-7 md:bottom-9 inset-x-5 sm:inset-x-10 md:inset-x-14 z-20 flex flex-col items-start pointer-events-auto">
          <div className="w-full max-w-2xl bg-transparent p-0">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-emerald-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] mb-2.5 sm:mb-3">
              <span className="h-0.5 w-6 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full inline-block shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
              <span className="font-bold tracking-wide">{currentT.eyebrow}</span>
            </div>

            {/* Heading H1 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-extrabold leading-[1.18] text-white tracking-tight drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]">
              <span>{currentT.h1a}</span>{" "}
              <span className="text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)] inline-block">
                {currentT.h1b}
              </span>
            </h1>

            {/* Description */}
            <p className="mt-2.5 sm:mt-3.5 text-sm sm:text-base md:text-lg text-white/95 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-normal max-w-2xl">
              {currentT.sub}
            </p>

            {/* CTAs */}
            <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="h-10 sm:h-11 px-6 sm:px-7 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-xs sm:text-sm shadow-[0_10px_25px_-5px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition-all"
              >
                <a href="#contact" onClick={handleScroll("contact")}>
                  <span>{currentT.quote}</span>
                  <ArrowUpRight className="size-4 rtl:-scale-x-100 ms-1.5" />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-10 sm:h-11 px-5 sm:px-6 rounded-full bg-black/45 hover:bg-black/70 text-white hover:text-emerald-300 border-white/35 hover:border-emerald-400/60 backdrop-blur-md font-semibold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <a href="#sectors" onClick={handleScroll("sectors")}>
                  <span>{currentT.secLink}</span>
                  <ArrowUpRight className="size-4 rtl:-scale-x-100 ms-1.5" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Slide Progress Bar along bottom edge of image */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-emerald-950/40 overflow-hidden pointer-events-none z-20">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-300 shadow-[0_0_12px_rgba(16,185,129,0.9)] transition-[width] duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 2. Bottom Stats Metrics Bar (Integrated with emerald dark aesthetic) */}
      <div className="w-full bg-gradient-to-b from-[#02140d] via-[#031910] to-[#020e0a] border-t border-emerald-500/25 px-6 sm:px-12 md:px-16 py-7 sm:py-9 relative overflow-hidden">
        {/* Soft radial emerald ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12)_0%,transparent_70%)] pointer-events-none" />

        <div className="grid grid-cols-3 gap-6 sm:gap-10 text-center items-center relative z-10">
          {/* Column 1 */}
          <div className="group transition-transform duration-300 hover:-translate-y-1 cursor-default">
            <strong className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-b from-white via-white to-emerald-200/90 bg-clip-text text-transparent font-latin tabular-nums block drop-shadow-sm group-hover:drop-shadow-[0_4px_16px_rgba(16,185,129,0.35)] transition-all">
              <StatCount target="5" duration={3000} delay={200} />
            </strong>
            <span className="text-xs sm:text-sm font-medium text-zinc-300 group-hover:text-emerald-300 transition-colors mt-2 block">
              {currentT.rail[0]}
            </span>
          </div>

          {/* Column 2 */}
          <div className="group transition-transform duration-300 hover:-translate-y-1 cursor-default">
            <strong className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-b from-white via-white to-emerald-200/90 bg-clip-text text-transparent font-latin tabular-nums block drop-shadow-sm group-hover:drop-shadow-[0_4px_16px_rgba(16,185,129,0.35)] transition-all">
              <StatCount target="6" duration={3000} delay={350} />
            </strong>
            <span className="text-xs sm:text-sm font-medium text-zinc-300 group-hover:text-emerald-300 transition-colors mt-2 block">
              {currentT.rail[1]}
            </span>
          </div>

          {/* Column 3 */}
          <div className="group transition-transform duration-300 hover:-translate-y-1 cursor-default">
            <strong className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-b from-white via-white to-emerald-200/90 bg-clip-text text-transparent font-latin tabular-nums block drop-shadow-sm group-hover:drop-shadow-[0_4px_16px_rgba(16,185,129,0.35)] transition-all">
              <StatCount target="35" duration={3200} delay={500} />
            </strong>
            <span className="text-xs sm:text-sm font-medium text-zinc-300 group-hover:text-emerald-300 transition-colors mt-2 block">
              {currentT.rail[2]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
