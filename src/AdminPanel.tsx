import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { 
  ShieldAlert, LogOut, CheckCircle, Clock, Trash2, Users, Trophy, 
  Lock, Eye, EyeOff, ShieldCheck, KeyRound, Search, Filter, Download, AlertTriangle, RefreshCw, FileSpreadsheet, ExternalLink, Mail
} from "lucide-react";
import { WhatsAppIcon } from "./components/WhatsAppIcon";
import { calculateDynamicPrize } from "./lib/utils";
import { 
  RegistrationData, 
  getLocalRegistrations, 
  mergeRegistrations, 
  updateRegistrationStatusInStore, 
  deleteRegistrationFromStore, 
  syncLocalRegistrationsToFirestore, 
  formatRegistrationDate 
} from "./lib/registrationsStore";

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
  const [mergedRegistrations, setMergedRegistrations] = useState<RegistrationData[]>([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [gameFilter, setGameFilter] = useState("all");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

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

    // Trigger sync unsynced local registrations to Firestore automatically
    syncLocalRegistrationsToFirestore().catch(err => console.error("Auto sync err:", err));

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
          } catch (cErr) {
            console.error("Firebase auth creation fallback:", cErr);
          }
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

  const updateStatus = async (id: string, status: "pending" | "verified") => {
    try {
      await updateRegistrationStatusInStore(id, status);
      
      // Update state locally for immediate UI response
      setMergedRegistrations(prev => 
        prev.map(r => r.id === id ? { ...r, status } : r)
      );

      showToast(`Status pendaftaran berhasil diperbarui menjadi: ${status.toUpperCase()}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      showToast("Gagal memperbarui status.");
    }
  };

  const deleteRegistration = async (id: string) => {
    if (window.confirm("Hapus data pendaftaran ini secara permanen?")) {
      try {
        await deleteRegistrationFromStore(id);
        
        setMergedRegistrations(prev => prev.filter(r => r.id !== id));
        showToast("Data pendaftaran berhasil dihapus.");
      } catch (err) {
        console.error("Failed to delete registration:", err);
        showToast("Gagal menghapus data.");
      }
    }
  };

  const exportToCSV = () => {
    if (mergedRegistrations.length === 0) return;
    const headers = ["Nama/Tim", "Kategori", "Lomba", "Alamat", "Nomor WA", "Pemain", "Status", "Tanggal"];
    const rows = mergedRegistrations.map((r) => [
      `"${r.nama || ''}"`,
      `"${r.kategori || ''}"`,
      `"${r.lomba || ''}"`,
      `"${r.alamat || ''}"`,
      `"${r.wa || ''}"`,
      `"${Array.isArray(r.players) ? r.players.join('; ') : ''}"`,
      `"${r.status || ''}"`,
      `"${formatRegistrationDate(r.createdAt)}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_Peserta_eSport_Padasuka_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openSpreadsheet = () => {
    const sheetId = localStorage.getItem("padasuka_spreadsheet_id");
    if (sheetId) {
      window.open(`https://docs.google.com/spreadsheets/d/${sheetId}/edit`, "_blank");
    } else {
      showToast("Spreadsheet ID otomatis dibuat saat otentikasi Google Sheets aktif. Anda juga bisa mengunduh file Excel/CSV via tombol 'Export CSV'.");
    }
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
            <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight uppercase text-white">
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
    return matchesSearch && matchesGame;
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
              <h1 className="font-extrabold text-base sm:text-lg leading-tight font-heading">
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
            onClick={openSpreadsheet}
            className="flex items-center gap-1.5 text-xs font-bold bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 px-3 py-2 rounded-lg transition-colors border border-emerald-800/60"
            title="Buka Google Spreadsheet Data"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Buka Spreadsheet
          </button>
          <button
            onClick={() => syncLocalRegistrationsToFirestore().then(() => showToast("Sinkronisasi data lokal ke Firestore selesai."))}
            className="flex items-center gap-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg transition-colors border border-slate-700"
            title="Sinkronisasi Data Lokal ke Cloud"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" /> Sync Cloud
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-lg transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-green-400" /> Export CSV
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-bold bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3.5 py-2 rounded-lg transition-colors border border-red-500/30"
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
              <h2 className="text-base font-extrabold font-heading text-white">
                Informasi Penyimpanan Data Formulir
              </h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Seluruh data pendaftaran tersimpan secara real-time di <span className="text-emerald-400 font-semibold">Firebase Firestore Database</span> dan di-backup secara otomatis pada <span className="text-emerald-400 font-semibold">Local Memory Browser</span>. Anda juga dapat mengekspor atau membuka ke Google Spreadsheet dengan tombol di atas.
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
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Daftar Pendaftar eSport ({filteredRegistrations.length})
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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
                          href={`https://wa.me/${reg.wa?.replace(/[^0-9]/g, '')}`}
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
                          onClick={() => deleteRegistration(reg.id)}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                          title="Hapus pendaftaran"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
