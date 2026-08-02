import React, { useState } from "react";
import { Loader2, X, Phone, Gamepad2, Users, AlertCircle } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getPricingConfig, formatParticipantName, formatTeamName } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");
  const [namaInput, setNamaInput] = useState("");
  const [playerInputs, setPlayerInputs] = useState<string[]>(["", "", "", "", ""]);
  const [cadanganInput, setCadanganInput] = useState<string>("");

  const getPlayerCount = (game: string) => {
    if (game.includes("Mobile Legends")) return 5;
    if (game.includes("Free Fire")) return 4;
    if (game.includes("FC") || game.includes("PS 4")) return 1;
    return 0;
  };

  const getFeePerPerson = (kategori: string) => {
    const pricing = getPricingConfig();
    const config = pricing.find(p => p.label === kategori);
    return config ? config.price : 0;
  };

  const playerCount = getPlayerCount(selectedGame);
  const feePerPerson = getFeePerPerson(selectedKategori);
  const totalFee = playerCount * feePerPerson;

  // Nama Tim -> UPPERCASE, Nama Peserta -> Capitalized Case
  const handleNamaInputChange = (val: string) => {
    if (playerCount > 1) {
      setNamaInput(formatTeamName(val));
    } else {
      setNamaInput(formatParticipantName(val));
    }
  };

  const handlePlayerInputChange = (index: number, val: string) => {
    const updated = [...playerInputs];
    updated[index] = formatParticipantName(val);
    setPlayerInputs(updated);
  };

  const handleCadanganInputChange = (val: string) => {
    setCadanganInput(formatParticipantName(val));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorText("");

    const formData = new FormData(e.currentTarget);
    
    const rawNama = (formData.get("nama") as string) || namaInput;
    const isTeam = playerCount > 1;
    const nama = isTeam ? formatTeamName(rawNama) : formatParticipantName(rawNama);

    const usia = formData.get("usia") as string;
    const kategori = formData.get("kategori") as string;
    const alamat = formData.get("alamat") as string;
    const wa = formData.get("wa") as string;
    const lomba = formData.get("lomba") as string;

    let squadPlayers: string[] = [];
    if (isTeam) {
      squadPlayers = playerInputs
        .slice(0, playerCount)
        .map(p => formatParticipantName(p.trim()))
        .filter(Boolean);

      if (squadPlayers.length < playerCount) {
        setErrorText(`Mohon lengkapi seluruh ${playerCount} nama anggota pemain untuk kategori kelompok/squad.`);
        setIsSubmitting(false);
        return;
      }
      if (cadanganInput.trim()) {
        squadPlayers.push(`${formatParticipantName(cadanganInput.trim())} (Cadangan)`);
      }
    } else {
      squadPlayers = [nama];
    }

    const daftarPemainMsg = playerCount > 1
      ? `\n*Daftar Nama Anggota Pemain (${squadPlayers.length} Orang):*\n${squadPlayers.map((p, i) => `  ${i + 1}. ${p}`).join("\n")}\n`
      : "";

    const message = `*PENDAFTARAN LOMBA eSPORT PADASUKA 2026*

Halo Panitia, saya ingin mendaftar lomba eSport dengan data berikut:
    
*Nama Lengkap/Tim:* ${nama}
${daftarPemainMsg}*Usia Rata-rata:* ${usia} Tahun
*Kategori:* ${kategori}
*Pilihan Game:* ${lomba}
*Alamat (Asal Kampung):* ${alamat}
*No. WhatsApp:* ${wa}
*Total Biaya (+Kuota Tim):* Rp ${totalFee.toLocaleString('id-ID')}

Saya akan segera melampirkan bukti transfer biaya pendaftaran. Terima kasih!`;

    try {
      // Save to Firebase
      await addDoc(collection(db, "registrations"), {
        nama,
        players: squadPlayers,
        anggotaTim: squadPlayers.join(", "),
        usia,
        kategori,
        alamat,
        wa,
        lomba,
        status: "pending",
        createdAt: serverTimestamp()
      });

      // Try saving to Google Sheets if authenticated
      try {
        const { getOrCreateSpreadsheetId, appendRowToSheet } = await import('../sheets');
        const sheetId = await getOrCreateSpreadsheetId();
        await appendRowToSheet(sheetId, [
          new Date().toLocaleString('id-ID'),
          nama,
          usia,
          kategori,
          alamat,
          wa,
          squadPlayers.join(", "),
          lomba
        ]);
      } catch (sheetError) {
        console.log("Google Sheets integration requires OAuth login or is not fully configured.", sheetError);
      }

      const encodedMessage = encodeURIComponent(message);
      // Contact routing: MLBB & FF -> +62 838-7539-3428, EA SPORTS FC -> +62 823-1290-7731
      const isMLorFF = lomba.includes("Mobile Legends") || lomba.includes("Free Fire");
      const whatsappNumber = isMLorFF ? "6283875393428" : "6282312907731";
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      e.currentTarget.reset();
      setNamaInput("");
      setPlayerInputs(["", "", "", "", ""]);
      setCadanganInput("");
      
      await new Promise(resolve => setTimeout(resolve, 800));
      window.open(whatsappUrl, "_blank");
      
    } catch (err: any) {
      console.error(err);
      setErrorText("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl border border-white/20 p-5 sm:p-8 md:p-10 rounded-[24px] shadow-2xl relative overflow-hidden w-full text-left">
      <AnimatePresence>
        {isSubmitting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full mb-6 relative"
            >
               <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
            </motion.div>
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl sm:text-2xl font-bold font-heading text-dark mb-2"
            >
              Memproses Pendaftaran...
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-secondary text-sm sm:text-base font-medium max-w-xs mx-auto"
            >
              Mohon tunggu sebentar, kami sedang menyiapkan lembar pendaftaran Anda ke sistem.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {errorText && (
        <div className="bg-red-50 text-primary p-3.5 sm:p-4 rounded-xl mb-4 sm:mb-6 border border-red-100 text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorText}</span>
        </div>
      )}

      {/* Kartu Kontak Pendaftaran Panitia */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Phone className="w-4 h-4 text-primary" /> Kartu Kontak Pendaftaran Panitia
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Kartu 1: Mobile Legends & Free Fire */}
          <a
            href="https://wa.me/6283875393428?text=Halo%20Panitia,%20saya%20ingin%20tanya%20pendaftaran%20Mobile%20Legends%20/%20Free%20Fire"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-emerald-200 hover:border-emerald-500 hover:shadow-lg transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm sm:text-base">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mobile Legends & Free Fire</span>
              </div>
              <div className="text-emerald-600 font-black text-base sm:text-lg tracking-wide flex items-center gap-1.5">
                +62 838-7539-3428
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium">Chat WhatsApp MLBB & FF →</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md">
              <WhatsAppIcon className="w-5 h-5 text-white" />
            </div>
          </a>

          {/* Kartu 2: EA SPORTS FC25 / FC26 */}
          <a
            href="https://wa.me/6282312907731?text=Halo%20Panitia,%20saya%20ingin%20tanya%20pendaftaran%20EA%20SPORTS%20FC25%20/%20FC26"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-blue-200 hover:border-blue-500 hover:shadow-lg transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm sm:text-base">
                <Gamepad2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>EA SPORTS FC25 / FC26</span>
              </div>
              <div className="text-blue-600 font-black text-base sm:text-lg tracking-wide flex items-center gap-1.5">
                +62 823-1290-7731
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium">Chat WhatsApp PS4 FC26 →</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md">
              <WhatsAppIcon className="w-5 h-5 text-white" />
            </div>
          </a>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6 relative z-0 w-full">
        <div className="space-y-1.5 sm:space-y-2">
          <label className="text-xs sm:text-sm font-semibold text-dark">Pilihan Lomba eSport</label>
          <select required name="lomba" value={selectedGame} onChange={(e) => setSelectedGame(e.target.value)} className="w-full px-4 py-3 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark text-sm sm:text-base appearance-none outline-none">
            <option value="">Pilih Game eSport</option>
            <option value="Mobile Legends: Bang-Bang (Tim)">Mobile Legends: Bang-Bang (Tim - 5 Orang)</option>
            <option value="Free Fire (Squad)">Free Fire (Squad - 4 Orang)</option>
            <option value="PS 4 Pro FC26 (Individu)">PS 4 Pro FC26 / EA SPORTS FC25 / FC26 (Individu)</option>
          </select>
        </div>

        {selectedGame && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-dark flex items-center justify-between">
                  <span>{selectedGame.includes('FC') || selectedGame.includes('PS') ? 'Nama Peserta' : 'Nama Tim / Squad'}</span>
                </label>
                <input 
                  required 
                  type="text" 
                  name="nama" 
                  value={namaInput}
                  onChange={(e) => handleNamaInputChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm sm:text-base outline-none font-medium" 
                  placeholder={selectedGame.includes('FC') || selectedGame.includes('PS') ? "Contoh: Budi Santoso" : "Contoh: EVOS LEGENDS"} 
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-dark">
                  {selectedGame.includes('FC') || selectedGame.includes('PS') ? 'Usia' : 'Rata-rata Usia Tim'}
                </label>
                <input required type="number" name="usia" max="50" className="w-full px-4 py-3 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm sm:text-base outline-none" placeholder="Misal: 18" />
              </div>
            </div>

            {/* Khusus Lomba Kelompok/Squad: Wajib Mengisi Nama Seluruh Pemain */}
            {playerCount > 1 && (
              <div className="bg-amber-50/90 border border-amber-200 p-4 sm:p-5 rounded-2xl space-y-3.5 shadow-sm">
                <div className="flex items-center gap-2 text-amber-950 font-black text-xs sm:text-sm uppercase tracking-wider">
                  <Users className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Daftar Nama Seluruh Anggota Pemain ({playerCount} Pemain Wajib)</span>
                </div>
                <p className="text-xs text-amber-900/90 font-medium leading-relaxed">
                  ⚠️ Untuk peserta kelompok/squad, <strong>wajib mengisi nama lengkap & ID/Nickname seluruh anggota pemain</strong> ({playerCount} orang) sebelum mengirim pendaftaran.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {Array.from({ length: playerCount }).map((_, idx) => (
                    <div key={idx} className="space-y-1">
                      <label className="text-xs font-bold text-gray-800 block">
                        Pemain {idx + 1} {idx === 0 ? "(Kapten Tim)" : ""} <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={playerInputs[idx] || ""}
                        onChange={(e) => handlePlayerInputChange(idx, e.target.value)}
                        placeholder={idx === 0 ? "Nama & Nickname/ID Kapten" : `Nama & Nickname Pemain ${idx + 1}`}
                        className="w-full px-3.5 py-2.5 rounded-[12px] border border-gray-200 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-xs sm:text-sm text-dark outline-none font-medium"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-1">
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Pemain Cadangan / Backup (Opsional)
                  </label>
                  <input
                    type="text"
                    value={cadanganInput}
                    onChange={(e) => handleCadanganInputChange(e.target.value)}
                    placeholder="Nama & Nickname Pemain Cadangan (Jika Ada)"
                    className="w-full px-3.5 py-2.5 rounded-[12px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-xs sm:text-sm text-dark outline-none font-medium"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-dark">Alamat / Asal Kampung</label>
                <input required type="text" name="alamat" className="w-full px-4 py-3 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm sm:text-base outline-none" placeholder="RT/RW, Kp." />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-dark">Nomor WhatsApp Aktif</label>
                <input required type="tel" name="wa" className="w-full px-4 py-3 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm sm:text-base outline-none" placeholder="08..." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-dark">Kategori</label>
                <select required name="kategori" value={selectedKategori} onChange={(e) => setSelectedKategori(e.target.value)} className="w-full px-4 py-3 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark text-sm sm:text-base appearance-none outline-none">
                  <option value="">Pilih Kategori Usia</option>
                  {getPricingConfig().map(p => (
                    <option key={p.label} value={p.label}>{p.label} - Rp {(p.price / 1000)}K/org</option>
                  ))}
                </select>
              </div>
              
              {selectedKategori && (
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-dark mb-2 block">Total Biaya Pendaftaran</label>
                  <div className="bg-primary/10 border border-primary/20 rounded-[12px] p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-primary block">Rp {feePerPerson.toLocaleString('id-ID')} x {playerCount} Orang ({selectedGame.includes('FC 26') ? 'Individu' : 'Tim'})</span>
                    </div>
                    <span className="text-lg font-black text-primary">Rp {totalFee.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
               <label className="flex items-start gap-3 p-4 bg-red-50/50 rounded-xl border border-red-100 cursor-pointer group">
                 <input type="checkbox" required className="mt-1 w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary shadow-sm cursor-pointer shrink-0" />
                 <span className="text-xs sm:text-sm text-secondary font-medium leading-relaxed select-none">
                   Saya menyetujui seluruh <button type="button" onClick={() => setShowTerms(true)} className="text-primary font-bold underline underline-offset-2 hover:text-dark transition-colors">Syarat dan Ketentuan (T&C)</button> pendaftaran lomba eSport, termasuk kesiapan menanggung kerugian jika batal hadir serta menaati regulasi keamanan selama acara.
                 </span>
               </label>
            </div>

            <div className="pt-2">
               <p className="text-xs sm:text-sm text-secondary leading-relaxed bg-gray-50 p-4 rounded-[12px] border border-gray-100">
                 <strong className="text-dark block mb-1">Upload Bukti Pembayaran via WA</strong>
                 Setelah klik tombol daftar, kirim foto/screenshot bukti transfer pendaftaran eSport langsung melalui chat WhatsApp.
               </p>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 sm:py-4 rounded-[16px] mt-4 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base uppercase tracking-wide"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin w-5 h-5 cursor-wait" />
              ) : (
                <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
              )}
              Kirim Data Pendaftaran
            </button>
          </div>
        )}
      </form>

      {showTerms && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              title="Tutup"
              type="button"
              onClick={() => setShowTerms(false)}
              className="absolute top-4 right-4 p-2.5 text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-dark rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-dark pr-8 mb-5">
              Syarat dan Ketentuan (T&C) eSport
            </h3>
            <div className="text-sm sm:text-base text-gray-600 space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <p>
                Dengan mencentang dan mengirim form pendaftaran ini, saya sebagai pendaftar/perwakilan tim menyatakan:
              </p>
              <ol className="list-decimal pl-4 space-y-2">
                <li><strong className="text-dark">Pembatalan dan Resiko:</strong> Apabila saya atau tim saya batal hadir pada hari H, maka uang pendaftaran hangus (tidak dapat dikembalikan) dan dianggap sebagai kerugian yang ditanggung pendaftar.</li>
                <li><strong className="text-dark">Sistem Pertandingan:</strong> Siap mengikuti sistem pertandingan maupun bagan turnamen (bracket) yang diacak otomatis oleh panitia tanpa ada unsur kecurangan.</li>
                <li><strong className="text-dark">Regulasi Keamanan:</strong> Berkomitmen penuh menjaga ketertiban, keamanan, dan sportivitas tinggi selama acara berlangsung. Segala bentuk keributan atau provokasi akan berakibat diskualifikasi dan diserahkan pada pihak berwajib jika diperlukan.</li>
                <li><strong className="text-dark">Nominal Hadiah:</strong> Menyadari bahwa total hadiah akan disesuaikan dengan jumlah target peserta/kuota dari masing-masing kategori sesuai yang disyaratkan Panitia. Panitia berhak melakukan penyesuaian nominal bila kuota tidak terpenuhi hingga Hari H.</li>
              </ol>
            </div>
            <button
              type="button"
              onClick={() => setShowTerms(false)}
              className="mt-8 w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function SponsorForm({ onClose, selectedPackage }: { onClose: () => void, selectedPackage?: string | null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [picName, setPicName] = useState("");
  const [brandName, setBrandName] = useState("");

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const rawNama = (formData.get("nama") as string) || picName;
    const rawPerusahaan = (formData.get("perusahaan") as string) || brandName;
    const nama = formatParticipantName(rawNama);
    const perusahaan = formatTeamName(rawPerusahaan);
    const paket = formData.get("paket") as string;
    const wa = formData.get("wa") as string;
    const pesan = formData.get("pesan") as string;

    const message = `*PENDAFTARAN SPONSOR FESTIVAL MERDEKA 2026*

Halo Panitia, saya tertarik untuk menjadi Sponsor dengan detil berikut:
    
*Nama Lengkap/PIC:* ${nama}
*Nama Brand/Perusahaan/Toko:* ${perusahaan}
*Pilihan Paket/Donasi:* ${paket}
*Nomor WA Aktif:* ${wa}
*Pesan/Catatan:* ${pesan || '-'}

Mohon informasi lebih lanjut mengenai teknis pengiriman logo dan MoU. Saya siap mendukung kesuksesan Festival!`;

    try {
      // Save to Firebase (sponsors collection)
      try {
        await addDoc(collection(db, "sponsors"), {
          nama,
          perusahaan,
          paket,
          wa,
          pesan,
          status: "pending",
          createdAt: serverTimestamp()
        });
      } catch (fbErr) {
        console.error("Firebase save err:", fbErr);
      }

      // Try saving to Google Sheets if authenticated
      try {
        const { getOrCreateSpreadsheetId, appendRowToSheet } = await import('../sheets');
        const sheetId = await getOrCreateSpreadsheetId();
        await appendRowToSheet(sheetId, [
          new Date().toLocaleString('id-ID'),
          nama,
          "-",
          "Sponsor",
          perusahaan,
          wa,
          "-",
          paket,
          pesan || "-"
        ]);
      } catch (sheetError) {
        console.log("Google Sheets integration requires OAuth login or is not fully configured.", sheetError);
      }

      const encodedMessage = encodeURIComponent(message);
      const whatsappNumber = "6282312907731";
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      await new Promise(resolve => setTimeout(resolve, 800));
      window.open(whatsappUrl, "_blank");
      onClose();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 relative">
      <AnimatePresence>
        {isSubmitting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-[-16px] xl:inset-[-24px] z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full mb-4 relative"
            >
               <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
            </motion.div>
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-bold font-heading text-dark mb-1"
            >
              Memproses...
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-secondary text-xs sm:text-sm font-medium"
            >
              Menyiapkan pengajuan sponsor.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-dark flex justify-between items-center">
          <span>Nama Lengkap / PIC</span>
        </label>
        <input 
          required 
          type="text" 
          name="nama" 
          value={picName}
          onChange={(e) => setPicName(formatParticipantName(e.target.value))}
          className="w-full px-4 py-2.5 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" 
          placeholder="Contoh: Budi Santoso" 
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-dark flex justify-between items-center">
          <span>Nama Brand/Perusahaan/Toko</span>
        </label>
        <input 
          required 
          type="text" 
          name="perusahaan" 
          value={brandName}
          onChange={(e) => setBrandName(formatTeamName(e.target.value))}
          className="w-full px-4 py-2.5 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" 
          placeholder="Contoh: TOKO JAYA ABADI" 
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-dark">Nomor WhatsApp Aktif</label>
        <input required type="tel" name="wa" className="w-full px-4 py-2.5 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" placeholder="08..." />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-dark">Paket Sponsor Pilihan</label>
        {selectedPackage ? (
          <input 
            type="text" 
            name="paket" 
            readOnly 
            value={selectedPackage} 
            className="w-full px-4 py-2.5 rounded-[12px] border border-gray-200 bg-gray-100 text-gray-700 font-semibold focus:outline-none cursor-not-allowed text-sm" 
          />
        ) : (
          <select required name="paket" className="w-full px-4 py-2.5 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm appearance-none">
            <option value="">Pilih Paket...</option>
            <option value="Paket Silver (Rp 20.000)">Paket Silver (Rp 20.000)</option>
            <option value="Paket Gold (Rp 50.000)">Paket Gold (Rp 50.000)</option>
            <option value="Paket Platinum (Rp 150.000+)">Paket Platinum (Rp 150.000+)</option>
            <option value="Sumbangan Barang / Doorprize">Sumbangan Barang / Doorprize</option>
            <option value="Sponsor Khusus Lainya">Bentuk Dukungan Lainnya</option>
          </select>
        )}
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-dark">Pesan Tambahan (Opsional)</label>
        <textarea name="pesan" className="w-full px-4 py-2.5 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none h-20" placeholder="Ketik pesan Anda..."></textarea>
      </div>
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-[12px] mt-2 transition-all shadow-lg flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed text-sm uppercase tracking-wide"
      >
        {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : (
          <>
            <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
            <span>Kirim Pengajuan via WA</span>
          </>
        )}
      </button>
    </form>
  )
}
