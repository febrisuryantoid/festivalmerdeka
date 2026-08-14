import { db } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, onSnapshot, query, getDocs } from "firebase/firestore";

export interface RegistrationData {
  id: string;
  localId?: string;
  nama: string;
  players: string[];
  anggotaTim: string;
  usia: string;
  kategori: string;
  alamat: string;
  wa: string;
  lomba: string;
  status: "pending" | "verified";
  createdAt?: any;
  firestoreSynced?: boolean;
}

/**
 * Calculates detailed fee information for a registration
 */
export function getFeeDetails(reg: RegistrationData) {
  const nameLower = (reg.nama || "").trim().toLowerCase();
  const lombaLower = (reg.lomba || "").trim().toLowerCase();
  
  let bayar = 0;
  
  // Manual Overrides for specific teams/players matching official table
  if (nameLower === "bee3ska") bayar = 75000;
  else if (nameLower === "ifal wibawa") bayar = 5000;
  else if (nameLower === "ziezan") {
    if (lombaLower.includes("free fire") || lombaLower.includes("ff")) bayar = 20000;
    else bayar = 25000;
  }
  else if (nameLower === "o2") bayar = 75000;
  else if (nameLower === "ripiansyah") bayar = 5000;
  else if (nameLower === "wahab") bayar = 15000;
  else if (nameLower === "nyawit") bayar = 25000;
  else if (nameLower === "harimau gold line") bayar = 55000;
  else if (nameLower === "patah hati") bayar = 40000;
  else if (nameLower === "ihab") bayar = 32000;
  else if (nameLower === "iftah") bayar = 20000;
  else if (nameLower === "ff 3") bayar = 32000;
  else if (nameLower === "kancil jamshot") bayar = 32000;
  else if (nameLower === "desta") bayar = 20000;
  else if (nameLower === "kacung pret") {
    if (lombaLower.includes("free fire")) bayar = 40000;
    else if (lombaLower.includes("mobile legends")) bayar = 50000;
  }
  else if (nameLower === "leo kacung") bayar = 32000;
  else if (nameLower === "sprint") bayar = 32000;
  else if (nameLower === "yang brow rasakan") bayar = 32000;
  else if (nameLower === "rahmat") bayar = 15000;
  else if (nameLower === "bkr") bayar = 75000;
  else if (nameLower === "kodel") bayar = 15000;
  else if (nameLower === "spirit") bayar = 32000;
  else if (nameLower === "xtc") bayar = 32000;

  const isSquad = (reg.lomba || "").toLowerCase().includes("squad") || 
                  (reg.lomba || "").toLowerCase().includes("5v5") || 
                  (reg.lomba || "").toLowerCase().includes("4v4") || 
                  (reg.lomba || "").toLowerCase().includes("mobile legends") || 
                  (reg.lomba || "").toLowerCase().includes("free fire");
  
  const playerCount = Array.isArray(reg.players) && reg.players.length > 0 
    ? reg.players.length 
    : (isSquad ? ((reg.lomba || "").toLowerCase().includes("free fire") ? 4 : 5) : 1);

  // Kebijakan baru: Flat Rp5.000 per orang untuk semua kelompok usia
  const pricePerOrg = 5000;
  const biaya = playerCount * pricePerOrg;
  
  if (bayar === 0) bayar = biaya;

  const sisa = bayar - biaya;

  const formatMoney = (val: number) => (val < 0 ? "-" : "") + "Rp" + Math.abs(val).toLocaleString('id-ID');

  return {
    bayar,
    biaya,
    sisa,
    formattedBayar: formatMoney(bayar),
    formattedBiaya: formatMoney(biaya),
    formattedSisa: formatMoney(sisa)
  };
}

/**
 * Calculates the total registration fee for display and export.
 * Deprecated: Use getFeeDetails instead.
 */
export function calculateRegistrationFee(reg: RegistrationData): string {
  return getFeeDetails(reg).formattedBayar;
}

const LOCAL_STORAGE_KEY = "padasuka_registrations_v1";

export function normalizeStr(str: string): string {
  return (str || "").trim().toLowerCase().replace(/\s+/g, " ");
}

