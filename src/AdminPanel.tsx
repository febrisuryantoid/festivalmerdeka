import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ShieldAlert, LogOut, CheckCircle, Clock, Trash2, Users, Trophy } from "lucide-react";

export default function AdminPanel() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [registrations, setRegistrations] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "registrations"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRegistrations(data);
    });
    return unsub;
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    
    if (username !== "festival" || password !== "17Agustus26") {
      setLoginError("Username atau password tidak dikenali.");
      setLoading(false);
      return;
    }
    
    const email = "festival@padasuka.id";
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found") {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
        } catch (createErr: any) {
          setLoginError("Akses ditolak. Cek kembali password Anda.");
        }
      } else {
        setLoginError("Terjadi kesalahan. Cek koneksi Anda.");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "registrations", id), { status });
  };

  const deleteRegistration = async (id: string) => {
    if (window.confirm("Hapus pendaftaran ini?")) {
      await deleteDoc(doc(db, "registrations", id));
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-50 text-primary rounded-xl flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-dark mb-8 font-heading">Admin Panel</h2>
          {loginError && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-3 rounded-xl">{loginError}</p>}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Masukkan username" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex justify-center items-center">
              Masuk Secure Area
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pendingCount = registrations.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex justify-center items-center"><ShieldAlert className="w-5 h-5" /></div>
          <div>
            <h1 className="font-bold text-dark leading-tight">Admin Dashboard</h1>
            <p className="text-xs text-secondary font-medium">Festival Merdeka 2026</p>
          </div>
        </div>
        <button onClick={() => signOut(auth)} className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0"><Clock className="w-6 h-6" /></div>
            <div><p className="text-sm text-gray-500 font-medium">Menunggu Verifikasi</p><p className="text-2xl font-bold text-gray-900">{pendingCount}</p></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0"><CheckCircle className="w-6 h-6" /></div>
            <div><p className="text-sm text-gray-500 font-medium">Pendaftar Terverifikasi</p><p className="text-2xl font-bold text-gray-900">{registrations.length - pendingCount}</p></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Trophy className="w-6 h-6" /></div>
            <div><p className="text-sm text-gray-500 font-medium">Total Peserta eSport</p><p className="text-2xl font-bold text-gray-900">{registrations.length}</p></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-dark flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Data Pendaftaran eSport</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Nama/Tim</th>
                  <th className="px-6 py-4">Kategori & Lomba</th>
                  <th className="px-6 py-4">Asal & WA</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {registrations.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Belum ada tim yang mendaftar.</td></tr>
                ) : registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{reg.nama}</div>
                      <div className="text-xs mt-0.5">Rata-rata Usia: {reg.usia} Thn</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{reg.lomba}</div>
                      <div className="text-xs bg-gray-100 text-gray-600 inline-block px-2 py-1 rounded mt-1">{reg.kategori}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{reg.alamat}</div>
                      <a href={`https://wa.me/${reg.wa}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1 mt-1">WA: {reg.wa}</a>
                    </td>
                    <td className="px-6 py-4">
                      {reg.status === 'pending' ? (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                           <Clock className="w-3 h-3" /> Pending
                         </span>
                      ) : (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                           <CheckCircle className="w-3 h-3" /> Verified
                         </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      {reg.status === 'pending' ? (
                        <button onClick={() => updateStatus(reg.id, 'verified')} className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors">Verifikasi</button>
                      ) : (
                        <button onClick={() => updateStatus(reg.id, 'pending')} className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs font-bold rounded-lg transition-colors">Batalkan</button>
                      )}
                      <button onClick={() => deleteRegistration(reg.id)} className="px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
