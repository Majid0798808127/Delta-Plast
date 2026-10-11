import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { ArrowUp, ArrowUpRight, Box, Check, ChevronDown, Cog, Globe, Leaf, Mail, MapPin, MessageCircle, Phone, Menu, X, ShieldCheck, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BrandMarquee } from "@/components/brand-marquee";
import { StatCount } from "@/components/stat-count";
import { HeroSlider } from "@/components/HeroSlider";
import banoonToys from "@/assets/banoon-toys.jpg.asset.json";
import sector1 from "@/assets/s1.jpg";
import sector2 from "@/assets/s2.jpg";
import sector3 from "@/assets/s3.jpg";
import sector5 from "@/assets/s5.jpg";

import logo from "@/assets/logo.png";
import factoryMachine from "@/assets/factory-machine.png";
import building from "@/assets/factory-building.png.asset.json";
import cert1 from "@/assets/cert-1.png.asset.json";
import cert2 from "@/assets/cert-2.png.asset.json";
import cert3 from "@/assets/cert-3.png.asset.json";
import cert4 from "@/assets/cert-4.png.asset.json";
import cert5 from "@/assets/cert-5.png.asset.json";
import cert6 from "@/assets/cert-6.png.asset.json";
import hihoseLogo from "@/assets/hihose-logo.png.asset.json";
import banoonLogo from "@/assets/banoon-logo.webp.asset.json";
import choudharyLogo from "@/assets/brand-choudhary-2.webp.asset.json";
import kidoJoyful from "@/assets/brand-kido-joyful.png.asset.json";
import banooninz from "@/assets/brand-banooninz.webp.asset.json";
import kidoSurprise from "@/assets/brand-kido-surprise.webp.asset.json";
import deltaBrand from "@/assets/brand-delta-plast.webp.asset.json";
import winnerStars from "@/assets/brand-winner-stars.png.asset.json";
import joHeroes from "@/assets/brand-jo-heroes.png.asset.json";
import kidoDough from "@/assets/brand-kido-dough.webp.asset.json";
import miniKido from "@/assets/brand-mini-kido.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Delta Plast | دلتا للصناعات البلاستيكية" },
      {
        name: "description",
        content:
          "Delta Plast — شركة دلتا للصناعات البلاستيكية — عبوات بلاستيكية، أدوات منزلية، ألعاب بنون®، برابيش Hi HOSE® وهندسة قوالب من مدينة الملك عبدالله الثاني الصناعية، الأردن.",
      },
      { property: "og:title", content: "Delta Plast | دلتا للصناعات البلاستيكية" },
      {
        property: "og:description",
        content: "صناعة بلاستيكية متقدمة وهندسة قوالب من مدينة الملك عبدالله الثاني الصناعية، الأردن.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Lang = "ar" | "en";

const T = {
  ar: {
    nav: ["الرئيسية", "القطاعات", "الاعتمادات", "العلامات", "تواصل"],
    quote: "تواصل معنا",
    eyebrow: "نصنع المنتجات بدقة عالية",
    h1a: "أهلاً بكم في",
    h1b: "دلتا للبلاستيك",
    sub: "رواد في صناعة العبوات البلاستيكية، الأدوات المنزلية، وهندسة القوالب المخصصة — من مدينة الملك عبدالله الثاني الصناعية.",
    secLink: "القطاعات",
    rail: ["قطاعات إنتاجية", "اعتمادات رسمية", "سنة من العطاء والتميز"],
    aboutK: "من نحن",
    aboutT: "خبرة صناعية تصنع الفرق",
    about:
      "منذ أكثر من 25 عاماً، تواصل دلتا بلاست ريادتها في صناعة البلاستيك المتقدمة من خلال مواكبة أحدث خطوط الإنتاج والتقنيات الذكية عالمياً. نوظف خبرتنا المتراكمة لتزويد السوق الأردني والأسواق الإقليمية والدولية بحلول بلاستيكية متكاملة في مجالات الحقن والنفخ والسحب وهندسة القوالب، ملتزمين بأعلى معايير الجودة والاستدامة لخدمة مختلف القطاعات الصناعية والتجارية.",
    company: "شركة دلتا للصناعات البلاستيكية",
    loc: "مدينة الملك عبدالله الثاني الصناعية",
    secK: "القطاعات",
    secT: "خمسة قطاعات إنتاجية",
    secP: "لأكثر من ربع قرن، نسعى جاهدين لتقديم الأفضل في مجالنا.",
    sectors: [
      ["صناعة عبوات بلاستيكية", "حلول تعبئة بتقنيات النفخ والحقن لمختلف الصناعات."],
      ["أدوات بلاستيكية منزلية متعددة", "منتجات منزلية ومطبخية متينة ومتعددة الاستخدامات."],
      ["صناعة البرابيش الحلزونية", "العلامة المسجلة Hi HOSE® — برابيش أرجيلة للاستخدام الواحد."],
      ["صناعة ألعاب الأطفال", "العلامة المسجلة Banoon® — ألعاب آمنة ومبهجة."],
      ["قطع بلاستيكية وحلول تغليف متخصصة", "هندسة مخصصة وحقن دقيق حسب مواصفات العميل."],
    ],
    advK: "أركان التميز",
    adv: [
      ["كادر متخصص", "فريق هندسي وفني ذو خبرة."],
      ["منتجات ذات جودة عالية", "رقابة جودة صارمة في كل مرحلة."],
      ["تقنيات ومكائن حديثة", "استثمار مستمر في أحدث المعدات."],
      ["حلول بلاستيكية مستدامة", "مواد وعمليات صديقة للبيئة."],
    ],
    factsK: "حقائق وأرقام",
    factsT: "دلتا بلاست بالأرقام",
    facts: [
      ["100", "%", "مواد آمنة وصحية", "نصنع ألعابنا ومنتجاتنا بالكامل من مواد معتمدة عالمياً خالية من ملوثات البيئة لتجربة لعب آمنة تماماً."],
      ["14", "+", "دولة نصدر إليها", "ثقة تمتد لأكثر من 15 دولة إقليمياً ودولياً، نوفر لهم منتجاتنا بجودة عالمية تليق بأطفالكم."],
      ["157", "+", "موظف وخبير مبدع", "فريق ريادي متفاني من المصممين والمهندسين ومختصي الإنتاج لضمان سعادة أطفالكم."],
      ["16", "+", "منتج ولعبة تفاعلية", "ألعاب صلصال إبداعية ومفاجآت ذكية ومجسمات متميزة من عائلات MEGO, KIDO وبنون بلايدو."],
    ],
    brandK: "العلامات التجارية",
    brandT: "علاماتنا التجارية، معيار واحد",
    brands: ["برابيش أرجيلة للاستخدام الواحد", "ألعاب ومفاجآت للأطفال", "مجموعة تأسست عام 1990"],
    certK: "الاعتمادات",
    certT: "سجلّ الشهادات",
    certs: [
      ["ISO 22000:2018", "نظام إدارة سلامة الغذاء", "CCPL"],
      ["ISO 9001:2015", "نظام إدارة الجودة", "CCPL"],
      ["شهادة صحية لغايات التصدير", "", "المؤسسة العامة للغذاء والدواء"],
      ["شهادة إدارة مكافحة الآفات", "", "Rentokil Boecker — IPM"],
      ["اعتماد مواد ملامسة للغذاء", "", "المؤسسة العامة للغذاء والدواء"],
      ["جائزة رواد التنوع في الصناعة", "", "IFC — مجموعة البنك الدولي"],
    ],
    open: "عرض",
    rfqT: "تواصل معنا",
    rfqP: "نحن هنا للإجابة على كافة استفساراتكم ومساعدتكم.",
    phone: "الهاتف",
    email: "البريد",
    map: "الاتجاهات",
    f: {
      name: "الاسم",
      company: "الشركة",
      mobile: "رقم الجوال",
      type: "نوع الطلب",
      types: ["عبوات", "أدوات منزلية", "Hi HOSE", "Banoon", "قطع مخصصة"],
      msg: "رسالتك",
      send: "إرسال الطلب",
      req: "هذا الحقل مطلوب",
      bad: "رقم غير صالح",
      sent: "تم استلام طلبك",
      sentP: "سيتواصل فريق المبيعات معك قريباً.",
      again: "طلب جديد",
    },
  },
  en: {
    nav: ["Home", "Sectors", "Certifications", "Brands", "Contact"],
    quote: "Contact us",
    eyebrow: "We manufacture products with high precision",
    h1a: "Welcome to",
    h1b: "Delta for Plastics",
    sub: "Leaders in containers, household goods, and custom mold engineering — from King Abdullah II Industrial City.",
    secLink: "Sectors",
    rail: ["Production Sectors", "Official Certifications", "Years of Excellence & Growth"],
    aboutK: "About",
    aboutT: "Industrial expertise that makes the difference",
    about:
      "For over 25 years, Delta Plast has led advanced plastic manufacturing by adopting the latest global production technologies and smart robotics. Leveraging our accumulated expertise, we supply Jordanian, regional, and international markets with comprehensive plastic solutions across injection, blow molding, extrusion, and precision molds—delivering uncompromising quality and sustainability.",
    company: "Delta Company for Plastic Industries",
    loc: "King Abdullah II Industrial City",
    secK: "Sectors",
    secT: "Five production sectors",
    secP: "For more than a quarter of a century, we strive to deliver the best in our field.",
    sectors: [
      ["Plastic container manufacturing", "Blow and injection packaging for every industry."],
      ["Household plastic goods", "Durable, multi-use kitchen and home ware."],
      ["Spiral hoses", "Registered brand Hi HOSE® — disposable hookah hose."],
      ["Children’s toys", "Registered brand Banoon® — safe, joyful toys."],
      ["Custom parts and specialized packaging", "Custom engineering and precision injection to spec."],
    ],
    advK: "Pillars",
    adv: [
      ["Specialist team", "Experienced engineering and technical staff."],
      ["Quality", "Strict quality control at every stage."],
      ["Modern machinery", "Continuous investment in modern equipment."],
      ["Sustainable solutions", "Eco-conscious materials and processes."],
    ],
    factsK: "Facts & figures",
    factsT: "delta PLAST in numbers",
    facts: [
      ["100", "%", "Safe, healthy materials", "Our toys and products are made entirely from internationally certified, pollutant-free materials for completely safe play."],
      ["14", "+", "Countries we export to", "Trust spanning more than 15 countries at home and abroad — we supply our products at a world-class quality worthy of your children."],
      ["157", "+", "Employees and creative experts", "A dedicated team of designers, engineers and production specialists devoted to your children's happiness."],
      ["16", "+", "Products and interactive toys", "Creative clay toys, smart surprises and distinctive figures from the MEGO, KIDO and Banoon Play-Doh families."],
    ],
    brandK: "Brands",
    brandT: "Our brands, one standard",
    brands: ["Disposable hookah hose", "Kids toys & surprises", "Group founded in 1990"],
    certK: "Certifications",
    certT: "Document register",
    certs: [
      ["ISO 22000:2018", "Food safety management", "CCPL"],
      ["ISO 9001:2015", "Quality management", "CCPL"],
      ["Health certificate for export", "", "Jordan Food and Drug Administration"],
      ["Pest management", "", "Rentokil Boecker — IPM"],
      ["Food-contact materials approval", "", "Jordan Food and Drug Administration"],
      ["Diversity pioneers in industry award", "", "IFC — World Bank Group"],
    ],
    open: "View",
    rfqT: "Contact us",
    rfqP: "We are here to answer all your inquiries and assist you.",
    phone: "Phone",
    email: "Email",
    map: "Directions",
    f: {
      name: "Name",
      company: "Company",
      mobile: "Mobile",
      type: "Request type",
      types: ["Containers", "Household goods", "Hi HOSE", "Banoon", "Custom parts"],
      msg: "Message",
      send: "Send request",
      req: "Required",
      bad: "Invalid number",
      sent: "Request received",
      sentP: "Our sales team will contact you shortly.",
      again: "New request",
    },
  },
};

const navIds = ["hero", "sectors", "certificates", "brands", "contact"];
const sectorLinks = [undefined, undefined, "https://hihose.jo", "https://banoonkids.com", undefined];
const certImgs = [cert1.url, cert2.url, cert3.url, cert4.url, cert5.url, cert6.url];
const brandLogos = [
  { src: hihoseLogo.url, name: "Hi HOSE®", href: "https://hihose.jo" },
  { src: banoonLogo.url, name: "Banoon®", href: "https://banoonkids.com" },
  { src: choudharyLogo.url, name: "Choudhary Group", href: undefined },
  { src: kidoJoyful.url, name: "Kido — a joyful world", href: undefined },
  { src: banooninz.url, name: "Banooninz", href: undefined },
  { src: kidoSurprise.url, name: "Kido Surprise", href: undefined },
  { src: deltaBrand.url, name: "Delta Plast", href: undefined },
  { src: winnerStars.url, name: "Winner Stars", href: undefined },
  { src: joHeroes.url, name: "JO Heroes", href: undefined },
  { src: kidoDough.url, name: "Kido Play-Dough", href: undefined },
  { src: miniKido.url, name: "Mini Kido Surprise", href: undefined },
];
const advIcons = [Users, ShieldCheck, Cog, Leaf];
const MAP = "https://www.google.com/maps/dir/?api=1&destination=31.8417751,36.0202137";
const WA = "https://wa.me/962771000832";
const pad = (n: number) => String(n).padStart(2, "0");

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setSeen(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${seen ? "reveal-in" : ""} ${className}`}>
      {children}
    </div>
  );
}

function Tilt3D({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  const move = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !ok) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - py) * 12}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 12}deg`);
    el.style.setProperty("--px", `${px * 100}%`);
    el.style.setProperty("--py", `${py * 100}%`);
    el.style.setProperty("--dx", `${(px - 0.5) * 16}px`);
    el.style.setProperty("--dy", `${(py - 0.5) * 16}px`);
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--px", "50%");
    el.style.setProperty("--py", "50%");
    el.style.setProperty("--dx", "0px");
    el.style.setProperty("--dy", "0px");
  };
  return (
    <div className="tilt-shell">
      <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`tilt3d ${className}`}>
        {children}
        <span className="tilt-glare" aria-hidden="true" />
      </div>
    </div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return <p className="flex items-center gap-3 text-xs font-semibold text-primary"><span className="h-px w-8 bg-primary" />{children}</p>;
}

