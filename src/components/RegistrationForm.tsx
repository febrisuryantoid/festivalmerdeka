import React, { useState } from "react";
import { Loader2, X, Phone, Gamepad2, Users, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, Copy, Check } from "lucide-react";
import { getPricingConfig, formatParticipantName, formatTeamName } from "../lib/utils";
import { submitRegistration, RegistrationData, checkForDuplicateRegistration, formatRegistrationDate } from "../lib/registrationsStore";
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
  
  // Duplicate Notice state
  const [duplicateNotice, setDuplicateNotice] = useState<{
    existing: RegistrationData;
    attemptedNama: string;
    attemptedLomba: string;
  } | null>(null);

  // Success Modal state
  const [successData, setSuccessData] = useState<{
    registration: RegistrationData;
    totalFee: number;
    whatsappUrl: string;
    whatsappNumber: string;
  } | null>(null);

  const [copiedAccount, setCopiedAccount] = useState(false);

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

  const validateForm = (
    lombaVal: string,
    namaVal: string,
    usiaVal: string,
    alamatVal: string,
    waVal: string,
    kategoriVal: string,
    isTeam: boolean,
    playersList: string[]
  ): string | null => {
    if (!lombaVal) {
      return "Mohon pilih Cabang Lomba eSport terlebih dahulu.";
    }
    if (!namaVal || namaVal.trim().length < 2) {
      return isTeam 
        ? "Mohon isi Nama Tim/Squad dengan benar (minimal 2 karakter)." 
        : "Mohon isi Nama Lengkap Peserta dengan benar (minimal 2 karakter).";
    }
    if (!usiaVal || isNaN(Number(usiaVal)) || Number(usiaVal) < 5 || Number(usiaVal) > 70) {
      return "Mohon masukkan Usia / Rata-rata usia tim yang valid (antara 5-70 tahun).";
    }
    if (isTeam) {
      if (playersList.length < playerCount) {
        return `Mohon lengkapi seluruh ${playerCount} nama anggota pemain wajib untuk kategori kelompok.`;
      }
      for (let i = 0; i < playerCount; i++) {
        if (!playersList[i] || playersList[i].trim().length < 2) {
          return `Mohon lengkapi nama Pemain ${i + 1} dengan benar.`;
        }
      }
    }
    if (!alamatVal || alamatVal.trim().length < 3) {
      return "Mohon isi Alamat / Asal Kampung dengan jelas (contoh: Kp. Padasuka RT 02/01).";
    }
    const cleanWa = waVal.replace(/[^0-9]/g, "");
    if (!cleanWa || cleanWa.length < 9 || cleanWa.length > 15) {
      return "Mohon masukkan nomor WhatsApp yang valid (contoh: 08123456789).";
    }
    if (!kategoriVal) {
      return "Mohon pilih Kategori Pendaftar (Karang Taruna Desa Padasuka, Umum, SD, SMP, atau SMA/SMK).";
    }
    return null;
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorText("");

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    
    const rawNama = (formData.get("nama") as string) || namaInput;
    const isTeam = playerCount > 1;
    const nama = isTeam ? formatTeamName(rawNama) : formatParticipantName(rawNama);

    const usia = (formData.get("usia") as string) || "";
    const kategori = (formData.get("kategori") as string) || selectedKategori;
    const alamat = (formData.get("alamat") as string) || "";
    const wa = (formData.get("wa") as string) || "";
    const lomba = (formData.get("lomba") as string) || selectedGame;

    let squadPlayers: string[] = [];
    if (isTeam) {
      squadPlayers = playerInputs
        .slice(0, playerCount)
        .map(p => formatParticipantName(p.trim()))
        .filter(Boolean);

      if (cadanganInput.trim()) {
        squadPlayers.push(`${formatParticipantName(cadanganInput.trim())} (Cadangan)`);
      }
    } else {
      squadPlayers = [nama];
    }

    // Comprehensive Client Validation
    const validationError = validateForm(
      lomba,
      nama,
      usia,
      alamat,
      wa,
      kategori,
      isTeam,
      squadPlayers.slice(0, playerCount)
    );

    if (validationError) {
      setErrorText(validationError);
      return;
    }

    setDuplicateNotice(null);
    setIsSubmitting(true);

    // Auto Database Sync & Duplicate Check
    try {
      const duplicateRecord = await checkForDuplicateRegistration({
        nama,
        usia,
        alamat,
        wa,
        lomba
      });

      if (duplicateRecord) {
        setIsSubmitting(false);
        setDuplicateNotice({
          existing: duplicateRecord,
          attemptedNama: nama,
          attemptedLomba: lomba
        });
        return;
      }
    } catch (dupErr) {
      console.warn("Duplicate check error, proceeding with submission:", dupErr);
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
      // Dual-layer storage submit (localStorage first, then Firestore)
      const res = await submitRegistration({
        nama,
        players: squadPlayers,
        anggotaTim: squadPlayers.join(", "),
        usia,
        kategori,
        alamat,
        wa,
        lomba
      });

      // Non-blocking Google Sheets append in background
      import('../sheets').then(({ getOrCreateSpreadsheetId, appendRowToSheet }) => {
        getOrCreateSpreadsheetId().then(sheetId => {
          appendRowToSheet(sheetId, [
            nama,
            squadPlayers.join(", "),
            usia,
            kategori,
            lomba,
            alamat,
            wa,
            "PENDING",
            new Date().toLocaleString('id-ID')
          ]).catch(() => {});
        }).catch(() => {});
      }).catch(() => {});

      const encodedMessage = encodeURIComponent(message);
      const isMLorFF = lomba.includes("Mobile Legends") || lomba.includes("Free Fire");
      const whatsappNumber = isMLorFF ? "6283875393428" : "6282312907731";
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Reset form controls
      if (formElement) {
        formElement.reset();
      }
      setNamaInput("");
      setPlayerInputs(["", "", "", "", ""]);
      setCadanganInput("");

      // Trigger Website Success Modal!
      setSuccessData({
        registration: res.registration,
        totalFee,
        whatsappUrl,
        whatsappNumber
      });

      // Also attempt opening WhatsApp popup automatically
      try {
        window.open(whatsappUrl, "_blank");
      } catch (e) {
        // Popups might be blocked by browser; user can still click the modal button!
      }

    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorText(
        err?.message 
          ? `Gagal mengirim data: ${err.message}` 
          : "Terjadi kesalahan koneksi sistem. Silakan periksa jaringan internet Anda dan coba lagi."
      );
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
            className="absolute inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
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
              Menyimpan Data Pendaftaran...
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-secondary text-sm sm:text-base font-medium max-w-xs mx-auto"
            >
              Data Anda sedang dimasukkan ke sistem & dashboard panitia secara aman.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Duplicate Registration Warning Modal */}
      <AnimatePresence>
        {duplicateNotice && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative border border-amber-200/90 my-8 text-left"
            >
              <button
                type="button"
                onClick={() => setDuplicateNotice(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 bg-gray-100 hover:bg-gray-200 hover:text-dark rounded-full transition-colors"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
                    Data Sudah Terdaftar!
                  </h3>
                  <p className="text-xs text-amber-700 font-semibold">
                    Auto Database Sync: Terdeteksi Pendaftaran Ganda
                  </p>
                </div>
              </div>

              <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm space-y-3 mb-6 text-slate-800">
                <p className="text-slate-700 leading-relaxed font-medium">
                  Data pendaftaran untuk <span className="font-extrabold text-slate-900">{duplicateNotice.existing.nama}</span> (No. WA: <span className="font-mono font-bold text-slate-900">{duplicateNotice.existing.wa}</span>) <span className="text-amber-900 font-bold">sudah tercatat sebelumnya</span> dalam database panitia. Anda tidak perlu mendaftar ulang.
                </p>

                <div className="border-t border-amber-200/80 pt-3 space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="text-slate-500 font-sans">Lomba Pilihan:</span>
                    <span className="font-bold text-slate-900">{duplicateNotice.existing.lomba}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="text-slate-500 font-sans">Waktu Terdaftar Akurat:</span>
                    <span className="font-bold text-amber-950 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
                      {formatRegistrationDate(duplicateNotice.existing.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700 pt-1">
                    <span className="text-slate-500 font-sans">Status Pendaftaran:</span>
                    {duplicateNotice.existing.status === "verified" ? (
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-sans font-bold text-xs border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Lunas / Terverifikasi
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-sans font-bold text-xs border border-amber-300 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Terdaftar (Menunggu Pembayaran)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`https://wa.me/${duplicateNotice.existing.lomba.includes("Mobile Legends") || duplicateNotice.existing.lomba.includes("Free Fire") ? "6283875393428" : "6282312907731"}?text=${encodeURIComponent(`Halo Panitia Festival Padasuka 2026, saya ingin menanyakan status pendaftaran saya:\n\n• Nama/Tim: ${duplicateNotice.existing.nama}\n• Lomba: ${duplicateNotice.existing.lomba}\n• Waktu Daftar: ${formatRegistrationDate(duplicateNotice.existing.createdAt)}\n• Status: ${duplicateNotice.existing.status === 'verified' ? 'Lunas / Terverifikasi' : 'Terdaftar (Pending)'}\n\nTerima kasih!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition-colors text-sm"
                >
                  <WhatsAppIcon className="w-5 h-5 fill-current" />
                  Hubungi Panitia & Konfirmasi Status WA
                </a>

                <button
                  type="button"
                  onClick={() => setDuplicateNotice(null)}
                  className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Tutup & Edit Data Form
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Website Success Modal */}
      <AnimatePresence>
        {successData && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative border border-slate-100 my-8"
            >
              <button
                type="button"
                onClick={() => setSuccessData(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 bg-gray-100 hover:bg-gray-200 hover:text-dark rounded-full transition-colors"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3 shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black tracking-wider uppercase mb-2">
                  Status: Pending Verifikasi
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 leading-tight">
                  Pendaftaran Berhasil!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Data pendaftaran Anda telah berhasil tersimpan di sistem & masuk ke Admin Dashboard Panitia.
                </p>
              </div>

              {/* Detail Ringkasan pendaftaran */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 mb-6 text-xs sm:text-sm">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Nama / Tim:</span>
                  <span className="font-extrabold text-slate-900">{successData.registration.nama}</span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Lomba eSport:</span>
                  <span className="font-bold text-primary">{successData.registration.lomba}</span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Kategori Usia:</span>
                  <span className="font-bold text-slate-800">{successData.registration.kategori} ({successData.registration.usia} Thn)</span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Asal Kampung / No. WA:</span>
                  <span className="font-medium text-slate-800">{successData.registration.alamat} • {successData.registration.wa}</span>
                </div>

                {successData.registration.players && successData.registration.players.length > 0 && (
                  <div className="border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-medium block mb-1">Anggota Tim Terdaftar:</span>
                    <span className="font-semibold text-slate-800 bg-white p-2 rounded border border-slate-200 block leading-relaxed">
                      {successData.registration.players.join(", ")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-900 font-bold">Total Biaya Pendaftaran:</span>
                  <span className="font-black text-emerald-600 text-base sm:text-lg">
                    Rp {successData.totalFee.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 font-medium space-y-2 mb-6">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Langkah Terakhir (Konfirmasi Pembayaran):</span>
                </div>
                <p className="leading-relaxed">
                  Silakan klik tombol di bawah untuk membuka chat WhatsApp panitia, kirim pesan konfirmasi, dan melampirkan screenshot bukti transfer biaya pendaftaran.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={successData.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setSuccessData(null)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm sm:text-base uppercase tracking-wider group"
                >
                  <WhatsAppIcon className="w-5 h-5 text-white" />
                  <span>Konfirmasi via WhatsApp</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <button
                  type="button"
                  onClick={() => setSuccessData(null)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-2xl transition-colors text-xs uppercase tracking-wider"
                >
                  Selesai & Tutup Halaman
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Direct Error Banner */}
      {errorText && (
        <div className="bg-red-50 text-red-900 p-4 rounded-2xl mb-6 border border-red-200 text-xs sm:text-sm font-semibold flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-red-950 block">Gagal Mengirim Form Pendaftaran:</span>
            <span className="leading-relaxed font-medium text-red-800">{errorText}</span>
          </div>
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
          <label className="text-xs sm:text-sm font-semibold text-dark">Pilihan Lomba eSport <span className="text-red-500">*</span></label>
          <select 
            required 
            name="lomba" 
            value={selectedGame} 
            onChange={(e) => {
              setSelectedGame(e.target.value);
              setErrorText("");
            }} 
            className="w-full px-4 py-3 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark text-sm sm:text-base appearance-none outline-none font-medium"
          >
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
                  <span>{selectedGame.includes('FC') || selectedGame.includes('PS') ? 'Nama Peserta' : 'Nama Tim / Squad'} <span className="text-red-500">*</span></span>
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
                  {selectedGame.includes('FC') || selectedGame.includes('PS') ? 'Usia' : 'Rata-rata Usia Tim'} <span className="text-red-500">*</span>
                </label>
                <input required type="number" name="usia" min="5" max="70" className="w-full px-4 py-3 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm sm:text-base outline-none font-medium" placeholder="Misal: 18" />
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
                <label className="text-xs sm:text-sm font-semibold text-dark">Alamat / Asal Kampung <span className="text-red-500">*</span></label>
                <input required type="text" name="alamat" className="w-full px-4 py-3 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm sm:text-base outline-none font-medium" placeholder="RT/RW, Kp. Padasuka" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-dark">Nomor WhatsApp Aktif <span className="text-red-500">*</span></label>
                <input required type="tel" name="wa" className="w-full px-4 py-3 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm sm:text-base outline-none font-medium" placeholder="08..." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-dark">Kategori Pendaftar <span className="text-red-500">*</span></label>
                <select 
                  required 
                  name="kategori" 
                  value={selectedKategori} 
                  onChange={(e) => setSelectedKategori(e.target.value)} 
                  className="w-full px-4 py-3 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark text-sm sm:text-base appearance-none outline-none font-medium"
                >
                  <option value="">Pilih Kategori Pendaftar</option>
                  <option value="Kategori Pemuda Karang Taruna Desa Padasuka">Kategori Pemuda Karang Taruna Desa Padasuka - Rp 10K/org</option>
                  <option value="Kategori Umum">Kategori Umum - Rp 15K/org</option>
                  <option value="SD">Kategori SD - Rp 5K/org</option>
                  <option value="SMP">Kategori SMP - Rp 8K/org</option>
                  <option value="SMA / SMK">Kategori SMA / SMK - Rp 10K/org</option>
                </select>
              </div>
              
              {selectedKategori && (
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-dark mb-2 block">Total Biaya Pendaftaran</label>
                  <div className="bg-primary/10 border border-primary/20 rounded-[12px] p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-primary block">Rp {feePerPerson.toLocaleString('id-ID')} x {playerCount} Orang ({selectedGame.includes('FC') || selectedGame.includes('PS') ? 'Individu' : 'Tim'})</span>
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
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 sm:py-4 rounded-[16px] mt-4 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base uppercase tracking-wide cursor-pointer"
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
              className="mt-8 w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg cursor-pointer"
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
      const encodedMessage = encodeURIComponent(message);
      const whatsappNumber = "6282312907731";
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      await new Promise(resolve => setTimeout(resolve, 600));
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
          <select required name="paket" className="w-full px-4 py-2.5 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm appearance-none font-medium">
            <option value="">Pilih Paket...</option>
            <option value="Paket Silver (Rp 500.000+)">Paket Silver (Rp 500.000+)</option>
            <option value="Paket Gold (Rp 1.250.000+)">Paket Gold (Rp 1.250.000+)</option>
            <option value="Paket Platinum (Rp 2.500.000+)">Paket Platinum (Rp 2.500.000+)</option>
            <option value="Donasi Bebas / Sumbangan">Donasi Bebas / Sumbangan</option>
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
        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-[12px] mt-2 transition-all shadow-lg flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed text-sm uppercase tracking-wide cursor-pointer"
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