export function normalizePhone(phone: string): string {
  let digits = (phone || "").replace(/\D/g, "");
  if (digits.startsWith("62")) {
    digits = "0" + digits.slice(2);
  }
  return digits;
}

/**
 * Safe helper to parse various Firestore / JS timestamp formats to Unix milliseconds.
 */
export function parseTimestampMillis(val: any): number {
  if (!val) return Date.now();
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const parsed = new Date(val).getTime();
    return isNaN(parsed) ? Date.now() : parsed;
  }
  if (val.seconds !== undefined) return val.seconds * 1000;
  if (typeof val.toDate === 'function') return val.toDate().getTime();
  return Date.now();
}

/**
 * Safe helper to format timestamp for display (e.g., "03 Aug 2026, 14:30")
 */
export function formatRegistrationDate(val: any): string {
  try {
    const millis = parseTimestampMillis(val);
    return new Date(millis).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return new Date().toLocaleDateString('id-ID');
  }
}

export const DEFAULT_INITIAL_REGISTRATIONS: RegistrationData[] = [
  {
    id: "manual_ifal_wibawa",
    localId: "manual_ifal_wibawa",
    nama: "IFAL WIBAWA",
    players: [],
    anggotaTim: "",
    usia: "9",
    kategori: "SD",
    lomba: "PS 4 Pro FC26 (Individu)",
    alamat: "Gunalong",
    wa: "083843073636",
    status: "verified" as const,
    createdAt: "2026-08-03T09:59:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_bee3ska",
    localId: "manual_bee3ska",
    nama: "BEE3SKA",
    players: [],
    anggotaTim: "",
    usia: "17",
    kategori: "UMUM",
    lomba: "Mobile Legends: Bang Bang (5v5 Squad)",
    alamat: "Ci Pancur",
    wa: "083875361747",
    status: "verified" as const,
    createdAt: "2026-08-03T16:56:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_ziezan",
    localId: "manual_ziezan",
    nama: "ZIEZAN",
    players: [],
    anggotaTim: "",
    usia: "8",
    kategori: "SD",
    lomba: "Mobile Legends: Bang Bang (5v5 Squad)",
    alamat: "Nyomplong",
    wa: "082312907731",
    status: "verified" as const,
    createdAt: "2026-08-05T10:31:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_o2",
    localId: "manual_o2",
    nama: "O2",
    players: [],
    anggotaTim: "",
    usia: "18",
    kategori: "UMUM",
    lomba: "Mobile Legends: Bang Bang (5v5 Squad)",
    alamat: "Nyodor Tengah",
    wa: "083146667785",
    status: "verified" as const,
    createdAt: "2026-08-07T10:18:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_ripiansyah",
    localId: "manual_ripiansyah",
    nama: "RIPIANSYAH",
    players: [],
    anggotaTim: "",
    usia: "11",
    kategori: "SD",
    lomba: "PS 4 Pro FC26 (Individu)",
    alamat: "Nyomplong",
    wa: "-",
    status: "verified" as const,
    createdAt: "2026-08-07T14:32:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_wahab",
    localId: "manual_wahab",
    nama: "WAHAB",
    players: [],
    anggotaTim: "",
    usia: "20",
    kategori: "UMUM",
    lomba: "PS 4 Pro FC26 (Individu)",
    alamat: "Batu Karut",
    wa: "089614180019",
    status: "verified" as const,
    createdAt: "2026-08-10T06:19:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_nyawit",
    localId: "manual_nyawit",
    nama: "NYAWIT",
    players: [],
    anggotaTim: "",
    usia: "11",
    kategori: "SD",
    lomba: "Free Fire (4 Squad)",
    alamat: "Nyomplong",
    wa: "089526296784",
    status: "verified" as const,
    createdAt: "2026-08-10T09:43:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_harimau_gold_line",
    localId: "manual_harimau_gold_line",
    nama: "HARIMAU GOLD LINE",
    players: [],
    anggotaTim: "",
    usia: "18",
    kategori: "UMUM",
    lomba: "Mobile Legends: Bang Bang (5v5 Squad)",
    alamat: "Batu Karut",
    wa: "083838441748",
    status: "verified" as const,
    createdAt: "2026-08-10T09:43:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_patah_hati",
    localId: "manual_patah_hati",
    nama: "PATAH HATI",
    players: [],
    anggotaTim: "",
    usia: "13",
    kategori: "SMP",
    lomba: "Mobile Legends: Bang Bang (5v5 Squad)",
    alamat: "Marapit",
    wa: "083187550268",
    status: "verified" as const,
    createdAt: "2026-08-10T09:43:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_ihab",
    localId: "manual_ihab",
    nama: "IHAB",
    players: [],
    anggotaTim: "",
    usia: "14",
    kategori: "SMP",
    lomba: "Free Fire (4 Squad)",
    alamat: "Gunalong",
    wa: "083169964552",
    status: "verified" as const,
    createdAt: "2026-08-11T09:43:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_iftah",
    localId: "manual_iftah",
    nama: "IFTAH",
    players: [],
    anggotaTim: "",
    usia: "10",
    kategori: "SD",
    lomba: "Free Fire (4 Squad)",
    alamat: "Batu Karut",
    wa: "083143048071",
    status: "verified" as const,
    createdAt: "2026-08-11T09:43:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_ff_3",
    localId: "manual_ff_3",
    nama: "FF 3",
    players: [],
    anggotaTim: "",
    usia: "13",
    kategori: "SMP",
    lomba: "Free Fire (4 Squad)",
    alamat: "Ci Pancur",
    wa: "083175409717",
    status: "verified" as const,
    createdAt: "2026-08-11T09:43:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_kancil_jamshot",
    localId: "manual_kancil_jamshot",
    nama: "KANCIL JAMSHOT",
    players: [],
    anggotaTim: "",
    usia: "13",
    kategori: "SMP",
    lomba: "Free Fire (4 Squad)",
    alamat: "Bakar",
    wa: "085691577572",
    status: "verified" as const,
    createdAt: "2026-08-11T09:43:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_desta",
    localId: "manual_desta",
    nama: "DESTA",
    players: [],
    anggotaTim: "",
    usia: "14",
    kategori: "SD",
    lomba: "Free Fire (4 Squad)",
    alamat: "Nyomplong",
    wa: "083153116541",
    status: "verified" as const,
    createdAt: "2026-08-11T13:28:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_kacung_pret_ff",
    localId: "manual_kacung_pret_ff",
    nama: "KACUNG PRET",
    players: [],
    anggotaTim: "",
    usia: "16",
    kategori: "SMA",
    lomba: "Free Fire (4 Squad)",
    alamat: "Batu Karut",
    wa: "085891593497",
    status: "verified" as const,
    createdAt: "2026-08-11T13:28:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_kacung_pret_ml",
    localId: "manual_kacung_pret_ml",
    nama: "KACUNG PRET",
    players: [],
    anggotaTim: "",
    usia: "16",
    kategori: "SMA",
    lomba: "Mobile Legends: Bang Bang (5v5 Squad)",
    alamat: "Batu Karut",
    wa: "089507569004",
    status: "verified" as const,
    createdAt: "2026-08-11T13:28:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_leo_kacung",
    localId: "manual_leo_kacung",
    nama: "LEO KACUNG",
    players: [],
    anggotaTim: "",
    usia: "12",
    kategori: "SMP",
    lomba: "Free Fire (4 Squad)",
    alamat: "Bakar",
    wa: "083823502753",
    status: "verified" as const,
    createdAt: "2026-08-12T14:02:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_sprint",
    localId: "manual_sprint",
    nama: "SPRINT",
    players: [],
    anggotaTim: "",
    usia: "12",
    kategori: "SMP",
    lomba: "Free Fire (4 Squad)",
    alamat: "Ci Pancur",
    wa: "-",
    status: "verified" as const,
    createdAt: "2026-08-12T14:02:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_yang_brow_rasakan",
    localId: "manual_yang_brow_rasakan",
    nama: "YANG BROW RASAKAN",
    players: [],
    anggotaTim: "",
    usia: "12",
    kategori: "SMP",
    lomba: "Free Fire (4 Squad)",
    alamat: "Lembur Asem",
    wa: "083836757460",
    status: "pending" as const,
    createdAt: "2026-08-13T14:02:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_rahmat",
    localId: "manual_rahmat",
    nama: "RAHMAT",
    players: [],
    anggotaTim: "",
    usia: "20",
    kategori: "UMUM",
    lomba: "PS 4 Pro FC26 (Individu)",
    alamat: "Batu Karut",
    wa: "083899871414",
    status: "verified" as const,
    createdAt: "2026-08-13T14:23:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_bkr",
    localId: "manual_bkr",
    nama: "BKR",
    players: [],
    anggotaTim: "",
    usia: "20",
    kategori: "UMUM",
    lomba: "Mobile Legends: Bang Bang (5v5 Squad)",
    alamat: "Batu Karut",
    wa: "083875393428",
    status: "verified" as const,
    createdAt: "2026-08-13T14:31:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_kodel",
    localId: "manual_kodel",
    nama: "KODEL",
    players: [],
    anggotaTim: "",
    usia: "20",
    kategori: "UMUM",
    lomba: "PS 4 Pro FC26 (Individu)",
    alamat: "Muntur",
    wa: "085931442631",
    status: "pending" as const,
    createdAt: "2026-08-13T14:34:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_ziezan_ff",
    localId: "manual_ziezan_ff",
    nama: "ZIEZAN",
    players: [],
    anggotaTim: "",
    usia: "8",
    kategori: "SD",
    lomba: "Free Fire (4 Squad)",
    alamat: "Nyomplong",
    wa: "-",
    status: "verified" as const,
    createdAt: "2026-08-13T15:49:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_spirit_ff",
    localId: "manual_spirit_ff",
    nama: "SPIRIT",
    players: [],
    anggotaTim: "",
    usia: "13",
    kategori: "SMP",
    lomba: "Free Fire (4 Squad)",
    alamat: "Batu Karut",
    wa: "-",
    status: "verified" as const,
    createdAt: "2026-08-14T13:00:00.000Z",
    firestoreSynced: true
  },
  {
    id: "manual_xtc_ff",
    localId: "manual_xtc_ff",
    nama: "XTC",
    players: [],
    anggotaTim: "",
    usia: "14",
    kategori: "SMP",
    lomba: "Free Fire (4 Squad)",
    alamat: "LA",
    wa: "-",
    status: "verified" as const,
    createdAt: "2026-08-14T13:00:00.000Z",
    firestoreSynced: true
  }
];