const btnDark = "h-12 rounded-md px-6 font-semibold shadow-none";
const btnLight = "h-12 rounded-md border-border px-6 font-semibold shadow-none";

type FormState = { name: string; company: string; mobile: string; type: string; msg: string };
const empty: FormState = { name: "", company: "", mobile: "", type: "", msg: "" };

function ContactLabel({ label, error, children }: { label: string; error: string | undefined; children: ReactNode }) {
  return <label className="contact-label block min-w-0"><span>{label}</span>{children}{error && <span className="mt-1 block text-sm text-destructive">{error}</span>}</label>;
}

function QuoteForm({ f }: { f: (typeof T)["ar"]["f"] }) {
  const [v, setV] = useState<FormState>(empty);
  const [err, setErr] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sent, setSent] = useState(false);
  const set = (k: keyof FormState) => (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: typeof err = {};
    (["name", "mobile", "type", "msg"] as const).forEach((k) => {
      if (!v[k].trim()) er[k] = f.req;
    });
    if (v.mobile.trim() && !/^\+?[\d\s-]{7,15}$/.test(v.mobile.trim())) er.mobile = f.bad;
    setErr(er);
    if (Object.keys(er).length === 0) setSent(true);
  };

  if (sent)
    return (
      <div className="flex min-h-[420px] flex-col items-start justify-center" role="status">
        <span className="grid size-12 place-items-center rounded-none bg-primary text-primary-foreground">
          <Check className="size-5" strokeWidth={2} />
        </span>
        <h3 className="mt-6 text-3xl font-semibold tracking-normal">{f.sent}</h3>
        <p className="mt-3 text-muted-foreground">{f.sentP}</p>
        <Button
          onClick={() => {
            setV(empty);
            setSent(false);
          }}
          variant="outline"
          className={`mt-8 ${btnLight}`}
        >
          {f.again}
        </Button>
      </div>
    );

  const field = "contact-field";

  return (
    <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
      <ContactLabel label={f.name} error={err.name}>
        <input aria-label={f.name} className={field} value={v.name} onChange={set("name")} autoComplete="name" />
      </ContactLabel>
      <ContactLabel label={f.company} error={err.company}>
        <input aria-label={f.company} className={field} value={v.company} onChange={set("company")} autoComplete="organization" />
      </ContactLabel>
      <ContactLabel label={f.mobile} error={err.mobile}>
        <input aria-label={f.mobile} className={field} dir="ltr" type="tel" value={v.mobile} onChange={set("mobile")} autoComplete="tel" />
      </ContactLabel>
      <ContactLabel label={f.type} error={err.type}>
        <span className="contact-select">
          <select aria-label={f.type} className={field} value={v.type} onChange={set("type")}>
            <option value="" />
            {f.types.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
          <ChevronDown className="size-4" aria-hidden="true" />
        </span>
      </ContactLabel>
      <div className="sm:col-span-2">
        <ContactLabel label={f.msg} error={err.msg}>
          <textarea aria-label={f.msg} className={`${field} contact-message`} value={v.msg} onChange={set("msg")} />
        </ContactLabel>
      </div>
      <Button type="submit" className="contact-submit sm:col-span-2">
        {f.send}
        <ArrowUpRight className="size-4 rtl:-scale-x-100" />
      </Button>
    </form>
  );
}

