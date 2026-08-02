import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  ChevronDown,
  Gamepad2,
  MapPin,
  Medal,
  Target,
  Trophy,
  Users,
  Star,
  ArrowRight,
  CheckCircle2,
  Image as ImageIcon,
  CreditCard,
  MessageCircleQuestion,
  Flag,
  CalendarClock,
  Sparkles,
  Gift,
  Wallet,
  HandCoins,
  X,
  Copy,
  Check,
  Menu,
  Download,
  Award,
  AlertTriangle,
  Flame,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RegistrationForm, SponsorForm } from "./components/RegistrationForm";
import { LiveLeaderboard } from "./components/LiveLeaderboard";
import { DynamicPrizeSimulator } from "./components/DynamicPrizeSimulator";
import { getPricingConfig, SLOT_TARGETS, calculateDynamicPrize, FC26_LOGO, MLBB_LOGO, FF_LOGO } from "./lib/utils";

export default function App() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedSponsorPackage, setSelectedSponsorPackage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [slotCounts, setSlotCounts] = useState({ ml: 0, ff: 0, fc: 0 });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    import("firebase/firestore").then(({ collection, query, where, onSnapshot }) => {
      import("./firebase").then(({ db }) => {
        const q = query(collection(db, "registrations"), where("status", "==", "verified"));
        onSnapshot(q, (snapshot) => {
          let ml = 0, ff = 0, fc = 0;
          snapshot.docs.forEach(doc => {
            const data = doc.data();
            const pLength = Array.isArray(data.players) && data.players.length > 0 ? data.players.length : 0;
            if (data.lomba?.includes("Mobile Legends")) {
              ml += pLength || 5;
            } else if (data.lomba?.includes("Free Fire")) {
              ff += pLength || 4;
            } else if (data.lomba?.includes("FC")) {
              fc += pLength || 1;
            }
          });
          setSlotCounts({ ml, ff, fc });
        });
      });
    });
  }, []);

  useEffect(() => {
    const targetDate = new Date("2026-08-15T09:00:00").getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // check if it was dismissed before
      if (localStorage.getItem('padasuka_app_dimiss_install') !== 'true') {
        setShowInstallBanner(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  const handleDismissInstall = () => {
    setShowInstallBanner(false);
    localStorage.setItem('padasuka_app_dimiss_install', 'true');
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const fadeDownVariant = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const slideInLeftVariant = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const slideInRightVariant = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const scaleUpVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const fastStaggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 }
    }
  };

  const slowStaggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.1 }
    }
  };

  return (
    <div className="relative font-body text-dark overflow-x-hidden bg-[#FAFAFA]">
      
      {/* Install App Banner */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: showInstallBanner ? 0 : 100, opacity: showInstallBanner ? 1 : 0 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-[400px] bg-white border border-gray-200 shadow-2xl rounded-2xl p-4 z-[999] flex items-center justify-between pointer-events-auto"
        style={{ pointerEvents: showInstallBanner ? 'auto' : 'none' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center shrink-0">
            <img src="/logo.svg" alt="App Icon" className="w-8 h-8 drop-shadow-sm rounded-md object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-dark text-sm">Install Aplikasi</span>
            <span className="text-secondary text-xs">Akses informasi Festival eSports Karang Taruna Desa Padasuka lebih cepat!</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDismissInstall}
            className="p-2 text-gray-400 hover:text-dark hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <button 
            onClick={handleInstallClick}
            className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Install
          </button>
        </div>
      </motion.div>

      {/* Navbar Minimalist */}
      <motion.nav 
        initial={{ y: -100 }} 
        animate={{ y: 0 }} 
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`z-50 transition-all duration-300 ${isScrolled ? 'fixed top-[15px] left-0 right-0' : 'absolute top-0 left-0 right-0 bg-transparent'}`}
      >
        <div className={`mx-auto px-4 sm:px-6 transition-all duration-300 max-w-7xl`}>
          <div className={`flex items-center justify-between w-full h-[65px] lg:h-[70px] transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md shadow-gray-200/50 rounded-full border border-gray-100 px-4 sm:px-6' : ''}`}>
            <div className={`flex items-center gap-2 md:gap-4 ${!isScrolled ? 'pl-1 sm:pl-0' : ''}`}>
              {/* Mobile View: Logo Serang, Karang Taruna, and Ikon 81 next to each other */}
              <div className="flex lg:hidden items-center gap-2 sm:gap-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logo_kabupaten_serang.png" alt="Kabupaten Serang" className="h-7 sm:h-8 w-auto object-contain drop-shadow-sm" />
                <img src="https://upload.wikimedia.org/wikipedia/id/f/f8/Logo_Karang_Taruna_New.png" alt="Karang Taruna" className="h-7 sm:h-8 w-auto object-contain drop-shadow-sm" />
                <img src="/logo.svg" alt="Ikon 81" className="h-7 sm:h-8 w-auto object-contain drop-shadow-sm" />
                <span className="font-heading font-black text-primary text-xs sm:text-sm tracking-tight whitespace-nowrap">Festival eSports</span>
              </div>

              {/* Desktop View (lg and above) */}
              <div className="hidden lg:flex items-center gap-2 sm:gap-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logo_kabupaten_serang.png" alt="Kabupaten Serang" className="h-7 sm:h-9 md:h-10 w-auto object-contain drop-shadow-sm" />
                <img src="https://upload.wikimedia.org/wikipedia/id/f/f8/Logo_Karang_Taruna_New.png" alt="Karang Taruna" className="h-7 sm:h-9 md:h-10 w-auto object-contain drop-shadow-sm" />
              </div>
              
              <div className="hidden lg:block h-8 md:h-10 w-px bg-gray-200"></div>
              
              <div className="hidden lg:flex items-center gap-1.5 sm:gap-2">
                <img src="/logo.svg" alt="Logo Festival eSports" className="h-7 sm:h-9 md:h-10 w-auto object-contain drop-shadow-sm" />
                <div className="flex flex-col leading-tight pt-0.5 text-left ml-1">
                  <span className="font-heading font-black text-primary text-[14px] sm:text-[16px] tracking-wide whitespace-nowrap text-left">Festival eSports</span>
                  <span className="font-heading font-extrabold text-[9px] sm:text-[10px] text-dark uppercase tracking-widest whitespace-nowrap text-left">Karang Taruna Desa Padasuka</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4 text-sm font-semibold text-secondary">
              <button
                onClick={() => scrollTo("daftar")}
                className="bg-primary hover:bg-primary-dark text-white px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-lg shadow-primary/20 transition-all whitespace-nowrap"
              >
                Daftar<span className="hidden sm:inline"> Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section Redesign */}
      <section className="relative min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20 overflow-hidden flex flex-col justify-center items-center">
        {/* Decorative Stars */}
        <div className="absolute top-24 sm:top-32 left-4 sm:left-10 md:left-32 text-primary opacity-30 animate-pulse">
          <Star className="w-6 h-6 sm:w-8 sm:h-8 fill-primary" />
        </div>
        <div
          className="absolute top-36 sm:top-40 right-4 sm:right-10 md:right-40 text-primary opacity-40 animate-bounce"
          style={{ animationDuration: "3s" }}
        >
          <Star className="w-8 h-8 sm:w-12 sm:h-12 fill-primary" />
        </div>
        <div className="absolute bottom-32 sm:bottom-40 left-10 sm:left-20 text-primary opacity-20">
          <Star className="w-4 h-4 sm:w-6 sm:h-6 fill-primary" />
        </div>
        <div className="absolute top-1/2 right-10 sm:right-20 text-primary opacity-30">
          <Star className="w-6 h-6 sm:w-10 sm:h-10 fill-primary" />
        </div>

        {/* Soft Background Map / Dots */}
        <div
          className="absolute inset-0 z-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #D61216 1px, transparent 0)",
            backgroundSize: "15px 15px",
            minHeight: "100%",
          }}
        ></div>
        <div
          className="hidden sm:block absolute inset-0 z-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #D61216 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>

        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center w-full">
          <motion.div variants={scaleUpVariant} className="mb-4 sm:mb-6">
            <span className="inline-block py-1.5 sm:py-2 px-4 sm:px-6 rounded-full bg-primary/10 text-primary font-extrabold text-[11px] sm:text-xs md:text-sm tracking-widest uppercase border border-primary/20 shadow-sm">
              Turnamen eSports
            </span>
          </motion.div>

          {/* Hero text optimized for all screens */}
          <motion.h1
            variants={fadeUpVariant}
            className="font-heading font-black text-[2.25rem] xs:text-[2.75rem] sm:text-[3.75rem] md:text-[4.5rem] lg:text-[5.25rem] leading-[1.08] tracking-tight text-primary uppercase text-center mb-4 sm:mb-6 w-full"
          >
            <span className="block drop-shadow-sm">FESTIVAL eSPORTS</span>
            <span className="block text-primary drop-shadow-sm">
              KARANG TARUNA
            </span>
            <span className="block text-gray-900 drop-shadow-sm mt-1 sm:mt-2">
              DESA PADASUKA
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUpVariant}
            className="text-secondary text-sm xs:text-base md:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 px-2 sm:px-0 leading-relaxed font-medium"
          >
            Diselenggarakan secara resmi dalam rupa <strong>Festival eSports Karang Taruna Desa Padasuka</strong>. Adu bakat gaming bergengsi dalam Mobile Legends, Free Fire, dan EA SPORTS FC26 PS4 Pro dengan total hadiah jutaan Rupiah!
          </motion.p>

          <motion.div
            variants={scaleUpVariant}
            className="w-full sm:w-auto px-4 sm:px-0"
          >
            <button
              onClick={() => scrollTo("daftar")}
              className="w-full sm:w-auto group flex items-center justify-center gap-3 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all shadow-xl shadow-primary/10 transform hover:-translate-y-1"
            >
              Daftar Sekarang
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Marquee Banner */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="w-full bg-primary py-3 sm:py-4 overflow-hidden flex whitespace-nowrap transform -rotate-1 origin-left md:origin-center scale-105 border-y-[3px] sm:border-y-4 border-primary-dark shadow-2xl z-20 relative">
        <div className="animate-marquee-slow flex items-center font-heading font-bold text-white text-base sm:text-xl md:text-2xl tracking-widest uppercase">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex items-center">
              <span className="mx-4 sm:mx-6">JAYALAH NEGERIKU TERCINTA</span>
              <Star className="w-4 h-4 sm:w-6 sm:h-6 fill-white text-white mx-1 sm:mx-2" />
              <span className="mx-4 sm:mx-6">SATU NUSA SATU BANGSA</span>
              <Star className="w-4 h-4 sm:w-6 sm:h-6 fill-white text-white mx-1 sm:mx-2" />
              <span className="mx-4 sm:mx-6">SEMANGAT UKHUWAH</span>
              <Star className="w-4 h-4 sm:w-6 sm:h-6 fill-white text-white mx-1 sm:mx-2" />
            </span>
          ))}
        </div>
      </motion.div>

      {/* Timer Banner */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleUpVariant} className="bg-white py-8 sm:py-12 border-b border-gray-100 relative z-10 -mt-2 sm:-mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-5 sm:gap-6 md:gap-12 md:divide-x divide-gray-200">
            <div className="text-center md:text-right">
              <p className="text-[10px] sm:text-xs md:text-sm text-secondary font-semibold uppercase tracking-widest mb-1 sm:mb-2">
                Menuju Puncak Acara
              </p>
              <div className="flex items-center justify-center md:justify-end gap-2 text-primary font-heading font-black text-2xl sm:text-3xl lg:text-4xl">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" /> 15 Agustus 2026
              </div>
            </div>
            <div className="flex items-center gap-3 xs:gap-4 sm:gap-6 md:pl-12 w-full md:w-auto justify-center">
              {[
                { label: "Hari", value: timeLeft.days },
                { label: "Jam", value: timeLeft.hours },
                { label: "Menit", value: timeLeft.minutes },
                { label: "Detik", value: timeLeft.seconds },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col text-center min-w-[50px] xs:min-w-[60px] sm:min-w-[70px]"
                >
                  <span className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-dark mb-0.5 sm:mb-1">
                    {item.value.toString().padStart(2, "0")}
                  </span>
                  <span className="text-[9px] xs:text-[10px] sm:text-xs text-secondary font-semibold uppercase tracking-widest">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Tentang */}
      <section
        id="tentang"
        className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6"
      >
        <div>
          <div className="text-center mb-8 sm:mb-12">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeDownVariant} className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold mb-3 sm:mb-4 uppercase text-primary flex items-center justify-center gap-2 sm:gap-3 text-center mx-auto max-w-full">
              <Sparkles className="w-7 h-7 sm:w-10 sm:h-10 shrink-0 text-primary" />
              Penyelenggara Resmi
            </motion.h2>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleUpVariant} className="w-16 sm:w-20 h-1 sm:h-1.5 bg-gold mx-auto rounded-full" />
          </div>

          {/* Epic Conic Border Radius Animated Logo Card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={scaleUpVariant}
            className="relative p-[4px] sm:p-[6px] rounded-[32px] sm:rounded-[44px] overflow-hidden shadow-[0_20px_50px_rgba(214,18,22,0.25)] my-6 max-w-3xl mx-auto group hover:scale-[1.01] transition-all duration-500"
          >
            {/* Conic Gradient Animated Border */}
            <div className="absolute top-1/2 left-1/2 w-[350%] h-[350%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg_at_50%_50%,#D61216_0%,#FFD700_20%,#00E676_40%,#2979FF_60%,#FF007A_80%,#D61216_100%)] animate-[spin_4s_linear_infinite]" />
            
            {/* Inner Card Container */}
            <div className="relative bg-white/95 backdrop-blur-xl p-6 sm:p-10 md:p-12 rounded-[28px] sm:rounded-[38px] flex flex-col items-center justify-center text-center z-10 border border-white/60">
              <div className="relative mb-4 sm:mb-6 group-hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                <img 
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjsJrkom2oZRhnM3OYNDrR1mM905PjVqygrNdwAj6nPj_l9ge9i-LDxIuI9AHa_hJsjGthRqTbE-HT8gAm6LzshKl4Znce_Ok8lW2ySfhqHW_WJa6_8A4bGSWyPKfk5t1ibmWkwxyDZsgbAsXAve27lUFeTXV4CFXFZsIZUMnJTz5xs4_As7ezM71pYb9k/s1600/Logo%20Karang%20Taruna%20Desa%20Padasuka.png" 
                  alt="Logo Karang Taruna Desa Padasuka" 
                  className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)] relative z-10"
                />
              </div>

              <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary font-black text-xs sm:text-sm tracking-widest uppercase mb-2">
                Penyelenggara Resmi
              </span>
              <h3 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-dark tracking-tight uppercase mb-2">
                KARANG TARUNA DESA PADASUKA
              </h3>
              <p className="text-secondary text-sm sm:text-base font-semibold max-w-lg mx-auto leading-relaxed">
                Kecamatan Baros, Kabupaten Serang — Banten
              </p>
              <p className="text-gray-600 text-xs sm:text-sm mt-4 max-w-xl mx-auto font-medium leading-relaxed">
                Menghadirkan <strong>Festival eSports Karang Taruna Desa Padasuka</strong> sebagai panggung kompetisi gaming paling bergengsi bagi pemuda dan masyarakat umum.
              </p>
            </div>
          </motion.div>

          {/* INFORMASI CABANG LOMBA - 3 Glass Cards */}
          <div className="mt-12 sm:mt-16">
            <div className="text-center mb-8 sm:mb-10">
              <motion.span initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeDownVariant} className="text-primary font-black tracking-widest uppercase text-xs sm:text-sm mb-2 block">
                INFORMASI CABANG LOMBA
              </motion.span>
              <motion.h3 initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleUpVariant} className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-dark uppercase tracking-tight">
                3 Cabang Game Utama
              </motion.h3>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleUpVariant} className="w-16 sm:w-20 h-1 bg-gold mx-auto rounded-full mt-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Card 1: Mobile Legends */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={scaleUpVariant}
                whileHover={{ y: -6 }}
                className="relative rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 bg-white border border-slate-200/90 shadow-xl flex flex-col justify-between overflow-hidden group text-dark hover:border-amber-500/60 transition-all duration-300"
              >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />
                
                <div>
                  {/* Logo Header */}
                  <div className="flex justify-center items-center h-16 sm:h-20 mb-6 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                    <img 
                      src={MLBB_LOGO} 
                      alt="Mobile Legends Logo" 
                      className="h-full w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>

                  {/* Content Details */}
                  <div className="space-y-3.5 my-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
                      <Users className="w-5 h-5 text-slate-600 shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Format Lomba</p>
                        <p className="font-extrabold text-dark text-sm sm:text-base">5 vs 5</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-amber-100/90 to-amber-50 border border-amber-300/90 p-4 rounded-2xl flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-amber-600 shrink-0" />
                      <div>
                        <p className="text-[10px] text-amber-900 font-bold uppercase tracking-wider">Total Hadiah (100% Target)</p>
                        <p className="font-black text-amber-600 text-xl sm:text-2xl font-heading">
                          Rp{calculateDynamicPrize('mlbb', slotCounts.ml).adjustedPrizePool.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
                      <Users className="w-5 h-5 text-slate-600 shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Kuota Peserta</p>
                        <p className="font-extrabold text-dark text-sm sm:text-base">200 Peserta <span className="text-xs text-gray-500 font-normal">(40 Tim)</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href="#pendaftaran"
                  className="mt-6 w-full py-3.5 px-4 bg-primary hover:bg-primary-dark text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-primary/20 text-center block"
                >
                  Daftar MLBB Sekarang
                </a>
              </motion.div>

              {/* Card 2: Free Fire */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={scaleUpVariant}
                whileHover={{ y: -6 }}
                className="relative rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 bg-white border border-slate-200/90 shadow-xl flex flex-col justify-between overflow-hidden group text-dark hover:border-red-500/60 transition-all duration-300"
              >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-red-500/20 transition-all" />

                <div>
                  {/* Logo Header */}
                  <div className="flex justify-center items-center h-16 sm:h-20 mb-6 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                    <img 
                      src={FF_LOGO} 
                      alt="Free Fire Logo" 
                      className="h-full w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>

                  {/* Content Details */}
                  <div className="space-y-3.5 my-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
                      <Users className="w-5 h-5 text-slate-600 shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Format Lomba</p>
                        <p className="font-extrabold text-dark text-sm sm:text-base">Squad</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-100/90 to-red-50 border border-red-300/90 p-4 rounded-2xl flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-primary shrink-0" />
                      <div>
                        <p className="text-[10px] text-red-900 font-bold uppercase tracking-wider">Total Hadiah (100% Target)</p>
                        <p className="font-black text-primary text-xl sm:text-2xl font-heading">
                          Rp{calculateDynamicPrize('ff', slotCounts.ff).adjustedPrizePool.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
                      <Users className="w-5 h-5 text-slate-600 shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Kuota Peserta</p>
                        <p className="font-extrabold text-dark text-sm sm:text-base">200 Peserta <span className="text-xs text-gray-500 font-normal">(50 Squad)</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href="#pendaftaran"
                  className="mt-6 w-full py-3.5 px-4 bg-primary hover:bg-primary-dark text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-primary/20 text-center block"
                >
                  Daftar FF Sekarang
                </a>
              </motion.div>

              {/* Card 3: EA SPORTS FC25 / FC26 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={scaleUpVariant}
                whileHover={{ y: -6 }}
                className="relative rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 bg-white border border-slate-200/90 shadow-xl flex flex-col justify-between overflow-hidden group text-dark hover:border-cyan-500/60 transition-all duration-300"
              >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />

                <div>
                  {/* Logo Header */}
                  <div className="flex justify-center items-center h-16 sm:h-20 mb-6 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                    <img 
                      src={FC26_LOGO} 
                      alt="EA SPORTS FC Logo" 
                      className="h-full w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>

                  {/* Content Details */}
                  <div className="space-y-3.5 my-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
                      <Gamepad2 className="w-5 h-5 text-slate-600 shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Console Platform</p>
                        <p className="font-extrabold text-dark text-sm sm:text-base">PlayStation 4 Pro</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-cyan-100/90 to-cyan-50 border border-cyan-300/90 p-4 rounded-2xl flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-cyan-700 shrink-0" />
                      <div>
                        <p className="text-[10px] text-cyan-900 font-bold uppercase tracking-wider">Total Hadiah (100% Target)</p>
                        <p className="font-black text-cyan-700 text-xl sm:text-2xl font-heading">
                          Rp{calculateDynamicPrize('fc', slotCounts.fc).adjustedPrizePool.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
                      <Users className="w-5 h-5 text-slate-600 shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Kuota Peserta</p>
                        <p className="font-extrabold text-dark text-sm sm:text-base">50 Peserta</p>
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href="#pendaftaran"
                  className="mt-6 w-full py-3.5 px-4 bg-gold hover:bg-amber-400 text-dark font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-gold/20 text-center block"
                >
                  Daftar FC Sekarang
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section
        id="jadwal"
        className="py-16 sm:py-24 bg-red-50/50 border-y border-red-50 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #D7001F 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeDownVariant} className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold mb-3 sm:mb-4 uppercase text-primary flex items-center justify-center gap-2 sm:gap-3 text-center mx-auto max-w-full">
              <CalendarClock className="w-7 h-7 sm:w-10 sm:h-10 shrink-0 text-primary" />
              Timeline Turnamen
            </motion.h2>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleUpVariant} className="w-16 sm:w-20 h-1 sm:h-1.5 bg-gold mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Pendaftaran Peserta",
                date: "2 Agustus – 10 Agustus 2026",
                icon: Target,
                badge: "Pendaftaran",
                desc: "Pendaftaran resmi tim & individu untuk seluruh cabang game eSport (Mobile Legends, Free Fire, FC26).",
              },
              {
                title: "Babak Penyisihan",
                date: "10 Agustus – 14 Agustus 2026",
                icon: Gamepad2,
                badge: "Penyisihan",
                desc: "Pertandingan kualifikasi sengit antar-squad & individu memperebutkan tiket ke panggung Grand Final.",
              },
              {
                title: "Grand Final & Penyerahan Hadiah",
                date: "15 Agustus 2026",
                icon: Trophy,
                badge: "Grand Final",
                desc: "Puncak laga perebutan piala di panggung utama, Nobar supporter, serta penyerahan sertifikat & uang tunai.",
              },
            ].map((item, i) => (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUpVariant}
                key={i}
                className="relative p-[2px] rounded-[24px] sm:rounded-[32px] overflow-hidden group shadow-sm hover:shadow-xl transition-all"
              >
                {/* Shiny Chasing Border Layer */}
                <div className="absolute top-1/2 left-1/2 w-[250%] h-[250%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_75%,#D61216_100%)] animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Actual Card Content Layer */}
                <div className="relative bg-white h-full p-6 sm:p-8 rounded-[22px] sm:rounded-[30px] flex flex-col justify-between z-10 border border-gray-100">
                  {/* Decorative Red Dot */}
                  <div className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors duration-300 shadow-[0_0_8px_rgba(214,18,22,0.5)]" />

                  <div>
                    <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-black text-xs uppercase mb-4">
                      {item.badge}
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-red-50 text-primary flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <h4 className="font-heading font-black text-xl sm:text-2xl text-dark mb-2 leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-secondary text-sm font-medium mb-6 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-100 mt-auto">
                    <span className="inline-flex items-center gap-1.5 bg-primary text-white font-extrabold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-sm">
                      <Calendar className="w-4 h-4 shrink-0" /> {item.date}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* HADIAH TURNAMEN SECTION */}
          <div className="mt-16 sm:mt-24 border-t border-red-100/80 pt-12 sm:pt-16">
            <div className="text-center mb-10 sm:mb-12">
              <motion.span initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeDownVariant} className="text-primary font-black tracking-widest uppercase text-xs sm:text-sm mb-2 block">
                APRESIASI PRESTASI PEMENANG
              </motion.span>
              <motion.h3 initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleUpVariant} className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-dark uppercase tracking-tight flex items-center justify-center gap-2 sm:gap-3">
                <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-primary shrink-0" />
                Hadiah Turnamen
              </motion.h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {/* Uang Tunai */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUpVariant}
                className="bg-white border-2 border-emerald-100 p-6 sm:p-8 rounded-[28px] text-center shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <Wallet className="w-9 h-9" />
                </div>
                <h4 className="font-heading font-black text-xl text-emerald-950 mb-2 flex items-center justify-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-600 shrink-0" /> Uang Tunai
                </h4>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  Total hadiah uang tunai jutaan Rupiah diserahkan secara langsung kepada para juara di panggung utama.
                </p>
              </motion.div>

              {/* Sertifikat Penghargaan */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUpVariant}
                className="bg-white border-2 border-amber-100 p-6 sm:p-8 rounded-[28px] text-center shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <Medal className="w-9 h-9" />
                </div>
                <h4 className="font-heading font-black text-xl text-amber-950 mb-2 flex items-center justify-center gap-2">
                  <Award className="w-5 h-5 text-amber-600 shrink-0" /> Sertifikat Penghargaan
                </h4>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  Piagam/sertifikat penghargaan resmi terverifikasi dari Karang Taruna Desa Padasuka untuk seluruh pemenang.
                </p>
              </motion.div>

              {/* Juara 1 & Juara 2 di Setiap Kategori */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUpVariant}
                className="bg-white border-2 border-primary/20 p-6 sm:p-8 rounded-[28px] text-center shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
              >
                <div className="w-16 h-16 rounded-2xl bg-red-50 text-primary flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <Trophy className="w-9 h-9" />
                </div>
                <h4 className="font-heading font-black text-xl text-primary mb-2 flex items-center justify-center gap-2">
                  <Medal className="w-5 h-5 text-primary shrink-0" /> Juara 1 & Juara 2
                </h4>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  Penghargaan juara diberikan secara adil untuk Juara 1 dan Juara 2 di setiap kategori pertandingan (SD, SMP, SMA, & UMUM).
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* eSport */}
      <section
        id="esport"
        className="py-16 sm:py-24 bg-gradient-to-br from-[#D61216] to-[#a80c0f] text-white relative overflow-hidden"
      >
        {/* Abstract Backgrounds */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_#ffffff,_transparent_60%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <div className="text-center mb-10 sm:mb-16">
            <motion.span initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeDownVariant} className="text-white/80 font-bold tracking-widest uppercase text-[10px] xs:text-xs sm:text-sm mb-2 block">
              Kompetisi Bergengsi
            </motion.span>
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleUpVariant} className="text-xl xs:text-3xl sm:text-4xl md:text-5xl font-heading font-black mb-4 uppercase text-white tracking-tight drop-shadow-sm flex items-center justify-center gap-2 sm:gap-4 text-center mx-auto max-w-full">
              <Gamepad2 className="w-7 h-7 sm:w-12 sm:h-12 shrink-0 text-white" />
              eSport Arena
            </motion.h2>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUpVariant} className="text-white/90 text-sm sm:text-lg max-w-2xl mx-auto">
              Perebutan Tahta Tertinggi antar Pemuda 14 Kampung Se-Desa Padasuka dengan Total Hadiah Jutaan Rupiah!
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-12 sm:mb-16">
            {[
              {
                key: "mlbb",
                game: "Mobile Legends: Bang-Bang",
                unit: "40 Tim (200 Peserta Target)",
                target: 200,
                unitTarget: 40,
                unitLabel: "Tim",
                basePrize: "Rp 1.825.000",
                logo: MLBB_LOGO,
                filled: slotCounts.ml,
              },
              {
                key: "ff",
                game: "Free Fire (Squad)",
                unit: "50 Squad (200 Peserta Target)",
                target: 200,
                unitTarget: 50,
                unitLabel: "Squad",
                basePrize: "Rp 1.455.000",
                logo: FF_LOGO,
                filled: slotCounts.ff,
              },
              {
                key: "fc",
                game: "PS 4 Pro FC26 (Individu)",
                unit: "50 Peserta Target",
                target: 50,
                unitTarget: 50,
                unitLabel: "Peserta",
                basePrize: "Rp 380.000",
                logo: FC26_LOGO,
                filled: slotCounts.fc,
              },
            ].map((item, i) => {
              const calculated = calculateDynamicPrize(item.key as 'mlbb' | 'ff' | 'fc', item.filled);
              const progress = Math.min(calculated.ratioPercent, 100);
              const formatRupiah = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

              return (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={i === 1 ? scaleUpVariant : (i === 0 ? slideInLeftVariant : slideInRightVariant)}
                  key={i}
                  className="group flex flex-col bg-white border border-slate-200/90 p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] text-center hover:-translate-y-2 hover:shadow-2xl transition-all relative overflow-hidden"
                >
                  {/* Top Realtime Progress Header */}
                  <div className="absolute top-0 right-0 left-0 bg-slate-50 border-b border-slate-100 flex flex-col pt-3 z-20">
                    <div className="flex justify-between items-center px-6 pb-2 text-[11px] font-bold text-slate-600">
                      <span>TERDAFTAR REALTIME</span>
                      <span className="text-primary font-mono tracking-wide">
                        {item.filled} / {item.target} PESERTA ({calculated.ratioPercent}%)
                      </span>
                    </div>
                    {/* Dynamic Color Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 relative overflow-hidden">
                      <div
                        className={`h-full ${calculated.indicatorColor} relative transition-all duration-1000 ease-out`}
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-[shimmerBorder_2s_linear_infinite]" style={{ animation: 'shimmerBorder 2s linear infinite' }} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Logo Container */}
                  <div className="relative mx-auto mt-10 mb-4 rounded-[20px] p-[2.5px] overflow-hidden shrink-0 shadow-sm w-32 sm:w-40 aspect-[2/1] bg-white">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-white to-primary bg-[length:200%_auto] animate-[shimmerBorder_3s_linear_infinite]"
                      style={{ animation: 'shimmerBorder 3s linear infinite' }} />
                    <style>{`
                      @keyframes shimmerBorder {
                        0% { background-position: 0% 50%; }
                        100% { background-position: 200% 50%; }
                      }
                    `}</style>
                    <div className="relative h-full w-full flex justify-center bg-white rounded-2xl z-10 p-2 items-center">
                      <img src={item.logo} alt={item.game} className="h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-heading mb-1 text-center text-slate-900">
                    {item.game}
                  </h3>
                  
                  {/* Status Badge */}
                  <div className="my-2 flex justify-center">
                    <span className={`text-[10px] sm:text-[12px] font-black uppercase px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1.5 ${
                      calculated.badgeType === 'green'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : calculated.badgeType === 'yellow'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${calculated.indicatorColor}`} />
                      {calculated.badgeText}
                    </span>
                  </div>

                  {/* Total Prize Pool Display */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-4 my-3 text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Hadiah Saat Ini</span>
                    <span className="text-xl sm:text-2xl font-black font-heading text-primary font-mono block">
                      {formatRupiah(calculated.adjustedPrizePool)}
                    </span>
                  </div>

                  {/* Table of Prizes per Category */}
                  <div className="space-y-2 relative z-10 w-full text-left mt-auto">
                    {calculated.categoryPrizes.map((prize, idx) => (
                      <div key={idx} className="bg-slate-50/80 border border-slate-100 p-2.5 sm:p-3 rounded-xl hover:border-slate-300 transition-colors">
                        <div className="text-[10px] font-bold text-slate-500 bg-slate-200/80 inline-flex items-center px-2 py-0.5 rounded-md mb-1.5">{prize.level}</div>
                        <div className="flex justify-between items-center text-[11px] sm:text-xs font-mono">
                           <div className="flex flex-col">
                             <span className="text-amber-600 font-bold flex items-center gap-1 text-[10px] font-sans"><Trophy className="w-3 h-3"/> Juara 1</span>
                             <span className="font-black text-slate-900 text-xs sm:text-sm">{prize.juara1Formatted}</span>
                           </div>
                           <div className="flex flex-col text-right">
                             <span className="text-slate-500 font-bold flex items-center justify-end gap-1 text-[10px] font-sans"><Medal className="w-3 h-3"/> Juara 2</span>
                             <span className="font-black text-slate-800 text-xs sm:text-sm">{prize.juara2Formatted}</span>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] sm:text-xs mt-4 text-slate-500 text-center font-semibold">
                    *Baseline Target 100%: {item.basePrize} (Algoritma Realtime)
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={slideInRightVariant} className="max-w-4xl lg:max-w-5xl mx-auto rounded-[24px] sm:rounded-[32px] overflow-hidden text-dark relative w-full shadow-xl bg-white border border-gray-100 mt-12 lg:mt-16 group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-gold to-primary" />
            <div className="p-6 sm:p-10 md:p-12 w-full relative z-10 space-y-8 sm:space-y-10">
              
              {/* BIAYA PENDAFTARAN */}
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-heading mb-2 text-center text-primary uppercase tracking-tight">
                  BIAYA PENDAFTARAN
                </h3>
                
                {/* 4 Kotak Horizontal */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
                  <div className="bg-emerald-50/80 border border-emerald-200 p-4 sm:p-5 rounded-2xl text-center flex flex-col items-center justify-center hover:shadow-md transition-all">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-1" />
                    <span className="font-extrabold font-heading text-emerald-950 text-sm sm:text-base">SD</span>
                    <span className="font-black text-emerald-600 text-lg sm:text-xl mt-1">Rp5.000</span>
                  </div>

                  <div className="bg-amber-50/80 border border-amber-200 p-4 sm:p-5 rounded-2xl text-center flex flex-col items-center justify-center hover:shadow-md transition-all">
                    <CheckCircle2 className="w-6 h-6 text-amber-600 mb-1" />
                    <span className="font-extrabold font-heading text-amber-950 text-sm sm:text-base">SMP</span>
                    <span className="font-black text-amber-600 text-lg sm:text-xl mt-1">Rp8.000</span>
                  </div>

                  <div className="bg-orange-50/80 border border-orange-200 p-4 sm:p-5 rounded-2xl text-center flex flex-col items-center justify-center hover:shadow-md transition-all">
                    <CheckCircle2 className="w-6 h-6 text-orange-600 mb-1" />
                    <span className="font-extrabold font-heading text-orange-950 text-sm sm:text-base">SMA / SMK</span>
                    <span className="font-black text-orange-600 text-lg sm:text-xl mt-1">Rp10.000</span>
                  </div>

                  <div className="bg-rose-50/80 border border-rose-200 p-4 sm:p-5 rounded-2xl text-center flex flex-col items-center justify-center hover:shadow-md transition-all">
                    <CheckCircle2 className="w-6 h-6 text-rose-600 mb-1" />
                    <span className="font-extrabold font-heading text-rose-950 text-sm sm:text-base">UMUM</span>
                    <span className="font-black text-rose-600 text-lg sm:text-xl mt-1">Rp15.000</span>
                  </div>
                </div>

                <p className="text-center text-gray-600 text-xs sm:text-sm mt-4 font-semibold">
                  Biaya pendaftaran berlaku per peserta.
                </p>
              </div>

              {/* KETENTUAN */}
              <div className="border-t border-gray-100 pt-8 sm:pt-10">
                <h4 className="text-lg sm:text-xl font-bold font-heading mb-4 text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> KETENTUAN
                </h4>
                <ul className="space-y-3 text-sm sm:text-base text-gray-700">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 font-bold" />
                    <span>SD, SMP, SMA/SMK & Umum</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 font-bold" />
                    <span>Mobile Legends & Free Fire menggunakan HP dan kuota internet masing-masing.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 font-bold" />
                    <span>EA SPORTS FC menggunakan PlayStation 4 Pro dari panitia.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 font-bold" />
                    <span>Kuota terbatas.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 font-bold" />
                    <span>Pendaftaran ditutup apabila kuota terpenuhi.</span>
                  </li>
                </ul>
              </div>



            </div>
          </motion.div>

          {/* SIMULATOR HADIAH DYNAMIC */}
          <div className="max-w-4xl lg:max-w-5xl mx-auto">
            <DynamicPrizeSimulator realTimeCounts={slotCounts} />
          </div>
        </div>
      </section>

      {/* Form Pendaftaran */}
      <section
        id="daftar"
        className="py-16 sm:py-24 relative overflow-hidden bg-primary pb-20 sm:pb-32"
      >
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-dark rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold rounded-full blur-3xl opacity-20 mix-blend-overlay"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <div className="mb-10 sm:mb-16 text-center text-white">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeDownVariant}><Star className="w-10 h-10 sm:w-16 sm:h-16 fill-gold text-gold mx-auto mb-4 sm:mb-6 drop-shadow-xl" /></motion.div>
            <motion.h2
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
              variants={scaleUpVariant}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-4 uppercase tracking-tight leading-none"
              style={{ textShadow: "0px 4px 10px rgba(0,0,0,0.3)" }}
            >
              DAFTAR SEKARANG JUGA
            </motion.h2>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUpVariant} className="text-white/90 text-sm md:text-lg max-w-2xl mx-auto font-medium mt-3 sm:mt-6">
              Jangan sampai ketinggalan keseruannya! Langsung isi form dan
              konfirmasi pendaftaranmu via WhatsApp. Praktis, cepat, tanpa ribet.
            </motion.p>
          </div>

          <div className="max-w-3xl mx-auto items-start">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUpVariant}>
              <RegistrationForm />
            </motion.div>
          </div>

          <div className="mt-12 lg:mt-16 w-full mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUpVariant}>
              <LiveLeaderboard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Galeri Kegiatan */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeDownVariant} className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold mb-3 sm:mb-4 uppercase text-primary flex items-center justify-center gap-2 sm:gap-3 text-center mx-auto max-w-full">
            <ImageIcon className="w-7 h-7 sm:w-10 sm:h-10 shrink-0 text-primary" />
            Galeri Kegiatan
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleUpVariant} className="w-16 sm:w-20 h-1 sm:h-1.5 bg-gold mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleUpVariant} className="col-span-2 row-span-2 rounded-2xl overflow-hidden aspect-square relative group bg-gray-100 flex items-center justify-center">
            <img src="https://asset.kompas.com/crop/0x1:1000x668/750x500/data/photo/2017/08/17/185151615029705195b2-lomba-panjat-pinang-kolosal-pantai-carnaval-taman-impian-jaya-an.jpg" alt="Panjat Pinang Kolosal" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <span className="text-white font-bold font-heading text-xl">Panjat Pinang Akbar</span>
            </div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleUpVariant} className="rounded-2xl overflow-hidden aspect-square relative group bg-gray-100 flex items-center justify-center">
            <img src="https://i.pinimg.com/236x/f1/66/25/f1662572ff7939db253147049d1a64ee.jpg" alt="Lomba Kemerdekaan" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleUpVariant} className="rounded-2xl overflow-hidden aspect-square relative group bg-gray-100 flex items-center justify-center">
            <img src="https://asset.kompas.com/crops/giiAH1xCXZdcsTnF7lfwhzsHXeI=/0x35:1000x702/1200x800/data/photo/2017/08/17/1918607778.jpg" alt="Tarik Tambang" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleUpVariant} className="rounded-2xl overflow-hidden aspect-square relative group bg-gray-100 flex items-center justify-center">
            <img src="https://media.suara.com/pictures/653x366/2023/07/22/21517-ilustrasi-lomba-tujuhbelasan-lomba-tujuhbelasan-kreatif-unsplash.jpg" alt="Lomba Seru" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleUpVariant} className="rounded-2xl overflow-hidden aspect-square relative group bg-gray-100 flex items-center justify-center">
            <img src="https://assets.pikiran-rakyat.com/crop/0x0:0x0/x/photo/2021/08/12/1576305531.jpg" alt="Lomba Balap Karung Helm" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          </motion.div>
        </div>
      </section>

      {/* Paket Sponsor Festival */}
      <section className="py-16 sm:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
             <motion.span initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeDownVariant} className="text-primary/80 font-bold tracking-widest uppercase text-[10px] xs:text-xs sm:text-sm mb-2 block">
              Dukungan Anda Sangat Berarti
            </motion.span>
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeDownVariant} className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold mb-3 sm:mb-4 uppercase text-primary flex items-center justify-center gap-2 sm:gap-3 text-center mx-auto max-w-full">
              <Gift className="w-7 h-7 sm:w-10 sm:h-10 shrink-0 text-gold" />
              Paket Sponsor
            </motion.h2>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUpVariant} className="text-sm sm:text-base text-secondary font-medium max-w-2xl mx-auto">
              Kesempatan emas bagi Brand, Perusahaan, atau Toko Anda untuk tampil dan mendukung meriahnya acara kemerdekaan di Desa Padasuka.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Paket Silver */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={slideInLeftVariant} className="relative p-[2px] rounded-[24px] overflow-hidden group shadow-sm hover:shadow-lg transition-all flex flex-col">
              <div className="absolute top-1/2 left-1/2 w-[250%] h-[250%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_75%,#94a3b8_100%)] animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex flex-col flex-1 bg-white p-6 sm:p-8 rounded-[22px] text-center z-10 border border-gray-100/50">
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors duration-300 shadow-[0_0_8px_rgba(214,18,22,0.5)]" />
                <h3 className="font-heading font-bold text-xl text-slate-600 mb-2">Paket Silver</h3>
                <div className="text-3xl font-black text-slate-800 font-heading mb-6">Rp 50.000<span className="text-sm text-secondary font-normal block mt-1">/ Donatur Minimal</span></div>
                <ul className="space-y-3 mb-8 text-sm text-secondary font-medium text-left flex-1">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Disebutkan oleh MC (1x Adlips Pengumuman)</li>
                </ul>
                <button onClick={() => { setSelectedSponsorPackage('Paket Silver (Rp 50.000)'); setActiveModal('sponsor'); }} className="w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors relative overflow-hidden group/btn">
                  <span className="relative z-10">Pilih Paket Silver</span>
                </button>
              </div>
            </motion.div>

            {/* Paket Gold */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleUpVariant} className="relative p-[3px] rounded-[24px] group shadow-xl mb-4 md:mb-0 transform md:-translate-y-4 hover:shadow-gold/30 transition-shadow flex flex-col text-center">
              <div className="absolute inset-0 overflow-hidden rounded-[24px]">
                <div className="absolute top-1/2 left-1/2 w-[250%] h-[250%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_60%,#fde047_80%,#ca8a04_100%)] animate-[spin_3s_linear_infinite]" />
              </div>
              <div className="bg-white h-full w-full rounded-[21px] p-6 sm:p-8 flex flex-col relative z-20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-white font-bold text-xs uppercase tracking-widest py-1 px-4 rounded-full shadow-md z-30 whitespace-nowrap">Paling Diminati</div>
                <h3 className="font-heading font-bold text-xl text-yellow-600 mb-2 mt-2">Paket Gold</h3>
                <div className="text-3xl font-black text-yellow-700 font-heading mb-6">Rp 150.000<span className="text-sm text-secondary font-normal block mt-1">/ Donatur Menengah</span></div>
                <ul className="space-y-3 mb-8 text-sm text-secondary font-medium text-left flex-1">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Promosi Produk & Jasa oleh MC (3x Adlips)</li>
                </ul>
                <button onClick={() => { setSelectedSponsorPackage('Paket Gold (Rp 150.000)'); setActiveModal('sponsor'); }} className="w-full bg-gold text-white font-bold py-3 rounded-xl hover:bg-yellow-600 transition-colors shadow-lg shadow-gold/20">Pilih Paket Gold</button>
              </div>
            </motion.div>

            {/* Paket Platinum */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={slideInRightVariant} className="relative p-[2px] rounded-[24px] overflow-hidden group shadow-sm hover:shadow-lg transition-all flex flex-col">
              <div className="absolute top-1/2 left-1/2 w-[250%] h-[250%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_75%,#1e293b_100%)] animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex flex-col flex-1 bg-white p-6 sm:p-8 rounded-[22px] text-center z-10 border border-gray-100/50">
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors duration-300 shadow-[0_0_8px_rgba(214,18,22,0.5)]" />
                <h3 className="font-heading font-bold text-xl text-dark mb-2">Paket Platinum</h3>
                <div className="text-3xl font-black text-dark font-heading mb-6 text-balance">Rp 500.000+<span className="text-sm text-secondary font-normal block mt-1">/ Donatur Eksklusif</span></div>
                <ul className="space-y-3 mb-8 text-sm text-secondary font-medium text-left flex-1">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Promosi oleh MC Tanpa Batas / Adlips Eksklusif</li>
                </ul>
                <button onClick={() => { setSelectedSponsorPackage('Paket Platinum (Rp 500.000+)'); setActiveModal('sponsor'); }} className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors relative overflow-hidden group/btn shadow-lg shadow-primary/20">
                  <span className="relative z-10">Pilih Paket Platinum</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pembayaran & Sponsor */}
      <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-16 md:gap-24 items-center">
            {/* Pembayaran */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={slideInLeftVariant} className="w-full max-w-4xl mx-auto overflow-hidden">
              <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold mb-5 sm:mb-8 text-primary uppercase text-center tracking-tight flex items-center justify-center gap-2 max-w-full">
                <Wallet className="w-7 h-7 sm:w-10 sm:h-10 shrink-0 text-primary" />
                Metode Pembayaran
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  {
                    name: "DANA",
                    num: "0823 1290 7731",
                    a: "Febri Suryanto",
                    color: "text-blue-500",
                    bg: "bg-blue-50/50",
                    logo: "https://play-lh.googleusercontent.com/3pjYaXJAV8Q05NwQbvsGCnkflnR8Sh_5xLoj92Uq5ptmnn2nbfp0WrCzKPPyI3eYpMz1f8mxd-RWm-1NrWzhPQ"
                  },
                  {
                    name: "ShopeePay",
                    num: "0823 1290 7731",
                    a: "Febri Suryanto",
                    color: "text-orange-500",
                    bg: "bg-orange-50/50",
                    logo: "https://play-lh.googleusercontent.com/TwrKtwhbq3qgO8ydyTYEmY-eNsjgZ4WODS-MrheYWext4EHon7u5ZuDLrm826tG6Wk6pL40j3hkiDHdmAXrt"
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="relative p-[2px] rounded-[24px] overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="absolute top-1/2 left-1/2 w-[250%] h-[250%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_75%,#D61216_100%)] animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative flex flex-col justify-between h-full bg-white p-6 rounded-[22px] z-10 border border-gray-100/50 gap-6">
                      <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors duration-300 shadow-[0_0_8px_rgba(214,18,22,0.5)]" />
                      
                      <div className={`p-4 rounded-[16px] inline-flex items-center gap-3 w-fit ${item.bg}`}>
                        {item.logo && <img src={item.logo} alt={item.name} className="h-8 w-auto object-contain rounded-md" />}
                        <span className={`font-bold tracking-wide uppercase ${item.color}`}>{item.name}</span>
                      </div>

                      <div>
                        <div className="text-secondary text-sm font-medium mb-1">
                          Nomor Rekening / Akun
                        </div>
                        <div className="font-heading font-black text-2xl sm:text-3xl tracking-wider text-dark flex items-center justify-between gap-3 group/copy mb-2">
                          <span className="tabular-nums flex-1">{item.num}</span>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(item.num.replace(/\s+/g, ''));
                              setCopiedKey(item.name);
                              setTimeout(() => setCopiedKey(null), 2000);
                            }}
                            className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-200 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-100 shrink-0 shadow-sm"
                            title="Salin Nomor"
                          >
                            {copiedKey === item.name ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-dark" />}
                          </button>
                        </div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                          a.n. <span className="text-gray-900">{item.a}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-8 sm:p-10 rounded-[24px] shadow-2xl relative overflow-hidden w-full mt-6 group">
                <div className="absolute right-0 top-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                <div className="text-sm sm:text-base text-white/80 font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> Tunai / Cash
                </div>
                <div className="font-extrabold font-heading text-3xl sm:text-4xl mb-4 relative z-10 tracking-tight">
                  Ziezan Store
                </div>
                <div className="text-sm sm:text-base text-white/90 leading-relaxed max-w-sm relative z-10 font-medium">
                  Blok Nyomplong No.33 RT.09/RW.02 <br />
                  Desa Padasuka, Kec. Baros, Kab. Serang
                </div>
              </div>
            </motion.div>

            {/* Sponsor */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={slideInRightVariant} className="w-full">
              <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold mb-8 sm:mb-12 text-primary uppercase text-center pt-6 lg:pt-0 border-t border-gray-100 lg:border-t-0 tracking-tight flex items-center justify-center gap-2 sm:gap-3 mx-auto max-w-full">
                <HandCoins className="w-7 h-7 sm:w-10 sm:h-10 shrink-0 text-primary" />
                Sponsor Acara
              </h3>
              
              <div className="relative w-full overflow-hidden flex bg-white py-6">
                <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                
                <div className="flex animate-marquee-sponsors whitespace-nowrap min-w-max items-center">
                  {[...Array(2)].map((_, arrayIndex) => (
                    <div key={arrayIndex} className="flex items-center">
                      {[
                        { name: "Bank BRI", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/BANK_BRI_logo.svg/1280px-BANK_BRI_logo.svg.png" },
                        { name: "Bank Mandiri", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/3840px-Bank_Mandiri_logo_2016.svg.png" },
                        { name: "Bank BJB", logo: "https://upload.wikimedia.org/wikipedia/id/thumb/4/41/Bank_BJB_logo.svg/1280px-Bank_BJB_logo.svg.png" },
                        { name: "Alfamart", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Alfamart_logo.svg/3840px-Alfamart_logo.svg.png" },
                        { name: "Alfamidi", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Alfamidi_2015.svg/1280px-Alfamidi_2015.svg.png" },
                        { name: "Indomaret", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Indomaret.svg/1280px-Indomaret.svg.png" },
                        { name: "Mixue", logo: "https://upload.wikimedia.org/wikipedia/id/thumb/b/bc/Mixue.svg/1280px-Mixue.svg.png" },
                        { name: "Honda", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Honda_Logo.svg" },
                        { name: "Uwinfly", logo: "https://3469ac02d2b4bbf32d16.cdn6.editmysite.com/uploads/b/3469ac02d2b4bbf32d16c9704ee30f1d7195477f1e19826a3c45f0d6a3bd2316/U-Winfly_1672574481.png" },
                        { name: "Optik B Riski", logo: "https://beeimg.com/images/l12451647972.jpg" },
                        { name: "Ziezan Store", logo: "https://beeimg.com/images/b39994578463.png" },
                      ].map((sponsor, i) => (
                        <div
                          key={`${arrayIndex}-${i}`}
                          className="h-10 sm:h-12 lg:h-14 flex items-center justify-center mx-4 sm:mx-6 shrink-0 bg-white rounded-lg shadow-sm px-3 sm:px-4 py-2"
                        >
                          <img src={sponsor.logo} alt={sponsor.name} className="h-full w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Lokasi */}
      <section id="lokasi" className="py-16 sm:py-24 bg-white border-t border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <motion.span initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeDownVariant} className="text-primary/80 font-bold tracking-widest uppercase text-[10px] xs:text-xs sm:text-sm mb-2 block">
              <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary inline" /> NAVIGASI VENUE PERTANDINGAN</span>
            </motion.span>
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeDownVariant} className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold mb-3 sm:mb-4 uppercase text-primary tracking-tight">
              Lokasi Turnamen eSport
            </motion.h2>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleUpVariant} className="w-16 sm:w-20 h-1 sm:h-1.5 bg-gold mx-auto rounded-full mb-6" />
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUpVariant} className="text-sm sm:text-base text-secondary font-medium max-w-2xl mx-auto">
              Silakan klik petunjuk arah Google Maps di bawah ini sesuai dengan cabang perlombaan eSport yang kamu ikuti!
            </motion.p>
          </div>

          {/* Dedicated Venue Cards with Embedded Google Maps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-4">
            {/* Venue 1: Mobile Legends & Free Fire */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUpVariant}
              className="bg-white text-dark p-6 sm:p-8 rounded-[28px] sm:rounded-[36px] border border-slate-200 shadow-xl flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Gamepad2 className="w-36 h-36 text-primary" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-red-100 text-red-700 border border-red-200 rounded-full text-xs font-black uppercase mb-4">
                  <Flame className="w-3.5 h-3.5 text-red-600 inline shrink-0" /> MLBB & FREE FIRE
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading mb-2 text-dark">
                  Lokasi Mobile Legends & Free Fire
                </h3>
                <p className="text-xs sm:text-sm text-secondary mb-4 leading-relaxed font-medium">
                  Venue resmi pertandingan babak kualifikasi dan penyisihan Mobile Legends: Bang Bang & Free Fire.
                </p>

                {/* Embedded Map Venue 1: MLBB & FF */}
                <div className="w-full h-52 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 mb-6 relative z-10 shadow-inner">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d991.5893031748755!2d106.1371775!3d-6.2165348!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwMTInNTkuMiJTIDEwNsKwMDgnMTQuMyJF!5e0!3m2!1sid!2sid!4v1785610660666!5m2!1sid!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi MLBB & Free Fire"
                    className="w-full h-full grayscale-[15%] hover:grayscale-0 transition-all duration-300"
                  ></iframe>
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/dHXj2Wd5GGQG77B59"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider group-hover:scale-[1.02]"
              >
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gold animate-bounce" /> Buka Google Maps ML & FF
              </a>
            </motion.div>

            {/* Venue 2: PS4 Pro FC25/26 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUpVariant}
              className="bg-white text-dark p-6 sm:p-8 rounded-[28px] sm:rounded-[36px] border border-slate-200 shadow-xl flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Trophy className="w-36 h-36 text-gold" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-100 text-amber-800 border border-amber-200 rounded-full text-xs font-black uppercase mb-4">
                  <Gamepad2 className="w-3.5 h-3.5 text-amber-700 inline shrink-0" /> PS4 PRO EA SPORTS FC
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading mb-2 text-dark">
                  Lokasi PS4 Pro EA SPORTS FC25/26
                </h3>
                <p className="text-xs sm:text-sm text-secondary mb-4 leading-relaxed font-medium">
                  Venue resmi turnamen konsol PlayStation 4 Pro EA SPORTS FC25 / FC26 kategori Individu (1v1).
                </p>

                {/* Embedded Map Venue 2: FC25/FC26 (Ziezan Store) */}
                <div className="w-full h-52 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 mb-6 relative z-10 shadow-inner">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d495.78645136109657!2d106.1383497!3d-6.2252286!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e4221001af43537%3A0xb3927ce369b81f4c!2sZiezan%20Store!5e0!3m2!1sid!2sid!4v1785610631092!5m2!1sid!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi PS4 Pro FC25/26 (Ziezan Store)"
                    className="w-full h-full grayscale-[15%] hover:grayscale-0 transition-all duration-300"
                  ></iframe>
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/pXJMi9Ho1UCQCqZG7"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gold text-dark font-extrabold py-4 px-6 rounded-2xl hover:bg-amber-400 transition-all shadow-lg shadow-gold/20 flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider group-hover:scale-[1.02]"
              >
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-bounce" /> Buka Google Maps PS4 FC
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION DOWNLOAD PROPOSAL */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 w-full max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariant}
          className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-xl border border-red-500/20 flex flex-col md:flex-row items-center justify-between gap-8 group"
        >
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />
          <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          
          <div className="relative z-10 max-w-2xl text-center md:text-left space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Kerja Sama & Proposal Resmi
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl leading-tight">
              Tertarik Menjadi Sponsor Festival eSports Karang Taruna Desa Padasuka?
            </h2>
            <p className="text-sm sm:text-base text-red-100 leading-relaxed font-medium">
              Unduh proposal resmi dan pelajari kesempatan kolaborasi strategis untuk mendukung kesuksesan perayaan HUT RI ke-81 di Desa Padasuka.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <button
              onClick={() => navigate("/proposal")}
              className="inline-flex items-center gap-3 bg-white hover:bg-red-50 text-red-700 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold shadow-lg shadow-black/20 hover:shadow-xl transition-all group/btn"
            >
              <Download className="w-5 h-5 text-red-600 group-hover/btn:translate-y-0.5 transition-transform" />
              <span>Unduh Proposal</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* FAQ di Paling Bawah Setelah Maps */}
      <section
        id="faq"
        className="py-16 sm:py-24 bg-slate-50/80 border-t border-gray-100"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center mb-10 sm:mb-16">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeDownVariant} className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold uppercase text-primary tracking-tight flex justify-center items-center gap-2 sm:gap-3 text-center mx-auto max-w-full">
              <MessageCircleQuestion className="w-7 h-7 sm:w-10 sm:h-10 shrink-0 text-primary" />
              Tanya Jawab (FAQ)
            </motion.h2>
          </div>

          <div className="space-y-4 w-full">
            {[
              {
                q: "Siapa penyelenggara Festival eSports Karang Taruna Desa Padasuka ini?",
                a: "Acara ini diselenggarakan secara resmi oleh Karang Taruna Desa Padasuka, Kecamatan Baros, Kabupaten Serang — Banten dalam rangka memeriahkan HUT RI ke-81.",
              },
              {
                q: "Bagaimana cara mendaftar turnamen eSport?",
                a: "Cukup pilih cabang game (Mobile Legends, Free Fire, atau PS4 Pro EA SPORTS FC26) pada formulir pendaftaran, isi data tim/peserta, dan klik 'Kirim Data'. Anda akan diarahkan ke WhatsApp panitia untuk konfirmasi bukti pendaftaran.",
              },
              {
                q: "Apakah peserta di luar Desa Padasuka diperbolehkan mendaftar?",
                a: "Boleh! Seluruh cabang eSport terbuka untuk umum dan pelajar se-Kabupaten Serang dan sekitarnya sesuai kategori tingkatan (SD, SMP, SMA, & UMUM).",
              },
              {
                q: "Berapa biaya pendaftaran eSport?",
                a: "Biaya pendaftaran per peserta menyesuaikan tingkatan: SD (Rp5.000), SMP (Rp8.000), SMA/SMK (Rp10.000), dan UMUM (Rp15.000). Total biaya tim otomatis dikalikan jumlah anggota.",
              },
              {
                q: "Bagaimana sistem pembagian piala & total hadiah?",
                a: "Piala bergilir, sertifikat penghargaan, dan total uang tunai jutaan Rupiah akan diserahkan secara langsung pada panggung utama Grand Final tanggal 15 Agustus 2026.",
              },
              {
                q: "Apakah boleh mendaftar lebih dari satu cabang eSport?",
                a: "Boleh, selama jadwal pertandingan (Match) Anda tidak berbenturan. Satu pemain dapat berkompetisi di Mobile Legends, Free Fire, maupun EA SPORTS FC26.",
              },
              {
                q: "Di mana lokasi babak kualifikasi dan Grand Final dilangsungkan?",
                a: "Lokasi Mobile Legends & Free Fire serta PS4 Pro FC25/26 dilangsungkan di arena khusus yang telah ditentukan panitia (klik tombol Google Maps pada bagian 'Lokasi Turnamen'). Puncak Grand Final dan Nonton Bareng (Nobar) dipusatkan di Lapangan Utama Desa Padasuka.",
              },
              {
                q: "Apakah penonton diperbolehkan hadir menyaksikan Final eSport?",
                a: "Sangat diperbolehkan! Panitia menyediakan layar panggung Nobar khusus agar pendukung dan warga dapat bersorak mendukung tim jagoannya.",
              },
              {
                q: "Bagaimana jika kami berminat menjadi Sponsor / Donatur?",
                a: "Dukungan sponsor sangat kami harapkan! Silakan hubungi Panitia Karang Taruna Desa Padasuka secara langsung untuk berdiskusi mengenai bentuk kerja sama terbaik atau klik tombol Sponsor di bagian bawah halaman.",
              },
              {
                q: "Kapan batas akhir pendaftaran turnamen eSport?",
                a: "Pendaftaran akan ditutup pada 10 Agustus 2026 atau jika kuota peserta telah terpenuhi penuh. Segera amankan tempat tim kamu!",
              },
            ].map((faq, i) => (
              <motion.details
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUpVariant}
                key={i}
                className="group bg-white rounded-[20px] sm:rounded-[24px] border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden w-full"
              >
                <summary className="flex cursor-pointer items-start sm:items-center justify-between p-5 sm:p-6 md:p-8 font-extrabold text-sm sm:text-lg text-slate-800 font-heading hover:text-primary transition-colors gap-4 w-full select-none outline-none">
                  <span className="flex-1 mt-0.5 sm:mt-0 leading-snug">
                    {faq.q}
                  </span>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shrink-0 group-open:bg-primary group-open:text-white transition-colors">
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-open:rotate-180" />
                  </div>
                </summary>
                <div className="px-5 sm:px-6 md:px-8 pb-6 sm:pb-8 text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed bg-slate-50/50 pt-3 sm:pt-4 border-t border-slate-100 w-full font-medium">
                  {faq.a}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-primary text-white w-full mt-16 border-t border-red-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col gap-8 w-full">
          <div className="flex flex-col lg:flex-row lg:justify-between items-center gap-8">
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-6 text-center sm:text-left">
              <div className="flex items-center gap-3 bg-white/95 px-3 py-1.5 rounded-xl shadow-sm">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logo_kabupaten_serang.png" alt="Kabupaten Serang" className="h-7 sm:h-8 w-auto object-contain" />
                <img src="https://upload.wikimedia.org/wikipedia/id/f/f8/Logo_Karang_Taruna_New.png" alt="Karang Taruna" className="h-7 sm:h-8 w-auto object-contain" />
              </div>
              
              <div className="hidden sm:block h-8 w-px bg-white/25"></div>

              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="Ikon 81" className="h-8 sm:h-10 w-auto object-contain brightness-0 invert drop-shadow-sm" />
                <div className="flex flex-col leading-tight pt-0.5 text-left ml-1">
                  <span className="font-heading font-semibold text-[10px] sm:text-[11px] text-white/80 uppercase tracking-widest whitespace-nowrap">Dirgahayu</span>
                  <span className="font-heading font-black text-white text-[13px] sm:text-[15px] uppercase tracking-wider whitespace-nowrap">Indonesia</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-end gap-x-6 gap-y-3 px-4 w-full sm:w-auto">
              <button onClick={() => setActiveModal('tentang')} className="text-white/85 hover:text-white hover:underline font-semibold text-xs sm:text-sm transition-colors text-center">Tentang</button>
              <button onClick={() => setActiveModal('sk')} className="text-white/85 hover:text-white hover:underline font-semibold text-xs sm:text-sm transition-colors text-center">Syarat</button>
              <button onClick={() => setActiveModal('privasi')} className="text-white/85 hover:text-white hover:underline font-semibold text-xs sm:text-sm transition-colors text-center">Privasi</button>
              <button onClick={() => setActiveModal('disclaimer')} className="text-white/85 hover:text-white hover:underline font-semibold text-xs sm:text-sm transition-colors text-center">Disclaimer</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-white/20 text-xs text-white/80 font-medium">
            <p className="text-center sm:text-left">
              Dirgahayu Republik Indonesia. Jayalah Negeriku!
            </p>
            <p className="text-center font-semibold text-white/90">
              &copy; 2026 Karang Taruna Desa Padasuka
            </p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 pt-20 pb-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
              onClick={() => setActiveModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[24px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
                <h3 className="font-heading font-extrabold text-xl text-dark">
                  {activeModal === 'tentang' && 'Tentang Karang Taruna Padasuka'}
                  {activeModal === 'sk' && 'Syarat & Ketentuan'}
                  {activeModal === 'privasi' && 'Kebijakan Privasi'}
                  {activeModal === 'disclaimer' && 'Disclaimer'}
                  {activeModal === 'sponsor' && 'Pendaftaran Sponsor'}
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-secondary hover:bg-red-50 hover:text-primary transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto font-medium text-secondary text-sm md:text-base leading-relaxed space-y-4">
                {activeModal === 'tentang' && (
                  <>
                    <img src="https://upload.wikimedia.org/wikipedia/id/f/f8/Logo_Karang_Taruna_New.png" alt="Karang Taruna" className="h-16 w-auto mb-6 drop-shadow-sm block" />
                    <p><strong>Karang Taruna Desa Padasuka</strong> adalah organisasi kepemudaan yang menjadi wadah pengembangan generasi muda non-partisan, yang tumbuh atas dasar kesadaran dan rasa tanggung jawab sosial dari, oleh, dan untuk masyarakat di wilayah Desa Padasuka, Kecamatan Baros, Kabupaten Serang, Provinsi Banten.</p>
                    <h4 className="font-bold text-dark mt-6 mb-2">Visi:</h4>
                    <p>Mewujudkan generasi muda Desa Padasuka yang mandiri, kreatif, inovatif, dan berakhlak mulia melalui pengembangan potensi lokal, olahraga, kesenian, serta kepedulian sosial yang nyata.</p>
                    <h4 className="font-bold text-dark mt-6 mb-2">Misi:</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Mengembangkan semangat kebersamaan dan kegotongroyongan di antara sesama generasi muda dan masyarakat umum.</li>
                      <li>Memfasilitasi pemuda-pemudi di setiap kampung se-Desa Padasuka dalam bidang olahraga, seni, dan kewirausahaan.</li>
                      <li>Mendukung program pemerintah desa dalam menjaga kerukunan, ketertiban, dan kesejahteraan sosial.</li>
                      <li>Mengadakan kegiatan positif yang kompetitif (seperti eSport, olahraga fisik, kerohanian) untuk menyalurkan energi pemuda secara produktif.</li>
                    </ul>
                    <h4 className="font-bold text-dark mt-6 mb-2">Tujuan:</h4>
                    <p>Menciptakan lingkungan masyarakat yang harmonis dan solid di mana para pemudanya mampu menjadi pionir atau motor penggerak setiap kemajuan di tingkat kampung maupun desa.</p>
                  </>
                )}
                {activeModal === 'sk' && (
                  <>
                    <h4 className="font-bold text-dark mb-2">1. Ketentuan Umum Lomba</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Peserta lomba merupakan warga Desa Padasuka atau undangan umum yang memenuhi kriteria panitia untuk kategori perorangan atau tim.</li>
                      <li>Setiap peserta wajib mematuhi seluruh peraturan yang telah ditetapkan panitia selama perlombaan berlangsung.</li>
                      <li>Keputusan dewan juri/panitia pada saat perlombaan bersifat mutlak dan tidak dapat diganggu gugat.</li>
                    </ul>
                    <h4 className="font-bold text-dark mt-6 mb-2">2. Pendaftaran</h4>
                    <p>Pendaftaran dianggap sah apabila peserta telah mengisi formulir dari Panitia (atau melalui aplikasi ini) dan membayar biaya pendaftaran yang ditetapkan (jika kategori tersebut berbayar).</p>
                    <h4 className="font-bold text-dark mt-6 mb-2">3. Kedisiplinan & Tata Tertib</h4>
                    <p>Peserta dan penonton wajib menjaga ketertiban, keamanan, kebersihan (tidak membuang sampah sembarangan), serta menjunjung tinggi asas objektivitas dan sportivitas/Fair Play.</p>
                  </>
                )}
                {activeModal === 'privasi' && (
                  <>
                    <p>Kami dari Panitia HUT RI ke-81 Desa Padasuka menghargai privasi informasi Anda. Informasi yang kami kumpulkan hanya meliputi nama peserta, nomor WhatsApp, nomor RT/RW yang dikumpulkan selama masa daftar.</p>
                    <h4 className="font-bold text-dark mt-6 mb-2">Penggunaan Informasi</h4>
                    <p>Setiap data yang Anda masukkan dalam formulir seperti nama dan nomor kontak hanya akan digunakan untuk keperluan verifikasi pendaftaran lomba, konfirmasi kehadiran, dan penyampaian informasi mengenai kompetisi terkait. Kami tidak akan menjual atau menyebarkan data tersebut ke pihak ketiga.</p>
                    <h4 className="font-bold text-dark mt-6 mb-2">Media & Dokumentasi</h4>
                    <p>Selama rangkaian kegiatan Festival eSports Karang Taruna Desa Padasuka, panitia akan mendokumentasikan acara berupa foto dan video. Dokumentasi tersebut akan digunakan sebagai media pelaporan, publikasi, dan materi promosi di media sosial atau lingkungan internal panitia.</p>
                  </>
                )}
                {activeModal === 'disclaimer' && (
                  <>
                    <p>Situs ini merupakan media pendukung untuk keperluan informasi, dokumentasi, dan pendaftaran <strong>Festival eSports Karang Taruna Desa Padasuka</strong> (Kec. Baros, Kab. Serang, Banten).</p>
                    <p className="mt-4">Panitia tidak bertanggung jawab atas segala kerugian yang terjadi akibat kelalaian peserta maupun kegagalan koneksi ketika melakukan transfer atau konfirmasi. Seluruh transaksi resmi hanya dilakukan melalui nomor-nomor rekening atau e-Wallet yang dicantumkan pada situs/halaman resmi panitia. Peserta diimbau untuk selalu waspada terhadap segala bentuk penipuan yang mengatasnamakan panitia penyelenggara.</p>
                    <p className="mt-4">Keseluruhan hadiah, jumlah perlombaan, dan detail jadwal dapat berubah sewaktu-waktu sesuai dengan kebijakan panitia penyelenggara terkait faktor cuaca, jumlah perwakilan peserta, dan kelayakan lokasi tanpa pemberitahuan mutlak terlebih dahulu.</p>
                  </>
                )}
                {activeModal === 'sponsor' && (
                  <SponsorForm onClose={() => setActiveModal(null)} selectedPackage={selectedSponsorPackage} />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