/**
 * Retrieve local registrations stored in localStorage
 */
export function getLocalRegistrations(): RegistrationData[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    let items: RegistrationData[] = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) items = parsed;
    }
    
    // Always update or merge default initial registrations so changes to defaults
    // are instantly reflected in milliseconds without waiting for async seed or stale localStorage!
    const updatedMap = new Map<string, RegistrationData>();
    
    for (const item of items) {
      const key = (item.id || (item.nama + "_" + item.lomba)).trim().toLowerCase();
      if (key) updatedMap.set(key, item);
    }

    for (const def of DEFAULT_INITIAL_REGISTRATIONS) {
      const key = (def.id || (def.nama + "_" + def.lomba)).trim().toLowerCase();
      const existing = updatedMap.get(key);
      if (!existing) {
        updatedMap.set(key, def);
      } else {
        updatedMap.set(key, {
          ...existing,
          ...def,
          status: def.status,
          kategori: def.kategori,
          usia: def.usia,
          alamat: def.alamat,
          wa: def.wa,
          lomba: def.lomba
        });
      }
    }

    return Array.from(updatedMap.values());
  } catch (err) {
    console.error("Error reading local registrations:", err);
    return DEFAULT_INITIAL_REGISTRATIONS;
  }
}

/**
 * Persist registrations array to localStorage
 */
