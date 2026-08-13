import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { ShieldCheck, Trophy, Swords, ChevronsRight, Crown, Sparkles, Award, Flame, Gamepad2, Layers, Maximize2, Minimize2 } from "lucide-react";
import { FC26_LOGO, MLBB_LOGO, FF_LOGO } from "../lib/utils";
import { getLocalRegistrations, mergeRegistrations, RegistrationData, parseTimestampMillis } from "../lib/registrationsStore";

export function TournamentBracket() {
  const [participants, setParticipants] = useState<RegistrationData[]>(() => {
    try {
      const local = getLocalRegistrations();
      return local.filter(p => (p.status || "").toLowerCase().trim() === "verified");
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState("Mobile Legends");
  const [isFullView, setIsFullView] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullView(false);
      }
    };
    if (isFullView) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isFullView]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "registrations"), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RegistrationData));
      const local = getLocalRegistrations();
      const merged = mergeRegistrations(docs, local);
      const activeParticipants = merged.filter(d => (d.status || "").toLowerCase().trim() === "verified");
      setParticipants(activeParticipants);
    }, (error) => {
      console.warn("Bracket realtime fetch failed:", error);
      const local = getLocalRegistrations().filter(p => (p.status || "").toLowerCase().trim() === "verified");
      setParticipants(local);
    });

    return () => unsub();
  }, []);

  const getCategoryWeight = (kategori = "") => {
    const k = (kategori || "").toLowerCase();
    if (k.includes("umum")) return 5;
    if (k.includes("karang taruna")) return 4;
    if (k.includes("sma") || k.includes("smk")) return 3;
    if (k.includes("smp")) return 2;
    if (k.includes("sd")) return 1;
    return 0;
  };

  const filteredParticipants = participants.filter(p => {
    if ((p.status || "").toLowerCase().trim() !== "verified") return false;
    const l = (p.lomba || "").toLowerCase();
    if (activeTab === "Mobile Legends" && (l.includes("mobile") || l.includes("ml") || l.includes("legend"))) return true;
    if (activeTab === "Free Fire" && (l.includes("free") || l.includes("fire") || l.includes("ff"))) return true;
    if (activeTab === "PS 4 Pro FC26" && (l.includes("fc") || l.includes("ps") || l.includes("ea") || l.includes("fifa"))) return true;
    return false;
  }).sort((a, b) => {
    // 1. Sort by age descending
    const ageA = parseInt(a.usia || "0", 10) || 0;
    const ageB = parseInt(b.usia || "0", 10) || 0;
    if (ageA !== ageB) return ageB - ageA;

    // 2. Secondary sort by category weight
    const weightA = getCategoryWeight(a.kategori);
    const weightB = getCategoryWeight(b.kategori);
    if (weightA !== weightB) return weightB - weightA;

    // 3. Tertiary sort by registration time
    const timeA = parseTimestampMillis(a.createdAt);
    const timeB = parseTimestampMillis(b.createdAt);
    return timeA - timeB; 
  });

  // Calculate bracket dimensions dynamically based on exact verified participant count
  const count = filteredParticipants.length;
  // Dynamic Bracket size: 2 for <=2, 4 for 3-4, 8 for 5-8, 16 for 9-16, etc.
  const bracketSize = count <= 2 ? 2 : Math.pow(2, Math.ceil(Math.log2(Math.max(2, count))));
  const totalRounds = Math.log2(bracketSize);

  // Fill initial slots with verified participants or BYE/TBD
  const initialSlots = Array(bracketSize).fill(null).map((_, i) => filteredParticipants[i] || null);

  interface Match {
    team1: RegistrationData | null;
    team2: RegistrationData | null;
  }

  const roundsData: Match[][] = [];

  // Round 0
  const round0: Match[] = [];
  for (let i = 0; i < bracketSize; i += 2) {
    round0.push({
      team1: initialSlots[i],
      team2: initialSlots[i + 1]
    });
  }
  roundsData.push(round0);

  // Subsequent rounds
  for (let r = 1; r < totalRounds; r++) {
    const matchesInRound = bracketSize / Math.pow(2, r + 1);
    const roundMatches: Match[] = [];
    for (let i = 0; i < matchesInRound; i++) {
      roundMatches.push({ team1: null, team2: null });
    }
    roundsData.push(roundMatches);
  }

  // Calculate dynamic column width & gap based on total rounds so bracket fits desktop without scroll
  const numCols = totalRounds + 1;
  let colWidth = 220;
  let colGap = 48;

  if (numCols <= 4) {
    colWidth = 240;
    colGap = 50;
  } else if (numCols === 5) {
    colWidth = 200;
    colGap = 36;
  } else if (numCols >= 6) {
    colWidth = 175;
    colGap = 24;
  }

  const cardHeight = 72; // px match card height
  const baseGap = 26;   // px gap between round 0 cards

  const computedHeight = round0.length * (cardHeight + baseGap);
  // Establish a stable minimum height to prevent sudden layout shifts (loncat-loncat) when changing tabs
  const totalCanvasHeight = Math.max(520, computedHeight);
  const verticalOffset = Math.max(0, (totalCanvasHeight - computedHeight) / 2);

  // Calculate Y centers for every match in every round
  const yCenters: number[][] = [];
  
  // Round 0 Y centers (with vertical centering offset)
  const round0Y: number[] = [];
  for (let i = 0; i < round0.length; i++) {
    round0Y.push(verticalOffset + i * (cardHeight + baseGap) + cardHeight / 2);
  }
  yCenters.push(round0Y);

  // Subsequent rounds Y centers (exact midpoint between parent match centers)
  for (let r = 1; r < totalRounds; r++) {
    const prevY = yCenters[r - 1];
    const currY: number[] = [];
    const countInRound = bracketSize / Math.pow(2, r + 1);
    for (let i = 0; i < countInRound; i++) {
      const parent1Y = prevY[2 * i];
      const parent2Y = prevY[2 * i + 1];
      currY.push((parent1Y + parent2Y) / 2);
    }
    yCenters.push(currY);
  }

  // Game-specific theme config (Clean Light Theme)
  const getThemeConfig = () => {
    if (activeTab === "Mobile Legends") {
      return {
        badge: "MLBB SQUAD",
        matchDate: "14 AGU • 20.00 WIB",
        accentColor: "from-amber-500 via-amber-400 to-yellow-500",
        stroke1: "#d97706",
        stroke2: "#f59e0b",
        badgeBg: "bg-amber-50 text-amber-900 border-amber-200",
        champBg: "bg-gradient-to-b from-amber-50 via-yellow-50 to-white border-2 border-amber-400 shadow-xl shadow-amber-500/10",
        champButton: "from-amber-500 to-yellow-500 text-slate-950"
      };
    } else if (activeTab === "Free Fire") {
      return {
        badge: "FF SQUAD",
        matchDate: "14 AGU • 20.00 WIB",
        accentColor: "from-red-600 via-orange-500 to-red-500",
        stroke1: "#dc2626",
        stroke2: "#f97316",
        badgeBg: "bg-red-50 text-red-900 border-red-200",
        champBg: "bg-gradient-to-b from-red-50 via-orange-50 to-white border-2 border-red-400 shadow-xl shadow-red-500/10",
        champButton: "from-red-600 to-orange-500 text-white"
      };
    } else {
      return {
        badge: "FC26 INDIVIDU",
        matchDate: "16 AGU • 20.00 WIB",
        accentColor: "from-cyan-600 via-blue-600 to-indigo-600",
        stroke1: "#0284c7",
        stroke2: "#2563eb",
        badgeBg: "bg-cyan-50 text-cyan-900 border-cyan-200",
        champBg: "bg-gradient-to-b from-cyan-50 via-blue-50 to-white border-2 border-cyan-400 shadow-xl shadow-cyan-500/10",
        champButton: "from-cyan-600 to-blue-600 text-white"
      };
    }
  };

  const theme = getThemeConfig();

  // Generate SVG path definitions for pixel-perfect connected bracket lines
  const generateConnectorPaths = () => {
    const paths: React.ReactNode[] = [];

    for (let r = 0; r < totalRounds - 1; r++) {
      const prevY = yCenters[r];
      const nextY = yCenters[r + 1];
      const countNext = nextY.length;

      const xRight = r * (colWidth + colGap) + colWidth;
      const xLeftNext = (r + 1) * (colWidth + colGap);
      const xMid = xRight + colGap / 2;

      for (let i = 0; i < countNext; i++) {
        const yP1 = prevY[2 * i];
        const yP2 = prevY[2 * i + 1];
        const yChild = nextY[i];

        // Path: Right edge of Parent 1 & 2 -> Midpoint -> Vertical connector -> Left edge of Child match
        const pathD = `
          M ${xRight} ${yP1} H ${xMid}
          M ${xRight} ${yP2} H ${xMid}
          M ${xMid} ${yP1} V ${yP2}
          M ${xMid} ${yChild} H ${xLeftNext}
        `;

        paths.push(
          <path
            key={`r-${r}-m-${i}`}
            d={pathD}
            fill="none"
            stroke={`url(#bracketGrad-${activeTab.replace(/\s+/g, '')})`}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.12))" }}
          />
        );
      }
    }

    // Final connector line from Grand Final match to Champion Podium
    const rFinal = totalRounds - 1;
    const xFinalRight = rFinal * (colWidth + colGap) + colWidth;
    const xPodiumLeft = totalRounds * (colWidth + colGap);
    const yFinal = yCenters[rFinal][0];

    paths.push(
      <path
        key="final-to-champion"
        d={`M ${xFinalRight} ${yFinal} H ${xPodiumLeft}`}
        fill="none"
        stroke={`url(#bracketGrad-${activeTab.replace(/\s+/g, '')})`}
        strokeWidth="4"
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.15))" }}
      />
    );

    return paths;
  };

  const totalCanvasWidth = (totalRounds + 1) * colWidth + totalRounds * colGap;

  useEffect(() => {
    if (!isFullView) return;
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 48;
        const containerHeight = containerRef.current.clientHeight - 180;
        const widthScale = containerWidth / totalCanvasWidth;
        const heightScale = containerHeight / totalCanvasHeight;
        setScaleFactor(Math.min(widthScale, heightScale, 1.8));
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    const timer = setTimeout(updateScale, 150);
    return () => {
      window.removeEventListener("resize", updateScale);
      clearTimeout(timer);
    };
  }, [isFullView, totalCanvasWidth, totalCanvasHeight]);

  return (
    <>
      <div className="relative w-full rounded-[28px] p-[2.5px] overflow-hidden shadow-2xl bg-white">
        <style>{`
          @keyframes pulse-scale {
            0% { transform: scale(0.9); }
            100% { transform: scale(1.1); }
          }
        `}</style>
        {/* Animated Conic Gradient Border Radius */}
        <div className="absolute -inset-[150%] animate-[spin_7s_linear_infinite] bg-[conic-gradient(from_0deg,#f59e0b,#ef4444,#06b6d4,#10b981,#f59e0b)] opacity-85 blur-[1px]" />

        {/* Main Bracket Card Container - Full White */}
        <div className="relative w-full bg-white rounded-[26px] p-4 sm:p-8 text-slate-900 z-10">
          {/* Soft Background Accent Glow */}
          <div className={`absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-r ${theme.accentColor} opacity-5 blur-3xl rounded-full pointer-events-none`} />
          <div className={`absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-r ${theme.accentColor} opacity-5 blur-3xl rounded-full pointer-events-none`} />

          {/* Maximize Button to enter 16:9 full-screen broadcast view */}
          <button 
            onClick={() => setIsFullView(true)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-slate-100 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 text-slate-700 hover:text-white rounded-xl border border-slate-200 hover:border-transparent transition-all duration-300 cursor-pointer flex items-center justify-center z-20 group shadow-sm hover:shadow-md"
            title="Tampilkan Layar Penuh (16:9)"
          >
            <Maximize2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline ml-1.5 text-xs font-black tracking-wider uppercase">Full View (16:9)</span>
          </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5 mb-8 relative z-10">
          <div className="flex flex-col items-center w-full">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase border mb-2.5 shadow-sm ${theme.badgeBg}`}>
              <Sparkles className="w-3.5 h-3.5" />
              {theme.badge} • <span className="text-amber-600 font-extrabold">{theme.matchDate}</span>
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 flex items-center justify-center gap-2">
              <Trophy className="w-7 h-7 text-amber-500 drop-shadow-sm" /> Bagan Turnamen Realtime (Terverifikasi)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm font-medium mt-1 max-w-xl">
              Bagan otomatis dibuat khusus untuk <span className="font-mono font-bold text-slate-900">{count}</span> peserta terverifikasi (<span className="font-mono font-bold text-amber-600">{bracketSize} Slot</span>).
            </p>
          </div>

          {/* Tab Selection with Active Full White & Animated Conic Border Radius */}
          <div className="flex justify-center flex-wrap mx-auto bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/90 w-full sm:w-max gap-2 shadow-inner">
            {[
              { name: "Mobile Legends", key: "Mobile Legends", logo: MLBB_LOGO, count: participants.filter(p => (p.lomba||"").toLowerCase().includes("mobile") || (p.lomba||"").toLowerCase().includes("ml")).length },
              { name: "Free Fire", key: "Free Fire", logo: FF_LOGO, count: participants.filter(p => (p.lomba||"").toLowerCase().includes("free") || (p.lomba||"").toLowerCase().includes("ff")).length },
              { name: "PS 4 Pro FC26", key: "PS 4 Pro FC26", logo: FC26_LOGO, count: participants.filter(p => (p.lomba||"").toLowerCase().includes("fc") || (p.lomba||"").toLowerCase().includes("ps")).length }
            ].map(game => {
              const isActive = activeTab === game.key;
              return isActive ? (
                <div key={game.name} className="relative p-[2px] rounded-xl overflow-hidden shadow-md">
                  {/* Active Tab Animated Conic Border */}
                  <div className="absolute -inset-[150%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,#f59e0b,#ef4444,#06b6d4,#10b981,#f59e0b)]" />
                  <button
                    onClick={() => setActiveTab(game.key)}
                    className="relative z-10 bg-white text-slate-900 font-extrabold px-3.5 py-2 rounded-[10px] flex items-center gap-2.5 cursor-pointer"
                  >
                    <div className="w-10 sm:w-16 aspect-[2/1] flex items-center justify-center">
                      <img
                        src={game.logo}
                        alt={game.name}
                        className="h-full max-w-full object-contain drop-shadow-sm"
                      />
                    </div>
                    <span className="text-xs font-mono font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-900 border border-slate-200">
                      {game.count}
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  key={game.name}
                  onClick={() => setActiveTab(game.key)}
                  className="flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80"
                >
                  <div className="w-10 sm:w-16 aspect-[2/1] flex items-center justify-center">
                    <img
                      src={game.logo}
                      alt={game.name}
                      className="h-full max-w-full object-contain drop-shadow-sm opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {game.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="lg:hidden flex items-center justify-end text-xs font-bold text-amber-600 mb-2 px-2 animate-pulse">
          Geser ke kanan untuk melihat bagan lengkap <ChevronsRight className="w-4 h-4 ml-1" />
        </div>

        {/* Bracket Scroll/Desktop Full Width Canvas Area */}
        <div className="overflow-x-auto pb-6 pt-2 w-full scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent flex justify-center">
          <div 
            className="relative min-w-max lg:min-w-0 lg:w-full max-w-full mx-auto px-2"
            style={{ width: `${totalCanvasWidth}px` }}
          >
            {/* Round Titles Row (Header Level) */}
            <div 
              className="flex mb-5 relative z-10"
              style={{ gap: `${colGap}px` }}
            >
              {roundsData.map((roundMatches, r) => {
                const isGrandFinal = r === totalRounds - 1;
                const roundTitle = isGrandFinal 
                  ? "Grand Final" 
                  : r === totalRounds - 2 
                  ? "Semi Finals" 
                  : r === totalRounds - 3 
                  ? "Quarter Finals" 
                  : `Penyisihan`;

                return (
                  <div key={r} className="shrink-0" style={{ width: `${colWidth}px` }}>
                    <div className={`text-center uppercase tracking-wider font-black text-[11px] py-2 px-2 rounded-xl border flex items-center justify-center gap-1.5 shadow-sm ${
                      isGrandFinal 
                        ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-md' 
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {isGrandFinal ? <Crown className="w-3.5 h-3.5 text-amber-600" /> : <Swords className="w-3.5 h-3.5 text-slate-500" />}
                      <span>{roundTitle}</span>
                    </div>
                  </div>
                );
              })}

              {/* Champion Header Title */}
              <div className="shrink-0" style={{ width: `${colWidth}px` }}>
                <div className="text-center uppercase tracking-wider font-black text-[11px] py-2 px-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 border border-amber-300 shadow-md flex items-center justify-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-slate-950" />
                  <span>JUARA 1</span>
                </div>
              </div>
            </div>

            {/* Matches & SVG Connector Canvas Area (Guaranteed Shared Origin x=0, y=0) */}
            <div 
              className="relative flex"
              style={{ height: `${totalCanvasHeight}px`, gap: `${colGap}px` }}
            >
              {/* SVG Connector Lines Overlay */}
              <svg className="absolute inset-0 pointer-events-none w-full h-full z-0 overflow-visible">
                <defs>
                  <linearGradient id={`bracketGrad-${activeTab.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={theme.stroke1} />
                    <stop offset="100%" stopColor={theme.stroke2} />
                  </linearGradient>
                </defs>
                {generateConnectorPaths()}
              </svg>

              {/* Matches Columns */}
              {roundsData.map((roundMatches, r) => {
                const isGrandFinal = r === totalRounds - 1;

                return (
                  <div key={r} className="relative shrink-0" style={{ width: `${colWidth}px`, height: `${totalCanvasHeight}px` }}>
                    {roundMatches.map((match, i) => {
                      const centerY = yCenters[r][i];
                      const topPos = centerY - cardHeight / 2;

                      return (
                        <div
                          key={i}
                          className={`absolute w-full rounded-2xl p-1.5 shadow-md border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex flex-col justify-center gap-1 z-10 ${
                            isGrandFinal
                              ? 'bg-gradient-to-r from-amber-50 via-white to-amber-50 border-amber-400 shadow-amber-500/10'
                              : 'bg-white border-slate-200 hover:border-amber-400'
                          }`}
                          style={{ top: `${topPos}px`, height: `${cardHeight}px` }}
                        >
                          {/* Team 1 Slot */}
                          <div className={`px-2 py-1 rounded-xl text-xs font-bold flex justify-between items-center transition-colors ${
                            match.team1 
                              ? 'bg-slate-50 text-slate-900 border border-slate-200/90' 
                              : 'bg-slate-50/50 text-slate-400 italic border border-dashed border-slate-200'
                          }`}>
                            <span className="truncate flex items-center gap-1 max-w-[125px]">
                              {match.team1 ? (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                  <span className="text-slate-900 font-extrabold text-[11px] tracking-tight truncate">{match.team1.nama}</span>
                                </>
                              ) : (
                                <span className="text-slate-400 font-normal text-[11px]">
                                  {r === 0 ? (i * 2 + 1 <= count ? `#${i * 2 + 1}` : "BYE") : "Menunggu"}
                                </span>
                              )}
                            </span>
                            {match.team1 && (
                              <span className="text-[9px] font-mono font-extrabold text-amber-800 bg-amber-100 border border-amber-200 px-1 py-0.5 rounded">
                                {match.team1.kategori || "UMUM"}
                              </span>
                            )}
                          </div>

                          {/* Team 2 Slot */}
                          <div className={`px-2 py-1 rounded-xl text-xs font-bold flex justify-between items-center transition-colors ${
                            match.team2 
                              ? 'bg-slate-50 text-slate-900 border border-slate-200/90' 
                              : 'bg-slate-50/50 text-slate-400 italic border border-dashed border-slate-200'
                          }`}>
                            <span className="truncate flex items-center gap-1 max-w-[125px]">
                              {match.team2 ? (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                  <span className="text-slate-900 font-extrabold text-[11px] tracking-tight truncate">{match.team2.nama}</span>
                                </>
                              ) : (
                                <span className="text-slate-400 font-normal text-[11px]">
                                  {r === 0 ? (i * 2 + 2 <= count ? `#${i * 2 + 2}` : "BYE") : "Menunggu"}
                                </span>
                              )}
                            </span>
                            {match.team2 && (
                              <span className="text-[9px] font-mono font-extrabold text-amber-800 bg-amber-100 border border-amber-200 px-1 py-0.5 rounded">
                                {match.team2.kategori || "UMUM"}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {/* GRAND CHAMPION PODIUM */}
              <div className="relative shrink-0" style={{ width: `${colWidth}px`, height: `${totalCanvasHeight}px` }}>
                <div
                  className={`absolute w-full rounded-2xl p-3 border-2 backdrop-blur-xl flex flex-col items-center justify-center text-center gap-2 z-20 ${theme.champBg}`}
                  style={{
                    top: `${yCenters[totalRounds - 1][0] - 70}px`,
                    height: '140px'
                  }}
                >
                  {/* Glowing Crown/Cash Icon with custom scaling and conic border radius animation */}
                  <div className="relative flex items-center justify-center p-[2px] rounded-full overflow-hidden w-11 h-11 shadow-inner">
                    <div 
                      className="absolute -inset-[150%] animate-[spin_4s_linear_infinite]" 
                      style={{
                        background: activeTab === "Mobile Legends"
                          ? "conic-gradient(from 0deg, #f59e0b, #fff, #d97706, #fff, #f59e0b)"
                          : activeTab === "Free Fire"
                          ? "conic-gradient(from 0deg, #dc2626, #fff, #f97316, #fff, #dc2626)"
                          : "conic-gradient(from 0deg, #0284c7, #fff, #2563eb, #fff, #0284c7)"
                      }}
                    />
                    <div 
                      className="relative z-10 w-full h-full rounded-full bg-white flex items-center justify-center shadow-md border border-slate-100"
                      style={{ animation: 'pulse-scale 1.5s infinite alternate ease-in-out' }}
                    >
                      <Crown className={`w-5 h-5 ${
                        activeTab === "Mobile Legends" 
                          ? "text-amber-500" 
                          : activeTab === "Free Fire" 
                          ? "text-red-500" 
                          : "text-cyan-600"
                      } drop-shadow-sm`} />
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] font-mono font-black uppercase tracking-widest text-amber-900 block mb-0.5">
                      JUARA UTAMA
                    </span>
                    <h5 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight uppercase line-clamp-1">
                      {filteredParticipants.length > 0 ? "PEMENANG FINAL" : "BYE"}
                    </h5>
                  </div>

                  <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black tracking-wider uppercase bg-gradient-to-r ${theme.champButton} shadow-sm`}>
                    HADIAH UANG CASH
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      {isFullView && typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 bg-slate-100/90 z-[99999] flex items-center justify-center p-4 sm:p-8 backdrop-blur-2xl transition-all duration-300">
          {/* Conic Animated Border for 16:9 Screen */}
          <div className="relative aspect-[16/9] w-full max-w-[1920px] max-h-[1080px] rounded-[32px] p-[3px] overflow-hidden shadow-[0_0_80px_rgba(245,158,11,0.25)] flex items-center justify-center bg-white border border-slate-200" ref={containerRef}>
            <div className="absolute -inset-[150%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_0deg,#f59e0b,#ef4444,#06b6d4,#10b981,#f59e0b)] opacity-30 blur-[2px]" />

            
            {/* Main Card (esports broadcast mode) - Full Light 4K Theme */}
            <div className="relative w-full h-full bg-white rounded-[30px] p-8 text-slate-900 z-10 flex flex-col justify-between overflow-hidden">
              {/* Soft Background Accent Glow */}
              <div className={`absolute -top-24 -left-24 w-[500px] h-[500px] bg-gradient-to-r ${theme.accentColor} opacity-10 blur-[100px] rounded-full pointer-events-none`} />
              <div className={`absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-gradient-to-r ${theme.accentColor} opacity-10 blur-[100px] rounded-full pointer-events-none`} />

              {/* Header Broadcast style */}
              <div className="flex justify-between items-center relative z-10 border-b border-slate-100 pb-6 mb-4">
                <div className="flex items-center gap-4 text-left">
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border ${theme.badgeBg} text-amber-600 border-amber-200`}>
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    {theme.badge} • <span className="font-extrabold">{theme.matchDate}</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                      <Trophy className="w-6 h-6 text-amber-500 animate-bounce" /> LIVE TOURNAMENT BRACKET
                    </h3>
                    <p className="text-slate-500 text-xs font-semibold">
                      Bagan otomatis dibuat khusus untuk <span className="text-amber-500 font-mono font-bold">{count}</span> peserta terverifikasi (<span className="text-amber-500 font-mono font-bold">{bracketSize} Slot</span>)
                    </p>
                  </div>
                </div>

                {/* Game Selection in Fullscreen */}
                <div className="flex gap-2">
                  {[
                    { name: "Mobile Legends", logo: MLBB_LOGO },
                    { name: "Free Fire", logo: FF_LOGO },
                    { name: "PS 4 Pro FC26", logo: FC26_LOGO }
                  ].map(game => (
                    <button
                      key={game.name}
                      onClick={() => setActiveTab(game.name)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border font-bold text-xs cursor-pointer ${
                        activeTab === game.name
                          ? `bg-slate-900 text-white border-slate-900 shadow-md scale-105`
                          : "bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      <img src={game.logo} alt={game.name} className="h-5 object-contain" />
                    </button>
                  ))}

                  {/* Minimize Icon on top right */}
                  <button 
                    onClick={() => setIsFullView(false)}
                    className="p-3 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl border border-red-200 hover:border-red-500 transition-all cursor-pointer flex items-center justify-center"
                    title="Keluar Layar Penuh (ESC)"
                  >
                    <Minimize2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scaled Bracket Content Area */}
              <div className="flex-1 flex items-center justify-center overflow-hidden relative">
                <div 
                  style={{
                    transform: `scale(${scaleFactor})`,
                    transformOrigin: "center center",
                    transition: "transform 0.2s ease-out",
                    width: `${totalCanvasWidth}px`,
                    height: `${totalCanvasHeight}px`
                  }}
                  className="relative shrink-0 flex justify-center items-center select-none"
                >
                  {/* Matches Columns */}
                  <div className="relative flex" style={{ height: `${totalCanvasHeight}px`, gap: `${colGap}px` }}>
                    {/* SVG lines */}
                    <svg className="absolute inset-0 pointer-events-none w-full h-full z-0 overflow-visible">
                      <defs>
                        <linearGradient id={`bracketGradDark-${activeTab.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={theme.stroke1} />
                          <stop offset="100%" stopColor={theme.stroke2} />
                        </linearGradient>
                      </defs>
                      {/* Connector paths */}
                      {generateConnectorPaths()}
                    </svg>

                    {roundsData.map((roundMatches, r) => {
                      return (
                        <div key={r} className="relative shrink-0" style={{ width: `${colWidth}px`, height: `${totalCanvasHeight}px` }}>
                          {roundMatches.map((match, i) => {
                            const centerY = yCenters[r][i];
                            const topPos = centerY - cardHeight / 2;

                            return (
                              <div
                                key={i}
                                className={`absolute w-full rounded-2xl p-1.5 shadow-md border transition-all duration-300 hover:scale-105 flex flex-col justify-center gap-1 z-10 bg-white border-slate-200`}
                                style={{ top: `${topPos}px`, height: `${cardHeight}px` }}
                              >
                                {/* Team 1 Slot */}
                                <div className={`px-2 py-1 rounded-xl text-xs font-bold flex justify-between items-center transition-colors ${
                                  match.team1 
                                    ? 'bg-slate-50 text-slate-900 border border-slate-200' 
                                    : 'bg-slate-50/50 text-slate-400 italic border border-dashed border-slate-200'
                                }`}>
                                  <span className="truncate flex items-center gap-1 max-w-[125px]">
                                    {match.team1 ? (
                                      <>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                        <span className="text-slate-900 font-extrabold text-[11px] tracking-tight truncate">{match.team1.nama}</span>
                                      </>
                                    ) : (
                                      <span className="text-slate-400 font-normal text-[11px]">
                                        {r === 0 ? (i * 2 + 1 <= count ? `#${i * 2 + 1}` : "BYE") : "Menunggu"}
                                      </span>
                                    )}
                                  </span>
                                  {match.team1 && (
                                    <span className="text-[9px] font-mono font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-1 py-0.5 rounded">
                                      {match.team1.kategori || "UMUM"}
                                    </span>
                                  )}
                                </div>

                                {/* Team 2 Slot */}
                                <div className={`px-2 py-1 rounded-xl text-xs font-bold flex justify-between items-center transition-colors ${
                                  match.team2 
                                    ? 'bg-slate-50 text-slate-900 border border-slate-200' 
                                    : 'bg-slate-50/50 text-slate-400 italic border border-dashed border-slate-200'
                                }`}>
                                  <span className="truncate flex items-center gap-1 max-w-[125px]">
                                    {match.team2 ? (
                                      <>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                        <span className="text-slate-900 font-extrabold text-[11px] tracking-tight truncate">{match.team2.nama}</span>
                                      </>
                                    ) : (
                                      <span className="text-slate-400 font-normal text-[11px]">
                                        {r === 0 ? (i * 2 + 2 <= count ? `#${i * 2 + 2}` : "BYE") : "Menunggu"}
                                      </span>
                                    )}
                                  </span>
                                  {match.team2 && (
                                    <span className="text-[9px] font-mono font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-1 py-0.5 rounded">
                                      {match.team2.kategori || "UMUM"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}

                    {/* Champion Podium */}
                    <div className="relative shrink-0" style={{ width: `${colWidth}px`, height: `${totalCanvasHeight}px` }}>
                      <div
                        className={`absolute w-full rounded-2xl p-3 border border-amber-400 bg-gradient-to-b from-white via-slate-50 to-white flex flex-col items-center justify-center text-center gap-2 z-20`}
                        style={{
                          top: `${yCenters[totalRounds - 1][0] - 70}px`,
                          height: '140px',
                          boxShadow: '0 4px 25px rgba(245, 158, 11, 0.15)'
                        }}
                      >
                        {/* Glowing Crown/Cash Icon with custom scaling and conic border radius animation */}
                        <div className="relative flex items-center justify-center p-[2px] rounded-full overflow-hidden w-11 h-11 shadow-inner">
                          <div 
                            className="absolute -inset-[150%] animate-[spin_4s_linear_infinite]" 
                            style={{
                              background: activeTab === "Mobile Legends"
                                ? "conic-gradient(from 0deg, #f59e0b, #fff, #d97706, #fff, #f59e0b)"
                                : activeTab === "Free Fire"
                                ? "conic-gradient(from 0deg, #dc2626, #fff, #f97316, #fff, #dc2626)"
                                : "conic-gradient(from 0deg, #0284c7, #fff, #2563eb, #fff, #0284c7)"
                            }}
                          />
                          <div 
                            className="relative z-10 w-full h-full rounded-full bg-white flex items-center justify-center shadow-md border border-slate-100"
                            style={{ animation: 'pulse-scale 1.5s infinite alternate ease-in-out' }}
                          >
                            <Crown className={`w-5 h-5 ${
                              activeTab === "Mobile Legends" 
                                ? "text-amber-500" 
                                : activeTab === "Free Fire" 
                                ? "text-red-500" 
                                : "text-cyan-600"
                            } drop-shadow-sm`} />
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] font-mono font-black uppercase tracking-widest text-amber-500 block mb-0.5">
                            JUARA UTAMA
                          </span>
                          <h5 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight uppercase line-clamp-1">
                            {filteredParticipants.length > 0 ? "PEMENANG FINAL" : "BYE"}
                          </h5>
                        </div>

                        <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black tracking-wider uppercase bg-amber-400 text-slate-900 shadow-sm`}>
                          HADIAH UANG CASH
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Broadcast info */}
              <div className="flex justify-between items-center relative z-10 border-t border-slate-200 pt-4 text-[10px] font-mono font-bold tracking-wider text-slate-500">
                <div>OFFICIAL LIVE ESPORTS STREAM OVERLAY • 4K ULTRA QUALITY</div>
                <div className="text-right">PRESS ESC TO CLOSE FULL VIEW</div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </>
  );
}
