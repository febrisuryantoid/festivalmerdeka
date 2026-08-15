import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { ShieldCheck, Trophy, Swords, ChevronsRight, Crown, Sparkles, Award, Flame, Gamepad2, Layers, Maximize2, Minimize2, CheckCircle2, XCircle, Check } from "lucide-react";
import { FC26_LOGO, MLBB_LOGO, FF_LOGO } from "../lib/utils";
import { getLocalRegistrations, mergeRegistrations, RegistrationData, parseTimestampMillis } from "../lib/registrationsStore";
import { FreeFireResponsiveBracket } from "./FreeFireResponsiveBracket";
import { MobileLegendsResponsiveBracket } from "./MobileLegendsResponsiveBracket";
import { FC26ResponsiveBracket } from "./FC26ResponsiveBracket";

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
    team3?: RegistrationData | null;
    winner?: 1 | 2 | 3 | null;
    score1?: string | number;
    score2?: string | number;
    score3?: string | number;
    customLabel?: string;
    matchName?: string;
  }

  // Helper to locate team by name
  const getTeam = (name: string): RegistrationData => {
    const norm = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    const found = filteredParticipants.find(p => {
      const pNorm = (p.nama || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      return pNorm === norm || pNorm.includes(norm) || norm.includes(pNorm);
    });
    if (found) return found;
    return {
      id: `ff_${name.toLowerCase().replace(/\s+/g, "_")}`,
      nama: name,
      players: [],
      anggotaTim: "",
      alamat: "Padasuka",
      wa: "-",
      kategori: name.toLowerCase().includes("ziezan") || name.toLowerCase().includes("desta") || name.toLowerCase().includes("iftah") || name.toLowerCase().includes("nyawit") ? "SD" : "SMP",
      usia: "13",
      lomba: "Free Fire (4 Squad)",
      status: "verified"
    };
  };

  const roundsData: Match[][] = [];
  let roundTitles: string[] = [];

  if (activeTab === "Free Fire" && count === 11) {
    // 11-Team Knockout Tree with Complete Historical Progression:
    // Round 0: Penyisihan (11 Tim: 5 Pertandingan + 1 BYE di awal untuk ZIEZAN)
    // Round 1: Babak 6 Besar (Hasil ZIEZAN vs NYAWIT -> ZIEZAN MENANG, XTC vs KANCIL JAMSHOT -> XTC MENANG, KACUNG PRET vs LEO KACUNG -> KACUNG PRET MENANG)
    // Round 2: Semi-Final 3 Besar / 4 Besar (KACUNG PRET BYE, XTC vs ZIEZAN)
    // Round 3: Grand Final (KACUNG PRET vs Pemenang XTC vs ZIEZAN)
    
    // Round 0: Babak Penyisihan
    const r0: Match[] = [
      {
        team1: getTeam("KACUNG PRET"),
        team2: getTeam("IHAB"),
        winner: 1, // KACUNG PRET Maju
        score1: "MENANG",
        score2: "KALAH",
        matchName: "Match 1 (Penyisihan)"
      },
      {
        team1: getTeam("LEO KACUNG"),
        team2: getTeam("SPRINT"),
        winner: 1, // LEO KACUNG Maju
        score1: "MENANG",
        score2: "KALAH",
        matchName: "Match 2 (Penyisihan)"
      },
      {
        team1: getTeam("XTC"),
        team2: getTeam("DESTA"),
        winner: 1, // XTC Maju
        score1: "MENANG",
        score2: "KALAH",
        matchName: "Match 3 (Penyisihan)"
      },
      {
        team1: getTeam("KANCIL JAMSHOT"),
        team2: getTeam("FF 3"),
        winner: 1, // KANCIL JAMSHOT Maju
        score1: "MENANG",
        score2: "KALAH",
        matchName: "Match 4 (Penyisihan)"
      },
      {
        team1: getTeam("ZIEZAN"),
        team2: null,
        winner: 1, // ZIEZAN BYE di awal
        score1: "BYE",
        customLabel: "BYE di Awal",
        matchName: "Match 5 (BYE di Awal)"
      },
      {
        team1: getTeam("NYAWIT"),
        team2: getTeam("IFTAH"),
        winner: 1, // NYAWIT Maju
        score1: "MENANG",
        score2: "KALAH",
        matchName: "Match 6 (Penyisihan)"
      }
    ];
    roundsData.push(r0);

    // Round 1: Babak 6 Besar (Pertandingan Antara Pemenang Penyisihan)
    roundsData.push([
      {
        team1: getTeam("KACUNG PRET"),
        team2: getTeam("LEO KACUNG"),
        winner: 1, // KACUNG PRET Menang
        score1: "MENANG",
        score2: "KALAH",
        matchName: "6 Besar Match 1"
      },
      {
        team1: getTeam("XTC"),
        team2: getTeam("KANCIL JAMSHOT"),
        winner: 1, // XTC Menang
        score1: "MENANG",
        score2: "KALAH",
        matchName: "6 Besar Match 2"
      },
      {
        team1: getTeam("ZIEZAN"),
        team2: getTeam("NYAWIT"),
        winner: 1, // ZIEZAN Menang lawan NYAWIT
        score1: "MENANG",
        score2: "KALAH",
        matchName: "6 Besar Match 3"
      }
    ]);

    // Round 2: Semi-Final (Kacung Pret BYE & XTC vs ZIEZAN)
    roundsData.push([
      {
        team1: getTeam("KACUNG PRET"),
        team2: null,
        winner: 1, // KACUNG PRET Maju via BYE
        score1: "BYE",
        customLabel: "BYE",
        matchName: "Semi-Final 1 (BYE)"
      },
      {
        team1: getTeam("XTC"),
        team2: getTeam("ZIEZAN"),
        matchName: "Semi-Final 2 (Eliminasi)"
      }
    ]);

    // Round 3: Grand Final Championship
    roundsData.push([
      {
        team1: getTeam("KACUNG PRET"),
        team2: null,
        customLabel: "Pemenang (XTC vs ZIEZAN)",
        matchName: "Grand Final Championship"
      }
    ]);

    roundTitles = [
      "Babak Penyisihan (SELESAI)",
      "Babak 6 Besar (SELESAI)",
      "Semi-Final (3 Besar • BYE)",
      "Grand Final"
    ];
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

    if (prevY.length === 3 && currCount === 2) {
      // 3 to 2 pairing: Match 0 (BYE) aligns with prevY[0], Match 1 aligns with midpoint of prevY[1] and prevY[2]
      currY.push(prevY[0]);
      currY.push((prevY[1] + prevY[2]) / 2);
    } else if (roundsData[r - 1].length === 6 && currCount === 2) {
      // 6 to 2 pairing: Match 0 aligns with midpoint of 0, 1, 2; Match 1 aligns with midpoint of 3, 4, 5
      currY.push((prevY[0] + prevY[2]) / 2);
      currY.push((prevY[3] + prevY[5]) / 2);
    } else if (roundsData[r - 1].length === currCount * 2) {
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

      if (prevY.length === 3 && countNext === 2) {
        // Match 0: Straight horizontal line from Parent 0 to Child 0 (BYE)
        paths.push(
          <path
            key={`r-${r}-m-0-straight`}
            d={`M ${xRight} ${prevY[0]} H ${xLeftNext}`}
            fill="none"
            stroke={`url(#bracketGrad-${activeTab.replace(/\s+/g, '')})`}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.12))" }}
          />
        );

        // Match 1: Fork line connecting Parent 1 & Parent 2 to Child 1
        const pathSF2 = `
          M ${xRight} ${prevY[1]} H ${xMid}
          M ${xRight} ${prevY[2]} H ${xMid}
          M ${xMid} ${prevY[1]} V ${prevY[2]}
          M ${xMid} ${nextY[1]} H ${xLeftNext}
        `;
        paths.push(
          <path
            key={`r-${r}-m-1-fork`}
            d={pathSF2}
            fill="none"
            stroke={`url(#bracketGrad-${activeTab.replace(/\s+/g, '')})`}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.12))" }}
          />
        );
        continue;
      }

      if (prevY.length === 6 && countNext === 2) {
        for (let i = 0; i < 2; i++) {
          const yP0 = prevY[3 * i];
          const yP1 = prevY[3 * i + 1];
          const yP2 = prevY[3 * i + 2];
          const yChild = nextY[i];

          const pathD = `
            M ${xRight} ${yP0} H ${xMid}
            M ${xRight} ${yP1} H ${xMid}
            M ${xRight} ${yP2} H ${xMid}
            M ${xMid} ${yP0} V ${yP2}
            M ${xMid} ${yChild} H ${xLeftNext}
          `;

          paths.push(
            <path
              key={`r-${r}-m-6to2-${i}`}
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
        continue;
      }

      if (prevY.length === 3 && countNext === 1) {
        const yP0 = prevY[0];
        const yP1 = prevY[1];
        const yP2 = prevY[2];
        const yChild = nextY[0];

        const pathD = `
          M ${xRight} ${yP0} H ${xMid}
          M ${xRight} ${yP1} H ${xMid}
          M ${xRight} ${yP2} H ${xMid}
          M ${xMid} ${yP0} V ${yP2}
          M ${xMid} ${yChild} H ${xLeftNext}
        `;

        paths.push(
          <path
            key={`r-${r}-m-3to1`}
            d={pathD}
            fill="none"
            stroke={`url(#bracketGrad-${activeTab.replace(/\s+/g, '')})`}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.12))" }}
          />
        );
        continue;
      }

      for (let i = 0; i < countNext; i++) {
        const yP1 = prevY[2 * i];
        const yP2 = prevY[2 * i + 1];
        const yChild = nextY[i];

        if (yP1 === undefined) continue;

        if (yP2 === undefined) {
          // Single parent line to child
          const pathD = `
            M ${xRight} ${yP1} H ${xLeftNext}
          `;
          paths.push(
            <path
              key={`r-${r}-m-${i}-single`}
              d={pathD}
              fill="none"
              stroke={`url(#bracketGrad-${activeTab.replace(/\s+/g, '')})`}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.12))" }}
            />
          );
          continue;
        }

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
        <div className="relative w-full bg-white rounded-2xl p-3 sm:p-5 text-slate-900 z-10">
          {/* Soft Background Accent Glow */}
          <div className={`absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-r ${theme.accentColor} opacity-5 blur-3xl rounded-full pointer-events-none`} />
          <div className={`absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-r ${theme.accentColor} opacity-5 blur-3xl rounded-full pointer-events-none`} />

          {/* Maximize Button to enter 16:9 full-screen broadcast view */}
          <button 
            onClick={() => setIsFullView(true)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 bg-slate-100 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 text-slate-700 hover:text-white rounded-lg border border-slate-200 hover:border-transparent transition-all duration-300 cursor-pointer flex items-center justify-center z-20 group shadow-xs hover:shadow-sm"
            title="Tampilkan Layar Penuh (16:9)"
          >
            <Maximize2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline ml-1 text-[11px] font-black tracking-wider uppercase">Full View (16:9)</span>
          </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-4 relative z-10">
          <div className="flex flex-col items-center w-full">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-mono font-bold tracking-widest uppercase border mb-1.5 shadow-xs ${theme.badgeBg}`}>
              <Sparkles className="w-3 h-3" />
              {theme.badge} • <span className="text-amber-600 font-extrabold">{theme.matchDate}</span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-black text-slate-900 flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500 drop-shadow-xs" /> Bagan Turnamen Realtime (Terverifikasi)
            </h3>
            <p className="text-slate-600 text-xs font-medium mt-0.5 max-w-xl">
              Bagan resmi turnamen khusus <span className="font-mono font-bold text-slate-900">{count}</span> peserta terverifikasi (<span className="font-mono font-bold text-amber-600">Bagan Sistem Gugur / Knockout</span>).
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
        </div>

        {activeTab === "Free Fire" ? (
          <FreeFireResponsiveBracket />
        ) : activeTab === "Mobile Legends" ? (
          <MobileLegendsResponsiveBracket />
        ) : activeTab === "PS 4 Pro FC26" ? (
          <FC26ResponsiveBracket />
        ) : (
          <>
            {/* Mobile Scroll Indicator */}
            <div className="lg:hidden flex items-center justify-between text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-xl mb-3 animate-pulse">
              <span className="flex items-center gap-1">📱 Tampilan HP: Sentuh & geser bagan ke samping</span>
              <span className="text-amber-600 flex items-center gap-0.5">Geser <ChevronsRight className="w-3.5 h-3.5" /></span>
            </div>

            {/* Bracket Scroll/Desktop Full Width Canvas Area */}
            <div className="overflow-x-auto pb-6 pt-2 w-full scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
              <div 
                className="relative mx-auto px-2"
                style={{ width: `${totalCanvasWidth}px`, minWidth: `${totalCanvasWidth}px` }}
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
                          const is3Besar = match.team3 !== undefined && match.team3 !== null;
                          const actualCardHeight = is3Besar ? 104 : cardHeight;
                          const topPos = centerY - actualCardHeight / 2;

                          return (
                            <div
                              key={i}
                              className={`absolute w-full rounded-2xl p-1.5 shadow-md border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex flex-col justify-center gap-1 z-10 ${
                                isGrandFinal
                                  ? 'bg-gradient-to-r from-amber-50 via-white to-amber-50 border-amber-400 shadow-amber-500/10'
                                  : 'bg-white border-slate-200 hover:border-amber-400'
                              }`}
                              style={{ top: `${topPos}px`, height: `${actualCardHeight}px` }}
                            >
                              {/* Match Tag/Label Header */}
                              {match.matchName && (
                                <div className="flex items-center justify-between px-1 text-[8.5px] font-mono font-bold text-slate-400">
                                  <span>{match.matchName}</span>
                                  {match.winner ? (
                                    <span className="text-emerald-600 font-extrabold flex items-center gap-0.5">
                                      <Check className="w-2.5 h-2.5" /> SELESAI
                                    </span>
                                  ) : null}
                                </div>
                              )}

                              {/* Team 1 Slot */}
                              <div className={`px-2 py-1 rounded-xl text-xs flex justify-between items-center transition-all ${
                                match.team1 
                                  ? match.winner === 1
                                    ? 'bg-emerald-50/90 text-emerald-950 border border-emerald-400 font-black shadow-xs'
                                    : match.winner === 2 || match.winner === 3
                                    ? 'bg-slate-100/70 text-slate-400 border border-slate-200 line-through opacity-70'
                                    : 'bg-slate-50 text-slate-900 border border-slate-200/90 font-extrabold'
                                  : 'bg-slate-50/50 text-slate-400 italic border border-dashed border-slate-200 font-medium'
                              }`}>
                                <span className="truncate flex items-center gap-1 max-w-[72%]">
                                  {match.team1 ? (
                                    <>
                                      {match.winner === 1 ? (
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                      ) : match.winner === 2 || match.winner === 3 ? (
                                        <XCircle className="w-3 h-3 text-rose-400 shrink-0" />
                                      ) : (
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                      )}
                                      <span className="text-[11px] tracking-tight truncate">{match.team1.nama}</span>
                                    </>
                                  ) : (
                                    <span className="text-slate-400 font-normal text-[10.5px]">
                                      {match.customLabel || (r === 0 ? "Peserta Terdaftar" : "Menunggu Pemenang")}
                                    </span>
                                  )}
                                </span>
                                {match.team1 && (
                                  <div className="shrink-0 flex items-center gap-1">
                                    {match.winner === 1 ? (
                                      <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-emerald-500 text-white tracking-wider">
                                        LOLOS
                                      </span>
                                    ) : match.winner === 2 || match.winner === 3 ? (
                                      <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase bg-slate-200 text-slate-500 tracking-wider">
                                        KALAH
                                      </span>
                                    ) : (
                                      <span className="text-[9px] font-mono font-bold text-slate-400">
                                        {match.team1.kategori || "TIM"}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Team 2 Slot */}
                              <div className={`px-2 py-1 rounded-xl text-xs flex justify-between items-center transition-all ${
                                match.team2 
                                  ? match.winner === 2
                                    ? 'bg-emerald-50/90 text-emerald-950 border border-emerald-400 font-black shadow-xs'
                                    : match.winner === 1 || match.winner === 3
                                    ? 'bg-slate-100/70 text-slate-400 border border-slate-200 line-through opacity-70'
                                    : 'bg-slate-50 text-slate-900 border border-slate-200/90 font-extrabold'
                                  : (r === 0 || match.score1 === "BYE" || match.customLabel === "BYE") && !match.team2
                                  ? 'bg-emerald-50/40 text-emerald-800 border border-dashed border-emerald-300 font-medium'
                                  : 'bg-slate-50/50 text-slate-400 italic border border-dashed border-slate-200 font-medium'
                              }`}>
                                <span className="truncate flex items-center gap-1 max-w-[72%]">
                                  {match.team2 ? (
                                    <>
                                      {match.winner === 2 ? (
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                      ) : match.winner === 1 || match.winner === 3 ? (
                                        <XCircle className="w-3 h-3 text-rose-400 shrink-0" />
                                      ) : (
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                      )}
                                      <span className="text-[11px] tracking-tight truncate">{match.team2.nama}</span>
                                    </>
                                  ) : (
                                    <span className="text-slate-400 font-normal text-[10.5px]">
                                      {match.customLabel || (r === 0 || match.score1 === "BYE" ? "BYE • Lolos Otomatis" : "Menunggu Pemenang")}
                                    </span>
                                  )}
                                </span>
                                {match.team2 ? (
                                  <div className="shrink-0 flex items-center gap-1">
                                    {match.winner === 2 ? (
                                      <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-emerald-500 text-white tracking-wider">
                                        LOLOS
                                      </span>
                                    ) : match.winner === 1 || match.winner === 3 ? (
                                      <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase bg-slate-200 text-slate-500 tracking-wider">
                                        KALAH
                                      </span>
                                    ) : (
                                      <span className="text-[9px] font-mono font-bold text-slate-400">
                                        {match.team2.kategori || "TIM"}
                                      </span>
                                    )}
                                  </div>
                                ) : (r === 0 || match.score1 === "BYE" || match.customLabel === "BYE") ? (
                                  <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase bg-emerald-100 text-emerald-800 tracking-wider shrink-0">
                                    BYE
                                  </span>
                                ) : null}
                              </div>

                              {/* Team 3 Slot (for Grand Final 3 Besar) */}
                              {match.team3 && (
                                <div className={`px-2 py-1 rounded-xl text-xs flex justify-between items-center transition-all ${
                                  match.winner === 3
                                    ? 'bg-emerald-50/90 text-emerald-950 border border-emerald-400 font-black shadow-xs'
                                    : match.winner === 1 || match.winner === 2
                                    ? 'bg-slate-100/70 text-slate-400 border border-slate-200 line-through opacity-70'
                                    : 'bg-slate-50 text-slate-900 border border-slate-200/90 font-extrabold'
                                }`}>
                                  <span className="truncate flex items-center gap-1 max-w-[72%]">
                                    {match.winner === 3 ? (
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                    ) : match.winner === 1 || match.winner === 2 ? (
                                      <XCircle className="w-3 h-3 text-rose-400 shrink-0" />
                                    ) : (
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                    )}
                                    <span className="text-[11px] tracking-tight truncate">{match.team3.nama}</span>
                                  </span>
                                  <div className="shrink-0 flex items-center gap-1">
                                    {match.winner === 3 ? (
                                      <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-emerald-500 text-white tracking-wider">
                                        LOLOS
                                      </span>
                                    ) : match.winner === 1 || match.winner === 2 ? (
                                      <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase bg-slate-200 text-slate-500 tracking-wider">
                                        KALAH
                                      </span>
                                    ) : (
                                      <span className="text-[9px] font-mono font-bold text-slate-400">
                                        {match.team3.kategori || "TIM"}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
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
          <div className="flex-1 flex items-center justify-center overflow-auto relative">
            {activeTab === "Free Fire" ? (
              <div className="w-full max-w-6xl mx-auto p-2">
                <FreeFireResponsiveBracket />
              </div>
            ) : activeTab === "Mobile Legends" ? (
              <div className="w-full max-w-6xl mx-auto p-2">
                <MobileLegendsResponsiveBracket />
              </div>
            ) : activeTab === "PS 4 Pro FC26" ? (
              <div className="w-full max-w-6xl mx-auto p-2">
                <FC26ResponsiveBracket />
              </div>
            ) : (
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
                              const is3Besar = match.team3 !== undefined && match.team3 !== null;
                              const actualCardHeight = is3Besar ? 104 : cardHeight;
                              const topPos = centerY - actualCardHeight / 2;

                              return (
                                <div
                                  key={i}
                                  className={`absolute w-full rounded-2xl p-1.5 shadow-md border transition-all duration-300 hover:scale-105 flex flex-col justify-center gap-1 z-10 bg-white border-slate-200`}
                                  style={{ top: `${topPos}px`, height: `${actualCardHeight}px` }}
                                >
                                  {/* Match Tag/Label Header */}
                                  {match.matchName && (
                                    <div className="flex items-center justify-between px-1 text-[8.5px] font-mono font-bold text-slate-400">
                                      <span>{match.matchName}</span>
                                      {match.winner ? (
                                        <span className="text-emerald-600 font-extrabold flex items-center gap-0.5">
                                          <Check className="w-2.5 h-2.5" /> SELESAI
                                        </span>
                                      ) : null}
                                    </div>
                                  )}

                                  {/* Team 1 Slot */}
                                  <div className={`px-2 py-1 rounded-xl text-xs flex justify-between items-center transition-all ${
                                    match.team1 
                                      ? match.winner === 1
                                        ? 'bg-emerald-50/90 text-emerald-950 border border-emerald-400 font-black shadow-xs'
                                        : match.winner === 2 || match.winner === 3
                                        ? 'bg-slate-100/70 text-slate-400 border border-slate-200 line-through opacity-70'
                                        : 'bg-slate-50 text-slate-900 border border-slate-200/90 font-extrabold'
                                      : 'bg-slate-50/50 text-slate-400 italic border border-dashed border-slate-200 font-medium'
                                  }`}>
                                    <span className="truncate flex items-center gap-1 max-w-[72%]">
                                      {match.team1 ? (
                                        <>
                                          {match.winner === 1 ? (
                                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                          ) : match.winner === 2 || match.winner === 3 ? (
                                            <XCircle className="w-3 h-3 text-rose-400 shrink-0" />
                                          ) : (
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                          )}
                                          <span className="text-[11px] tracking-tight truncate">{match.team1.nama}</span>
                                        </>
                                      ) : (
                                        <span className="text-slate-400 font-normal text-[10.5px]">
                                          {match.customLabel || (r === 0 ? "Peserta Terdaftar" : "Menunggu Pemenang")}
                                        </span>
                                      )}
                                    </span>
                                    {match.team1 && (
                                      <div className="shrink-0 flex items-center gap-1">
                                        {match.winner === 1 ? (
                                          <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-emerald-500 text-white tracking-wider">
                                            LOLOS
                                          </span>
                                        ) : match.winner === 2 || match.winner === 3 ? (
                                          <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase bg-slate-200 text-slate-500 tracking-wider">
                                            KALAH
                                          </span>
                                        ) : (
                                          <span className="text-[9px] font-mono font-bold text-slate-400">
                                            {match.team1.kategori || "TIM"}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {/* Team 2 Slot */}
                                  <div className={`px-2 py-1 rounded-xl text-xs flex justify-between items-center transition-all ${
                                    match.team2 
                                      ? match.winner === 2
                                        ? 'bg-emerald-50/90 text-emerald-950 border border-emerald-400 font-black shadow-xs'
                                        : match.winner === 1 || match.winner === 3
                                        ? 'bg-slate-100/70 text-slate-400 border border-slate-200 line-through opacity-70'
                                        : 'bg-slate-50 text-slate-900 border border-slate-200/90 font-extrabold'
                                      : (r === 0 || match.score1 === "BYE" || match.customLabel === "BYE") && !match.team2
                                      ? 'bg-emerald-50/40 text-emerald-800 border border-dashed border-emerald-300 font-medium'
                                      : 'bg-slate-50/50 text-slate-400 italic border border-dashed border-slate-200 font-medium'
                                  }`}>
                                    <span className="truncate flex items-center gap-1 max-w-[72%]">
                                      {match.team2 ? (
                                        <>
                                          {match.winner === 2 ? (
                                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                          ) : match.winner === 1 || match.winner === 3 ? (
                                            <XCircle className="w-3 h-3 text-rose-400 shrink-0" />
                                          ) : (
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                          )}
                                          <span className="text-[11px] tracking-tight truncate">{match.team2.nama}</span>
                                        </>
                                      ) : (
                                        <span className="text-slate-400 font-normal text-[10.5px]">
                                          {match.customLabel || (r === 0 || match.score1 === "BYE" ? "BYE • Lolos Otomatis" : "Menunggu Pemenang")}
                                        </span>
                                      )}
                                    </span>
                                    {match.team2 ? (
                                      <div className="shrink-0 flex items-center gap-1">
                                        {match.winner === 2 ? (
                                          <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-emerald-500 text-white tracking-wider">
                                            LOLOS
                                          </span>
                                        ) : match.winner === 1 || match.winner === 3 ? (
                                          <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase bg-slate-200 text-slate-500 tracking-wider">
                                            KALAH
                                          </span>
                                        ) : (
                                          <span className="text-[9px] font-mono font-bold text-slate-400">
                                            {match.team2.kategori || "TIM"}
                                          </span>
                                        )}
                                      </div>
                                    ) : (r === 0 || match.score1 === "BYE" || match.customLabel === "BYE") ? (
                                      <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase bg-emerald-100 text-emerald-800 tracking-wider shrink-0">
                                        BYE
                                      </span>
                                    ) : null}
                                  </div>

                                  {/* Team 3 Slot (for Grand Final 3 Besar) */}
                                  {match.team3 && (
                                    <div className={`px-2 py-1 rounded-xl text-xs flex justify-between items-center transition-all ${
                                      match.winner === 3
                                        ? 'bg-emerald-50/90 text-emerald-950 border border-emerald-400 font-black shadow-xs'
                                        : match.winner === 1 || match.winner === 2
                                        ? 'bg-slate-100/70 text-slate-400 border border-slate-200 line-through opacity-70'
                                        : 'bg-slate-50 text-slate-900 border border-slate-200/90 font-extrabold'
                                    }`}>
                                      <span className="truncate flex items-center gap-1 max-w-[72%]">
                                        {match.winner === 3 ? (
                                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                        ) : match.winner === 1 || match.winner === 2 ? (
                                          <XCircle className="w-3 h-3 text-rose-400 shrink-0" />
                                        ) : (
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                        )}
                                        <span className="text-[11px] tracking-tight truncate">{match.team3.nama}</span>
                                      </span>
                                      <div className="shrink-0 flex items-center gap-1">
                                        {match.winner === 3 ? (
                                          <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-emerald-500 text-white tracking-wider">
                                            LOLOS
                                          </span>
                                        ) : match.winner === 1 || match.winner === 2 ? (
                                          <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase bg-slate-200 text-slate-500 tracking-wider">
                                            KALAH
                                          </span>
                                        ) : (
                                          <span className="text-[9px] font-mono font-bold text-slate-400">
                                            {match.team3.kategori || "TIM"}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  )}
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
            )}
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
