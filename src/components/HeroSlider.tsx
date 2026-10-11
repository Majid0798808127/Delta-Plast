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
      <div className="relative w-full h-[500px] sm:h-[560px] md:h-[620px] lg:h-[660px] overflow-hidden bg-black">
        {/* Embla Viewport */}
        <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing w-full h-full" dir={direction}>
          <div className="flex touch-pan-y w-full h-full">
            {SLIDES.map((slide, index) => {
              const isActive = index === selectedIndex;
              return (
                <div
                  key={slide.id}
                  className="relative min-w-0 flex-[0_0_100%] h-full overflow-hidden bg-black"
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

        {/* Top Vignette Overlay for crisp contrast */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />

        {/* Deep Bottom Gradient: transitions smoothly to #050505 under the text */}
        <div className="absolute inset-x-0 bottom-0 h-[75%] sm:h-[70%] bg-gradient-to-t from-[#050505] via-[#050505]/85 via-45% to-transparent pointer-events-none z-10" />

        {/* Top Badge: Current Category & Slide Counter */}
        <div className="absolute top-5 inset-x-5 sm:top-7 sm:inset-x-8 flex items-center justify-between pointer-events-none z-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-emerald-500/30 text-xs font-semibold text-white shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </span>
            <span>{activeSlide.category[lang]}</span>
          </div>

          <div
            className="px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-emerald-500/20 text-xs font-mono tabular-nums font-bold text-white shadow-lg"
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
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 size-11 sm:size-13 rounded-full flex items-center justify-center bg-black/50 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 hover:border-emerald-500/60 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {lang === "ar" ? <ChevronLeft className="size-6" /> : <ChevronLeft className="size-6" />}
        </button>

        <button
          type="button"
          onClick={scrollNext}
          aria-label={lang === "ar" ? "الشريحة التالية" : "Next slide"}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 size-11 sm:size-13 rounded-full flex items-center justify-center bg-black/50 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 hover:border-emerald-500/60 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {lang === "ar" ? <ChevronRight className="size-6" /> : <ChevronRight className="size-6" />}
        </button>

        {/* Main Hero Text directly positioned over the lower gradient (as in user mockup) */}
        <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 inset-x-6 sm:inset-x-12 md:inset-x-16 z-20 flex flex-col items-start pointer-events-auto">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-emerald-400 mb-3">
            <span className="h-0.5 w-7 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full inline-block shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="font-bold tracking-wide">{currentT.eyebrow}</span>
          </div>

          {/* Heading H1 */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold leading-[1.18] text-white tracking-tight drop-shadow-md max-w-3xl">
            <span>{currentT.h1a}</span>{" "}
            <span className="text-white inline-block">{currentT.h1b}</span>
          </h1>

          {/* Description */}
          <p className="mt-3.5 sm:mt-4 text-sm sm:text-base md:text-lg text-zinc-200/90 leading-relaxed max-w-2xl drop-shadow font-normal">
            {currentT.sub}
          </p>

          {/* CTAs: Side by Side Buttons */}
          <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3.5">
            <Button
              asChild
              className="h-11 sm:h-12 px-7 sm:px-8 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-sm sm:text-base shadow-[0_10px_30px_-5px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition-all animate-shimmer"
            >
              <a href="#contact" onClick={handleScroll("contact")}>
                <span>{currentT.quote}</span>
                <ArrowUpRight className="size-4 rtl:-scale-x-100 ms-2" />
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-11 sm:h-12 px-6 sm:px-7 rounded-full bg-black/45 hover:bg-emerald-950/30 text-white hover:text-emerald-300 border-white/25 hover:border-emerald-500/50 backdrop-blur-md font-semibold text-sm sm:text-base shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <a href="#sectors" onClick={handleScroll("sectors")}>
                <span>{currentT.secLink}</span>
                <ArrowUpRight className="size-4 rtl:-scale-x-100 ms-2" />
              </a>
            </Button>
          </div>
        </div>

        {/* Slide Progress Bar along bottom edge of image */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 overflow-hidden pointer-events-none z-20">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.9)] transition-[width] duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 2. Bottom Stats Metrics Bar (Directly underneath the image, on clean #050505) */}
      <div className="w-full bg-[#050505] border-t border-white/10 px-6 sm:px-12 md:px-16 py-8 sm:py-10">
        <div className="grid grid-cols-3 gap-6 sm:gap-10 text-center items-center">
          {/* Column 1 (In RTL: right column = 5 قطاعات إنتاجية) */}
          <div className="group transition-transform duration-300 hover:-translate-y-1 cursor-default">
            <strong className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-b from-white via-white to-emerald-200/90 bg-clip-text text-transparent font-latin tabular-nums block drop-shadow-sm group-hover:drop-shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all">
              <StatCount target="5" duration={3000} delay={200} />
            </strong>
            <span className="text-xs sm:text-sm font-medium text-zinc-400 group-hover:text-emerald-300 transition-colors mt-2 block">
              {currentT.rail[0]}
            </span>
          </div>

          {/* Column 2 (In RTL: middle column = 6 اعتمادات رسمية) */}
          <div className="group transition-transform duration-300 hover:-translate-y-1 cursor-default">
            <strong className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-b from-white via-white to-emerald-200/90 bg-clip-text text-transparent font-latin tabular-nums block drop-shadow-sm group-hover:drop-shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all">
              <StatCount target="6" duration={3000} delay={350} />
            </strong>
            <span className="text-xs sm:text-sm font-medium text-zinc-400 group-hover:text-emerald-300 transition-colors mt-2 block">
              {currentT.rail[1]}
            </span>
          </div>

          {/* Column 3 (In RTL: left column = 35 سنة من العطاء والتميز) */}
          <div className="group transition-transform duration-300 hover:-translate-y-1 cursor-default">
            <strong className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-b from-white via-white to-emerald-200/90 bg-clip-text text-transparent font-latin tabular-nums block drop-shadow-sm group-hover:drop-shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all">
              <StatCount target="35" duration={3200} delay={500} />
            </strong>
            <span className="text-xs sm:text-sm font-medium text-zinc-400 group-hover:text-emerald-300 transition-colors mt-2 block">
              {currentT.rail[2]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
