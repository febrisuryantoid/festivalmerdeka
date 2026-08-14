import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { ShieldCheck, Trophy, Swords, ChevronsRight, Crown, Sparkles, Award, Flame, Gamepad2, Layers, Maximize2, Minimize2 } from "lucide-react";
import { FC26_LOGO, MLBB_LOGO, FF_LOGO } from "../lib/utils";
import { getLocalRegistrations, mergeRegistrations, RegistrationData, parseTimestampMillis } from "../lib/registrationsStore";

export function TournamentBracket() {
  const [bracketSeeds, setBracketSeeds] = useState<Record<string, string[]>>({});
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
    import("firebase/firestore").then(({ doc, onSnapshot }) => {
      const unsubSeeds = onSnapshot(doc(db, "settings", "bracketSeeds"), (docSnap) => {
        if (docSnap.exists()) {
          setBracketSeeds(docSnap.data());
        }
      }, (err) => {
        console.warn("Bracket seeds realtime fetch failed:", err);
      });
      return unsubSeeds;
    });
  }, []);

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

  const customOrder = bracketSeeds[activeTab] || [];

  const filteredParticipants = participants.filter(p => {
    if ((p.status || "").toLowerCase().trim() !== "verified") return false;
    const l = (p.lomba || "").toLowerCase();
    if (activeTab === "Mobile Legends" && (l.includes("mobile") || l.includes("ml") || l.includes("legend"))) return true;
    if (activeTab === "Free Fire" && (l.includes("free") || l.includes("fire") || l.includes("ff"))) return true;
    if (activeTab === "PS 4 Pro FC26" && (l.includes("fc") || l.includes("ps") || l.includes("ea") || l.includes("fifa"))) return true;
    return false;
  }).sort((a, b) => {
    // If admin custom order is set, prioritize it
    if (customOrder.length > 0) {
      const idxA = customOrder.indexOf(a.id || a.localId || "");
      const idxB = customOrder.indexOf(b.id || b.localId || "");
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
    }

    // Default sorting:
    // When there is a BYE for SD in Free Fire, ensure the SD team (ZIEZAN / IFTAH / NYAWIT) receives the designated BYE seed slot
    const isZieA = (a.nama || "").toLowerCase() === "ziezan";
    const isZieB = (b.nama || "").toLowerCase() === "ziezan";
    if (isZieA && !isZieB) return -1;
    if (!isZieA && isZieB) return 1;

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

  const [ffViewMode, setFfViewMode] = useState<"bracket" | "room">("bracket");

  // Calculate bracket dimensions dynamically
  const count = filteredParticipants.length;

  interface Match {
    team1: RegistrationData | null;
    team2: RegistrationData | null;
    customLabel?: string;
  }

  const roundsData: Match[][] = [];
  let roundTitles: string[] = [];

  if (activeTab === "Free Fire" && count === 11) {
    // 11-Team Knockout Tree with exactly 1 BYE for an SD team (e.g. ZIEZAN / Tim SD)
    // Find an SD team to grant the direct BYE pass to the Semifinals/Quarterfinals
    const sdTeam = filteredParticipants.find(p => (p.kategori || "").toUpperCase() === "SD") || filteredParticipants[0];
    const otherTeams = filteredParticipants.filter(p => p !== sdTeam);

    // Round 0: 5 matches for 10 teams, plus 1 BYE match for the SD team
    const r0: Match[] = [
      { team1: sdTeam, team2: null, customLabel: "BYE (Lolos Otomatis Tim SD)" }
    ];
    for (let i = 0; i < otherTeams.length; i += 2) {
      r0.push({
        team1: otherTeams[i] || null,
        team2: otherTeams[i + 1] || null
      });
    }
    roundsData.push(r0);

    // Round 1: 6 Besar (SD team auto advances + 5 winners)
    roundsData.push([
      { team1: sdTeam, team2: null, customLabel: `${sdTeam?.nama || "Tim SD"} vs Pemenang M2` },
      { team1: null, team2: null, customLabel: "Pemenang M3 vs M4" },
      { team1: null, team2: null, customLabel: "Pemenang M5 vs M6" }
    ]);

    // Round 2: Grand Final Showdown (3 Besar Finalis)
    roundsData.push([
      { team1: null, team2: null, customLabel: "Grand Final 3 Besar" }
    ]);

    roundTitles = ["Babak Penyisihan (5 Match + 1 BYE SD)", "Semi-Final (6 Besar)", "Grand Final"];
  } else if (activeTab === "Free Fire" && count >= 12) {
    // 12-Team Custom Knockout Tree (No BYEs)
    const r0: Match[] = [];
    for (let i = 0; i < count; i += 2) {
      r0.push({
        team1: filteredParticipants[i] || null,
        team2: filteredParticipants[i + 1] || null
      });
    }
    roundsData.push(r0);

    roundsData.push([
      { team1: null, team2: null, customLabel: "Pemenang M1 vs M2" },
      { team1: null, team2: null, customLabel: "Pemenang M3 vs M4" },
      { team1: null, team2: null, customLabel: "Pemenang M5 vs M6" }
    ]);

    roundsData.push([
      { team1: null, team2: null, customLabel: "Grand Final 3 Besar" }
    ]);

    roundTitles = ["Babak Penyisihan (6 Match)", "Semi-Final (6 Besar)", "Grand Final"];
  } else if (activeTab === "Mobile Legends" && count === 6) {
    // 6-Team Knockout Tree (No BYEs!)
    const r0: Match[] = [];
    for (let i = 0; i < count; i += 2) {
      r0.push({
        team1: filteredParticipants[i] || null,
        team2: filteredParticipants[i + 1] || null
      });
    }
    roundsData.push(r0);

    // Round 1: Semifinals (2 Matches)
    roundsData.push([
      { team1: null, team2: null, customLabel: "Pemenang M1 vs M2" },
      { team1: null, team2: null, customLabel: "Pemenang M3 vs Playoff" }
    ]);

    // Round 2: Grand Final
    roundsData.push([
      { team1: null, team2: null, customLabel: "Finalis 1 vs Finalis 2" }
    ]);

    roundTitles = ["Babak Penyisihan (3 Match)", "Semi-Final", "Grand Final"];
  } else if (count <= 4) {
    // 4-Team Knockout Tree
    const r0: Match[] = [];
    for (let i = 0; i < Math.max(2, count); i += 2) {
      r0.push({
        team1: filteredParticipants[i] || null,
        team2: filteredParticipants[i + 1] || null
      });
    }
    roundsData.push(r0);

    // Grand Final
    roundsData.push([
      { team1: null, team2: null, customLabel: "Pemenang SF1 vs SF2" }
    ]);

    roundTitles = ["Semi-Final", "Grand Final"];
  } else {
    // Standard Power of 2 tree
    const bracketSize = Math.pow(2, Math.ceil(Math.log2(Math.max(2, count))));
    const totalR = Math.log2(bracketSize);

    const getStandardSeeds = (size: number): number[] => {
      let seeds = [1];
      while (seeds.length < size) {
        const nextLength = seeds.length * 2;
        const nextSeeds: number[] = [];
        for (let i = 0; i < seeds.length; i++) {
          nextSeeds.push(seeds[i]);
          nextSeeds.push(nextLength + 1 - seeds[i]);
        }
        seeds = nextSeeds;
      }
      return seeds;
    };

    const seeds = getStandardSeeds(bracketSize);
    const initialSlots = seeds.map(seed => {
      const playerIndex = seed - 1;
      return playerIndex < count ? filteredParticipants[playerIndex] : null;
    });

    const round0: Match[] = [];
    for (let i = 0; i < bracketSize; i += 2) {
      round0.push({
        team1: initialSlots[i],
        team2: initialSlots[i + 1]
      });
    }
    roundsData.push(round0);

    for (let r = 1; r < totalR; r++) {
      const prevRound = roundsData[r - 1];
      const roundMatches: Match[] = [];
      for (let i = 0; i < prevRound.length; i += 2) {
        roundMatches.push({
          team1: null,
          team2: null
        });
      }
      roundsData.push(roundMatches);
    }

    roundTitles = roundsData.map((_, r) => {
      if (r === roundsData.length - 1) return "Grand Final";
      if (r === roundsData.length - 2) return "Semi Finals";
      if (r === roundsData.length - 3) return "Quarter Finals";
      return "Penyisihan";
    });
  }

  const totalRounds = roundsData.length;

  // Calculate dynamic column width & gap based on total rounds so bracket fits desktop without scroll
  const numCols = totalRounds + 1;
  let colWidth = 180;
  let colGap = 36;

  if (numCols <= 3) {
    colWidth = 200;
    colGap = 44;
  } else if (numCols === 4) {
    colWidth = 180;
    colGap = 36;
  } else if (numCols >= 5) {
    colWidth = 160;
    colGap = 28;
  }

  const cardHeight = 72; // px match card height
  const baseGap = 24;   // px gap between round 0 cards

  const computedHeight = roundsData[0].length * (cardHeight + baseGap);
  const totalCanvasHeight = Math.max(540, computedHeight);
  const verticalOffset = Math.max(0, (totalCanvasHeight - computedHeight) / 2);

  // Calculate Y centers for every match in every round
  const yCenters: number[][] = [];
  
  // Round 0 Y centers
  const round0Y: number[] = [];
  for (let i = 0; i < roundsData[0].length; i++) {
    round0Y.push(verticalOffset + i * (cardHeight + baseGap) + cardHeight / 2);
  }
  yCenters.push(round0Y);

  // Subsequent rounds Y centers
  for (let r = 1; r < totalRounds; r++) {
    const prevY = yCenters[r - 1];
    const currCount = roundsData[r].length;
    const currY: number[] = [];

    if (roundsData[r - 1].length === currCount * 2) {
      // Standard 2 to 1 parent pairing
      for (let i = 0; i < currCount; i++) {
        const p1 = prevY[2 * i];
        const p2 = prevY[2 * i + 1];
        currY.push((p1 + p2) / 2);
      }
    } else if (currCount === 1) {
      // Single match (Grand Final) centered among all parents
      const firstY = prevY[0];
      const lastY = prevY[prevY.length - 1];
      currY.push((firstY + lastY) / 2);
    } else {
      // Proportional spacing
      const step = totalCanvasHeight / (currCount + 1);
      for (let i = 0; i < currCount; i++) {
        currY.push(step * (i + 1));
      }
    }
    yCenters.push(currY);
  }

  // Game-specific theme config (Clean Light Theme)
  const getThemeConfig = () => {
    if (activeTab === "Mobile Legends") {
      return {
        badge: "MLBB SQUAD",
        matchDate: "15 AGU • 20.00 WIB",
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
        const containerWidth = containerRef.current.clientWidth - 32;
        const containerHeight = containerRef.current.clientHeight - 120;
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
              Bagan otomatis dibuat khusus untuk <span className="font-mono font-bold text-slate-900">{count}</span> peserta terverifikasi (<span className="font-mono font-bold text-amber-600">{count} Tim • {activeTab === "Free Fire" && count === 11 ? "5 Match + 1 BYE Kategori SD" : "Sistem Pertandingan Langsung"}</span>).
            </p>
          </div>

          {/* Tab Selection with Active Full White & Animated Conic Border Radius */}
          <div className="flex justify-center flex-wrap mx-auto bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/90 w-full sm:w-max gap-2 shadow-inner">
            {[
              { name: "Mobile Legends", key: "Mobile Legends", logo: MLBB_LOGO, count: participants.filter(p => p.status === "verified" && ((p.lomba||"").toLowerCase().includes("mobile") || (p.lomba||"").toLowerCase().includes("ml"))).length },
              { name: "Free Fire", key: "Free Fire", logo: FF_LOGO, count: participants.filter(p => p.status === "verified" && ((p.lomba||"").toLowerCase().includes("free") || (p.lomba||"").toLowerCase().includes("ff"))).length },
              { name: "PS 4 Pro FC26", key: "PS 4 Pro FC26", logo: FC26_LOGO, count: participants.filter(p => p.status === "verified" && ((p.lomba||"").toLowerCase().includes("fc") || (p.lomba||"").toLowerCase().includes("ps"))).length }
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

          {/* Sub-view toggle for Free Fire (Knockout Bracket vs Battle Royale 12 Slot Room) */}
          {activeTab === "Free Fire" && (
            <div className="flex items-center justify-center gap-2 mt-1">
              <button
                onClick={() => setFfViewMode("bracket")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                  ffViewMode === "bracket"
                    ? "bg-red-600 text-white shadow-red-500/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Swords className="w-3.5 h-3.5" />
                Bagan Knockout ({count === 11 ? "5 Match + 1 BYE SD" : "Knockout Bracket"})
              </button>
              <button
                onClick={() => setFfViewMode("room")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                  ffViewMode === "room"
                    ? "bg-red-600 text-white shadow-red-500/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Room Battle Royale ({count} Slot Tim)
              </button>
            </div>
          )}
        </div>

        {/* Free Fire 12 Slot Battle Royale Custom Room View */}
        {activeTab === "Free Fire" && ffViewMode === "room" ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-transparent p-4 sm:p-6 rounded-2xl border border-red-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-red-600 block mb-1">
                    FORMAT RESMI FREE FIRE BATTLE ROYALE (4 SQUAD)
                  </span>
                  <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-red-500" /> Lobby Room ({count} Tim Bertanding Bersama)
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Semua {count} Tim bertanding secara bersamaan dalam 1 Room Custom Battle Royale.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-mono font-bold">
                  <span className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-slate-700 shadow-sm">
                    🗺️ Match 1: Bermuda (20.00)
                  </span>
                  <span className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-slate-700 shadow-sm">
                    🗺️ Match 2: Purgatory (20.30)
                  </span>
                  <span className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-slate-700 shadow-sm">
                    🗺️ Match 3: Kalahari (21.00)
                  </span>
                </div>
              </div>
            </div>

            {/* 12 Slot Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {filteredParticipants.map((team, idx) => (
                <div 
                  key={team.id || idx}
                  className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-red-400 hover:shadow-md transition-all relative overflow-hidden group shadow-sm flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-red-50 text-red-600 font-mono font-black text-xs flex items-center justify-center border border-red-200 group-hover:bg-red-600 group-hover:text-white transition-colors">
                        #{idx + 1}
                      </span>
                      <div>
                        <h5 className="font-extrabold text-slate-900 text-sm tracking-tight line-clamp-1">
                          {team.nama}
                        </h5>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          📍 {team.alamat || "Padasuka"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {team.kategori || "UMUM"}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Usia: <b>{team.usia || "-"} th</b></span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> TERVERIFIKASI
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Point Scoring System Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" /> Sistem Poin Resmi Battle Royale:
              </div>
              <p className="leading-relaxed">
                Juara 1 (Booyah): <b>12 Poin</b> • Juara 2: <b>9 Poin</b> • Juara 3: <b>8 Poin</b> • Juara 4: <b>7 Poin</b> • Juara 5: <b>6 Poin</b> • Juara 6: <b>5 Poin</b> • Juara 7: <b>4 Poin</b> • Juara 8: <b>3 Poin</b> • Juara 9: <b>2 Poin</b> • Juara 10: <b>1 Poin</b> • Juara 11-12: <b>0 Poin</b> (+ <b>1 Poin per Kill</b>).
              </p>
            </div>
          </div>
        ) : (
          <>
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
                    const roundTitle = roundTitles[r] || (isGrandFinal ? "Grand Final" : `Babak ${r + 1}`);

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
                                <span className="truncate flex items-center gap-1 max-w-full">
                                  {match.team1 ? (
                                    <>
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                      <span className="text-slate-900 font-extrabold text-[11px] tracking-tight truncate">{match.team1.nama}</span>
                                    </>
                                  ) : (
                                    <span className="text-slate-400 font-normal text-[11px]">
                                      {match.customLabel || (r === 0 ? "Peserta Terdaftar" : "Menunggu Pemenang")}
                                    </span>
                                  )}
                                </span>
                              </div>

                              {/* Team 2 Slot */}
                              <div className={`px-2 py-1 rounded-xl text-xs font-bold flex justify-between items-center transition-colors ${
                                match.team2 
                                  ? 'bg-slate-50 text-slate-900 border border-slate-200/90' 
                                  : 'bg-slate-50/50 text-slate-400 italic border border-dashed border-slate-200'
                              }`}>
                                <span className="truncate flex items-center gap-1 max-w-full">
                                  {match.team2 ? (
                                    <>
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                      <span className="text-slate-900 font-extrabold text-[11px] tracking-tight truncate">{match.team2.nama}</span>
                                    </>
                                  ) : (
                                    <span className="text-slate-400 font-normal text-[11px]">
                                      {match.customLabel || (r === 0 ? "Peserta Terdaftar" : "Menunggu Pemenang")}
                                    </span>
                                  )}
                                </span>
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
                          {filteredParticipants.length > 0 ? "PEMENANG FINAL" : "TBD"}
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
          </>
        )}
      </div>
    </div>

      {isFullView && typeof document !== 'undefined' ? createPortal(
        <div 
          className="fixed inset-0 bg-white z-[99999] flex flex-col overflow-hidden transition-all duration-300" 
          ref={containerRef}
        >
          {/* Soft Background Accent Glow */}
          <div className={`absolute -top-48 -left-48 w-[800px] h-[800px] bg-gradient-to-r ${theme.accentColor} opacity-5 blur-[120px] rounded-full pointer-events-none`} />
          <div className={`absolute -bottom-48 -right-48 w-[800px] h-[800px] bg-gradient-to-r ${theme.accentColor} opacity-5 blur-[120px] rounded-full pointer-events-none`} />

          {/* Header Broadcast style & Tabs (Same layout as normal view) */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4 p-4 sm:p-6 border-b border-slate-100 bg-white/80 backdrop-blur-md">
            
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border ${theme.badgeBg} text-amber-600 border-amber-200`}>
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                {theme.badge} • <span className="font-extrabold">{theme.matchDate}</span>
              </div>
              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight justify-center sm:justify-start">
                  <Trophy className="w-6 h-6 text-amber-500" /> LIVE TOURNAMENT BRACKET
                </h3>
              </div>
            </div>

            {/* Game Selection in Fullscreen - Identical Layout to Normal View */}
            <div className="flex items-center gap-4">
              <div className="flex justify-center flex-wrap bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/90 gap-2 shadow-inner">
                {[
                  { name: "Mobile Legends", key: "Mobile Legends", logo: MLBB_LOGO, count: participants.filter(p => p.status === "verified" && ((p.lomba||"").toLowerCase().includes("mobile") || (p.lomba||"").toLowerCase().includes("ml"))).length },
                  { name: "Free Fire", key: "Free Fire", logo: FF_LOGO, count: participants.filter(p => p.status === "verified" && ((p.lomba||"").toLowerCase().includes("free") || (p.lomba||"").toLowerCase().includes("ff"))).length },
                  { name: "PS 4 Pro FC26", key: "PS 4 Pro FC26", logo: FC26_LOGO, count: participants.filter(p => p.status === "verified" && ((p.lomba||"").toLowerCase().includes("fc") || (p.lomba||"").toLowerCase().includes("ps"))).length }
                ].map(game => {
                  const isActive = activeTab === game.key;
                  return isActive ? (
                    <div key={game.name} className="relative p-[2px] rounded-xl overflow-hidden shadow-md">
                      <div className="absolute -inset-[150%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,#f59e0b,#ef4444,#06b6d4,#10b981,#f59e0b)]" />
                      <button
                        onClick={() => setActiveTab(game.key)}
                        className="relative z-10 bg-white text-slate-900 font-extrabold px-3.5 py-2 rounded-[10px] flex items-center gap-2.5 cursor-pointer"
                      >
                        <div className="w-8 sm:w-12 aspect-[2/1] flex items-center justify-center">
                          <img src={game.logo} alt={game.name} className="h-full max-w-full object-contain drop-shadow-sm" />
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
                      <div className="w-8 sm:w-12 aspect-[2/1] flex items-center justify-center">
                        <img src={game.logo} alt={game.name} className="h-full max-w-full object-contain drop-shadow-sm opacity-70 hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {game.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Minimize Icon on top right */}
              <button 
                onClick={() => setIsFullView(false)}
                className="p-3 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl border border-red-200 hover:border-red-500 transition-all cursor-pointer flex items-center justify-center shadow-sm"
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
                                  <span className="truncate flex items-center gap-1 max-w-full">
                                    {match.team1 ? (
                                      <>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                        <span className="text-slate-900 font-extrabold text-[11px] tracking-tight truncate">{match.team1.nama}</span>
                                      </>
                                    ) : (
                                      <span className="text-slate-400 font-normal text-[11px]">
                                        {match.customLabel || (r === 0 ? "Peserta Terdaftar" : "Menunggu Pemenang")}
                                      </span>
                                    )}
                                  </span>
                                </div>

                                {/* Team 2 Slot */}
                                <div className={`px-2 py-1 rounded-xl text-xs font-bold flex justify-between items-center transition-colors ${
                                  match.team2 
                                    ? 'bg-slate-50 text-slate-900 border border-slate-200' 
                                    : 'bg-slate-50/50 text-slate-400 italic border border-dashed border-slate-200'
                                }`}>
                                  <span className="truncate flex items-center gap-1 max-w-full">
                                    {match.team2 ? (
                                      <>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                        <span className="text-slate-900 font-extrabold text-[11px] tracking-tight truncate">{match.team2.nama}</span>
                                      </>
                                    ) : (
                                      <span className="text-slate-400 font-normal text-[11px]">
                                        {match.customLabel || (r === 0 ? "Peserta Terdaftar" : "Menunggu Pemenang")}
                                      </span>
                                    )}
                                  </span>
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
              <div className="flex justify-between items-center relative z-10 border-t border-slate-200 p-4 sm:px-6 text-[10px] font-mono font-bold tracking-wider text-slate-500 bg-white">
                <div>OFFICIAL LIVE ESPORTS STREAM OVERLAY • 4K ULTRA QUALITY</div>
                <div className="text-right">PRESS ESC TO CLOSE FULL VIEW</div>
              </div>
        </div>,
        document.body
      ) : null}
    </>
  );
}
