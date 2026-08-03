import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Gamepad2, ShieldCheck, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FC26_LOGO, MLBB_LOGO, FF_LOGO } from "../lib/utils";
import { getLocalRegistrations, mergeRegistrations, RegistrationData } from "../lib/registrationsStore";

export function LiveLeaderboard() {
  const [participants, setParticipants] = useState<RegistrationData[]>([]);
  const [activeTab, setActiveTab] = useState("Mobile Legends");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "registrations"), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const local = getLocalRegistrations();
      const merged = mergeRegistrations(docs, local);
      setParticipants(merged.filter(p => p.status === "verified"));
    }, (error) => {
      console.warn("Leaderboard snapshot fallback to local:", error);
      const local = getLocalRegistrations().filter(p => p.status === "verified");
      setParticipants(local);
    });
    return unsub;
  }, []);

  const filtered = participants.filter(p => {
    if (!p.lomba) return false;
    if (activeTab === "Mobile Legends") return p.lomba.includes("Mobile Legends");
    if (activeTab === "Free Fire") return p.lomba.includes("Free Fire");
    if (activeTab === "PS 4 Pro FC26") return p.lomba.includes("FC") || p.lomba.includes("PS 4") || p.lomba.includes("EA Sports");
    return p.lomba.includes(activeTab);
  });

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl border border-white/20 p-5 sm:p-8 rounded-[24px] shadow-2xl relative overflow-hidden">
      <div className="flex flex-col items-center text-center gap-5 mb-8">
        <div className="flex flex-col items-center w-full">
           <h3 className="text-xl sm:text-2xl font-bold font-heading text-dark flex items-center justify-center gap-2"><ShieldCheck className="w-6 h-6 text-green-500" /> Peserta Terdaftar</h3>
           <p className="text-secondary text-sm font-medium mt-1">Tim yang sudah diverifikasi pembayarannya oleh admin.</p>
        </div>
        <div className="flex justify-center mx-auto bg-gray-100 p-1.5 rounded-xl w-max gap-2.5 sm:gap-4">
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
                className={`flex items-center justify-center p-2 rounded-lg transition-all shadow-sm ${isActive ? 'bg-primary' : 'hover:bg-gray-200/50'}`}
              >
                <div className="w-20 sm:w-28 md:w-32 lg:w-40 aspect-[2/1] flex items-center justify-center">
                  <img src={game.logo} alt={game.name} className={`h-full max-w-full object-contain drop-shadow-sm transition-transform duration-300 hover:scale-110 ${isActive ? 'brightness-0 invert' : ''}`} />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="min-h-[200px]">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
            <Gamepad2 className="w-12 h-12 mb-3 opacity-20" />
            <p>Belum ada tim terverifikasi untuk kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100/50 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-heading text-xl shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-dark truncate text-lg">{item.nama}</h4>
                    <div className="flex items-center gap-3 text-xs font-semibold text-secondary mt-1">
                      <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-gray-600"><User className="w-3 h-3"/> Asal: {item.alamat}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {filtered.length > 0 && (
         <div className="mt-6 text-center text-secondary text-sm font-medium border-t border-gray-100 pt-6">
           Sistem Bagan (Bracket) Pertandingan akan diundi secara otomatis H-3 lomba oleh Admin.
         </div>
      )}
    </div>
  )
}
