import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Users, Gamepad2, ShieldCheck, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function LiveLeaderboard() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Mobile Legends (Tim)");

  useEffect(() => {
    const q = query(collection(db, "registrations"), where("status", "==", "verified"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setParticipants(data);
    });
    return unsub;
  }, []);

  const filtered = participants.filter(p => p.lomba?.includes(activeTab));

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl border border-white/20 p-5 sm:p-8 rounded-[24px] shadow-2xl relative overflow-hidden">
      <div className="flex flex-col items-start gap-5 mb-8">
        <div>
           <h3 className="text-xl sm:text-2xl font-bold font-heading text-dark flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-green-500" /> Peserta Terdaftar (Real-time)</h3>
           <p className="text-secondary text-sm font-medium mt-1">Tim yang sudah diverifikasi pembayarannya oleh admin.</p>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-xl w-full sm:w-max overflow-x-auto hide-scrollbar gap-1">
          {[
            { name: "Mobile Legends", logo: "https://upload.wikimedia.org/wikipedia/en/a/a0/Mobile_Legends_Bang_Bang_2025_logo.png" },
            { name: "Free Fire", logo: "https://upload.wikimedia.org/wikipedia/id/8/8b/Garena_Free_Fire_New_Style.png" },
            { name: "EA Sports FC", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/FC_26_Logo.svg/1280px-FC_26_Logo.svg.png" }
          ].map(game => {
            const isML = game.name === "Mobile Legends";
            const filterKey = isML ? "Mobile Legends" : (game.name === "Free Fire" ? "Free Fire" : "EA Sports FC 26");
            const isActive = activeTab.includes(filterKey);
            return (
              <button
                key={game.name}
                onClick={() => setActiveTab(isML ? "Mobile Legends (Tim)" : (game.name === "Free Fire" ? "Free Fire (Squad)" : "EA Sports FC 26 (Individu)"))}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 whitespace-nowrap px-4 py-2 sm:py-2.5 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200/50' : 'text-gray-500 hover:text-dark hover:bg-gray-200/50'}`}
              >
                <img src={game.logo} alt={game.name} className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow-sm" />
                <span className={`${isActive ? 'block' : 'hidden sm:block'}`}>{game.name}</span>
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