const sectorImages = [sector1, sector2, sector3, banoonToys.url, sector5];

const ARAB_TIMEZONES = new Set([
  "Asia/Amman",
  "Asia/Riyadh",
  "Asia/Dubai",
  "Africa/Cairo",
  "Asia/Baghdad",
  "Asia/Kuwait",
  "Asia/Qatar",
  "Asia/Bahrain",
  "Asia/Muscat",
  "Asia/Beirut",
  "Asia/Damascus",
  "Asia/Jerusalem",
  "Asia/Gaza",
  "Asia/Hebron",
  "Africa/Casablanca",
  "Africa/Algiers",
  "Africa/Tunis",
  "Africa/Tripoli",
  "Africa/Khartoum",
  "Asia/Aden",
  "Africa/Nouakchott",
  "Africa/Djibouti",
  "Indian/Comoro",
  "Africa/Mogadishu",
]);

const ARAB_COUNTRIES = new Set([
  "JO", "SA", "AE", "EG", "IQ", "KW", "QA", "BH", "OM", "LB", "SY", "PS",
  "MA", "DZ", "TN", "LY", "SD", "YE", "MR", "DJ", "KM", "SO",
]);

function detectInitialLanguage(): Lang {
  if (typeof window === "undefined") return "ar";
  try {
    const saved = localStorage.getItem("preferred_lang") as Lang | null;
    if (saved === "ar" || saved === "en") return saved;

    // 1. Browser language preferences (Arabic locale)
    const navLangs = navigator.languages || [navigator.language || ""];
    if (navLangs.some((l) => l && l.toLowerCase().startsWith("ar"))) return "ar";

    // 2. Region / Timezone detection (covers all Arab world countries)
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (ARAB_TIMEZONES.has(tz)) return "ar";
  } catch { }

  // Outside the Arab world defaults to English
  return "en";
}

