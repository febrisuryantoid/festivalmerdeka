import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { ShieldCheck, Trophy, Swords } from "lucide-react";
import { FC26_LOGO, MLBB_LOGO, FF_LOGO } from "../lib/utils";
import { getLocalRegistrations, RegistrationData, parseTimestampMillis } from "../lib/registrationsStore";

export function TournamentBracket() {
  const [participants, setParticipants] = useState<RegistrationData[]>(() => {
    try {
      const local = getLocalRegistrations();
      return local.filter(p => (p.status || "").toLowerCase().trim() === "verified");
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState("Mobile Legends");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "registrations"), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RegistrationData));
      const verified = docs.filter(d => (d.status || "").toLowerCase().trim() === "verified");
      setParticipants(verified);
    }, (error) => {
      console.warn("Bracket realtime fetch failed:", error);
    });

    return () => unsub();
  }, []);

  const filteredParticipants = participants.filter(p => {
    const l = (p.lomba || "").toLowerCase();
    if (activeTab === "Mobile Legends" && (l.includes("mobile") || l.includes("ml") || l.includes("legends"))) return true;
    if (activeTab === "Free Fire" && (l.includes("free") || l.includes("fire") || l.includes("ff"))) return true;
    if (activeTab === "PS 4 Pro FC26" && (l.includes("fc") || l.includes("ps") || l.includes("ea") || l.includes("fifa"))) return true;
    return false;
  }).sort((a, b) => {
    const timeA = parseTimestampMillis(a.createdAt);
    const timeB = parseTimestampMillis(b.createdAt);
    return timeA - timeB; 
  });

  // Mock a bracket structure (e.g. 8 teams for Quarter Finals)
  // Fill available slots, pad with TBD
  const bracketSlots = Array(8).fill(null).map((_, i) => {
    return filteredParticipants[i] ? filteredParticipants[i].nama : "TBD";
  });

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl border border-white/20 p-5 sm:p-8 rounded-[24px] shadow-2xl relative overflow-hidden">
      <div className="flex flex-col items-center text-center gap-5 mb-8">
        <div className="flex flex-col items-center w-full">
           <h3 className="font-heading text-dark flex items-center justify-center gap-2">
             <Trophy className="w-6 h-6 text-gold" /> Bagan Turnamen
           </h3>
           <p className="text-secondary text-sm font-medium mt-1">
             Struktur pertandingan resmi yang akan di-update saat technical meeting.
           </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center flex-wrap mx-auto bg-gray-100 p-1.5 rounded-xl w-full sm:w-max gap-2">
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

      {/* Bracket UI Mock */}
      <div className="overflow-x-auto pb-8 pt-4 w-full">
        <div className="min-w-[800px] flex justify-between px-2 gap-8">
          
          {/* Quarter Finals */}
          <div className="flex flex-col gap-4 w-48 shrink-0 py-8 relative">
            <h4 className="text-center text-slate-400 uppercase tracking-wider absolute top-0 left-0 right-0">Quarter Finals</h4>
            {[0, 1, 2, 3].map(i => (
              <div key={`qf-${i}`} className="h-[60px] bg-slate-50 border border-slate-200 rounded-lg p-2 shadow-sm flex flex-col justify-center gap-1 relative z-10">
                <div className="px-2 py-0.5 bg-white border border-slate-100 rounded text-xs font-bold text-slate-700 flex justify-between items-center">
                  <span className="truncate">{bracketSlots[i*2] || "TBD"}</span>
                  <span className="text-[10px] text-slate-400 font-mono">0</span>
                </div>
                <div className="px-2 py-0.5 bg-white border border-slate-100 rounded text-xs font-bold text-slate-700 flex justify-between items-center">
                  <span className="truncate">{bracketSlots[i*2+1] || "TBD"}</span>
                  <span className="text-[10px] text-slate-400 font-mono">0</span>
                </div>
                {/* Connector line Right */}
                <div className="absolute -right-4 top-1/2 w-4 h-[2px] bg-slate-200" />
              </div>
            ))}
          </div>

          {/* Semi Finals */}
          <div className="flex flex-col gap-[76px] w-48 shrink-0 pt-[62px] relative">
            <h4 className="text-center text-slate-400 uppercase tracking-wider absolute top-0 left-0 right-0">Semi Finals</h4>
            {[0, 1].map(i => (
              <div key={`sf-${i}`} className="h-[60px] bg-slate-50 border border-slate-200 rounded-lg p-2 shadow-sm flex flex-col justify-center gap-1 relative z-10">
                <div className="px-2 py-0.5 bg-white border border-slate-100 rounded text-xs font-bold text-slate-400 flex justify-between items-center italic">
                  <span className="truncate">Menunggu Lawan</span>
                  <span className="text-[10px] text-slate-300 font-mono">-</span>
                </div>
                <div className="px-2 py-0.5 bg-white border border-slate-100 rounded text-xs font-bold text-slate-400 flex justify-between items-center italic">
                  <span className="truncate">Menunggu Lawan</span>
                  <span className="text-[10px] text-slate-300 font-mono">-</span>
                </div>
                
                {/* Connector line Left (Vertical join) */}
                <div className="absolute -left-4 top-1/2 w-4 h-[2px] bg-slate-200" />
                <div className="absolute -left-4 w-[2px] bg-slate-200" style={{
                  top: i === 0 ? '50%' : '-15px',
                  bottom: i === 0 ? '-15px' : '50%',
                  height: '53px'
                }} />

                {/* Connector line Right */}
                <div className="absolute -right-4 top-1/2 w-4 h-[2px] bg-slate-200" />
              </div>
            ))}
          </div>

          {/* Grand Final */}
          <div className="flex flex-col justify-center w-56 shrink-0 relative pt-8">
            <h4 className="text-center text-gold uppercase tracking-wider absolute top-0 left-0 right-0 flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3" /> Grand Final
            </h4>
            <div className="bg-gradient-to-br from-gold/20 to-amber-100 border-2 border-gold/40 rounded-xl p-3 shadow-lg flex flex-col gap-2 relative z-10">
              <div className="px-3 py-1.5 bg-white rounded-lg text-sm font-black text-slate-700 flex justify-between items-center shadow-sm">
                <span className="truncate">TBD</span>
                <span className="text-xs text-slate-400 font-mono">-</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Swords className="w-4 h-4 text-gold/70" />
              </div>
              <div className="px-3 py-1.5 bg-white rounded-lg text-sm font-black text-slate-700 flex justify-between items-center shadow-sm">
                <span className="truncate">TBD</span>
                <span className="text-xs text-slate-400 font-mono">-</span>
              </div>

              {/* Connector line Left (Vertical join) */}
              <div className="absolute -left-4 top-1/2 w-4 h-[2px] bg-slate-200" />
              <div className="absolute -left-4 w-[2px] bg-slate-200 top-[-26px] h-[136px]" />
            </div>
          </div>

          {/* Winner */}
          <div className="flex flex-col justify-center w-48 shrink-0 relative pt-8">
            <h4 className="text-center text-emerald-500 uppercase tracking-wider absolute top-0 left-0 right-0 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Champion
            </h4>
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4 shadow-lg flex flex-col gap-1 relative z-10 items-center justify-center text-center">
              <Trophy className="w-10 h-10 text-emerald-500 mb-2 drop-shadow-md" />
              <span className="text-lg font-black text-emerald-700 truncate w-full uppercase tracking-wide">
                ?
              </span>
              
              {/* Connector line Left */}
              <div className="absolute -left-4 top-1/2 w-4 h-[2px] bg-slate-200" />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

