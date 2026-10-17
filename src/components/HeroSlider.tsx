import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCount } from "@/components/stat-count";
import { cn } from "@/lib/utils";

import newBuilding from "@/assets/hero-factory-building.jpg";
import injectionHall from "@/assets/hero-slide-injection-hall.png";
import roboticsLine from "@/assets/hero-slide-robotics.png";
import banoonWorkshop from "@/assets/hero-slide-banoon.png";

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
    image: newBuilding,
    category: { ar: "المجمع الصناعي الرئيسي — سحاب", en: "Main Industrial Complex — Sahab" },
    title: {
      ar: "صرح صناعي متكامل في مدينة الملك عبدالله الثاني الصناعية",
      en: "State-of-the-Art Complex in King Abdullah II Industrial City",
    },
  },
  {
    id: "injection-hall",
    image: injectionHall,
    category: { ar: "صالات تصنيع وحقن البلاستيك الحديثة", en: "Modern Plastic Injection & Production Halls" },
    title: {
      ar: "طاقة إنتاجية متقدمة بأحدث ماكينات القولبة والرقابة الصناعية",
      en: "High-Capacity Production with Modern Molding & Engineering Precision",
    },
  },
  {
    id: "robotics",
    image: roboticsLine,
    category: { ar: "خطوط الإنتاج والتعبئة الروبوتية", en: "Robotic Packaging & Injection Lines" },
    title: {
      ar: "أحدث خطوط الحقن الروبوتية والتعبئة الآلية الدقيقة",
      en: "Next-Gen Robotic Injection & Automated Precision Packaging",
    },
  },
  {
    id: "banoon",
    image: banoonWorkshop,
    category: { ar: "مصنع ألعاب بنون® والمنتجات الترويجية", en: "Banoon® Toys & Promotional Items Workshop" },
    title: {
      ar: "خطوط تجميع وتعبئة متطورة لألعاب الأطفال والمفاجآت الترويجية",
      en: "Advanced Assembly & Packaging Lines for Safe Children's Toys",
    },
  },
];

const AUTOPLAY_INTERVAL = 5500; // 5.5s

const DEFAULT_T_AR = {
  eyebrow: "نصنع المنتجات بدقة عالية",
  h1a: "أهلاً بكم في",
  h1b: "دلتا للبلاستيك",
  sub: "رواد في صناعة العبوات البلاستيكية، الأدوات المنزلية، وصناعة ألعاب الأطفال — من مدينة الملك عبدالله الثاني الصناعية.",
  quote: "تواصل معنا",
  secLink: "القطاعات",
  rail: ["قطاعات إنتاجية", "اعتمادات رسمية", "سنة من العطاء والتميز"],
};

const DEFAULT_T_EN = {
  eyebrow: "High precision manufacturing",
  h1a: "Welcome to",
  h1b: "Delta Plast",
  sub: "Leaders in plastic containers, household goods, and children's toys manufacturing — from King Abdullah II Industrial City.",
  quote: "Contact us",
  secLink: "Sectors",
  rail: ["Manufacturing sectors", "Official accreditations", "Years of excellence"],
};

/**
 * Mobile Haptic Feedback helper
 * Triggers subtle vibration on mobile devices (e.g. Android Chrome/Edge/Firefox)
 */
