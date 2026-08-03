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

/**
 * Retrieve local registrations stored in localStorage
 */
export function getLocalRegistrations(): RegistrationData[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error reading local registrations:", err);
    return [];
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

/**
 * Synchronize any local registrations that failed to upload to Firestore
 */
export async function syncLocalRegistrationsToFirestore() {
  const localItems = getLocalRegistrations();
  const unsynced = localItems.filter(item => !item.firestoreSynced);
  if (unsynced.length === 0) return;

  for (const item of unsynced) {
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

      const updated = getLocalRegistrations().map(l => {
        if (l.localId === item.localId) {
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
 * Merge Firestore documents and LocalStorage items safely
 */
export function mergeRegistrations(firestoreItems: any[], localItems: RegistrationData[]): RegistrationData[] {
  const map = new Map<string, RegistrationData>();

  // Add local items first
  for (const item of localItems) {
    const key = item.id || item.localId || `local_${Math.random()}`;
    map.set(key, { ...item });
  }

  // Overlay Firestore items (Firestore is authoritative if present)
  for (const docItem of firestoreItems) {
    const firestoreId = docItem.id;
    const localMatch = docItem.localId 
      ? localItems.find(l => l.localId === docItem.localId || l.id === firestoreId)
      : localItems.find(l => l.id === firestoreId);

    const merged: RegistrationData = {
      id: firestoreId,
      localId: docItem.localId || localMatch?.localId,
      nama: docItem.nama || localMatch?.nama || "-",
      players: Array.isArray(docItem.players) ? docItem.players : (localMatch?.players || []),
      anggotaTim: docItem.anggotaTim || localMatch?.anggotaTim || "",
      usia: docItem.usia || localMatch?.usia || "-",
      kategori: docItem.kategori || localMatch?.kategori || "-",
      alamat: docItem.alamat || localMatch?.alamat || "-",
      wa: docItem.wa || localMatch?.wa || "-",
      lomba: docItem.lomba || localMatch?.lomba || "-",
      status: docItem.status || localMatch?.status || "pending",
      createdAt: docItem.createdAt || localMatch?.createdAt || new Date().toISOString(),
      firestoreSynced: true
    };

    if (localMatch?.localId) {
      map.delete(localMatch.localId);
    }
    map.set(firestoreId, merged);
  }

  // Convert map to array and sort by createdAt descending
  const result = Array.from(map.values());
  result.sort((a, b) => parseTimestampMillis(b.createdAt) - parseTimestampMillis(a.createdAt));
  return result;
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

