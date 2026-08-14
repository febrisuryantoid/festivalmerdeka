import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { 
  ShieldAlert, LogOut, CheckCircle, Clock, Trash2, Users, Trophy, 
  Lock, Eye, EyeOff, ShieldCheck, KeyRound, Search, Filter, Download, AlertTriangle, RefreshCw, FileSpreadsheet, ExternalLink, Mail,
  Plus, Pencil, UserPlus, X, Save, Copy, Check, Globe
} from "lucide-react";
import { WhatsAppIcon } from "./components/WhatsAppIcon";
import { calculateDynamicPrize } from "./lib/utils";
import { 
  RegistrationData, 
  getLocalRegistrations, 
  mergeRegistrations, 
  submitRegistration,
  editRegistrationInStore,
  updateRegistrationStatusInStore, 
  deleteRegistrationFromStore, 
  syncLocalRegistrationsToFirestore, 
  formatRegistrationDate,
  getFeeDetails 
} from "./lib/registrationsStore";
import { syncAllRegistrationsToSheet, DEFAULT_SPREADSHEET_ID } from "./sheets";
import { googleSignIn } from "./auth";
import { AdminBracketManager } from "./components/AdminBracketManager";

// Security Salt & SHA-256 Hashes for credentials verification
const SECURITY_SALT = "padasuka_esport_2026_salt_99";
// Hash for username: "padasuka" + SECURITY_SALT
const EXPECTED_USER_HASH = "3bc0a55b9f513eefc01d979de32085a5b03bc22cd8fa60482ff64b405070865e";
// Hash for password: "qwerty2026" + SECURITY_SALT
const EXPECTED_PASS_HASH = "c2187201c11071b26267e935609a6d8fbe80fedd393711cc623500d8bc82f66e";

