import React, { useState } from "react";
import { Loader2, X } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getPricingConfig } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");

  const getPlayerCount = (game: string) => {
    if (game.includes("Mobile Legends")) return 5;
    if (game.includes("Free Fire")) return 4;
    if (game.includes("FC 26")) return 1;
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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorText("");

    const formData = new FormData(e.currentTarget);
    
    const nama = formData.get("nama") as string;
    const usia = formData.get("usia") as string;
    const kategori = formData.get("kategori") as string;
    const alamat = formData.get("alamat") as string;
    const wa = formData.get("wa") as string;
    const lomba = formData.get("lomba") as string;

    const message = `*PENDAFTARAN LOMBA eSPORT PADASUKA 2026* 🎮🏆

Halo Panitia, saya ingin mendaftar lomba eSport dengan data berikut:
    
*Nama Lengkap/Tim:* ${nama}
*Usia Rata-rata:* ${usia} Tahun
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
        usia,
        kategori,
        alamat,
        wa,
        lomba,
        status: "pending",
        createdAt: serverTimestamp()
      });

      const encodedMessage = encodeURIComponent(message);
      const whatsappNumber = "6282312907731";
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      e.currentTarget.reset();
      
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
        <div className="bg-red-50 text-primary p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 border border-red-100 text-sm font-medium">
          {errorText}
        </div>
      )}

      <div className="bg-blue-50 p-4 shrink-0 rounded-[16px] mb-6 sm:mb-8 border border-blue-100 flex items-start gap-3 w-full">
        <div className="w-full">
           <strong className="text-sm text-blue-900 block mb-1">Pendaftaran Khusus eSport!</strong>
           <span className="text-[13px] sm:text-sm text-blue-900 leading-relaxed block">
             Untuk lomba Tradisional, pendaftaran langsung di tempat (on the spot) pada Hari H (17 Agustus 2026).
           </span>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6 relative z-0 w-full">
        <div className="space-y-1.5 sm:space-y-2">
          <label className="text-xs sm:text-sm font-semibold text-dark">Pilihan Lomba eSport</label>
          <select required name="lomba" value={selectedGame} onChange={(e) => setSelectedGame(e.target.value)} className="w-full px-4 py-3 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark text-sm sm:text-base appearance-none outline-none">
            <option value="">Pilih Game</option>
            <option value="Mobile Legends (Tim)">Mobile Legends (Tim - 5 Orang)</option>
            <option value="Free Fire (Squad)">Free Fire (Squad - 4 Orang)</option>
            <option value="EA Sports FC 26 (Individu)">EA Sports FC 26 PS4 (Individu)</option>
          </select>
        </div>

        {selectedGame && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-dark">
                  {selectedGame.includes('FC 26') ? 'Nama Peserta' : 'Nama Tim / Squad'}
                </label>
                <input required type="text" name="nama" className="w-full px-4 py-3 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm sm:text-base outline-none" placeholder={selectedGame.includes('FC 26') ? "Contoh: Budi" : "Contoh: Evos Legends"} />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-dark">
                  {selectedGame.includes('FC 26') ? 'Usia' : 'Rata-rata Usia Tim'}
                </label>
                <input required type="number" name="usia" max="50" className="w-full px-4 py-3 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm sm:text-base outline-none" placeholder="Misal: 18" />
              </div>
            </div>

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
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
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
                <li><strong className="text-dark">Nominal Hadiah:</strong> Menyadari bahwa total hadiah akan disesuaikan dengan jumlah target peserta/slot dari masing-masing kategori sesuai yang disyaratkan Panitia. Panitia berhak melakukan penyesuaian nominal bila slot tidak terpenuhi hingga Hari H.</li>
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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const nama = formData.get("nama") as string;
    const perusahaan = formData.get("perusahaan") as string;
    const paket = formData.get("paket") as string;
    const wa = formData.get("wa") as string;
    const pesan = formData.get("pesan") as string;

    const message = `*PENDAFTARAN SPONSOR FESTIVAL MERDEKA 2026* 🤝🎉

Halo Panitia, saya tertarik untuk menjadi Sponsor dengan detil berikut:
    
*Nama Lengkap/PIC:* ${nama}
*Nama Brand/Perusahaan/Toko:* ${perusahaan}
*Pilihan Paket/Donasi:* ${paket}
*Nomor WA Aktif:* ${wa}
*Pesan/Catatan:* ${pesan || '-'}

Mohon informasi lebih lanjut mengenai teknis pengiriman logo dan MoU. Saya siap mendukung kesuksesan Festival!`;

    try {
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
        <label className="text-sm font-semibold text-dark">Nama Lengkap / PIC</label>
        <input required type="text" name="nama" className="w-full px-4 py-2.5 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" placeholder="Nama Anda" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-dark">Nama Brand/Perusahaan/Toko</label>
        <input required type="text" name="perusahaan" className="w-full px-4 py-2.5 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" placeholder="Contoh: Toko Jaya Abadi" />
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
        {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Kirim Pengajuan via WA"}
      </button>
    </form>
  )
}