function Index() {
  const [lang, setLang] = useState<Lang>(detectInitialLanguage);
  const [menu, setMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimer = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const t = T[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("preferred_lang");
      if (!saved) {
        fetch("https://api.country.is")
          .then((r) => r.json())
          .then((data) => {
            if (data?.country) {
              const isArab = ARAB_COUNTRIES.has(data.country);
              setLang(isArab ? "ar" : "en");
            }
          })
          .catch(() => { });
      }
    } catch { }
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    const sections = navIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);
      setShowScrollTop(scrollY > 300);

      if (scrollTimer.current) {
        window.clearTimeout(scrollTimer.current);
      }

      if (scrollY < 60) {
        setHeaderVisible(true);
      } else if (scrollY > lastScrollY.current + 8) {
        // Scrolling down: hide header
        setHeaderVisible(false);
      } else if (scrollY < lastScrollY.current - 8) {
        // Scrolling up: reveal header
        setHeaderVisible(true);
      }

      lastScrollY.current = scrollY;

      // Reappear smoothly after 2.2 seconds if user pauses scrolling
      scrollTimer.current = window.setTimeout(() => {
        setHeaderVisible(true);
      }, 2200);

      if (scrollY < 120) {
        setActiveSection("hero");
        return;
      }

      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveSection("contact");
        return;
      }

      const readingLine = (header?.getBoundingClientRect().bottom ?? 50) + 120;
      let current = "hero";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= readingLine) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const measure = () => {
      document.documentElement.style.setProperty("--header-offset", `${(header?.offsetHeight ?? 60) + 40}px`);
      schedule();
    };

    const resizeObserver = header ? new ResizeObserver(measure) : null;
    if (header && resizeObserver) resizeObserver.observe(header);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    measure();

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      if (frame) window.cancelAnimationFrame(frame);
      if (scrollTimer.current) window.clearTimeout(scrollTimer.current);
      document.documentElement.style.removeProperty("--header-offset");
    };
  }, []);

  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        headerRef.current?.querySelector<HTMLButtonElement>("[aria-controls='mobile-navigation']")?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [menu]);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenu(false);
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        block: "start",
      });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  const h2 = "mt-5 text-3xl font-bold leading-snug md:text-4xl";

  return (
    <div id="top" className="relative min-h-screen bg-background text-foreground overflow-x-clip">
      {/* 3. Atmospheric Industrial Depth Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Soft Brand Emerald Depth Orb */}
        <div className="absolute -top-32 start-[-8%] size-[680px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.065)_0%,transparent_70%)] blur-3xl animate-float-slow" />
        {/* Soft Industrial Emerald/Teal Depth Orb */}
        <div className="absolute top-[38%] end-[-10%] size-[780px] rounded-full bg-[radial-gradient(circle,rgba(5,150,105,0.05)_0%,transparent_70%)] blur-3xl" />
        {/* Soft Lower Ambient Depth Orb */}
        <div className="absolute bottom-[-5%] start-[18%] size-[600px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.045)_0%,transparent_70%)] blur-3xl animate-float-slow [animation-delay:3.5s]" />
      </div>

      <div className="relative z-10 lively-shell">
        {/* 1. Re-Architected Header: Floating Sticky Pill Container */}
        <div
          className={`sticky top-5 z-50 w-full max-w-6xl mx-auto px-4 transition-all duration-500 ease-out ${headerVisible ? "translate-y-0 opacity-100" : "-translate-y-28 opacity-0 pointer-events-none"
            }`}
        >
          <header
            ref={headerRef}
            className={`relative flex items-center justify-between gap-3 px-4 py-2 sm:px-6 sm:py-2.5 backdrop-blur-2xl border rounded-full transition-all duration-300 ${scrolled
              ? "bg-background/95 border-border shadow-[0_12px_36px_rgba(0,0,0,0.1)]"
              : "bg-background/85 border-border/80 shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
              }`}
          >
            {/* Logo */}
            <a
              href="#hero"
              onClick={scrollTo("hero")}
              aria-label="Delta Plast"
              className="flex items-center gap-2 shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <img
                src={logo}
                alt="Delta Plast"
                width={1005}
                height={588}
                className="h-[44px] sm:h-[48px] md:h-[52px] w-auto object-contain transition-transform duration-300 hover:scale-105 select-none"
              />
            </a>

            {/* Strict Chronological RTL Navigation in Segmented Capsule Track */}
            <nav
              aria-label={lang === "ar" ? "القائمة الرئيسية" : "Main navigation"}
              className="header-navigation hidden items-center gap-1 p-1 bg-secondary/80 border border-border/70 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] lg:flex"
            >
              {t.nav.map((n, i) => {
                const id = navIds[i]!;
                const isActive = activeSection === id;
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={scrollTo(id)}
                    aria-current={isActive ? "location" : undefined}
                    className={`inline-flex items-center justify-center transition-all duration-200 text-sm select-none ${isActive
                      ? "bg-foreground text-background shadow-sm rounded-full px-4 py-1.5 font-bold scale-[1.02]"
                      : "text-muted-foreground hover:text-foreground font-medium px-3.5 py-1.5 rounded-full hover:bg-background/90"
                      }`}
                  >
                    {n}
                  </a>
                );
              })}
            </nav>

            {/* End Controls */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
              <Button
                variant="ghost"
                className="h-9 px-3.5 rounded-full text-xs font-bold border border-border/80 hover:bg-secondary font-latin text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => {
                  const nextLang = lang === "ar" ? "en" : "ar";
                  setLang(nextLang);
                  try {
                    localStorage.setItem("preferred_lang", nextLang);
                  } catch { }
                }}
                aria-label="Switch language"
              >
                {lang === "ar" ? "EN" : "عربي"}
              </Button>
              <Button
                asChild
                className="hidden sm:inline-flex h-9 px-5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-md shadow-primary/25 animate-shimmer hover:scale-105 active:scale-95 transition-all"
              >
                <a href="#contact" onClick={scrollTo("contact")}>
                  {t.quote}
                  <ArrowUpRight className="size-3.5 rtl:-scale-x-100 ms-1.5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 min-h-[44px] min-w-[44px] rounded-full border border-border/80 lg:hidden text-foreground hover:bg-secondary"
                aria-label={menu ? "Close menu" : "Open menu"}
                aria-controls="mobile-navigation"
                aria-expanded={menu}
                onClick={() => setMenu(!menu)}
              >
                {menu ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </div>

            {/* Mobile Navigation Dropdown */}
            {menu && (
              <nav
                id="mobile-navigation"
                aria-label={lang === "ar" ? "القائمة الرئيسية" : "Main navigation"}
                className="absolute top-[calc(100%+12px)] inset-x-0 p-3.5 bg-background/95 backdrop-blur-2xl border border-border/80 shadow-[0_16px_40px_rgba(0,0,0,0.12)] rounded-3xl grid grid-cols-2 gap-2.5 z-50 lg:hidden animate-in fade-in slide-in-from-top-2 duration-200"
              >
                {t.nav.slice(0, 4).map((n, i) => {
                  const id = navIds[i]!;
                  const isActive = activeSection === id;
                  return (
                    <a
                      key={id}
                      href={`#${id}`}
                      onClick={scrollTo(id)}
                      className={`flex items-center justify-center p-3.5 text-sm rounded-2xl transition-all min-h-[44px] ${isActive
                        ? "bg-foreground text-background shadow-sm font-bold"
                        : "bg-secondary text-foreground hover:bg-secondary/80 font-medium"
                        }`}
                    >
                      {n}
                    </a>
                  );
                })}
                {/* 5th nav link (تواصل) and Primary CTA combined in an accessible full-width structure */}
                <a
                  href={`#${navIds[4]}`}
                  onClick={scrollTo(navIds[4]!)}
                  className={`col-span-2 flex items-center justify-center gap-2 p-3.5 text-sm rounded-2xl transition-all min-h-[44px] ${activeSection === navIds[4]
                    ? "bg-primary text-primary-foreground shadow-md font-bold"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-sm"
                    }`}
                >
                  {t.quote}
                  <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                </a>
                <div className="col-span-2 text-center text-[11px] text-muted-foreground pt-1" dir="ltr">
                  © {new Date().getFullYear()} Delta Plast
                </div>
              </nav>
            )}
          </header>
        </div>

        <main>
          {/* 1. Hero Cover with dark atmosphere, floating elements, and interactive slider */}
          {/* 1. Hero Cover with full-frame interactive slider matching user's exact mockup */}
          <section
            id="hero"
            className="gallery-cover hero-dark-luxury relative overflow-hidden bg-[#050505] border border-border/70 shadow-2xl"
            aria-label={t.company}
          >
            <div className="relative z-20 w-full hero-fade-up">
              <HeroSlider lang={lang} t={t} scrollTo={scrollTo} />
            </div>
          </section>

          {/* 2. Sectors */}
          <section id="sectors" className="editorial-section">
            <Reveal className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Pill>{t.secK}</Pill>
                <h2 className={h2}>{t.secT}</h2>
                <p className="mt-4 max-w-xl text-sm leading-loose text-muted-foreground">{t.secP}</p>
              </div>
              <span className="tactile-badge font-latin text-sm">01 — 05</span>
            </Reveal>
            <div className="sector-grid mt-10">
              {t.sectors.map(([title, desc], i) => {
                const href = sectorLinks[i];
                return (
                  <Reveal key={title} delay={i * 80}>
                    <Tilt3D className="sector-card">
                      <figure className="sector-figure">
                        <img
                          src={sectorImages[i]}
                          alt={title}
                          loading="lazy"
                          className={i === 2 || i === 3 ? "object-contain p-2" : "object-cover"}
                        />
                        <span className="sector-number tilt-back">{pad(i + 1)}</span>
                      </figure>
                      <div className="sector-details">
                        <h3 className="text-lg font-bold">{title}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                        {href && (
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            dir="ltr"
                            className="mt-5 inline-flex items-center gap-2 font-latin text-sm font-semibold text-primary hover:underline"
                          >
                            {href.replace("https://", "")}
                            <ArrowUpRight className="size-4" />
                          </a>
                        )}
                      </div>
                    </Tilt3D>
                  </Reveal>
                );
              })}
            </div>
          </section>

          {/* Pillars */}
          <section id="pillars" className="editorial-section section-tinted">
            <Pill>{t.advK}</Pill>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {t.adv.map(([title, desc], i) => {
                const Icon = advIcons[i] ?? ShieldCheck;
                return (
                  <Reveal key={title} className="pillar-item">
                    <Icon className="size-7 text-primary" strokeWidth={1.5} />
                    <h3 className="mt-5 text-lg font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                  </Reveal>
                );
              })}
            </div>
          </section>

          {/* Facts & Figures */}
          <section className="editorial-section section-tinted">
            <Reveal className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <Pill>{t.factsK}</Pill>
                <h2 className={h2}>{t.factsT}</h2>
              </div>
              <span className="tactile-badge font-latin" dir="ltr">Delta Plast</span>
            </Reveal>
            <div className="facts-grid mt-10">
              {t.facts.map(([num, suffix, title, desc], i) => {
                const Icon = [ShieldCheck, Globe, Users, Box][i] ?? ShieldCheck;
                return (
                  <Reveal key={i} delay={i * 90}>
                    <Tilt3D className="fact-card">
                      <div className="flex items-center justify-between">
                        <div className="fact-icon">
                          <Icon className="size-6" strokeWidth={1.5} />
                        </div>
                        <span className="tactile-badge font-latin">{pad(i + 1)}</span>
                      </div>
                      <div className="fact-metric" dir="ltr">
                        <strong className="font-latin">
                          <StatCount target={num ?? "0"} duration={3000} delay={i * 150} />
                        </strong>
                        <span className="font-latin text-2xl font-bold text-primary">{suffix}</span>
                      </div>
                      <h3 className="mt-4 text-base font-bold">{title}</h3>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{desc}</p>
                    </Tilt3D>
                  </Reveal>
                );
              })}
            </div>
          </section>

          {/* 3. Certifications (Strict Chronological Position) */}
          <section id="certificates" className="editorial-section section-tinted certificates-section">
            <Reveal className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <Pill>{t.certK}</Pill>
                <h2 className={h2}>{t.certT}</h2>
              </div>
              <ShieldCheck className="size-9 text-primary" strokeWidth={1} />
            </Reveal>
            <div className="certificate-grid">
              {t.certs.map(([name, scope, issuer], i) => (
                <Reveal key={name} delay={i * 65}>
                  <Tilt3D className="certificate-card">
                    <a href={certImgs[i]} target="_blank" rel="noreferrer" className="certificate-link">
                      <div className="certificate-top">
                        <span className="tactile-badge font-latin" dir="ltr">{pad(i + 1)}</span>
                        <ShieldCheck className="size-4 text-primary" />
                      </div>
                      <div className="certificate-image">
                        <img src={certImgs[i]} alt={name} loading="lazy" />
                      </div>
                      <div className="certificate-details">
                        <h3>{name}</h3>
                        <p>{scope ? `${scope} — ${issuer}` : issuer}</p>
                        <span className="certificate-open">
                          {t.open}
                          <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                        </span>
                      </div>
                    </a>
                  </Tilt3D>
                </Reveal>
              ))}
            </div>
          </section>

          {/* 4. Brands */}
          <section id="brands" className="editorial-section">
            <Reveal>
              <Pill>{t.brandK}</Pill>
              <h2 className={h2}>{t.brandT}</h2>
            </Reveal>
            <BrandMarquee
              direction={lang === "ar" ? "rtl" : "ltr"}
              items={brandLogos.map((b, i) => {
                const content = (
                  <>
                    <span className="brand-index font-latin tilt-back">{pad(i + 1)}</span>
                    <div className="brand-logo-stage">
                      <img src={b.src} alt={b.name} loading="eager" draggable={false} />
                    </div>
                    <div className="brand-details">
                      <h3 className="font-latin text-xl font-bold" dir="ltr">{b.name}</h3>
                      {t.brands[i] && <p className="mt-3 text-sm text-muted-foreground">{t.brands[i]}</p>}
                      {b.href && (
                        <span className="mt-6 inline-flex items-center gap-2 font-latin text-xs font-semibold text-primary" dir="ltr">
                          {b.href.replace("https://", "")}
                          <ArrowUpRight className="size-4" />
                        </span>
                      )}
                    </div>
                  </>
                );
                return (
                  <article key={b.name} className="brand-card">
                    {b.href ? (
                      <a href={b.href} target="_blank" rel="noreferrer" className="block h-full">
                        {content}
                      </a>
                    ) : (
                      <div className="h-full">{content}</div>
                    )}
                  </article>
                );
              })}
            />
          </section>

          {/* About Us */}
          <section className="editorial-section">
            <Reveal className="about-layout">
              <div>
                <Pill>{t.aboutK}</Pill>
                <h2 className={h2}>{t.aboutT}</h2>
                <p className="mt-6 text-base leading-loose text-muted-foreground">{t.about}</p>
                <a href={MAP} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                  <MapPin className="size-4" />
                  {t.loc}
                  <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                </a>
              </div>
              <figure className="factory-figure relative group w-full">
                <Tilt3D className="rounded-2xl overflow-hidden border border-border/80 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.18),0_0_35px_-5px_rgba(16,185,129,0.15),inset_0_2px_0_rgba(255,255,255,0.9)] transition-all duration-500 hover:border-emerald-500/50 hover:shadow-[0_30px_70px_-10px_rgba(0,0,0,0.25),0_0_50px_-5px_rgba(16,185,129,0.3)]">
                  <div className="relative overflow-hidden w-full">
                    <img
                      src={factoryMachine}
                      alt={t.company}
                      width={1024}
                      height={434}
                      loading="lazy"
                      className="object-cover w-full aspect-[21/10] transition-transform duration-700 ease-out hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10 pointer-events-none opacity-60 hover:opacity-30 transition-opacity" />
                  </div>
                </Tilt3D>
                <figcaption className="mt-3.5 text-xs text-muted-foreground flex items-center justify-between">
                  <span>{t.company} — أحدث خطوط الإنتاج والتقنيات الصناعية</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    3D Interactive
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </section>

          {/* 5. Contact */}
          <section id="contact" className="editorial-section">
            <Reveal className="contact-head">
              <div>
                <Pill>{t.nav[4]}</Pill>
                <h2 className={h2}>{t.rfqT}</h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{t.rfqP}</p>
            </Reveal>
            <div className="contact-panel mt-10">
              <Tilt3D className="contact-info h-full">
                <ul className="contact-list">
                  {[
                    { I: Phone, v: "+962 79 7440088", h: "tel:+962797440088", ltr: true },
                    { I: Mail, v: "sales@deltaplast.jo", h: "mailto:sales@deltaplast.jo", ltr: true },
                    { I: MapPin, v: t.loc, h: MAP, ltr: false },
                  ].map(({ I, v, h, ltr }) => (
                    <li key={h}>
                      <a
                        href={h}
                        target={h.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="contact-row"
                      >
                        <span className="contact-icon">
                          <I className="size-4 shrink-0" />
                        </span>
                        <span className="min-w-0" dir={ltr ? "ltr" : undefined}>
                          {v}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                <iframe
                  title={t.loc}
                  src="https://maps.google.com/maps?q=31.8417751,36.0202137&z=15&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="contact-map"
                />
                <Button asChild variant="outline" className="contact-directions">
                  <a href={MAP} target="_blank" rel="noreferrer">
                    {t.map}
                    <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                  </a>
                </Button>
              </Tilt3D>
              <Tilt3D className="contact-form h-full">
                <QuoteForm f={t.f} />
              </Tilt3D>
            </div>
          </section>
        </main>

        <footer className="border-t-2 border-primary px-5 py-7 pe-20 text-xs text-muted-foreground md:px-8 md:pe-24">
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Delta Plast" className="h-8 w-auto" />
              <span className="font-semibold text-foreground">{t.company}</span>
            </div>
            <div className="md:absolute md:left-1/2 md:-translate-x-1/2 text-center font-medium" dir="ltr">
              © {new Date().getFullYear()} Delta Plast. {lang === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}
            </div>
          </div>
        </footer>
      </div>

      <Button
        asChild
        size="icon"
        className="fixed bottom-6 end-5 z-40 size-13 rounded-full bg-whatsapp text-primary-foreground shadow-[0_10px_25px_rgba(16,185,129,0.45)] ring-4 ring-emerald-500/25 hover:ring-emerald-500/50 hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <a href={WA} target="_blank" rel="noreferrer" aria-label="WhatsApp">
          <MessageCircle />
        </a>
      </Button>

      {showScrollTop && (
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}
          size="icon"
          variant="outline"
          className="fixed bottom-22 end-5 z-40 size-12 rounded-full bg-background/95 backdrop-blur-md border border-border shadow-lift hover:bg-secondary hover:scale-105 active:scale-95 transition-all text-foreground"
          aria-label={lang === "ar" ? "الرجوع للأعلى" : "Scroll to top"}
        >
          <ArrowUp className="size-5" />
        </Button>
      )}
    </div>
  );
}