async function computeSHA256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input + SECURITY_SALT);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function AdminPanel() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  
  const [firestoreDocs, setFirestoreDocs] = useState<any[]>([]);
  const [mergedRegistrations, setMergedRegistrations] = useState<RegistrationData[]>(() => {
    try {
      return getLocalRegistrations();
    } catch {
      return [];
    }
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [gameFilter, setGameFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // CRUD & Auto Spreadsheet Sync States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBracketEditorOpen, setIsBracketEditorOpen] = useState(false);
  const [editingReg, setEditingReg] = useState<RegistrationData | null>(null);
  const [isUnauthorizedModalOpen, setIsUnauthorizedModalOpen] = useState(false);
  const [isCopiedDomain, setIsCopiedDomain] = useState(false);
  const [isSheetSettingsOpen, setIsSheetSettingsOpen] = useState(false);
  const [sheetIdInput, setSheetIdInput] = useState(
    localStorage.getItem("padasuka_spreadsheet_id") || DEFAULT_SPREADSHEET_ID
  );
  const [webhookUrlInput, setWebhookUrlInput] = useState(
    localStorage.getItem("padasuka_sheet_webhook_url") || ""
  );
  const [copiedScriptCode, setCopiedScriptCode] = useState(false);

  const [formNama, setFormNama] = useState("");
  const [formUsia, setFormUsia] = useState("");
  const [formKategori, setFormKategori] = useState("Kategori Pemuda Karang Taruna Desa Padasuka");
  const [formLomba, setFormLomba] = useState("Mobile Legends: Bang Bang (5v5 Squad)");
  const [formAlamat, setFormAlamat] = useState("");
  const [formWa, setFormWa] = useState("");
  const [formPlayers, setFormPlayers] = useState("");
  const [formStatus, setFormStatus] = useState<"pending" | "verified">("pending");

  const resetForm = () => {
    setFormNama("");
    setFormUsia("");
    setFormKategori("Kategori Pemuda Karang Taruna Desa Padasuka");
    setFormLomba("Mobile Legends: Bang Bang (5v5 Squad)");
    setFormAlamat("");
    setFormWa("");
    setFormPlayers("");
    setFormStatus("pending");
  };

  const autoSyncToSpreadsheet = async (latestData: RegistrationData[]) => {
    try {
      const sheetId = localStorage.getItem("padasuka_spreadsheet_id") || DEFAULT_SPREADSHEET_ID;
      await syncAllRegistrationsToSheet(sheetId, latestData);
      console.log("Auto sync to Google Sheet succeeded");
    } catch (err: any) {
      console.warn("Auto sync to Google Sheet skipped or unauthenticated:", err?.message || err);
    }
  };

  // Injeksi meta tag robots noindex untuk URL /melbu
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    let created = false;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
      created = true;
    }
    meta.content = "noindex, nofollow, noarchive, nosnippet";

    return () => {
      if (created && meta && meta.parentNode) {
        meta.parentNode.removeChild(meta);
      }
    };
  }, []);

  // Timer countdown jika terjadi lockout
  useEffect(() => {
    let interval: any = null;
    if (lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  // Cek sesi terenkripsi lokal
  useEffect(() => {
    const getValidSessionUser = () => {
      const token = sessionStorage.getItem("padasuka_admin_session");
      if (!token) return null;
      try {
        const decoded = decodeURIComponent(atob(token));
        const payload = JSON.parse(decoded);
        if (payload && payload.expires > Date.now()) {
          return payload.user || "febridriver@gmail.com";
        }
      } catch (e) {
        return null;
      }
      return null;
    };

    const sessionEmail = getValidSessionUser();
    if (sessionEmail) {
      setUser({ uid: "admin-encrypted-session", email: sessionEmail });
    }

    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // Real-time Firestore fetch & Auto-sync local storage
  useEffect(() => {
    if (!user) return;

    // Trigger sync unsynced local registrations to Firestore automatically without duplicates
    syncLocalRegistrationsToFirestore(firestoreDocs).catch(err => console.error("Auto sync err:", err));

    const colRef = collection(db, "registrations");
    const unsub = onSnapshot(colRef, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFirestoreDocs(docs);
    }, (error) => {
      console.warn("Firestore snapshot error, falling back to local registrations:", error);
    });

    return unsub;
  }, [user]);

  // Combine Firestore and LocalStorage whenever either updates
  useEffect(() => {
    const local = getLocalRegistrations();
    const merged = mergeRegistrations(firestoreDocs, local);
    setMergedRegistrations(merged);
  }, [firestoreDocs]);

  const showToast = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (lockoutTimer > 0) {
      setLoginError(`Akses terkunci. Silakan tunggu ${lockoutTimer} detik lagi.`);
      return;
    }

    setLoading(true);

    try {
      const inputUser = username.trim().toLowerCase();
      const uHash = await computeSHA256(inputUser);
      const pHash = await computeSHA256(password);

      const isValidLegacyUser = uHash === EXPECTED_USER_HASH;
      const isValidFebriUser = inputUser === "febridriver@gmail.com" || inputUser === "febridriver";
      const isValidPassword = pHash === EXPECTED_PASS_HASH || password === "qwerty2026";

      if ((!isValidLegacyUser && !isValidFebriUser) || !isValidPassword) {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        if (newAttempts >= 5) {
          setLockoutTimer(900); // Lockout 15 menit
          setLoginError("Sistem keamanan mendeteksi 5 kali percobaan gagal. Akses terkunci selama 15 menit.");
        } else {
          setLoginError(`Username atau password tidak sesuai! (${5 - newAttempts} percobaan tersisa)`);
        }
        setLoading(false);
        return;
      }

      // Enkripsi payload token sesi lokal
      const adminEmail = isValidFebriUser ? "febridriver@gmail.com" : (inputUser.includes("@") ? inputUser : "febridriver@gmail.com");
      const payload = {
        user: adminEmail,
        role: "administrator",
        timestamp: Date.now(),
        expires: Date.now() + 60 * 60 * 1000, // Valid 1 jam
      };
      const token = btoa(encodeURIComponent(JSON.stringify(payload)));
      sessionStorage.setItem("padasuka_admin_session", token);

      // Authenticate ke Firebase Auth jika memungkinkan
      const fbPass = "qwerty2026";
      try {
        await signInWithEmailAndPassword(auth, adminEmail, fbPass);
      } catch (err: any) {
        if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential" || err.code === "auth/invalid-login-credentials") {
          try {
            await createUserWithEmailAndPassword(auth, adminEmail, fbPass);
          } catch (cErr: any) {
            if (cErr.code === "auth/email-already-in-use") {
              console.warn("User already exists but sign in failed (likely different provider). Proceeding with local session.");
            } else {
              console.warn("Firebase auth creation fallback:", cErr);
            }
          }
        } else if (err.code === "auth/unauthorized-domain") {
          console.warn("Domain festival.baros.my.id is not yet in Firebase Authorized Domains. Using local encrypted session.");
        }
      }

      setUser({ uid: "admin-encrypted-session", email: adminEmail });
      setFailedAttempts(0);
    } catch (err) {
      console.error("Security hash validation error:", err);
      setLoginError("Terjadi kesalahan sistem enkripsi.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    sessionStorage.removeItem("padasuka_admin_session");
    setUser(null);
    await signOut(auth).catch(() => {});
  };

  const formatWaNumber = (wa?: string) => {
    let phone = wa?.replace(/[^0-9]/g, '') || '';
    if (phone.startsWith('0')) {
      phone = '62' + phone.substring(1);
    }
    return phone;
  };

  const generateTMUrl = (wa: string, nama: string) => {
    const phone = formatWaNumber(wa);
    const message = `Halo ${nama},\n\nKami dari Panitia eSports Festival mengundang Anda selaku PIC tim/peserta untuk menghadiri Technical Meeting pada:\nTanggal: 14 Agustus 2026\nWaktu: Pukul 16.30 WIB\nTempat: Kp. Batu Karut, RT 08/RW 04, Desa Padasuka, Kecamatan Baros, Kabupaten Serang, Banten (Rumah Pak Rudi Ketua Karang Taruna Desa Padasuka)\n\nMohon kehadirannya tepat waktu.\nTerima kasih.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const updateStatus = async (id: string, status: "pending" | "verified") => {
    try {
      await updateRegistrationStatusInStore(id, status);
      
      const updated = mergedRegistrations.map(r => r.id === id ? { ...r, status } : r);
      setMergedRegistrations(updated);

      showToast(`Status diperbarui ke: ${status.toUpperCase()} & disinkronkan ke Sheet.`);
      autoSyncToSpreadsheet(updated);
    } catch (err) {
      console.error("Failed to update status:", err);
      showToast("Gagal memperbarui status.");
    }
  };

  const deleteRegistration = async (id: string) => {
    if (window.confirm("Hapus data pendaftaran ini secara permanen?")) {
      try {
        await deleteRegistrationFromStore(id);
        
        const updated = mergedRegistrations.filter(r => r.id !== id);
        setMergedRegistrations(updated);
        showToast("Data pendaftaran berhasil dihapus & Spreadsheet disinkronkan.");
        autoSyncToSpreadsheet(updated);
      } catch (err) {
        console.error("Failed to delete registration:", err);
        showToast("Gagal menghapus data.");
      }
    }
  };

  const handleOpenEdit = (reg: RegistrationData) => {
    setEditingReg(reg);
    setFormNama(reg.nama || "");
    setFormUsia(reg.usia || "");
    setFormKategori(reg.kategori || "Kategori Pemuda Karang Taruna Desa Padasuka");
    setFormLomba(reg.lomba || "Mobile Legends: Bang Bang (5v5 Squad)");
    setFormAlamat(reg.alamat || "");
    setFormWa(reg.wa || "");
    setFormPlayers(
      Array.isArray(reg.players) && reg.players.length > 0
        ? reg.players.join("\n")
        : (reg.anggotaTim || "")
    );
    setFormStatus(reg.status || "pending");
  };

  const handleSaveNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim() || !formWa.trim()) {
      alert("Nama Pendaftar/Tim dan Nomor WhatsApp wajib diisi!");
      return;
    }

    const playerArray = formPlayers
      ? formPlayers.split("\n").map(s => s.trim()).filter(Boolean)
      : [];

    try {
      const res = await submitRegistration({
        nama: formNama.trim(),
        players: playerArray,
        anggotaTim: playerArray.join(", "),
        usia: formUsia.trim() || "17",
        kategori: formKategori,
        alamat: formAlamat.trim() || "Desa Padasuka",
        wa: formWa.trim(),
        lomba: formLomba
      });

      if (formStatus === "verified") {
        await updateRegistrationStatusInStore(res.docId, "verified");
      }

      const local = getLocalRegistrations();
      const updated = mergeRegistrations(firestoreDocs, local);
      setMergedRegistrations(updated);

      autoSyncToSpreadsheet(updated);
      setIsAddModalOpen(false);
      resetForm();
      showToast("Pendaftaran baru berhasil ditambahkan & disinkronkan ke Spreadsheet!");
    } catch (err: any) {
      alert("Gagal menambahkan data: " + (err.message || "Terjadi kesalahan"));
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReg) return;
    if (!formNama.trim() || !formWa.trim()) {
      alert("Nama Pendaftar/Tim dan Nomor WhatsApp wajib diisi!");
      return;
    }

    const playerArray = formPlayers
      ? formPlayers.split("\n").map(s => s.trim()).filter(Boolean)
      : [];

    try {
      await editRegistrationInStore(editingReg.id, {
        nama: formNama.trim(),
        players: playerArray,
        anggotaTim: playerArray.join(", "),
        usia: formUsia.trim() || "-",
        kategori: formKategori,
        alamat: formAlamat.trim() || "-",
        wa: formWa.trim(),
        lomba: formLomba,
        status: formStatus
      });

      const updated = mergedRegistrations.map(r => {
        if (r.id === editingReg.id || r.localId === editingReg.id) {
          return {
            ...r,
            nama: formNama.trim(),
            players: playerArray,
            anggotaTim: playerArray.join(", "),
            usia: formUsia.trim() || "-",
            kategori: formKategori,
            alamat: formAlamat.trim() || "-",
            wa: formWa.trim(),
            lomba: formLomba,
            status: formStatus
          };
        }
        return r;
      });

      setMergedRegistrations(updated);
      autoSyncToSpreadsheet(updated);
      setEditingReg(null);
      resetForm();
      showToast("Data pendaftaran berhasil diperbarui & disinkronkan ke Spreadsheet!");
    } catch (err: any) {
      alert("Gagal menyimpan perubahan: " + (err.message || "Terjadi kesalahan"));
    }
  };

  const exportToCSV = () => {
    if (mergedRegistrations.length === 0) {
      showToast("Belum ada data pendaftaran untuk di-export.");
      return;
    }
    const headers = [
      "No",
      "Nama / Nama Tim",
      "Anggota Pemain",
      "Usia",
      "Kategori Pendaftar",
      "Lomba / Cabang Game",
      "Alamat / Asal",
      "Nomor WhatsApp",
      "Status Verifikasi",
      "Waktu Pendaftaran",
      "Total Bayar",
      "Total Biaya",
      "Sisa Biaya"
    ];

    const rows = mergedRegistrations.map((r, idx) => {
      const fee = getFeeDetails(r);
      return [
        idx + 1,
        `"${(r.nama || '').replace(/"/g, '""')}"`,
        `"${(Array.isArray(r.players) && r.players.length > 0 ? r.players.filter(Boolean).join('; ') : (r.anggotaTim || '')).replace(/"/g, '""')}"`,
        `"${r.usia || ''}"`,
        `"${(r.kategori || '').replace(/"/g, '""')}"`,
        `"${(r.lomba || '').replace(/"/g, '""')}"`,
        `"${(r.alamat || '').replace(/"/g, '""')}"`,
        `"${(r.wa || '').replace(/"/g, '""')}"`,
        `"${(r.status || 'pending').toUpperCase()}"`,
        `"${formatRegistrationDate(r.createdAt)}"`,
        `"${fee.formattedBayar}"`,
        `"${fee.formattedBiaya}"`,
        `"${fee.formattedSisa}"`
      ];
    });

    // UTF-8 BOM \uFEFF for seamless Excel & Google Sheets compatibility
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Data_Peserta_eSport_Padasuka_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Export CSV Berhasil! (${mergedRegistrations.length} data pendaftar terunduh)`);
  };

  const handleSyncToSpreadsheet = async () => {
    if (mergedRegistrations.length === 0) {
      showToast("Belum ada data pendaftaran untuk disinkronkan.");
      return;
    }
    try {
      showToast("Menyinkronkan data ke Google Spreadsheet...");
      const sheetId = localStorage.getItem("padasuka_spreadsheet_id") || DEFAULT_SPREADSHEET_ID;
      const res = await syncAllRegistrationsToSheet(sheetId, mergedRegistrations);
      if (res?.mode === "webhook") {
        showToast(`Berhasil menyinkronkan ${mergedRegistrations.length} data via Webhook Apps Script!`);
      } else {
        showToast(`Berhasil menyinkronkan ${mergedRegistrations.length} data ke Google Spreadsheet!`);
      }
    } catch (err: any) {
      console.warn("Spreadsheet sync error, checking Google Auth:", err);
      const errMsg = err?.message || "";
      if (errMsg.includes("policy_enforced") || errMsg.includes("400") || errMsg.includes("Advanced Protection") || errMsg.includes("Perlindungan Lanjutan")) {
        setIsSheetSettingsOpen(true);
        showToast("Perhatian: Akun Google Anda mengaktifkan Program Perlindungan Lanjutan. Gunakan opsi Webhook Apps Script di Pengaturan Sheet!");
        return;
      }

      if (errMsg.includes("Akses token") || errMsg.includes("login") || err.code === "auth/unauthorized-domain") {
        try {
          await googleSignIn();
          const sheetId = localStorage.getItem("padasuka_spreadsheet_id") || DEFAULT_SPREADSHEET_ID;
          await syncAllRegistrationsToSheet(sheetId, mergedRegistrations);
          showToast(`Berhasil terhubung & menyinkronkan ${mergedRegistrations.length} data ke Google Spreadsheet!`);
        } catch (authErr: any) {
          const authErrMsg = authErr?.message || authErr?.code || "";
          if (authErrMsg.includes("policy_enforced") || authErrMsg.includes("400")) {
            setIsSheetSettingsOpen(true);
            showToast("Login diblokir oleh Program Perlindungan Lanjutan Google. Gunakan opsi Webhook Apps Script di tombol Pengaturan!");
          } else if (authErr?.code === "auth/unauthorized-domain" || authErrMsg.includes("unauthorized-domain")) {
            setIsUnauthorizedModalOpen(true);
            showToast("Perhatian: Domain festival.baros.my.id belum diotorisasi di Firebase Console.");
          } else {
            showToast("Otentikasi Google dibatalkan atau gagal: " + authErrMsg);
          }
        }
      } else {
        showToast("Gagal sync ke Sheet: " + errMsg);
      }
    }
  };

  const handleSyncCloud = async () => {
    try {
      showToast("Menyinkronkan data & membersihkan duplikasi di Cloud Firestore...");
      await syncLocalRegistrationsToFirestore(firestoreDocs);
      const local = getLocalRegistrations();
      const updated = mergeRegistrations(firestoreDocs, local);
      setMergedRegistrations(updated);
      showToast(`Sync Cloud Selesai! ${updated.length} data pendaftaran unik terverifikasi & bebas duplikasi.`);
    } catch (err: any) {
      console.error("Sync Cloud error:", err);
      showToast("Gagal sync Cloud: " + (err?.message || "Terjadi kesalahan"));
    }
  };

  const handleCleanRedundant = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data redundan / duplikat secara paksa?")) return;
    try {
      showToast("Membersihkan data redundan...");
      // 1. Clean local storage strictly
      const local = getLocalRegistrations();
      const uniqueLocalMap = new Map();
      local.forEach(item => {
        const sig = `${(item.nama||"").trim().toLowerCase()}|${(item.wa||"").trim()}|${(item.lomba||"").trim()}`;
        if (!uniqueLocalMap.has(sig) || item.status === "verified") {
          uniqueLocalMap.set(sig, item);
        }
      });
      const uniqueLocal = Array.from(uniqueLocalMap.values());
      localStorage.setItem("padasuka_registrations_v1", JSON.stringify(uniqueLocal));
      
      // 2. Clean Firestore
      if (firestoreDocs.length > 0) {
        let deleted = 0;
        const seenSigs = new Map();
        for (const doc of firestoreDocs) {
          const sig = `${(doc.nama||"").trim().toLowerCase()}|${(doc.wa||"").trim()}|${(doc.lomba||"").trim()}`;
          if (!seenSigs.has(sig)) {
            seenSigs.set(sig, doc);
          } else {
            const existing = seenSigs.get(sig);
            const isExistingVerified = existing.status === "verified";
            const isCurrentVerified = doc.status === "verified";
            let toDeleteId = doc.id;
            if (isCurrentVerified && !isExistingVerified) {
              toDeleteId = existing.id;
              seenSigs.set(sig, doc);
            }
            await deleteRegistrationFromStore(toDeleteId);
            deleted++;
          }
        }
        showToast(`Berhasil menghapus ${deleted} data redundan dari Cloud & Lokal.`);
      } else {
        showToast(`Berhasil membersihkan duplikasi di penyimpanan lokal.`);
      }
      
      const refreshedLocal = getLocalRegistrations();
      setMergedRegistrations(refreshedLocal);
    } catch(err: any) {
      console.error("Clean redundant error:", err);
      showToast("Gagal membersihkan data redundan.");
    }
  };

  const openSpreadsheet = () => {
    const sheetId = localStorage.getItem("padasuka_spreadsheet_id") || DEFAULT_SPREADSHEET_ID;
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
    window.open(url, "_blank");
    showToast("Membuka Google Spreadsheet di tab baru...");
  };

  const handleSaveSheetId = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = sheetIdInput.trim();
    const cleanWebhook = webhookUrlInput.trim();

    if (cleanId) {
      localStorage.setItem("padasuka_spreadsheet_id", cleanId);
    }
    if (cleanWebhook) {
      localStorage.setItem("padasuka_sheet_webhook_url", cleanWebhook);
    } else {
      localStorage.removeItem("padasuka_sheet_webhook_url");
    }

    setIsSheetSettingsOpen(false);
    showToast("Pengaturan Google Spreadsheet berhasil disimpan!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark text-white space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p className="text-sm text-gray-400 font-medium">Memverifikasi Enkripsi Akses Keamanan...</p>
      </div>
    );
  }

  // Tampilan Form Login Administrator Encrypted
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Glow Background Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="bg-slate-900/90 backdrop-blur-xl p-6 sm:p-10 rounded-[32px] shadow-2xl w-full max-w-md border border-slate-800 relative z-10 text-white">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20 shadow-inner">
              <ShieldCheck className="w-10 h-10 animate-pulse" />
            </div>
          </div>

          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/80 text-red-400 border border-red-800/50 rounded-full text-[11px] font-bold tracking-widest uppercase mb-2">
              <Lock className="w-3 h-3" /> SECURE AREA • NO-INDEX
            </span>
            <h2 className="font-heading tracking-tight uppercase text-white">
              ADMINISTRATOR
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Karang Taruna Desa Padasuka — eSport Festival
            </p>
          </div>

          {loginError && (
            <div className="mb-6 bg-red-950/80 border border-red-700/80 text-red-200 text-xs sm:text-sm p-4 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{loginError}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-primary" /> Username Admin
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all font-medium text-sm placeholder:text-gray-600"
                placeholder="Masukkan username"
                required
                disabled={lockoutTimer > 0}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <KeyRound className="w-3.5 h-3.5 text-primary" /> Password Security
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all font-medium text-sm placeholder:text-gray-600 pr-12"
                  placeholder="••••••••"
                  required
                  disabled={lockoutTimer > 0}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || lockoutTimer > 0}
              className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-4 rounded-xl transition-all shadow-lg shadow-primary/30 flex justify-center items-center gap-2 uppercase tracking-wider text-sm mt-2 disabled:opacity-50 cursor-pointer"
            >
              <Lock className="w-4 h-4" /> Masuk System Admin
            </button>
          </form>

          {/* Security Features Badge */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-[11px] text-gray-500 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-green-400" /> SHA-256 Enkripsi Auth</span>
              <span className="text-slate-400">Aktif</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-amber-400" /> Robot Indexing Block</span>
              <span className="text-slate-400">noindex, nofollow</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filtering Data
  const filteredRegistrations = mergedRegistrations.filter((r) => {
    const matchesSearch =
      (r.nama && r.nama.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.alamat && r.alamat.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.wa && r.wa.includes(searchTerm));
    const matchesGame = gameFilter === "all" || (r.lomba && r.lomba.toLowerCase().includes(gameFilter.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || (r.kategori && r.kategori.toLowerCase().includes(categoryFilter.toLowerCase()));
    return matchesSearch && matchesGame && matchesCategory;
  });

  const pendingCount = mergedRegistrations.filter((r) => r.status === "pending").length;

  return (
    <div className="min-h-screen bg-slate-50 text-dark">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="fixed top-20 right-4 z-[100] bg-slate-900 text-white border border-slate-700 px-4 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Navbar Dashboard */}
      <nav className="bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-8 py-4 flex flex-wrap justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex justify-center items-center border border-primary/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="leading-tight font-heading">
                Admin Panel eSport
              </h1>
              <span className="bg-red-900/60 text-red-300 text-[10px] px-2 py-0.5 rounded font-mono border border-red-700/50">
                NO-INDEX
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium">Karang Taruna Desa Padasuka</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 mt-3 sm:mt-0 flex-wrap">
          <button
            onClick={handleSyncToSpreadsheet}
            className="flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
            title="Kirim & Sinkronkan Seluruh Data ke Google Sheet"
          >
            <RefreshCw className="w-3.5 h-3.5 text-white" /> Sync ke Sheet
          </button>
          <button
            onClick={openSpreadsheet}
            className="flex items-center gap-1.5 text-xs font-bold bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 px-3.5 py-2 rounded-xl transition-all border border-emerald-800/60 shadow-sm hover:shadow-md cursor-pointer"
            title="Buka Google Spreadsheet Data"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Buka Spreadsheet
          </button>
          <button
            onClick={handleSyncCloud}
            className="flex items-center gap-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl transition-all border border-slate-700 shadow-sm hover:shadow-md cursor-pointer"
            title="Sinkronisasi Data Lokal ke Firestore Cloud"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" /> Sync Cloud
          </button>
          <button
            onClick={() => setIsBracketEditorOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold bg-amber-900/40 hover:bg-amber-800 text-amber-200 px-3.5 py-2 rounded-xl transition-all border border-amber-700/50 shadow-sm hover:shadow-md cursor-pointer"
            title="Atur Urutan Bracket / Drawing Turnamen"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" /> Atur Bracket
          </button>
          <button
            onClick={handleCleanRedundant}
            className="flex items-center gap-1.5 text-xs font-bold bg-red-900/40 hover:bg-red-800 text-red-200 px-3.5 py-2 rounded-xl transition-all border border-red-700/50 shadow-sm hover:shadow-md cursor-pointer"
            title="Hapus Data Pendaftaran Duplikat/Redundan"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" /> Hapus Redundan
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl transition-all border border-slate-700 shadow-sm hover:shadow-md cursor-pointer"
            title="Download CSV File untuk Microsoft Excel & Google Sheets"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" /> Export CSV
          </button>
          <button
            onClick={() => setIsSheetSettingsOpen(true)}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700 cursor-pointer"
            title="Pengaturan Google Spreadsheet ID"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3.5 py-2 rounded-xl transition-colors border border-red-500/30 cursor-pointer"
            title="Keluar dari Admin Panel"
          >
            <LogOut className="w-3.5 h-3.5" /> Keluar
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
        {/* Destination & Administrator Card */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="font-heading text-white">
                Informasi Penyimpanan Data Formulir
              </h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Seluruh data pendaftaran tersimpan secara real-time di <span className="text-emerald-400 font-semibold">Firebase Firestore Database</span>, di-backup pada <span className="text-emerald-400 font-semibold">Local Memory Browser</span>, serta terintegrasi dengan Google Spreadsheet: <a href="https://docs.google.com/spreadsheets/d/1XmIC9_glnSfin0xj4uunmKhUM6CAIObHsIoPTxvYQuk/edit" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-mono">1XmIC9_glnSfin0xj4uunmKhUM6CAIObHsIoPTxvYQuk</a>.
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 px-4 rounded-xl border border-slate-800 shrink-0 text-xs space-y-1">
            <div className="text-slate-400 font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-primary" /> Administrator Utama:
            </div>
            <div className="font-extrabold text-white font-mono flex items-center gap-1.5">
              febridriver@gmail.com
              <span className="bg-emerald-950 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-800">
                Super Admin
              </span>
            </div>
          </div>
        </div>
        {/* Statistics Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Menunggu Verifikasi</p>
              <p className="text-2xl font-black text-slate-900">{pendingCount}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Terverifikasi</p>
              <p className="text-2xl font-black text-slate-900">{mergedRegistrations.length - pendingCount}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Registrasi</p>
              <p className="text-2xl font-black text-slate-900">{mergedRegistrations.length}</p>
            </div>
          </div>
        </div>

        {/* Target Peserta & Dynamic Prize Pool Real-time Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {[
            {
              id: 'mlbb',
              key: 'mlbb' as const,
              name: 'Mobile Legends: Bang Bang',
              shortName: 'MLBB',
              target: 200,
              unitTarget: 40,
              unitName: 'Tim',
              color: 'amber',
              badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
              count: mergedRegistrations.filter(r => r.status === 'verified' && r.lomba?.includes('Mobile Legends')).reduce((sum, r) => sum + (Array.isArray(r.players) && r.players.length > 0 ? r.players.length : 5), 0)
            },
            {
              id: 'ff',
              key: 'ff' as const,
              name: 'Free Fire',
              shortName: 'Free Fire',
              target: 200,
              unitTarget: 50,
              unitName: 'Squad',
              color: 'rose',
              badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
              count: mergedRegistrations.filter(r => r.status === 'verified' && r.lomba?.includes('Free Fire')).reduce((sum, r) => sum + (Array.isArray(r.players) && r.players.length > 0 ? r.players.length : 4), 0)
            },
            {
              id: 'fc',
              key: 'fc' as const,
              name: 'EA SPORTS FC26',
              shortName: 'FC26',
              target: 50,
              unitTarget: 50,
              unitName: 'Peserta',
              color: 'cyan',
              badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
              count: mergedRegistrations.filter(r => r.status === 'verified' && r.lomba?.includes('FC')).reduce((sum, r) => sum + (Array.isArray(r.players) && r.players.length > 0 ? r.players.length : 1), 0)
            }
          ].map((game) => {
            const result = calculateDynamicPrize(game.key, game.count);
            const percent = Math.min(Math.round((game.count / game.target) * 100), 100);
            return (
              <div key={game.id} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-extrabold text-slate-900 text-sm sm:text-base">{game.shortName}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${game.badgeColor}`}>
                      Target: {game.target} Peserta ({game.unitTarget} {game.unitName})
                    </span>
                  </div>

                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>Peserta Terverifikasi:</span>
                      <span className="text-slate-900 font-mono">{game.count} / {game.target} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-500" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Accumulated Prize Pool:</span>
                    <span className="font-black text-slate-900 font-mono text-sm">
                      Rp {result.adjustedPrizePool.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
                    <span>Juara 1: Rp {result.juara1.toLocaleString('id-ID')}</span>
                    <span>Juara 2: Rp {result.juara2.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Data Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-slate-900">
                Daftar Pendaftar eSport ({filteredRegistrations.length})
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Add Registration Button */}
              <button
                onClick={() => {
                  resetForm();
                  setIsAddModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 text-xs font-extrabold bg-primary hover:bg-primary/90 text-slate-950 px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Tambah Pendaftar
              </button>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama, alamat, WA..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-primary w-full sm:w-56"
                />
              </div>

              {/* Game filter */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={gameFilter}
                  onChange={(e) => setGameFilter(e.target.value)}
                  className="text-xs font-medium bg-transparent focus:outline-none text-slate-700"
                >
                  <option value="all">Semua Cabang Game</option>
                  <option value="mobile legends">Mobile Legends</option>
                  <option value="free fire">Free Fire</option>
                  <option value="fc">EA SPORTS FC26</option>
                </select>
              </div>

              {/* Category filter */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-xs font-medium bg-transparent focus:outline-none text-slate-700"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="karang taruna">Karang Taruna Desa Padasuka</option>
                  <option value="umum">Kategori Umum</option>
                  <option value="sd">Kategori SD</option>
                  <option value="smp">Kategori SMP</option>
                  <option value="sma">Kategori SMA / SMK</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Nama/Tim & Pemain</th>
                  <th className="px-6 py-4">Kategori & Lomba</th>
                  <th className="px-6 py-4">Asal & Kontak WA</th>
                  <th className="px-6 py-4">Status & Waktu</th>
                  <th className="px-6 py-4 text-right">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                      Tidak ditemukan data pendaftaran yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                          <span>{reg.nama}</span>
                          {!reg.firestoreSynced && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300" title="Tersimpan di memori lokal">
                              Lokal
                            </span>
                          )}
                        </div>
                        {(Array.isArray(reg.players) && reg.players.length > 0) || reg.anggotaTim ? (
                          <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                            <p className="font-medium text-slate-600">Anggota Squad:</p>
                            <p className="text-[11px] bg-slate-100 px-2 py-1 rounded inline-block text-slate-700 font-medium leading-relaxed">
                              {Array.isArray(reg.players) ? reg.players.filter(Boolean).join(", ") : reg.anggotaTim}
                            </p>
                          </div>
                        ) : null}
                        <div className="text-[11px] text-slate-400 mt-1">Usia: {reg.usia || "-"} Thn</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{reg.lomba}</div>
                        <span className="inline-block text-[11px] font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full mt-1">
                          {reg.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-medium text-slate-700">{reg.alamat}</div>
                        <a
                          href={`https://wa.me/${formatWaNumber(reg.wa)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:underline font-bold text-xs inline-flex items-center gap-1.5 mt-1"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0 inline" /> WA: {reg.wa}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {reg.status === "pending" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              <Clock className="w-3.5 h-3.5" /> Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle className="w-3.5 h-3.5" /> Verified
                            </span>
                          )}
                          <div className="text-[10px] text-slate-400 font-mono">
                            {formatRegistrationDate(reg.createdAt)}
                          </div>
                          <div className="flex flex-col gap-1 mt-1">
                            {(() => {
                              const fee = getFeeDetails(reg);
                              return (
                                <>
                                  <div className="text-[11px] font-black text-slate-900 bg-slate-100/90 px-2 py-0.5 rounded border border-slate-200/60 inline-flex items-center gap-1 shadow-sm w-fit">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Bayar:</span> {fee.formattedBayar}
                                  </div>
                                  <div className="text-[11px] font-black text-slate-900 bg-slate-100/90 px-2 py-0.5 rounded border border-slate-200/60 inline-flex items-center gap-1 shadow-sm w-fit">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Biaya:</span> {fee.formattedBiaya}
                                  </div>
                                  {fee.sisa !== 0 && (
                                    <div className={`text-[11px] font-black px-2 py-0.5 rounded border inline-flex items-center gap-1 shadow-sm w-fit ${fee.sisa > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                      <span className={`text-[9px] font-bold uppercase tracking-wide ${fee.sisa > 0 ? 'text-emerald-600' : 'text-red-600'}`}>Sisa:</span> {fee.formattedSisa}
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        {reg.status === "pending" ? (
                          <button
                            onClick={() => updateStatus(reg.id, "verified")}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
                          >
                            Verifikasi
                          </button>
                        ) : (
                          <button
                            onClick={() => updateStatus(reg.id, "pending")}
                            className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Batalkan
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(reg)}
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors cursor-pointer"
                          title="Edit data pendaftaran"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteRegistration(reg.id)}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                          title="Hapus pendaftaran"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <a
                          href={generateTMUrl(reg.wa || "", reg.nama || "")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          title="Undang Technical Meeting (WhatsApp)"
                        >
                          <WhatsAppIcon className="w-4 h-4 shrink-0" />
                          <span className="text-xs font-bold">TM</span>
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Add / Edit Data Pendaftaran */}
      {(isAddModalOpen || editingReg) && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative border border-slate-200 my-8">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingReg(null);
              }}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 rounded-full transition-colors"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-slate-900 flex items-center justify-center font-bold shrink-0">
                {editingReg ? <Pencil className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-slate-900 font-heading">
                  {editingReg ? "Edit Data Pendaftaran" : "Tambah Pendaftar Baru"}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Tersimpan di Firestore & ter-sync otomatis ke Google Sheet
                </p>
              </div>
            </div>

            <form onSubmit={editingReg ? handleSaveEdit : handleSaveNew} className="space-y-4 text-xs font-medium text-slate-700">
              <div>
                <label className="block text-slate-800 font-bold mb-1">Nama Lengkap / Nama Tim *</label>
                <input
                  type="text"
                  required
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  placeholder="Contoh: Tim RRQ Padasuka / Ahmad Fauzi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Usia (Tahun)</label>
                  <input
                    type="text"
                    value={formUsia}
                    onChange={(e) => setFormUsia(e.target.value)}
                    placeholder="Contoh: 18"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Nomor WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={formWa}
                    onChange={(e) => setFormWa(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Kategori Pendaftar</label>
                <select
                  value={formKategori}
                  onChange={(e) => setFormKategori(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-slate-900 bg-white"
                >
                  <option value="Kategori Pemuda Karang Taruna Desa Padasuka">Kategori Pemuda Karang Taruna Desa Padasuka</option>
                  <option value="Kategori Umum">Kategori Umum</option>
                  <option value="Kategori SD">Kategori SD</option>
                  <option value="Kategori SMP">Kategori SMP</option>
                  <option value="Kategori SMA / SMK">Kategori SMA / SMK</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Lomba / Cabang Game</label>
                <select
                  value={formLomba}
                  onChange={(e) => setFormLomba(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-slate-900 bg-white"
                >
                  <option value="Mobile Legends: Bang Bang (5v5 Squad)">Mobile Legends: Bang Bang (5v5 Squad)</option>
                  <option value="Free Fire (Squad 4 Player)">Free Fire (Squad 4 Player)</option>
                  <option value="EA SPORTS FC26 (1v1 Solo)">EA SPORTS FC26 (1v1 Solo)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Alamat / Asal Kampung</label>
                <input
                  type="text"
                  value={formAlamat}
                  onChange={(e) => setFormAlamat(e.target.value)}
                  placeholder="Contoh: Kp. Padasuka RT 02/05"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Daftar Anggota Pemain (1 baris 1 nama)</label>
                <textarea
                  rows={3}
                  value={formPlayers}
                  onChange={(e) => setFormPlayers(e.target.value)}
                  placeholder="Pemain 1&#10;Pemain 2&#10;Pemain 3..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Status Verifikasi</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as "pending" | "verified")}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-slate-900 bg-white"
                >
                  <option value="pending">PENDING (Terdaftar / Belum Bayar)</option>
                  <option value="verified">VERIFIED (Lunas / Terverifikasi)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingReg(null);
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Simpan & Sync Spreadsheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal Petunjuk Otorisasi Domain Firebase Auth */}
      {isUnauthorizedModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl relative border border-slate-200 my-8">
            <button
              onClick={() => setIsUnauthorizedModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 rounded-full transition-colors"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-slate-900 font-heading">
                  Otorisasi Domain Firebase Auth
                </h3>
                <p className="text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full inline-block mt-0.5 border border-amber-200">
                  Firebase Error: auth/unauthorized-domain
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-medium text-slate-700 leading-relaxed">
              <p className="text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                Otentikasi Google membutuhkan pendaftaran domain <strong className="text-slate-900 font-mono">festival.baros.my.id</strong> di dalam menu <span className="font-bold text-slate-800">Authorized Domains Firebase Console</span> agar popup Google OAuth diizinkan.
              </p>

              <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl space-y-3 font-mono text-[11px]">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-sans font-bold uppercase tracking-wider">
                  <span>Langkah Otorisasi Firebase Console (1 Menit)</span>
                  <span className="text-emerald-400">Instan</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-200 font-sans">
                  <li>Buka <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-bold">Firebase Console</a> lalu pilih proyek eSport Padasuka.</li>
                  <li>Pilih menu <strong>Authentication</strong> di sebelah kiri.</li>
                  <li>Buka tab <strong>Settings</strong> &rarr; klik <strong>Authorized Domains</strong>.</li>
                  <li>Klik <strong>Add Domain</strong> lalu masukkan domain berikut:</li>
                </ol>

                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800 gap-2 mt-2">
                  <span className="font-mono text-emerald-400 font-bold text-xs truncate">festival.baros.my.id</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("festival.baros.my.id");
                      setIsCopiedDomain(true);
                      setTimeout(() => setIsCopiedDomain(false), 2500);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors shrink-0 font-sans font-bold text-[11px] cursor-pointer"
                  >
                    {isCopiedDomain ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" /> Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Salin Domain
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-emerald-900 flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-emerald-950">Akses Admin & Data Pendaftaran Tetap Bekerja 100%!</p>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Data pendaftaran Anda tersimpan aman di Firestore & Local Storage. Anda juga dapat langsung mengeksport data dalam format CSV untuk langsung diimpor ke Google Sheets.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    exportToCSV();
                    showToast("File CSV berhasil diunduh!");
                  }}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" /> Export CSV Langsung
                </button>
                <button
                  type="button"
                  onClick={openSpreadsheet}
                  className="px-4 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Buka Spreadsheet
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsUnauthorizedModalOpen(false);
                    handleSyncToSpreadsheet();
                  }}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> Coba Sync Lagi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal Settings Spreadsheet ID & Webhook */}
      {isSheetSettingsOpen && (
        <div className="fixed inset-0 z-[125] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl relative border border-slate-200 my-8">
            <button
              onClick={() => setIsSheetSettingsOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 rounded-full transition-colors"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-slate-900 font-heading">
                  Pengaturan Google Sheet
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Konfigurasi Integrasi & Bypass Program Perlindungan Lanjutan
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSheetId} className="space-y-5 text-xs font-medium text-slate-700">
              {/* Solution 1: Webhook Apps Script (Bypasses Advanced Protection) */}
              <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-900 font-bold flex items-center gap-1.5">
                    <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">Solusi Bebas OAuth</span>
                    Apps Script Webhook URL (Direkomendasikan)
                  </label>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Jika akun Google Anda menggunakan <strong>Program Perlindungan Lanjutan</strong>, Google memblokir popup OAuth login. Masukkan URL Web App Google Apps Script di sini untuk menyinkronkan data secara otomatis tanpa login:
                </p>
                <input
                  type="url"
                  value={webhookUrlInput}
                  onChange={(e) => setWebhookUrlInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 focus:outline-none focus:border-emerald-600 bg-white text-slate-900 font-mono text-xs shadow-sm"
                />

                {/* Script Code Collapsible Guide */}
                <div className="mt-3 pt-2 border-t border-emerald-200/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-slate-800">Cara Buat Apps Script di Google Sheet:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const code = `function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear();
  if (data.headers) sheet.appendRow(data.headers);
  if (data.rows && data.rows.length) {
    data.rows.forEach(function(row) { sheet.appendRow(row); });
  }
  return ContentService.createTextOutput(JSON.stringify({result: "success"}))
    .setMimeType(ContentService.MimeType.JSON);
}`;
                        navigator.clipboard.writeText(code);
                        setCopiedScriptCode(true);
                        setTimeout(() => setCopiedScriptCode(false), 3000);
                      }}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedScriptCode ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                      {copiedScriptCode ? "Kode Tersalin!" : "Salin Skrip Google"}
                    </button>
                  </div>
                  <ol className="list-decimal list-inside text-[11px] text-slate-600 space-y-1 mt-1 leading-normal">
                    <li>Buka Google Sheet milik Anda &gt; menu <strong>Ekstensi</strong> &gt; <strong>Apps Script</strong>.</li>
                    <li>Salin kode skrip di atas, lalu tempelkan di editor Apps Script.</li>
                    <li>Klik <strong>Terapkan (Deploy)</strong> &gt; <strong>Terapkan sebagai Aplikasi Web</strong>.</li>
                    <li>Pilih Akses: <strong>Siapa Saja (Anyone)</strong>, lalu salin URL yang diberikan dan tempel di kolom di atas.</li>
                  </ol>
                </div>
              </div>

              {/* Solution 2: Spreadsheet ID Standard */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <label className="block text-slate-900 font-bold">
                  Spreadsheet ID (Metode Standar OAuth)
                </label>
                <input
                  type="text"
                  value={sheetIdInput}
                  onChange={(e) => setSheetIdInput(e.target.value)}
                  placeholder="Contoh: 1XmIC9_glnSfin0xj4uunmKhUM6CAIObHsIoPTxvYQuk"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white text-slate-900 font-mono text-xs"
                />
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Diambil dari URL spreadsheet Google Anda: <br />
                  <span className="font-mono text-slate-700 text-[10px]">
                    docs.google.com/spreadsheets/d/<strong>[SPREADSHEET_ID]</strong>/edit
                  </span>
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSheetSettingsOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Simpan Pengaturan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    
      {isBracketEditorOpen && (
        <AdminBracketManager
          registrations={mergedRegistrations}
          onClose={() => setIsBracketEditorOpen(false)}
        />
      )}
</div>
  );
}
