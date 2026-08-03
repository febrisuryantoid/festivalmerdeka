import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const MLBB_LOGO = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjNn2Y7sUjG_Sw8Rd52cR5wE6-g24ewtKE3HhtFKgcmyxuTUte_Mrkv2PQ3xnMbYQJHYydJsqoSH5wpUSIjjR1RoYvxPl2SyppC916DPclvc0w7G92DZ6_9VIyVZHCPMhvJJPDAoQitnC732lwLgz0v5hLJTNaEncD96uB7mvjN7n2vfATvecYp6y7Zx1Y/s1600/MLBB.png";
export const FF_LOGO = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjjAzWUsaCw74D55yMT4zwK0S5t4iXWFxPbdkE-XoXdNoXhiHd_jCBVP71K1zd3oUQQlEqk5o8rwNbWGqKPGG3HiYMv8ynG9sA2VpGzKB_VJUhpZ8hi3Mxv3r0tBQUiRCxGNI4oRDkBeXbxUYuShaHMKyC8PkHT91Mcpe6d7fC1NfAGUEZnEEcXpqwFvBo/s1600/FF.png";
export const FC26_LOGO = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi8ZVPJmkRedRSiMEVunGklTkAgIvhZP1Iyb3ziIwSRe6eG7tbDVfRt0Ub1uRCw0baYk7VB6PNtyKRKMZIvXRee2QAzt4Wh30TuwsJsG-NFlc0Y4YizPxTDlgFMimTGRoZsuIsdd_kJKPENDaHWImTHu_eEggIZ_Vr_K4QbryK79Pvk9rIvboJoQjk62Yo/s1600/FC26.png";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Capitalizes the first letter of each word for participant names (Title Case)
 * e.g., "budi santoso" -> "Budi Santoso", "FAJAR RAMADHAN" -> "Fajar Ramadhan"
 */
