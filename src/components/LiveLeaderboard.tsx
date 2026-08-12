import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Gamepad2, ShieldCheck, Clock, Layers } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FC26_LOGO, MLBB_LOGO, FF_LOGO } from "../lib/utils";
import { getLocalRegistrations, mergeRegistrations, RegistrationData, formatRegistrationDate, parseTimestampMillis } from "../lib/registrationsStore";

const getShortLomba = (lomba?: string) => {
  if (!lomba) return "-";
  const l = lomba.toLowerCase();
  if (l.includes("mobile") || l.includes("ml") || l.includes("legends")) return "MLBB";
  if (l.includes("free") || l.includes("fire") || l.includes("ff")) return "FF";
  if (l.includes("fc") || l.includes("ps") || l.includes("ea") || l.includes("fifa")) return "FC26";
  return lomba;
};

export function LiveLeaderboard() {
  const [participants, setParticipants] = useState<RegistrationData[]>(() => {
    try {
      const local = getLocalRegistrations();
      return local.filter(p => (p.status || "").toLowerCase().trim() === "verified");
    } catch {
      return [];
    }
  });
  const [activeTab, setActiveTab] = useState("Semua");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "registrations"), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const local = getLocalRegistrations();
      const merged = mergeRegistrations(docs, local);
      setParticipants(merged.filter(p => (p.status || "").toLowerCase().trim() === "verified"));
    }, (error) => {
      console.warn("Leaderboard snapshot fallback to local:", error);
      const local = getLocalRegistrations().filter(p => (p.status || "").toLowerCase().trim() === "verified");
      setParticipants(local);
    });
    return unsub;
  }, []);

  const filtered = participants.filter(p => {
    if (activeTab === "Semua") return true;
    if (!p.lomba) return false;
    const l = p.lomba.toLowerCase();
    if (activeTab === "Mobile Legends") return l.includes("mobile") || l.includes("ml") || l.includes("legends");
    if (activeTab === "Free Fire") return l.includes("free") || l.includes("fire") || l.includes("ff");
    if (activeTab === "PS 4 Pro FC26") return l.includes("fc") || l.includes("ps") || l.includes("ea") || l.includes("fifa");
    return l.includes(activeTab.toLowerCase());
  }).sort((a, b) => {
    const timeA = parseTimestampMillis(a.createdAt);
    const timeB = parseTimestampMillis(b.createdAt);
    return timeA - timeB; // Ascending: oldest top, newest bottom
  });

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl border border-white/20 p-5 sm:p-8 rounded-[24px] shadow-2xl relative overflow-hidden">
      <div className="flex flex-col items-center text-center gap-5 mb-8">
        <div className="flex flex-col items-center w-full">
           <h3 className="font-heading text-dark flex items-center justify-center gap-2">
             <ShieldCheck className="w-6 h-6 text-emerald-500" /> Peserta Terdaftar (Tim Terverifikasi)
           </h3>
           <p className="text-secondary text-sm font-medium mt-1">
             Daftar resmi tim yang sudah diverifikasi oleh admin. Tersinkronisasi real-time.
           </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center flex-wrap mx-auto bg-gray-100 p-1.5 rounded-xl w-full sm:w-max gap-2">
          <button
            onClick={() => setActiveTab("Semua")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "Semua" ? "bg-primary text-white shadow-md" : "text-slate-600 hover:bg-gray-200/60"
            }`}
          >
            <Layers className="w-4 h-4" /> Semua Tim ({participants.length})
          </button>
          {[
            { name: "Mobile Legends", key: "Mobile Legends", logo: MLBB_LOGO },
            { name: "Free Fire", key: "Free Fire", logo: FF_LOGO },
            { name: "PS 4 Pro FC26", key: "PS 4 Pro FC26", logo: FC26_LOGO }
          ].map(game => {
            const isActive = activeTab === game.key;
            return (
              <button
                key={game.name}
                onClick={() => setActiveTab(game.key)}
                className={`flex items-center justify-center p-2 rounded-lg transition-all shadow-sm cursor-pointer ${
                  isActive ? "bg-primary text-white shadow-md" : "hover:bg-gray-200/50"
                }`}
              >
                <div className="w-16 sm:w-24 md:w-28 aspect-[2/1] flex items-center justify-center">
                  <img
                    src={game.logo}
                    alt={game.name}
                    className={`h-full max-w-full object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105 ${
                      isActive ? "brightness-0 invert" : ""
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-[200px]">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-gray-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Gamepad2 className="w-12 h-12 mb-3 opacity-20" />
            <p className="font-medium text-sm text-slate-500">Belum ada tim terverifikasi untuk kategori ini.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-16 text-center">No.</th>
                    <th className="py-3.5 px-4">Nama / Nama Tim</th>
                    <th className="py-3.5 px-4">Alamat / Asal</th>
                    <th className="py-3.5 px-4">Jenis Lomba</th>
                    <th className="py-3.5 px-4 text-right">Status Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-800">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((item, i) => (
                      <motion.tr
                        key={item.id || item.localId || i}
                        layout
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-emerald-50/40 transition-colors"
                      >
                        <td className="py-3.5 px-4 text-center font-black text-emerald-700 bg-emerald-50/60 rounded-lg">
                          #{i + 1}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900 text-base sm:text-lg">
                          <div className="flex items-center gap-2">
                            <span>{item.nama}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-sm text-slate-600 font-semibold whitespace-nowrap">
                          {item.alamat || "-"}
                        </td>
                        <td className="py-3.5 px-4 text-sm font-black text-slate-700 whitespace-nowrap">
                          {getShortLomba(item.lomba)}
                        </td>
                        <td className="py-3.5 px-4 text-right text-xs sm:text-sm font-bold whitespace-nowrap">
                          <span className="inline-flex items-center justify-end gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> TERVERIFIKASI
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {filtered.length > 0 && (
         <div className="mt-6 text-center text-secondary text-xs sm:text-sm font-medium border-t border-gray-100 pt-6">
           Sistem Bagan (Bracket) Pertandingan akan diundi secara otomatis H-3 lomba oleh Admin.
         </div>
      )}
    </div>
  );
}