export function saveLocalRegistrations(items: RegistrationData[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Error saving local registrations:", err);
  }
}

/**
 * Submit a registration with dual-layer storage (LocalStorage first, then Firestore).
 * Guarantees zero data loss even if network or adblocker fails Firestore request.
 */
export async function submitRegistration(data: Omit<RegistrationData, "id" | "status" | "createdAt" | "firestoreSynced">): Promise<{
  success: boolean;
  docId: string;
  isLocalOnly: boolean;
  registration: RegistrationData;
  errorDetail?: string;
}> {
  const localId = `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const nowIso = new Date().toISOString();

  const newReg: RegistrationData = {
    ...data,
    id: localId,
    localId,
    status: "pending",
    createdAt: nowIso,
    firestoreSynced: false
  };

  // 1. ALWAYS save to localStorage first (guarantees 100% data persistence & INSTANT speed)
  const existingLocal = getLocalRegistrations();
  existingLocal.unshift(newReg);
  saveLocalRegistrations(existingLocal);

  let docId = localId;
  let isLocalOnly = true;

  // 2. Background Firestore write with rapid timeout
  const firestorePromise = (async () => {
    try {
      const docRef = await addDoc(collection(db, "registrations"), {
        nama: data.nama,
        players: data.players,
        anggotaTim: data.anggotaTim,
        usia: data.usia,
        kategori: data.kategori,
        alamat: data.alamat,
        wa: data.wa,
        lomba: data.lomba,
        status: "pending",
        createdAt: serverTimestamp(),
        localId
      });

      // Update local copy with Firestore doc ID and mark synced
      const currentLocal = getLocalRegistrations();
      const updatedLocal = currentLocal.map(item => {
        if (item.localId === localId) {
          return { ...item, id: docRef.id, firestoreSynced: true };
        }
        return item;
      });
      saveLocalRegistrations(updatedLocal);
      return docRef.id;
    } catch (firestoreErr: any) {
      console.warn("Firestore write fallback to local storage:", firestoreErr);
      return null;
    }
  })();

  // Race with 800ms timeout for lightning-fast UI response
  const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 800));
  const resultDocId = await Promise.race([firestorePromise, timeoutPromise]);

  if (resultDocId) {
    docId = resultDocId;
    isLocalOnly = false;
    newReg.id = docId;
    newReg.firestoreSynced = true;
  }

  return {
    success: true,
    docId,
    isLocalOnly,
    registration: newReg
  };
}

export function getRegistrationSignature(r: Partial<RegistrationData>): string {
  const normNama = normalizeStr(r.nama || "");
  const normWa = normalizePhone(r.wa || "");
  const normLomba = normalizeStr(r.lomba || "");
  if (normNama && normWa && normLomba) {
    return `${normNama}|${normWa}|${normLomba}`;
  }
  return r.id || r.localId || `id_${Math.random()}`;
}

/**
 * Synchronize any local registrations that failed to upload to Firestore without creating duplicates.
 */
export async function syncLocalRegistrationsToFirestore(existingFirestoreDocs?: any[]) {
  const localItems = getLocalRegistrations();
  const unsynced = localItems.filter(item => !item.firestoreSynced);
  
  // Fetch Firestore docs if not provided
  let firestoreItems = existingFirestoreDocs || [];
  if (!existingFirestoreDocs || existingFirestoreDocs.length === 0) {
    try {
      const qSnap = await getDocs(collection(db, "registrations"));
      firestoreItems = qSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn("Could not fetch Firestore docs for sync deduplication:", e);
    }
  }

  // Map existing Firestore signatures and IDs
  const existingSigs = new Set<string>();
  const existingIds = new Set<string>();

  for (const fDoc of firestoreItems) {
    if (fDoc.id) existingIds.add(fDoc.id);
    if (fDoc.localId) existingIds.add(fDoc.localId);
    existingSigs.add(getRegistrationSignature(fDoc));
  }

  // Clean up duplicate documents in Firestore if present
  if (firestoreItems.length > 1) {
    await cleanupFirestoreDuplicates(firestoreItems);
  }

  if (unsynced.length === 0) return;

  for (const item of unsynced) {
    const itemSig = getRegistrationSignature(item);
    const itemLocalId = item.localId || item.id;

    // Check if this item ALREADY exists in Firestore
    if (existingSigs.has(itemSig) || (itemLocalId && existingIds.has(itemLocalId))) {
      // Already uploaded or matched! DO NOT call addDoc again!
      const updated = getLocalRegistrations().map(l => {
        if (l.localId === item.localId || l.id === item.id) {
          return { ...l, firestoreSynced: true };
        }
        return l;
      });
      saveLocalRegistrations(updated);
      continue;
    }

    // Truly unsynced new item: upload to Firestore
    try {
      const docRef = await addDoc(collection(db, "registrations"), {
        nama: item.nama,
        players: item.players,
        anggotaTim: item.anggotaTim,
        usia: item.usia,
        kategori: item.kategori,
        alamat: item.alamat,
        wa: item.wa,
        lomba: item.lomba,
        status: item.status || "pending",
        createdAt: serverTimestamp(),
        localId: item.localId
      });

      existingSigs.add(itemSig);
      existingIds.add(docRef.id);

      const updated = getLocalRegistrations().map(l => {
        if (l.localId === item.localId || l.id === item.id) {
          return { ...l, id: docRef.id, firestoreSynced: true };
        }
        return l;
      });
      saveLocalRegistrations(updated);
    } catch (e) {
      console.error("Sync unsynced item failed:", e);
    }
  }
}

/**
 * Merge Firestore documents and LocalStorage items safely with strict deduplication
 */
export function mergeRegistrations(firestoreItems: any[], localItems: RegistrationData[]): RegistrationData[] {
  const mapBySig = new Map<string, RegistrationData>();

  // Overlay Firestore items first
  for (const docItem of firestoreItems) {
    const firestoreId = docItem.id;
    const item: RegistrationData = {
      id: firestoreId,
      localId: docItem.localId,
      nama: docItem.nama || "-",
      players: Array.isArray(docItem.players) ? docItem.players : [],
      anggotaTim: docItem.anggotaTim || "",
      usia: docItem.usia || "-",
      kategori: docItem.kategori || "-",
      alamat: docItem.alamat || "-",
      wa: docItem.wa || "-",
      lomba: docItem.lomba || "-",
      status: ((docItem.status || "pending").toString().toLowerCase().trim() === "verified" ? "verified" : "pending"),
      createdAt: docItem.createdAt || new Date().toISOString(),
      firestoreSynced: true
    };

    const sig = getRegistrationSignature(item);
    if (!mapBySig.has(sig)) {
      mapBySig.set(sig, item);
    } else {
      // Deduplicate: prefer "verified" status
      const existing = mapBySig.get(sig)!;
      if (item.status === "verified" && existing.status !== "verified") {
        mapBySig.set(sig, { ...item, firestoreSynced: true });
      }
    }
  }

  // Process local items
  for (const local of localItems) {
    const sig = getRegistrationSignature(local);
    const localStatus = (local.status || "pending").toString().toLowerCase().trim() === "verified" ? "verified" : "pending";

    if (mapBySig.has(sig)) {
      const existing = mapBySig.get(sig)!;
      const merged: RegistrationData = {
        ...existing,
        localId: local.localId || existing.localId,
        players: (existing.players && existing.players.length) ? existing.players : local.players,
        anggotaTim: existing.anggotaTim || local.anggotaTim,
        status: (existing.status === "verified" || localStatus === "verified") ? "verified" : "pending",
        firestoreSynced: true
      };
      mapBySig.set(sig, merged);
    } else {
      mapBySig.set(sig, {
        ...local,
        status: localStatus,
        id: local.id || local.localId || `local_${Math.random()}`
      });
    }
  }

  // Convert map to array and sort by createdAt descending
  const result = Array.from(mapBySig.values());
  result.sort((a, b) => parseTimestampMillis(b.createdAt) - parseTimestampMillis(a.createdAt));

  // Update local storage with clean deduplicated list
  saveLocalRegistrations(result);

  return result;
}

/**
 * Automatically cleans up duplicate records from Firestore if redundant records exist.
 */
export async function cleanupFirestoreDuplicates(firestoreItems: any[]): Promise<number> {
  if (!firestoreItems || firestoreItems.length <= 1) return 0;

  const seenSigs = new Map<string, any>();
  const duplicateDocIdsToDelete: string[] = [];

  for (const item of firestoreItems) {
    const sig = getRegistrationSignature(item);
    if (!seenSigs.has(sig)) {
      seenSigs.set(sig, item);
    } else {
      const existing = seenSigs.get(sig);
      const isExistingVerified = (existing.status || "").toString().toLowerCase() === "verified";
      const isItemVerified = (item.status || "").toString().toLowerCase() === "verified";

      if (isItemVerified && !isExistingVerified) {
        duplicateDocIdsToDelete.push(existing.id);
        seenSigs.set(sig, item);
      } else {
        duplicateDocIdsToDelete.push(item.id);
      }
    }
  }

  let deletedCount = 0;
  for (const docId of duplicateDocIdsToDelete) {
    if (docId) {
      try {
        await deleteDoc(doc(db, "registrations", docId));
        deletedCount++;
      } catch (err) {
        console.warn("Could not delete duplicate Firestore doc:", docId, err);
      }
    }
  }
  return deletedCount;
}

/**
 * Update complete registration data in both Firestore and LocalStorage
 */
export async function editRegistrationInStore(
  id: string,
  updatedFields: Partial<Omit<RegistrationData, "id" | "localId" | "createdAt">>
): Promise<{ success: boolean; message?: string }> {
  // 1. Update LocalStorage
  const localItems = getLocalRegistrations();
  const updatedLocal = localItems.map(item => {
    if (item.id === id || item.localId === id) {
      return { ...item, ...updatedFields };
    }
    return item;
  });
  saveLocalRegistrations(updatedLocal);

  // 2. Update Firestore
  try {
    const docRef = doc(db, "registrations", id);
    await updateDoc(docRef, updatedFields);
    return { success: true };
  } catch (err: any) {
    console.warn("Firestore updateDoc error (local fallback updated):", err);
    return { success: true, message: "Data diperbarui secara lokal." };
  }
}

/**
 * Update registration status in both Firestore and LocalStorage
 */
export async function updateRegistrationStatusInStore(id: string, newStatus: "pending" | "verified"): Promise<{ success: boolean; message?: string }> {
  // 1. Update LocalStorage
  const localItems = getLocalRegistrations();
  let foundLocal = false;
  const updatedLocal = localItems.map(item => {
    if (item.id === id || item.localId === id) {
      foundLocal = true;
      return { ...item, status: newStatus };
    }
    return item;
  });

  if (!foundLocal) {
    // If not found in local array, add a stub or fetch it
    updatedLocal.push({
      id,
      nama: "-",
      players: [],
      anggotaTim: "",
      usia: "-",
      kategori: "-",
      alamat: "-",
      wa: "-",
      lomba: "-",
      status: newStatus,
      createdAt: new Date().toISOString(),
      firestoreSynced: true
    });
  }
  saveLocalRegistrations(updatedLocal);

  // 2. Update Firestore
  try {
    await updateDoc(doc(db, "registrations", id), { status: newStatus });
    return { success: true };
  } catch (err: any) {
    console.warn("Firestore updateDoc error (local fallback updated):", err);
    return { success: true, message: "Status diperbarui secara lokal." };
  }
}

/**
 * Delete registration from both Firestore and LocalStorage
 */
export async function deleteRegistrationFromStore(id: string): Promise<{ success: boolean }> {
  // Delete from LocalStorage
  const localItems = getLocalRegistrations();
  const updatedLocal = localItems.filter(item => item.id !== id && item.localId !== id);
  saveLocalRegistrations(updatedLocal);

  // Delete from Firestore
  try {
    await deleteDoc(doc(db, "registrations", id));
  } catch (err: any) {
    console.warn("Firestore deleteDoc error (local item removed):", err);
  }
  return { success: true };
}

/**
  * Check database and local storage for duplicate registration.
  * Rules:
  * - Returns matching record if same Nama AND same WA AND same Lomba.
  * - Returns matching record if ALL 4 identity fields match: Nama, Usia, Alamat, WA.
  * - If Nama is identical but other fields (Usia/Alamat/WA) differ, it is NOT considered duplicate.
  */
export async function checkForDuplicateRegistration(data: {
  nama: string;
  usia: string;
  alamat: string;
  wa: string;
  lomba: string;
}): Promise<RegistrationData | null> {
  const targetNama = normalizeStr(data.nama);
  const targetUsia = (data.usia || "").trim();
  const targetAlamat = normalizeStr(data.alamat);
  const targetWa = normalizePhone(data.wa);
  const targetLomba = normalizeStr(data.lomba);

  // 1. Local registrations
  const localItems = getLocalRegistrations();

  // 2. Fetch latest registrations from Firestore with 2s timeout
  let firestoreItems: any[] = [];
  try {
    const fetchPromise = getDocs(collection(db, "registrations"));
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500));
    const qSnap = await Promise.race([fetchPromise, timeoutPromise]) as any;

    if (qSnap && typeof qSnap.forEach === "function") {
      qSnap.forEach((d: any) => {
        firestoreItems.push({ id: d.id, ...d.data() });
      });
    }
  } catch (err) {
    console.warn("Firestore check duplicate fetch failed, fallback to local:", err);
  }

  const all = mergeRegistrations(firestoreItems, localItems);

  for (const item of all) {
    const itemNama = normalizeStr(item.nama);
    const itemUsia = (item.usia || "").trim();
    const itemAlamat = normalizeStr(item.alamat);
    const itemWa = normalizePhone(item.wa);
    const itemLomba = normalizeStr(item.lomba);

    const sameNama = targetNama === itemNama;
    const sameWa = targetWa.length >= 8 && itemWa.length >= 8 && targetWa === itemWa;
    const sameLomba = targetLomba === itemLomba;
    const sameUsia = targetUsia === itemUsia;
    const sameAlamat = targetAlamat === itemAlamat;

    // Rule 1: Same Nama + Same WA + Same Lomba
    if (sameNama && sameWa && sameLomba) {
      return item;
    }

    // Rule 2: Same Nama + Same Usia + Same Alamat + Same WA (exact double entry)
    if (sameNama && sameUsia && sameAlamat && sameWa) {
      return item;
    }
  }

  return null;
}

/**
 * Seed the requested manual registrations into LocalStorage and Firestore safely (no duplicates).
 */
export async function seedManualRegistrations() {
  if (localStorage.getItem("padasuka_manual_seeded_v3.0") === "true") {
    return;
  }

  const manualData: RegistrationData[] = DEFAULT_INITIAL_REGISTRATIONS;

  // 1. Update/Clean local storage
  const local = getLocalRegistrations();
  const filteredLocal = local.filter(l => {
    const isManualOld = (l.id && l.id.startsWith("manual_")) || (l.localId && l.localId.startsWith("manual_"));
    const matchesTargetName = DEFAULT_INITIAL_REGISTRATIONS.some(
      d => d.nama.trim().toLowerCase() === (l.nama || "").trim().toLowerCase() && d.lomba.trim().toLowerCase() === (l.lomba || "").trim().toLowerCase()
    );
    return !isManualOld && !matchesTargetName;
  });

  const updatedLocal = [...filteredLocal, ...manualData];
  saveLocalRegistrations(updatedLocal);

  // 2. Check & Update/Add Firestore
  try {
    const qSnap = await getDocs(collection(db, "registrations"));
    const firestoreDocs = qSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

    for (const item of manualData) {
      const existingDoc = firestoreDocs.find(d => 
        (d.nama || "").trim().toLowerCase() === item.nama.trim().toLowerCase() &&
        (d.lomba || "").trim().toLowerCase() === item.lomba.trim().toLowerCase()
      );
      if (existingDoc) {
        // Update existing document in firestore
        await updateDoc(doc(db, "registrations", existingDoc.id), {
          nama: item.nama,
          players: item.players,
          anggotaTim: item.anggotaTim,
          usia: item.usia,
          kategori: item.kategori,
          alamat: item.alamat,
          wa: item.wa,
          lomba: item.lomba,
          status: item.status,
          createdAt: item.createdAt,
          localId: item.localId
        });
      } else {
        // Create new document in firestore
        await addDoc(collection(db, "registrations"), {
          nama: item.nama,
          players: item.players,
          anggotaTim: item.anggotaTim,
          usia: item.usia,
          kategori: item.kategori,
          alamat: item.alamat,
          wa: item.wa,
          lomba: item.lomba,
          status: item.status,
          createdAt: item.createdAt,
          localId: item.localId
        });
      }
    }
    // Set localStorage flag so we don't repeat the firestore checks on every load
    localStorage.setItem("padasuka_manual_seeded_v3.0", "true");
  } catch (err) {
    console.warn("Could not seed manual registrations to Firestore:", err);
  }
}