export function formatParticipantName(str: string): string {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => {
      if (!word) return "";
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * Converts team / squad name to UPPERCASE automatically
 * e.g., "evos legends" -> "EVOS LEGENDS"
 */
export function formatTeamName(str: string): string {
  if (!str) return "";
  return str.toUpperCase();
}

export const getPricingConfig = () => {
  return [
    { label: "Kategori Pemuda Karang Taruna Desa Padasuka", price: 10000 },
    { label: "Kategori Umum", price: 15000 },
    { label: "Kategori SD", price: 5000 },
    { label: "Kategori SMP", price: 8000 },
    { label: "Kategori SMA / SMK", price: 10000 },
    { label: "SD", price: 5000 },
    { label: "SMP", price: 8000 },
    { label: "SMA / SMK", price: 10000 },
    { label: "UMUM", price: 15000 },
  ];
};

export const SLOT_TARGETS = {
  mlbb: {
    id: "mlbb",
    name: "Mobile Legends: Bang Bang",
    shortName: "MLBB",
    logo: MLBB_LOGO,
    targetParticipants: 200, // 200 Peserta (40 Tim)
    teamSize: 5,
    targetUnits: 40,
    unitName: "Tim",
    minPrizePoolRatio: 0.60, // Minimum 60%
    categories: [
      { level: "SD", juara1Base: 150000, juara2Base: 75000 },
      { level: "SMP", juara1Base: 250000, juara2Base: 100000 },
      { level: "SMA", juara1Base: 350000, juara2Base: 150000 },
      { level: "Umum", juara1Base: 500000, juara2Base: 250000 },
    ],
  },
  ff: {
    id: "ff",
    name: "Free Fire",
    shortName: "Free Fire",
    logo: FF_LOGO,
    targetParticipants: 200, // 200 Peserta (50 Squad)
    teamSize: 4,
    targetUnits: 50,
    unitName: "Squad",
    minPrizePoolRatio: 0.60, // Minimum 60%
    categories: [
      { level: "SD", juara1Base: 120000, juara2Base: 60000 },
      { level: "SMP", juara1Base: 200000, juara2Base: 100000 },
      { level: "SMA", juara1Base: 250000, juara2Base: 125000 },
      { level: "Umum", juara1Base: 400000, juara2Base: 200000 },
    ],
  },
  fc: {
    id: "fc",
    name: "EA SPORTS FC26",
    shortName: "FC26",
    logo: FC26_LOGO,
    targetParticipants: 50, // 50 Peserta
    teamSize: 1,
    targetUnits: 50,
    unitName: "Peserta",
    minPrizePoolRatio: 0.60, // Minimum 60%
    categories: [
      { level: "SD", juara1Base: 30000, juara2Base: 15000 },
      { level: "SMP", juara1Base: 50000, juara2Base: 25000 },
      { level: "SMA", juara1Base: 75000, juara2Base: 35000 },
      { level: "Umum", juara1Base: 100000, juara2Base: 50000 },
    ],
  }
};

function roundMoney(amount: number, step = 5000): number {
  return Math.round(amount / step) * step;
}

/**
 * Algoritma Penyesuaian Hadiah Otomatis (Dynamic Target Prize Algorithm)
 * Menghitung hadiah secara transparan berdasarkan data Juara 1 dan Juara 2 original.
 */
export function calculateDynamicPrize(
  gameKey: 'mlbb' | 'ff' | 'fc',
  actualParticipants: number,
  roundStep = 5000
) {
  const config = SLOT_TARGETS[gameKey];
  if (!config) {
    return {
      ratioPercent: 100,
      badgeText: "Target Tercapai",
      badgeType: "green" as const,
      indicatorColor: "bg-emerald-500",
      indicatorText: "text-emerald-600",
      actualParticipants: 0,
      targetParticipants: 1,
      basePrizePool: 0,
      minPrizePool: 0,
      adjustedPrizePool: 0,
      isMinFloorActive: false,
      isBonusActive: false,
      juara1: 0,
      juara2: 0,
      diffAmount: 0,
      categoryPrizes: [],
      unitName: "Peserta",
      targetUnits: 1,
      actualUnits: 0,
    };
  }

  // Hitung total base prize pool dari jumlah Juara 1 & Juara 2 baseline (100% target)
  const basePrizePool = config.categories.reduce(
    (sum, cat) => sum + cat.juara1Base + cat.juara2Base,
    0
  );

  const rawRatio = actualParticipants / config.targetParticipants;
  const ratioPercent = Math.round(rawRatio * 100);

  // Minimum ratio threshold (60%)
  const minRatio = config.minPrizePoolRatio || 0.60;
  const minPrizePool = roundMoney(basePrizePool * minRatio, roundStep);

  // Baseline multiplier: tidak boleh turun di bawah 1.0 (100% Baseline Minimum)
  // Ketika peserta melebihi target (> 100%), multiplier naik secara proporsional.
  const effectiveRatio = Math.max(1.0, rawRatio);

  const isBonusActive = rawRatio > 1.0;

  // Status Badge & Color Indicators
  let badgeText = "Target Belum Tercapai (Hadiah Awal 100%)";
  let badgeType: "red" | "yellow" | "green" = "yellow";
  let indicatorColor = "bg-amber-500";
  let indicatorText = "text-amber-600";

  if (ratioPercent >= 100) {
    badgeType = "green";
    badgeText = isBonusActive ? `Bonus Prize Pool Aktif (+${Math.round((rawRatio - 1) * 100)}%)` : "Target Tercapai (100%)";
    indicatorColor = "bg-emerald-500";
    indicatorText = "text-emerald-600";
  }

  // Calculate dynamic prizes per category based on original baseline Juara 1 & Juara 2
  const categoryPrizes = config.categories.map((cat) => {
    const j1 = roundMoney(cat.juara1Base * effectiveRatio, roundStep);
    const j2 = roundMoney(cat.juara2Base * effectiveRatio, roundStep);
    return {
      level: cat.level,
      juara1: j1,
      juara2: j2,
      juara1Formatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(j1),
      juara2Formatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(j2),
    };
  });

  // Calculate accumulated adjusted prize pool from sum of category prizes
  const adjustedPrizePool = categoryPrizes.reduce(
    (sum, cat) => sum + cat.juara1 + cat.juara2,
    0
  );

  const diffAmount = adjustedPrizePool - basePrizePool;

  // Total Juara 1 & Total Juara 2 overall
  const juara1Total = categoryPrizes.reduce((sum, cat) => sum + cat.juara1, 0);
  const juara2Total = categoryPrizes.reduce((sum, cat) => sum + cat.juara2, 0);

  return {
    ratioPercent,
    badgeText,
    badgeType,
    indicatorColor,
    indicatorText,
    rawRatio,
    actualParticipants,
    targetParticipants: config.targetParticipants,
    basePrizePool,
    minPrizePool,
    adjustedPrizePool,
    isMinFloorActive: rawRatio < 1.0,
    isBonusActive,
    juara1: juara1Total,
    juara2: juara2Total,
    diffAmount,
    categoryPrizes,
    unitName: config.unitName,
    targetUnits: config.targetUnits,
    actualUnits: Math.ceil(actualParticipants / config.teamSize),
  };
}
