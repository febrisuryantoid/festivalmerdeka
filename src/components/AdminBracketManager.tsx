import React, { useState, useEffect } from "react";
import { X, Save, ArrowUp, ArrowDown, Users } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { RegistrationData } from "../lib/registrationsStore";

export function AdminBracketManager({ onClose, registrations }: { onClose: () => void; registrations: RegistrationData[] }) {
  const [activeTab, setActiveTab] = useState("Mobile Legends");
  const [bracketOrders, setBracketOrders] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load existing bracket seeds
    const loadSeeds = async () => {
      try {
        const d = await getDoc(doc(db, "settings", "bracketSeeds"));
        if (d.exists()) {
          setBracketOrders(d.data());
        }
      } catch (err) {
        console.error("Failed to load bracket seeds:", err);
      }
    };
    loadSeeds();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "bracketSeeds"), bracketOrders);
      alert("Urutan bracket berhasil disimpan!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan bracket.");
    } finally {
      setSaving(false);
    }
  };

  const getFilteredRegistrations = (game: string) => {
    return registrations.filter(p => {
      if (p.status !== "verified") return false;
      const l = (p.lomba || "").toLowerCase();
      if (game === "Mobile Legends" && (l.includes("mobile") || l.includes("ml") || l.includes("legend"))) return true;
      if (game === "Free Fire" && (l.includes("free") || l.includes("fire") || l.includes("ff"))) return true;
      if (game === "PS 4 Pro FC26" && (l.includes("fc") || l.includes("ps") || l.includes("ea") || l.includes("fifa"))) return true;
      return false;
    });
  };

  const currentParticipants = getFilteredRegistrations(activeTab);
  
  // Sort based on bracketOrders if exists, otherwise append un-ordered
  const currentOrder = bracketOrders[activeTab] || [];
  
  let orderedParticipants = [...currentParticipants].sort((a, b) => {
    // FORCE ZIEZAN to the top always
    const isZieA = (a.nama || "").toLowerCase() === "ziezan";
    const isZieB = (b.nama || "").toLowerCase() === "ziezan";
    if (isZieA && !isZieB) return -1;
    if (!isZieA && isZieB) return 1;

    const idxA = currentOrder.indexOf(a.id!);
    const idxB = currentOrder.indexOf(b.id!);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;

    return 0;
  });

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newArr = [...orderedParticipants];
    const temp = newArr[index - 1];
    newArr[index - 1] = newArr[index];
    newArr[index] = temp;
    setBracketOrders({
      ...bracketOrders,
      [activeTab]: newArr.map(p => p.id!)
    });
  };

  const moveDown = (index: number) => {
    if (index === orderedParticipants.length - 1) return;
    const newArr = [...orderedParticipants];
    const temp = newArr[index + 1];
    newArr[index + 1] = newArr[index];
    newArr[index] = temp;
    setBracketOrders({
      ...bracketOrders,
      [activeTab]: newArr.map(p => p.id!)
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Atur Urutan Bracket</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex border-b border-slate-200">
          {["Mobile Legends", "Free Fire", "PS 4 Pro FC26"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === tab ? "border-primary text-primary bg-primary/5" : "border-transparent text-slate-500 hover:bg-slate-50"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 flex-1 overflow-y-auto bg-slate-50">
          <p className="text-sm text-slate-600 mb-4">
            Atur urutan peserta terverifikasi untuk <b>{activeTab}</b>. Urutan ini akan langsung diterapkan di bagan turnamen di frontend (Peserta 1 vs Peserta 2, dsb).
          </p>
          
          <div className="space-y-2">
            {orderedParticipants.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">Belum ada peserta terverifikasi.</div>
            ) : (
              orderedParticipants.map((p, idx) => (
                <div key={p.id} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <span className="font-mono font-bold text-slate-400 w-6 text-center">{idx + 1}</span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 text-sm">{p.nama}</p>
                    <p className="text-[11px] text-slate-500">{p.alamat}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded text-slate-600"><ArrowUp className="w-3.5 h-3.5" /></button>
                    <button onClick={() => moveDown(idx)} disabled={idx === orderedParticipants.length - 1} className="p-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded text-slate-600"><ArrowDown className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">Batal</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30 flex items-center gap-2 transition-all disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan Bracket"}
          </button>
        </div>
      </div>
    </div>
  );
}