function triggerHaptic(pattern: number | number[] = 14) {
  if (typeof window === "undefined") return;
  try {
    if ("vibrate" in navigator && typeof navigator.vibrate === "function") {
      navigator.vibrate(pattern);
    }
  } catch {
    // Safe fallback if not supported or restricted
  }
}

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

  // Word tokenization for fluid, zero-layout-shift reveal animation
  const eyebrowWords = useMemo(
    () => (currentT.eyebrow || "").trim().split(/\s+/).filter(Boolean),
    [currentT.eyebrow],
  );
  const h1aWords = useMemo(
    () => (currentT.h1a || "").trim().split(/\s+/).filter(Boolean),
    [currentT.h1a],
  );
  const h1bWords = useMemo(
    () => (currentT.h1b || "").trim().split(/\s+/).filter(Boolean),
    [currentT.h1b],
  );
  const allTitleWords = useMemo(
    () => [...h1aWords, ...h1bWords],
    [h1aWords, h1bWords],
  );
  const subWords = useMemo(
    () => (currentT.sub || "").trim().split(/\s+/).filter(Boolean),
    [currentT.sub],
  );

  // Animation states: image first, then text descends, then types word by word
  const [hasDropped, setHasDropped] = useState(false);
  const [eyebrowCount, setEyebrowCount] = useState(0);
  const [titleCount, setTitleCount] = useState(0);
  const [subCount, setSubCount] = useState(0);
  const [activePhase, setActivePhase] = useState<"idle" | "dropping" | "eyebrow" | "title" | "sub" | "done">("idle");
  const [buttonsVisible, setButtonsVisible] = useState(false);

  const timeoutsRef = useRef<number[]>([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const completeAllImmediately = useCallback(() => {
    clearAllTimeouts();
    setHasDropped(true);
    setEyebrowCount(eyebrowWords.length);
    setTitleCount(allTitleWords.length);
    setSubCount(subWords.length);
    setActivePhase("done");
    setButtonsVisible(true);
  }, [clearAllTimeouts, eyebrowWords.length, allTitleWords.length, subWords.length]);

  const startAnimation = useCallback(() => {
    clearAllTimeouts();

    // Respect reduced motion accessibility
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      completeAllImmediately();
      return;
    }

    // Reset initial state: text hidden so user sees the hero photo first
    setHasDropped(false);
    setEyebrowCount(0);
    setTitleCount(0);
    setSubCount(0);
    setActivePhase("idle");
    setButtonsVisible(false);

    // 1. Initial pause for the factory image to be appreciated first (600ms)
    const tDrop = window.setTimeout(() => {
      setHasDropped(true);
      setActivePhase("dropping");
    }, 600);
    timeoutsRef.current.push(tDrop);

    // 2. Eyebrow badge typing: starts at 900ms
    const EYEBROW_START = 900;
    const EYEBROW_STEP = 130;
    eyebrowWords.forEach((_, idx) => {
      const t = window.setTimeout(() => {
        setActivePhase("eyebrow");
        setEyebrowCount(idx + 1);
        triggerHaptic(12);
      }, EYEBROW_START + idx * EYEBROW_STEP);
      timeoutsRef.current.push(t);
    });

    // 3. Title (H1) word-by-word typing: starts right after eyebrow
    const TITLE_START = EYEBROW_START + eyebrowWords.length * EYEBROW_STEP + 160;
    const TITLE_STEP = 180;
    allTitleWords.forEach((_, idx) => {
      const t = window.setTimeout(() => {
        setActivePhase("title");
        setTitleCount(idx + 1);
        if (idx === allTitleWords.length - 1) {
          // Last word of title ("للبلاستيك") gets a celebratory double vibration tick
          triggerHaptic([16, 40, 20]);
        } else {
          triggerHaptic(14);
        }
      }, TITLE_START + idx * TITLE_STEP);
      timeoutsRef.current.push(t);
    });

    // 4. Subtitle (p) word-by-word typing: flows naturally
    const SUB_START = TITLE_START + allTitleWords.length * TITLE_STEP + 150;
    const SUB_STEP = 80;
    subWords.forEach((_, idx) => {
      const t = window.setTimeout(() => {
        setActivePhase("sub");
        setSubCount(idx + 1);
        triggerHaptic(10);
      }, SUB_START + idx * SUB_STEP);
      timeoutsRef.current.push(t);
    });

    // 5. Action Buttons (CTA) spring in
    const BUTTONS_START = SUB_START + Math.min(subWords.length, 6) * SUB_STEP;
    const tBtn = window.setTimeout(() => {
      setButtonsVisible(true);
    }, BUTTONS_START);
    timeoutsRef.current.push(tBtn);

    // 6. Complete typing phase
    const FINISH_TIME = SUB_START + subWords.length * SUB_STEP + 200;
    const tFinish = window.setTimeout(() => {
      setActivePhase("done");
      setButtonsVisible(true);
    }, FINISH_TIME);
    timeoutsRef.current.push(tFinish);
  }, [
    clearAllTimeouts,
    completeAllImmediately,
    eyebrowWords,
    allTitleWords,
    subWords,
  ]);

  // Run on initial mount and whenever language changes
  useEffect(() => {
    startAnimation();
    return () => clearAllTimeouts();
  }, [lang, startAnimation, clearAllTimeouts]);

  // Mobile user touch unlocks vibration permission on mobile browsers
  useEffect(() => {
    const onTouch = () => {
      triggerHaptic(8);
    };
    window.addEventListener("touchstart", onTouch, { once: true, passive: true });
    return () => window.removeEventListener("touchstart", onTouch);
  }, []);

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
    >
      {/* 1. Full-Frame Slider with Overlay */}
      <div className="relative w-full h-[440px] sm:h-[500px] md:h-[560px] lg:h-[600px] overflow-hidden bg-black">
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
                    key={`${slide.id}-${isActive ? "on" : "off"}`}
                    src={slide.image}
                    alt={slide.title[lang]}
                    width={1920}
                    height={1080}
                    loading="eager"
                    decoding="async"
                    className={cn(
                      "w-full h-full object-cover object-center select-none will-change-transform",
                      isActive ? "animate-subtle-zoom" : "scale-100"
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Vignette Overlay for crisp contrast */}
        <div className="absolute top-0 inset-x-0 h-16 sm:h-20 bg-gradient-to-b from-black/40 via-black/15 to-transparent pointer-events-none z-10" />

        {/* Soft Bottom Gradient: lower height so factory machinery, lighting & floor stay 100% bright and razor-sharp */}
        <div className="absolute inset-x-0 bottom-0 h-[32%] sm:h-[35%] bg-gradient-to-t from-[#050505]/95 via-[#050505]/35 to-transparent pointer-events-none z-10" />

        {/* Top Badge: Current Category & Slide Counter */}
        <div className="absolute top-3.5 inset-x-3.5 sm:top-6 sm:inset-x-8 flex items-center justify-between pointer-events-none z-20">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-emerald-500/30 text-[10px] sm:text-xs font-semibold text-white shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </span>
            <span>{activeSlide.category[lang]}</span>
          </div>

          <div
            className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-emerald-500/20 text-[10px] sm:text-xs font-mono tabular-nums font-bold text-white shadow-lg"
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
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 size-9 sm:size-13 rounded-full flex items-center justify-center bg-black/50 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 hover:border-emerald-500/60 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {lang === "ar" ? <ChevronLeft className="size-5 sm:size-6" /> : <ChevronLeft className="size-5 sm:size-6" />}
        </button>

        <button
          type="button"
          onClick={scrollNext}
          aria-label={lang === "ar" ? "الشريحة التالية" : "Next slide"}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 size-9 sm:size-13 rounded-full flex items-center justify-center bg-black/50 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 hover:border-emerald-500/60 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {lang === "ar" ? <ChevronRight className="size-5 sm:size-6" /> : <ChevronRight className="size-5 sm:size-6" />}
        </button>

        {/* Main Hero Text directly positioned over the lower gradient (as in user mockup) */}
        {/* Initially elevated and transparent so the background image is seen first, then descends into view */}
        <div
          onClick={() => {
            if (activePhase !== "done") completeAllImmediately();
          }}
          className={cn(
            "absolute bottom-3 sm:bottom-6 md:bottom-8 inset-x-3.5 sm:inset-x-8 md:inset-x-12 z-20 flex flex-col items-start pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            hasDropped
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-8 pointer-events-none"
          )}
        >
          {/* Eyebrow badge with glowing bar */}
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs md:text-sm font-semibold text-emerald-400 mb-1 sm:mb-2.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <span
              className={cn(
                "h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full inline-block shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all duration-500",
                eyebrowCount > 0 ? "w-4 sm:w-7 opacity-100" : "w-0 opacity-0"
              )}
            />
            <span className="font-bold tracking-wide flex items-center flex-wrap">
              {eyebrowWords.map((word, idx) => {
                const isWordRevealed = idx < eyebrowCount;
                return (
                  <span
                    key={`eye-${idx}-${word}`}
                    className={cn(
                      "inline-block transition-all duration-300 ease-out me-1",
                      isWordRevealed
                        ? "opacity-100 translate-y-0 filter-none scale-100"
                        : "opacity-0 -translate-y-2 filter blur-[2px] scale-95"
                    )}
                  >
                    {word}
                  </span>
                );
              })}
              {activePhase === "eyebrow" && (
                <span
                  aria-hidden="true"
                  className="inline-block w-[2px] h-[0.8em] bg-emerald-400 ms-1 align-middle rounded-full shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse"
                />
              )}
            </span>
          </div>

          {/* Heading H1 (Word-by-word animated with glowing caret) */}
          <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-[52px] font-extrabold leading-[1.2] sm:leading-[1.18] text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] max-w-3xl">
            <span className="inline">
              {h1aWords.map((word, idx) => {
                const isWordRevealed = idx < titleCount;
                return (
                  <span
                    key={`h1a-${idx}-${word}`}
                    className={cn(
                      "inline-block transition-all duration-300 ease-out me-[0.24em] sm:me-[0.28em]",
                      isWordRevealed
                        ? "opacity-100 translate-y-0 filter-none scale-100"
                        : "opacity-0 -translate-y-3 filter blur-[3px] scale-95"
                    )}
                  >
                    {word}
                  </span>
                );
              })}
            </span>{" "}
            <span className="text-white inline">
              {h1bWords.map((word, idx) => {
                const globalIdx = h1aWords.length + idx;
                const isWordRevealed = globalIdx < titleCount;
                return (
                  <span
                    key={`h1b-${idx}-${word}`}
                    className={cn(
                      "inline-block transition-all duration-300 ease-out me-[0.24em] sm:me-[0.28em]",
                      isWordRevealed
                        ? "opacity-100 translate-y-0 filter-none scale-100"
                        : "opacity-0 -translate-y-3 filter blur-[3px] scale-95"
                    )}
                  >
                    {word}
                  </span>
                );
              })}
            </span>
            {activePhase === "title" && (
              <span
                aria-hidden="true"
                className="inline-block w-[3px] sm:w-[4px] h-[0.82em] bg-emerald-400 ms-1 align-middle rounded-full shadow-[0_0_12px_rgba(16,185,129,0.95)] animate-pulse"
              />
            )}
          </h1>

          {/* Description (Word-by-word animated with fluid reading cadence) */}
          <p className="mt-1 sm:mt-3 text-[11px] sm:text-sm md:text-base lg:text-lg text-white/95 leading-snug sm:leading-relaxed max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-medium line-clamp-2 sm:line-clamp-none">
            {subWords.map((word, idx) => {
              const isWordRevealed = idx < subCount;
              return (
                <span
                  key={`sub-${idx}-${word}`}
                  className={cn(
                    "inline-block transition-all duration-200 ease-out me-[0.22em] sm:me-[0.26em]",
                    isWordRevealed
                      ? "opacity-100 translate-y-0 filter-none"
                      : "opacity-0 -translate-y-2 filter blur-[2px]"
                  )}
                >
                  {word}
                </span>
              );
            })}
            {activePhase === "sub" && (
              <span
                aria-hidden="true"
                className="inline-block w-[2px] h-[0.8em] bg-teal-400 ms-1 align-middle rounded-full shadow-[0_0_8px_rgba(20,184,166,0.85)] animate-pulse"
              />
            )}
          </p>

          {/* CTAs: Side by Side Buttons - Compact and neat on Mobile */}
          <div
            className={cn(
              "mt-2.5 sm:mt-5 flex flex-row items-center gap-2 sm:gap-3.5 transition-all duration-700 ease-out",
              buttonsVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
            )}
          >
            <Button
              asChild
              className="h-8 sm:h-11 px-3.5 sm:px-7 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all animate-shimmer"
            >
              <a href="#contact" onClick={handleScroll("contact")}>
                <span>{currentT.quote}</span>
                <ArrowUpRight className="size-3 sm:size-4 rtl:-scale-x-100 ms-1 sm:ms-2" />
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-8 sm:h-11 px-3 sm:px-6 rounded-full bg-black/50 hover:bg-emerald-950/30 text-white hover:text-emerald-300 border-white/25 hover:border-emerald-500/50 backdrop-blur-md font-semibold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <a href="#sectors" onClick={handleScroll("sectors")}>
                <span>{currentT.secLink}</span>
                <ArrowUpRight className="size-3 sm:size-4 rtl:-scale-x-100 ms-1 sm:ms-2" />
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
