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
  Menu
} from "lucide-react";
import { RegistrationForm, SponsorForm } from "./components/RegistrationForm";
import { LiveLeaderboard } from "./components/LiveLeaderboard";

export default function App() {
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
            if (data.lomba?.includes("Mobile Legends")) ml++;
            if (data.lomba?.includes("Free Fire")) ff++;
            if (data.lomba?.includes("FC")) fc++;
          });
          setSlotCounts({ ml, ff, fc });
        });
      });
    });
  }, []);

  useEffect(() => {
    const targetDate = new Date("2026-08-17T00:00:00").getTime();
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
            <img src="https://beeimg.com/images/k22145264424.png" alt="App Icon" className="w-8 h-8 drop-shadow-sm rounded-md" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-dark text-sm">Install Aplikasi</span>
            <span className="text-secondary text-xs">Akses informasi Festival Merdeka lebih cepat!</span>
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
            <div className={`flex items-center gap-3 md:gap-4 ${!isScrolled ? 'pl-2 sm:pl-0' : ''}`}>
            <div className="hidden lg:flex items-center gap-2 sm:gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logo_kabupaten_serang.png" alt="Kabupaten Serang" className="h-7 sm:h-9 md:h-10 w-auto object-contain drop-shadow-sm" />
              <img src="https://upload.wikimedia.org/wikipedia/id/f/f8/Logo_Karang_Taruna_New.png" alt="Karang Taruna" className="h-7 sm:h-9 md:h-10 w-auto object-contain drop-shadow-sm" />
            </div>
            
            <div className="hidden lg:block h-8 md:h-10 w-px bg-gray-200"></div>
            
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div 
                className="h-7 sm:h-9 md:h-10 w-8 sm:w-10 drop-shadow-sm bg-primary"
                style={{
                  WebkitMaskImage: 'url(https://beeimg.com/images/k22145264424.png)',
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskImage: 'url(https://beeimg.com/images/k22145264424.png)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center'
                }}
              />
              <div className="flex flex-col leading-tight pt-0.5 text-left ml-1">
                <span className="font-heading font-semibold text-[10px] sm:text-[11px] text-dark uppercase tracking-widest whitespace-nowrap text-left">Dirgahayu</span>
                <span className="font-heading font-black text-primary text-[13px] sm:text-[15px] uppercase tracking-wider whitespace-nowrap text-left">Indonesia</span>
              </div>
            </div>
            <div className={`hidden lg:block w-px bg-gray-200 ml-1 transition-all duration-300 ${isScrolled ? 'h-6' : 'h-8'}`}></div>
            <div className="hidden lg:flex flex-col leading-none pt-1">
              <span className="font-heading font-semibold text-[8px] text-gray-500 uppercase tracking-widest">Festival</span>
              <span className="font-heading font-black text-gray-800 text-sm uppercase tracking-wide">MERDEKA</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold text-secondary">
            <button
              onClick={() => setActiveModal("menu")}
              className="p-2 sm:p-2.5 text-gray-700 hover:text-primary transition-colors flex items-center justify-center group"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            </button>
            <button
              onClick={() => scrollTo("daftar")}
              className="bg-primary hover:bg-primary-dark text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-lg shadow-primary/20 transition-all"
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
              "radial-gradient(circle at 2px 2px, #D7001F 1px, transparent 0)",
            backgroundSize: "15px 15px",
            minHeight: "100%",
          }}
        ></div>
        <div
          className="hidden sm:block absolute inset-0 z-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #D7001F 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>

        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center w-full">
          <motion.div variants={scaleUpVariant} className="mb-4 sm:mb-6">
            <span className="inline-block py-1 sm:py-1.5 px-3 sm:px-4 rounded-full bg-primary/10 text-primary font-bold text-[10px] sm:text-xs md:text-sm tracking-widest uppercase border border-primary/20">
              Festival Merdeka 2026
            </span>
          </motion.div>

          {/* Hero text optimized for all screens */}
          <motion.h1
            variants={fadeUpVariant}
            className="font-heading font-extrabold text-[2.25rem] xs:text-[2.75rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem] leading-[1.05] sm:leading-[1.1] tracking-tight text-primary uppercase text-center mb-4 sm:mb-6 w-full"
          >
            <span className="block drop-shadow-sm">SIAPKAN DIRIMU</span>
            <span
              className="block text-white"
              style={{ WebkitTextStroke: "2px #D7001F" }}
            >
              UNTUK IKUT
            </span>
            <span className="block drop-shadow-md relative inline-block z-10 px-2 sm:px-4">
              LOMBA 17-AN
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUpVariant}
            className="text-secondary text-sm xs:text-base md:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 px-2 sm:px-0 leading-relaxed font-medium"
          >
            Meriahkan kemerdekaan dengan semangat kebersamaan dan sportivitas. Tunjukkan kemampuanmu dan raih total hadiah jutaan Rupiah!
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
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" /> 17 Agustus 2026
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
          <div className="text-center mb-10 sm:mb-16">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeDownVariant} className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold mb-3 sm:mb-4 uppercase text-primary flex items-center justify-center gap-2 sm:gap-3 text-center mx-auto max-w-full">
              <Sparkles className="w-7 h-7 sm:w-10 sm:h-10 shrink-0 text-primary" />
              Keseruan 17-an
            </motion.h2>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleUpVariant} className="w-16 sm:w-20 h-1 sm:h-1.5 bg-gold mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {[
              {
                icon: Trophy,
                title: "Lomba Islami & Tradisional",
                desc: "Melestarikan budaya bangsa dan menjunjung tinggi nilai agama untuk seluruh kalangan warga.",
              },
              {
                icon: Gamepad2,
                title: "eSport Competition",
                desc: "Adu bakat gaming gengsi tinggi dari 14 kampung se-Padasuka. Siapkan tim terbaikmu!",
              },
              {
                icon: Users,
                title: "Malam Tirakatan",
                desc: "Puncak kebersamaan, doa syukur kemerdekaan, pembagian hadiah, dan ramah tamah warga.",
              },
            ].map((item, i) => (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={scaleUpVariant}
                whileHover={{ y: -5 }}
                key={i}
                className="relative p-[2px] rounded-[24px] sm:rounded-[32px] overflow-hidden group shadow-sm hover:shadow-lg transition-all"
              >
                <div className="absolute top-1/2 left-1/2 w-[250%] h-[250%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_75%,#d7001f_100%)] animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative bg-white h-full p-6 sm:p-8 rounded-[22px] sm:rounded-[30px] flex flex-col items-center text-center z-10 border border-gray-100/50">
                  <div className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors duration-300 shadow-[0_0_8px_rgba(215,0,31,0.5)]" />
                  
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/5 text-primary rounded-full flex items-center justify-center mb-5 sm:mb-6 relative shrink-0">
                    <div className="absolute inset-0 border border-primary/20 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
                    <item.icon className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-heading mb-2 sm:mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
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
              Jadwal Acara
            </motion.h2>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleUpVariant} className="w-16 sm:w-20 h-1 sm:h-1.5 bg-gold mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                title: "Pendaftaran Perlombaan",
                date: "Mulai Sekarang – 9 Agustus 2026",
                icon: Target,
                desc: "Pastikan tim/peserta sudah terdaftar sebelum kuota habis.",
              },
              {
                title: "Lomba Islami & Anak",
                date: "10–13 Agustus 2026",
                icon: Users,
                desc: "Lomba keagamaan dan lomba anak-anak sore hari.",
              },
              {
                title: "Spesial Lomba Kemerdekaan",
                date: "14–16 Agustus 2026",
                icon: Trophy,
                desc: "Berbagai perlombaan tradisional utama.",
              },
              {
                title: "Grand Final, eSport & Malam Tirakatan",
                date: "17 Agustus 2026",
                icon: Medal,
                desc: "Acara puncak, final eSport, dan pembagian hadiah.",
              },
            ].map((item, i) => (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUpVariant}
                key={i}
                className="relative p-[2px] rounded-[24px] overflow-hidden group shadow-sm hover:shadow-lg transition-all"
              >
                {/* Shiny Chasing Border Layer */}
                <div className="absolute top-1/2 left-1/2 w-[250%] h-[250%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_75%,#d7001f_100%)] animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Actual Card Content Layer */}
                <div className="relative bg-white h-full p-6 sm:p-8 rounded-[22px] flex flex-col justify-between z-10 border border-gray-100/50">
                  {/* Decorative Red Dot */}
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors duration-300 shadow-[0_0_8px_rgba(215,0,31,0.5)]" />

                  <div>
                    <div className="w-12 h-12 rounded-xl bg-red-50 text-primary flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-heading font-extrabold text-lg md:text-xl text-dark mb-2 leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-secondary text-sm font-medium mb-4 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-100 mt-auto">
                    <span className="inline-block bg-primary/10 text-primary font-bold text-xs px-3 py-1.5 rounded-lg">
                      {item.date}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Perlombaan Tradisional */}
      <section
        id="lomba"
        className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6"
      >
        <div>
          <div className="text-center mb-10 sm:mb-16">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeDownVariant} className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold mb-3 sm:mb-4 uppercase text-primary flex justify-center items-center gap-2 sm:gap-3 text-center mx-auto max-w-full">
              <Trophy className="w-7 h-7 sm:w-10 sm:h-10 shrink-0 text-primary" />
              Kategori Lomba
            </motion.h2>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUpVariant} className="text-sm sm:text-base text-secondary font-medium">
              Beragam perlombaan seru untuk memeriahkan hari kemerdekaan!
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 xl:gap-10">
            {[
              {
                title: "Kategori Anak",
                items: [
                  "Balap Karung",
                  "Makan Kerupuk",
                  "Lomba Kelereng",
                  "Memasukkan Paku ke Botol",
                  "Pecah Air",
                ],
              },
              {
                title: "Kategori Remaja",
                items: [
                  "Balap Karung Helm",
                  "Tarik Tambang",
                  "Balap Bakiak",
                  "Futsal Sarung",
                  "Estafet Tepung / Air",
                ],
              },
              {
                title: "Dewasa & Umum",
                items: [
                  "Panjat Pinang",
                  "Tarik Tambang Akbar",
                  "Balap Egrang",
                  "Sepak Bola Daster",
                  "Lomba Tumpeng",
                ],
              },
            ].map((cat, i) => (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={scaleUpVariant}
                key={i}
                className="relative p-[2px] rounded-[24px] sm:rounded-[32px] overflow-hidden group shadow-sm hover:shadow-lg transition-all"
              >
                <div className="absolute top-1/2 left-1/2 w-[250%] h-[250%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_75%,#d7001f_100%)] animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative bg-white h-full p-6 sm:p-8 rounded-[22px] sm:rounded-[30px] z-10 border border-gray-100/50 flex flex-col">
                  <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors duration-300 shadow-[0_0_8px_rgba(215,0,31,0.5)] z-20" />
                  <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-primary/5 rounded-bl-[80px] sm:rounded-bl-[100px] z-0 group-hover:scale-110 transition-transform"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-primary font-heading mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100 flex items-center justify-between pr-8">
                      {cat.title}
                    </h3>
                    <ul className="space-y-3 sm:space-y-4">
                      {cat.items.map((item, j) => (
                        <li
                          key={j}
                          className="flex items-start sm:items-center gap-3 text-sm sm:text-base text-dark font-medium leading-tight group/item"
                        >
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 group-hover/item:scale-110 group-hover/item:bg-green-100 transition-all">
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <span className="flex-1 group-hover/item:text-primary transition-colors">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* eSport */}
      <section
        id="esport"
        className="py-16 sm:py-24 bg-gradient-to-br from-[#D7001F] to-[#990011] text-white relative overflow-hidden"
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
              Perebutan Tahta Tertinggi antar Pemuda 14 Kampung Se-Desa Padasuka dengan Total Hadiah Jutaan Rupiah! <br className="hidden sm:block" /> <span className="font-bold text-gold">* Syarat batas usia maksimal 50 tahun (Kategori Umum).</span>
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-12 sm:mb-16">
            {[
              {
                game: "Mobile Legends (Tim)",
                prizes: [
                  { level: "SD", juara1: "Rp 150.000", juara2: "Rp 75.000" },
                  { level: "SMP", juara1: "Rp 250.000", juara2: "Rp 100.000" },
                  { level: "SMA", juara1: "Rp 350.000", juara2: "Rp 150.000" },
                  { level: "Umum", juara1: "Rp 500.000", juara2: "Rp 250.000" },
                ],
                logo: "https://upload.wikimedia.org/wikipedia/en/a/a0/Mobile_Legends_Bang_Bang_2025_logo.png",
                filled: slotCounts.ml,
              },
              {
                game: "Free Fire (Squad)",
                prizes: [
                  { level: "SD", juara1: "Rp 120.000", juara2: "Rp 60.000" },
                  { level: "SMP", juara1: "Rp 200.000", juara2: "Rp 100.000" },
                  { level: "SMA", juara1: "Rp 250.000", juara2: "Rp 125.000" },
                  { level: "Umum", juara1: "Rp 400.000", juara2: "Rp 200.000" },
                ],
                logo: "https://upload.wikimedia.org/wikipedia/id/8/8b/Garena_Free_Fire_New_Style.png",
                filled: slotCounts.ff,
              },
              {
                game: "EA Sports FC 26 (Individu)",
                prizes: [
                  { level: "SD", juara1: "Rp 30.000", juara2: "Rp 15.000" },
                  { level: "SMP", juara1: "Rp 50.000", juara2: "Rp 25.000" },
                  { level: "SMA", juara1: "Rp 75.000", juara2: "Rp 35.000" },
                  { level: "Umum", juara1: "Rp 100.000", juara2: "Rp 50.000" },
                ],
                logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/FC_26_Logo.svg/1280px-FC_26_Logo.svg.png",
                filled: slotCounts.fc,
              },
            ].map((item, i) => {
              const progress = Math.min((item.filled / 32) * 100, 100);
              return (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={i === 1 ? scaleUpVariant : (i === 0 ? slideInLeftVariant : slideInRightVariant)}
                  key={i}
                  className="group flex flex-col bg-white border border-gray-100 p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] text-center hover:-translate-y-2 hover:shadow-2xl transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 left-0 bg-gray-50 border-b border-gray-100 flex flex-col pt-3 z-20">
                    <div className="flex justify-between items-center px-6 pb-2 text-xs font-bold text-gray-500">
                      <span>DAFTAR SEKARANG</span>
                      <span className="text-primary tracking-wide">TARGET: {item.filled} OF 32 SLOTS</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 relative overflow-hidden">
                      <div className="h-full bg-primary relative transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}>
                        <div className="absolute inset-0 bg-white/30 animate-[shimmerBorder_2s_linear_infinite]" style={{ animation: 'shimmerBorder 2s linear infinite' }} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative mx-auto mt-10 mb-5 sm:mb-6 rounded-[20px] p-[2.5px] overflow-hidden shrink-0 shadow-sm w-32 sm:w-40 aspect-[2/1] bg-white">
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
                  <h3 className="text-xl sm:text-2xl font-bold font-heading mb-6 text-center text-dark">
                    {item.game}
                  </h3>
                  
                  <div className="space-y-2 relative z-10 w-full text-left mt-auto">
                    {item.prizes.map((prize, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-100 p-3 rounded-xl hover:border-slate-300 transition-colors">
                        <div className="text-[10px] sm:text-xs font-bold text-slate-500 bg-slate-200/60 inline-flex items-center px-2 py-0.5 rounded-md mb-2">{prize.level}</div>
                        <div className="flex justify-between items-center text-[11px] sm:text-xs">
                           <div className="flex flex-col">
                             <span className="text-yellow-600 font-bold flex items-center gap-1"><Trophy className="w-3.5 h-3.5"/> Juara 1</span>
                             <span className="font-black text-slate-800 text-sm">{prize.juara1}</span>
                           </div>
                           <div className="flex flex-col text-right">
                             <span className="text-slate-500 font-bold flex items-center justify-end gap-1"><Medal className="w-3.5 h-3.5"/> Juara 2</span>
                             <span className="font-black text-slate-800 text-sm">{prize.juara2}</span>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] sm:text-xs mt-6 text-gray-400 text-center font-medium">*Estimasi Nominal Berdasarkan Kuota</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUpVariant} className="max-w-2xl mx-auto mt-6 bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 text-center shadow-sm lg:max-w-4xl xl:max-w-5xl">
            <span className="text-secondary text-sm sm:text-base font-medium leading-relaxed block">
              <strong className="text-dark">Catatan Penting:</strong> Nominal hadiah di atas merupakan estimasi awal. Hadiah <span className="underline decoration-gold decoration-2 underline-offset-2 font-semibold">bisa bertambah</span> jika pendaftar melampaui target, dan dapat disesuaikan jika slot tidak terpenuhi penuh. Yuk ajak teman kalian untuk mendaftar!
            </span>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={slideInRightVariant} className="max-w-4xl mx-auto rounded-[24px] sm:rounded-[32px] overflow-hidden text-dark relative w-full shadow-xl bg-white border border-gray-100 mt-16 lg:mt-24 group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-gold to-primary" />
            <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors duration-300 shadow-[0_0_8px_rgba(215,0,31,0.5)] z-20" />
            <div className="p-6 sm:p-10 md:p-12 w-full relative z-10">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-heading mb-2 text-center text-primary uppercase tracking-tight">
                Tarif Pendaftaran eSport
              </h3>
              <p className="text-center text-secondary text-sm sm:text-base mb-6 sm:mb-8 font-medium">Semua perlombaan tradisional dijamin 100% GRATIS.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { k: "SD Kelas 1–3", v: "Rp 5.000" },
                  { k: "SD Kelas 4–6", v: "Rp 8.000" },
                  { k: "SMP", v: "Rp 10.000" },
                  { k: "SMA/SMK", v: "Rp 12.000" },
                  { k: "Umum (Maks 50 Thn)", v: "Rp 15.000" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors ${item.k.includes('Umum') ? 'sm:col-span-2' : ''}`}
                  >
                    <span className="text-sm sm:text-base font-semibold text-secondary">
                      {item.k}
                    </span>
                    <span className="font-bold font-heading text-base sm:text-lg text-primary">
                      {item.v}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-secondary text-xs sm:text-sm mt-4 font-medium px-2">* Tarif Pendaftaran berlaku untuk Per-Orang (Individu), silahkan dikali dengan jumlah orang di tim.</div>
            </div>
          </motion.div>
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
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors duration-300 shadow-[0_0_8px_rgba(215,0,31,0.5)]" />
                <h3 className="font-heading font-bold text-xl text-slate-600 mb-2">Paket Silver</h3>
                <div className="text-3xl font-black text-slate-800 font-heading mb-6">Rp 20.000<span className="text-sm text-secondary font-normal block mt-1">/ Slot Minimal</span></div>
                <ul className="space-y-3 mb-8 text-sm text-secondary font-medium text-left flex-1">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Pemuatan Nama/Logo di Banner Acara (Kecil)</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Disebutkan oleh MC (1x)</li>
                </ul>
                <button onClick={() => { setSelectedSponsorPackage('Paket Silver (Rp 20.000)'); setActiveModal('sponsor'); }} className="w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors relative overflow-hidden group/btn">
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
                <div className="text-3xl font-black text-yellow-700 font-heading mb-6">Rp 50.000<span className="text-sm text-secondary font-normal block mt-1">/ Slot Menengah</span></div>
                <ul className="space-y-3 mb-8 text-sm text-secondary font-medium text-left flex-1">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Posisi Logo Premium di Banner Utama (Sedang)</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Promosi Produk oleh MC (2x)</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Spot gelar Produk/Brosur di Area Acara</li>
                </ul>
                <button onClick={() => { setSelectedSponsorPackage('Paket Gold (Rp 50.000)'); setActiveModal('sponsor'); }} className="w-full bg-gold text-white font-bold py-3 rounded-xl hover:bg-yellow-600 transition-colors shadow-lg shadow-gold/20">Pilih Paket Gold</button>
              </div>
            </motion.div>

            {/* Paket Platinum */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={slideInRightVariant} className="relative p-[2px] rounded-[24px] overflow-hidden group shadow-sm hover:shadow-lg transition-all flex flex-col">
              <div className="absolute top-1/2 left-1/2 w-[250%] h-[250%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_75%,#1e293b_100%)] animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex flex-col flex-1 bg-white p-6 sm:p-8 rounded-[22px] text-center z-10 border border-gray-100/50">
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors duration-300 shadow-[0_0_8px_rgba(215,0,31,0.5)]" />
                <h3 className="font-heading font-bold text-xl text-dark mb-2">Paket Platinum</h3>
                <div className="text-3xl font-black text-dark font-heading mb-6 text-balance">Rp 150.000+<span className="text-sm text-secondary font-normal block mt-1">/ Slot Eksklusif</span></div>
                <ul className="space-y-3 mb-8 text-sm text-secondary font-medium text-left flex-1">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Logo Terbesar di Center Banner & Kaos Panitia</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Promosi MC Tanpa Batas / Adlips</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Spanduk Khusus Brand di Titik Strategis</li>
                </ul>
                <button onClick={() => { setSelectedSponsorPackage('Paket Platinum (Rp 150.000+)'); setActiveModal('sponsor'); }} className="w-full bg-dark text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors relative overflow-hidden group/btn">
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
                    <div className="absolute top-1/2 left-1/2 w-[250%] h-[250%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_75%,#d7001f_100%)] animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative flex flex-col justify-between h-full bg-white p-6 rounded-[22px] z-10 border border-gray-100/50 gap-6">
                      <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors duration-300 shadow-[0_0_8px_rgba(215,0,31,0.5)]" />
                      
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

      {/* FAQ */}
      <section
        id="faq"
        className="py-16 sm:py-24 bg-gray-50 border-t border-gray-100"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center mb-10 sm:mb-16">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeDownVariant} className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold uppercase text-primary tracking-tight flex justify-center items-center gap-2 sm:gap-3 text-center mx-auto max-w-full">
              <MessageCircleQuestion className="w-7 h-7 sm:w-10 sm:h-10 shrink-0 text-primary" />
              Tanya Jawab
            </motion.h2>
          </div>

          <div className="space-y-4 w-full">
            {[
              {
                q: "Bagaimana cara mendaftar lomba eSport?",
                a: "Cukup isi formulir 'Pendaftaran Khusus eSport' dan klik 'Kirim Data'. Anda akan diarahkan ke WhatsApp panitia untuk konfirmasi bukti transfer.",
              },
              {
                q: "Apakah warga bukan Desa Padasuka boleh ikut lomba?",
                a: "Boleh! Kategori eSport (Pelajar/Umum) terbuka untuk peserta dari luar Desa Padasuka sesuai syarat batas usia. Lomba tradisional difokuskan untuk memeriahkan warga lokal.",
              },
              {
                q: "Kapan lomba tradisional diadakan dan apakah berbayar?",
                a: "Semua perlombaan tradisional 100% GRATIS dan diadakan secara on the spot pada Hari H (17 Agustus 2026). Langsung datang ke lokasi untuk mendaftar!",
              },
              {
                q: "Bagaimana sistem hadiah dibagikan?",
                a: "Hadiah diserahkan secara langsung atau pada acara puncak/Malam Tirakatan. Nominal hadiah eSport bersifat estimasi dan dan berpotensi bertambah (menyesuaikan jumlah peserta tim).",
              },
              {
                q: "Apa saja lomba tradisional yang tersedia?",
                a: "Sangat beragam! Mulai dari Balap Karung Pakai Helm, Makan Kerupuk, Tarik Tambang, hingga hiburan puncak Panjat Pinang. Semuanya meriah untuk keluarga.",
              },
              {
                q: "Apakah boleh mendaftar lebih dari satu cabang eSport?",
                a: "Tentu boleh, selama jadwal pertandingan (Match) Anda tidak berbenturan. Satu tim atau individu dapat berkompetisi di beberapa cabang.",
              },
              {
                q: "Di mana lokasi rangkaian acara dilangsungkan?",
                a: "Seluruh rangkaian acara utama perayaan (termasuk panggung dan perlombaan tradisional) akan dipusatkan di Lapangan Utama Desa Padasuka, Kec. Baros, Serang.",
              },
              {
                q: "Apakah penonton diperbolehkan hadir untuk Final eSport?",
                a: "Sangat diperbolehkan! Kami menyediakan area khusus Nonton Bareng (Nobar) agar suasana kompetisi semakin meriah dengan dukungan supporter dari masing-masing tim.",
              },
              {
                q: "Bagaimana jika saya ingin menjadi sponsor / donatur?",
                a: "Dukungan Anda sangat berarti! Silakan pilih salah satu opsi pada 'Paket Sponsor' (Silver, Gold, Platinum). Anda akan diarahkan ke WhatsApp untuk proses MoU lebih lanjut.",
              },
              {
                q: "Kapan batas akhir pendaftaran eSport?",
                a: "Pendaftaran akan ditutup H-3 sebelum tanggal dimulainya Match atau apabila kuota slot peserta sudah terpenuhi penuh. Jangan sampai kehabisan!",
              },
            ].map((faq, i) => (
              <motion.details
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUpVariant}
                key={i}
                className="group bg-white rounded-[20px] sm:rounded-[24px] border border-gray-100 shadow-sm overflow-hidden w-full"
              >
                <summary className="flex cursor-pointer items-start sm:items-center justify-between p-5 sm:p-6 md:p-8 font-bold text-sm sm:text-lg text-dark font-heading hover:text-primary transition-colors gap-4 w-full select-none outline-none">
                  <span className="flex-1 mt-0.5 sm:mt-0 leading-snug">
                    {faq.q}
                  </span>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-50 rounded-full flex items-center justify-center shrink-0 group-open:bg-primary group-open:text-white transition-colors">
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-open:rotate-180" />
                  </div>
                </summary>
                <div className="px-5 sm:px-6 md:px-8 pb-6 sm:pb-8 text-sm sm:text-base md:text-lg text-secondary leading-relaxed bg-gray-50/50 pt-3 sm:pt-4 border-t border-gray-50 w-full">
                  {faq.a}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* Map Lokasi */}
      <section id="lokasi" className="py-16 sm:py-24 bg-white border-t border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <motion.span initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeDownVariant} className="text-primary/80 font-bold tracking-widest uppercase text-[10px] xs:text-xs sm:text-sm mb-2 block">
              Titik Kumpul
            </motion.span>
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeDownVariant} className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold mb-3 sm:mb-4 uppercase text-primary tracking-tight">
              Lokasi Acara
            </motion.h2>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleUpVariant} className="w-16 sm:w-20 h-1 sm:h-1.5 bg-gold mx-auto rounded-full mb-6" />
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUpVariant} className="text-sm sm:text-base text-secondary font-medium max-w-2xl mx-auto">
              Seluruh rangkaian kegiatan perayaan dipusatkan di Lapangan Utama Desa Padasuka. Mari bergabung dan meriahkan acara bersama keluarga!
            </motion.p>
          </div>

          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-50px" }} 
            variants={scaleUpVariant}
            className="w-full h-[300px] sm:h-[400px] lg:h-[450px] rounded-[20px] sm:rounded-[32px] overflow-hidden shadow-lg border border-gray-100 relative group"
          >
            <iframe 
              src="https://maps.google.com/maps?q=Kantor+Desa+Padasuka,+Baros,+Serang,+Banten&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              className="absolute inset-0 z-0 grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
              title="Lokasi Festival Merdeka"
            ></iframe>
            
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 md:right-8 z-10">
              <a 
                href="https://share.google/DvRivd6ll2rfWzat1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/90 backdrop-blur-md text-primary hover:bg-primary hover:text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 transition-all transform hover:-translate-y-1 border border-primary/20 hover:border-primary/0"
              >
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" /> Buka Google Maps
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-transparent w-full mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 flex flex-col gap-8 w-full">
          <div className="flex flex-col lg:flex-row lg:justify-between items-center lg:items-start gap-8">
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-6">
              <div className="hidden lg:flex items-center gap-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logo_kabupaten_serang.png" alt="Kabupaten Serang" className="h-8 md:h-10 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                <img src="https://upload.wikimedia.org/wikipedia/id/f/f8/Logo_Karang_Taruna_New.png" alt="Karang Taruna" className="h-8 md:h-10 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
              </div>
              
              <div className="hidden lg:block h-8 w-px bg-gray-200"></div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <div 
                  className="h-7 sm:h-9 md:h-10 w-8 sm:w-10 drop-shadow-sm bg-primary"
                  style={{
                    WebkitMaskImage: 'url(https://beeimg.com/images/k22145264424.png)',
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskImage: 'url(https://beeimg.com/images/k22145264424.png)',
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center'
                  }}
                />
                <div className="flex flex-col leading-tight pt-0.5 text-left ml-1">
                  <span className="font-heading font-semibold text-[10px] sm:text-[11px] text-dark uppercase tracking-widest whitespace-nowrap text-left">Dirgahayu</span>
                  <span className="font-heading font-black text-primary text-[13px] sm:text-[15px] uppercase tracking-wider whitespace-nowrap text-left">Indonesia</span>
                </div>
              </div>
              <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
              <span className="font-heading font-bold text-xs sm:text-sm text-dark tracking-wide text-center">
                FESTIVAL MERDEKA 2026
              </span>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-end gap-x-4 sm:gap-x-6 gap-y-3 px-4 w-full sm:w-auto">
              <button onClick={() => setActiveModal('tentang')} className="text-secondary hover:text-primary font-medium text-[11px] xs:text-xs sm:text-sm transition-colors text-center w-[45%] sm:w-auto">Tentang Kami</button>
              <button onClick={() => setActiveModal('sk')} className="text-secondary hover:text-primary font-medium text-[11px] xs:text-xs sm:text-sm transition-colors text-center w-[45%] sm:w-auto">Syarat & Ketentuan</button>
              <button onClick={() => setActiveModal('privasi')} className="text-secondary hover:text-primary font-medium text-[11px] xs:text-xs sm:text-sm transition-colors text-center w-[45%] sm:w-auto">Kebijakan Privasi</button>
              <button onClick={() => setActiveModal('disclaimer')} className="text-secondary hover:text-primary font-medium text-[11px] xs:text-xs sm:text-sm transition-colors text-center w-[45%] sm:w-auto">Disclaimer</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-400 text-center sm:text-left">
              Dirgahayu Republik Indonesia. Jayalah Negeriku!
            </p>
            <p className="text-xs font-semibold text-gray-400 text-center">
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
                  {activeModal === 'menu' && 'Menu Navigasi'}
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
                {activeModal === 'menu' && (
                  <div className="flex flex-col gap-3">
                     <button onClick={() => { setActiveModal(null); scrollTo("tentang"); }} className="w-full text-left px-5 py-4 hover:bg-primary/5 rounded-2xl font-bold text-dark transition-colors border border-transparent hover:border-primary/20 flex items-center justify-between group">
                       Tentang <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                     </button>
                     <button onClick={() => { setActiveModal(null); scrollTo("lomba"); }} className="w-full text-left px-5 py-4 hover:bg-primary/5 rounded-2xl font-bold text-dark transition-colors border border-transparent hover:border-primary/20 flex items-center justify-between group">
                       Kategori Lomba <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                     </button>
                     <button onClick={() => { setActiveModal(null); scrollTo("jadwal"); }} className="w-full text-left px-5 py-4 hover:bg-primary/5 rounded-2xl font-bold text-dark transition-colors border border-transparent hover:border-primary/20 flex items-center justify-between group">
                       Jadwal <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                     </button>
                     <button onClick={() => { setActiveModal(null); scrollTo("esport"); }} className="w-full text-left px-5 py-4 hover:bg-primary/5 rounded-2xl font-bold text-dark transition-colors border border-transparent hover:border-primary/20 flex items-center justify-between group">
                       eSport <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                     </button>
                     <button onClick={() => { setActiveModal(null); scrollTo("lokasi"); }} className="w-full text-left px-5 py-4 hover:bg-primary/5 rounded-2xl font-bold text-dark transition-colors border border-transparent hover:border-primary/20 flex items-center justify-between group">
                       Lokasi <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                     </button>
                     <button onClick={() => { setActiveModal(null); scrollTo("faq"); }} className="w-full text-left px-5 py-4 hover:bg-primary/5 rounded-2xl font-bold text-dark transition-colors border border-transparent hover:border-primary/20 flex items-center justify-between group">
                       FAQ <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                     </button>
                     <a href="/proposal" className="w-full text-left px-5 py-4 hover:bg-primary/5 rounded-2xl font-bold text-primary transition-colors border border-transparent hover:border-primary/20 flex items-center justify-between group bg-primary/5">
                       Proposal Kegiatan <ArrowRight className="w-4 h-4 text-primary transition-colors" />
                     </a>
                  </div>
                )}
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
                    <p>Pendaftaran dianggap sah apabila peserta telah mengisi formulir dari Panitia (atau melalui aplikasi ini) dan membayar biaya pendaftaran yang ditetapkan (jika kategori tersebut berbayar). Untuk Lomba eSport, batas usia maksimal kategori umum adalah 50 tahun.</p>
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
                    <p>Selama rangkaian kegiatan Festival Merdeka 2026, panitia akan mendokumentasikan acara berupa foto dan video. Dokumentasi tersebut akan digunakan sebagai media pelaporan, publikasi, dan materi promosi di media sosial atau lingkungan internal panitia.</p>
                  </>
                )}
                {activeModal === 'disclaimer' && (
                  <>
                    <p>Situs ini merupakan media pendukung untuk keperluan informasi, dokumentasi, dan pendaftaran <strong>Festival Lomba 17-an Tahun 2026 yang dikelola oleh Karang Taruna dan Panitia Desa Padasuka</strong> (Kec. Baros, Kab. Serang, Banten).</p>
                    <p className="mt-4">Panitia tidak bertanggung jawab atas segala kerugian yang terjadi akibat kelalaian peserta maupun kegagalan koneksi ketika melakukan transfer atau konfirmasi. Seluruh transaksi resmi hanya dilakukan melalui nomor-nomor rekening atau e-Wallet yang dicantumkan pada situs/halaman resmi panitia. Peserta diimbau untuk selalu waspada terhadap segala bentuk penipuan yang mengatasnamakan panitia penyelenggara.</p>
                    <p className="mt-4">Keseluruhan hadiah, jumlah perlombaan, dan detail jadwal dapat berubah sewaktu-waktu sesuai dengan kebijakan panitia penyelenggara terkait faktor cuaca, jumlah perwakilan slot, dan kelayakan lokasi tanpa pemberitahuan mutlak terlebih dahulu.</p>
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
