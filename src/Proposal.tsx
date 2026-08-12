import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Printer, Download, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPricingConfig } from './lib/utils';
import domtoimage from 'dom-to-image-more';
import { jsPDF } from 'jspdf';

export default function Proposal() {
  const navigate = useNavigate();
  const pricing = getPricingConfig();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const getPrice = (labelFragment: string) => {
    const item = pricing.find(p => p.label.includes(labelFragment));
    if (!item) return '5K';
    return (
      <span className="flex items-center justify-center gap-1">
        <span>{item.price / 1000}K</span>
      </span>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    const element = contentRef.current;
    if (!element) return;
    
    setIsDownloading(true);

    try {
      const pages = Array.from(element.querySelectorAll('.proposal-page')) as HTMLElement[];
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i];
        
        const dataUrl = await domtoimage.toJpeg(pageEl, { 
          quality: 0.98, 
          bgcolor: '#ffffff',
          scale: 2
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(dataUrl);
        const innerWidth = pdfWidth;
        const innerHeight = (imgProps.height * innerWidth) / imgProps.width;

        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(dataUrl, 'JPEG', 0, 0, innerWidth, innerHeight);
      }
      
      pdf.save('Proposal_Kegiatan_HUT_RI_81_Padasuka.pdf');
    } catch (error) {
      console.error('Failed to generate PDF', error);
      alert('Gagal mengunduh PDF. Silakan gunakan tombol Cetak untuk menyimpan sebagai PDF.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-serif pt-8 pb-16 print:bg-white print:p-0 print:m-0">
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm p-4 flex justify-between items-center z-50 print:hidden">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-sans font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> Kembali
        </button>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary-dark px-3 sm:px-4 py-2 rounded-lg font-sans font-medium transition-colors disabled:opacity-70 text-sm sm:text-base"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isDownloading ? 'Memproses...' : 'Download PDF'}
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 sm:px-4 py-2 rounded-lg font-sans font-medium transition-colors text-sm sm:text-base"
          >
            <Printer className="w-4 h-4" /> Cetak
          </button>
        </div>
      </div>

      <div ref={contentRef} className="mt-20 sm:mt-16 print:mt-0 flex flex-col items-center gap-8 print:gap-0">
        
        {/* Halaman 1: Cover */}
        <div className="bg-white w-[210mm] min-h-[297mm] shadow-lg print:shadow-none print:w-full px-[30mm] pt-[30mm] pb-[20mm] relative mx-auto box-border proposal-page flex flex-col justify-between" style={{ pageBreakAfter: 'always' }}>
          <div className="text-center space-y-6">
            <h1 className="uppercase tracking-wider mb-8">PROPOSAL KEGIATAN<br/>SEMARAK KEMERDEKAAN KE-81</h1>
            <img src="https://upload.wikimedia.org/wikipedia/id/f/f8/Logo_Karang_Taruna_New.png" alt="Karang Taruna" className="h-40 mx-auto my-12" />
            <div className="space-y-4">
              <h2 className="uppercase text-red-700">FESTIVAL LOMBA DAN HIBURAN</h2>
              <h3 className="uppercase">DESA PADASUKA, BAROS</h3>
              <p className="text-md mt-4">Peringatan Hari Ulang Tahun Republik Indonesia<br/>Sekaligus Wadah Silaturahmi Warga</p>
            </div>
          </div>
          <div className="text-center mt-auto border-t-2 border-black pt-4">
            <p className="font-bold uppercase text-lg">KARANG TARUNA DESA PADASUKA</p>
            <p className="text-sm mt-1">Kecamatan Baros, Kabupaten Serang - Banten</p>
            <p className="text-sm font-bold mt-2">TAHUN 2026</p>
          </div>
        </div>

        {/* Halaman 2: Bab I */}
        <div className="bg-white w-[210mm] min-h-[297mm] shadow-lg print:shadow-none print:w-full pl-[30mm] pr-[20mm] pt-[30mm] pb-[20mm] mx-auto box-border proposal-page text-justify leading-[1.6]" style={{ pageBreakAfter: 'always' }}>
          <h2 className="text-center uppercase mb-8">BAB I<br/>PENDAHULUAN</h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2">A. Latar Belakang</h3>
              <p>Momen peringatan Hari Ulang Tahun (HUT) Kemerdekaan Republik Indonesia selalu menjadi waktu yang ditunggu-tunggu oleh seluruh lapisan masyarakat. Perayaan 17 Agustus bukan sekadar seremonial belaka, melainkan sebuah refleksi sejarah perjuangan bangsa yang mengandung nilai-nilai patriotisme, gotong royong, dan persatuan yang kokoh. Di usia Kemerdekaan RI yang ke-81 ini, semangat nasionalisme patut terus dikobarkan, terlebih di kalangan generasi muda tingkat pedesaan sebagai ujung tombak kemajuan bangsa.</p>
              <p className="mt-2">Desa Padasuka, sebagai salah satu entitas masyarakat di Kecamatan Baros, memiliki pemuda-pemudi potensial dan masyarakat yang dinamis. Dalam rangka menjaga dan meningkatkan soliditas serta silaturahmi antarwarga, Karang Taruna Desa Padasuka merasa perlu menginisiasi sebuah acara peringatan tingkat desa yang terencana dan meriah. Melalui Festival Kemerdekaan ini, diharapkan berbagai kompetisi baik olahraga raga jasmani maupun eSport digital dapat menjadi ajang adu bakat sekaligus perekat kerukunan.</p>
            </div>
            <div>
              <h3 className="mb-2">B. Maksud dan Tujuan</h3>
              <ul className="list-[lower-alpha] pl-6 space-y-1">
                <li>Memeriahkan Peringatan HUT ke-81 Kemerdekaan Republik Indonesia.</li>
                <li>Menumbuhkan rasa nasionalisme, cinta tanah air, dan semangat sportivitas pemuda.</li>
                <li>Mempererat tali persaudaraan dan silaturahmi antarwarga dan generasi muda se-Desa Padasuka.</li>
                <li>Menyediakan panggung kompetisi eSport bergengsi dan terstruktur bagi bakat-bakat gaming lokal.</li>
                <li>Mengembangkan semangat produktif dan kepemimpinan pemuda-pemudi Karang Taruna Padasuka.</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2">C. Dasar Kegiatan</h3>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Pancasila dan UUD 1945.</li>
                <li>Program Kerja Tahunan Karang Taruna Desa Padasuka Tahun 2026.</li>
                <li>Hasil Musyawarah Pemuda dan Pengurus Karang Taruna Desa Padasuka.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Halaman 3: Bab II */}
        <div className="bg-white w-[210mm] min-h-[297mm] shadow-lg print:shadow-none print:w-full pl-[30mm] pr-[20mm] pt-[30mm] pb-[20mm] mx-auto box-border proposal-page text-justify leading-[1.6]" style={{ pageBreakAfter: 'always' }}>
           <h2 className="text-center uppercase mb-8">BAB II<br/>PELAKSANAAN KEGIATAN</h2>
           <div className="space-y-6">
             <div>
               <h3 className="mb-2">A. Nama dan Tema Kegiatan</h3>
               <p>Kegiatan ini bernama <strong>"eSport Festival Kemerdekaan HUT RI ke-81 Desa Padasuka"</strong> diselenggarakan oleh <strong>Karang Taruna Desa Padasuka</strong>. Dengan tema <strong>"Merdeka Bersama, Bangkit Berkarya di Era Digital!"</strong>, kegiatan ini menyajikan turnamen eSport bergengsi untuk menggali potensi dan kreativitas generasi muda.</p>
             </div>
             <div>
               <h3 className="mb-2">B. Waktu dan Tempat</h3>
               <p>Rangkaian kegiatan rencananya akan diselenggarakan pada:</p>
               <table className="mt-2 text-sm w-full font-sans">
                 <tbody>
                   <tr>
                     <td className="py-1 w-40 font-semibold align-top">• Hari/Tanggal</td>
                     <td className="py-1">: Minggu - Sabtu, 2 - 15 Agustus 2026</td>
                   </tr>
                   <tr>
                     <td className="py-1 font-semibold align-top">• Waktu</td>
                     <td className="py-1">: 09.00 WIB s/d Selesai</td>
                   </tr>
                   <tr>
                     <td className="py-1 font-semibold align-top">• Tempat</td>
                     <td className="py-1">: Lapangan Utama Padasuka & Panggung Utama eSport Arena</td>
                   </tr>
                 </tbody>
               </table>
             </div>
             <div>
               <h3 className="mb-2">C. Jenis Cabang Turnamen eSport</h3>
               <p>Turnamen terdiri dari 3 cabang game utama dengan target kuota peserta: MLBB 200 Peserta (40 Tim), FF 200 Peserta (50 Squad), FC26 50 Peserta (*berlaku penyesuaian otomatis algoritma target):</p>
               <ul className="list-decimal pl-6 mt-2 space-y-2">
                 <li><strong>Mobile Legends: Bang Bang</strong> (Tim 5 Orang)</li>
                 <li><strong>Free Fire</strong> (Squad 4 Orang)</li>
                 <li><strong>PlayStation 4 Pro EA SPORTS FC26</strong> (Individu 1v1)</li>
               </ul>
               <p className="mt-3 text-sm">Biaya pendaftaran disamaratakan sebesar Rp 5.000 per peserta untuk seluruh jenjang usia (SD, SMP, SMA/SMK, & Umum) dengan rincian estimasi hadiah Juara 1 & 2 (J1 & J2) dalam 1 Kategori Utama sebagai berikut:</p>
               <table className="w-full text-xs mt-2 border-collapse border border-gray-800">
                 <thead>
                   <tr className="bg-gray-100">
                     <th className="border border-gray-800 p-1.5 text-left">Kategori Turnamen</th>
                     <th className="border border-gray-800 p-1.5 text-center">Biaya / Peserta</th>
                     <th className="border border-gray-800 p-1.5 text-center">Mobile Legends (5v5)</th>
                     <th className="border border-gray-800 p-1.5 text-center">Free Fire (Squad)</th>
                     <th className="border border-gray-800 p-1.5 text-center">FC 26 (Individu)</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr>
                     <td className="border border-gray-800 p-2 font-semibold">Kategori Utama (Semua Usia)</td>
                     <td className="border border-gray-800 p-2 text-center font-bold">Rp 5.000</td>
                     <td className="border border-gray-800 p-2 text-center">J1: 500K | J2: 250K</td>
                     <td className="border border-gray-800 p-2 text-center">J1: 450K | J2: 225K</td>
                     <td className="border border-gray-800 p-2 text-center">J1: 120K | J2: 60K</td>
                   </tr>
                 </tbody>
               </table>
             </div>
             <div>
               <h3 className="mb-2">D. Peserta Acara</h3>
               <p>Peserta mencakup seluruh lapisan masyarakat Desa Padasuka dari usia anak-anak, pelajar, hingga umum serta masyarakat desa tetangga dalam ruang lingkup cabang eSport.</p>
             </div>
           </div>
        </div>

        {/* Halaman 4: Bab III Sponsorship */}
        <div className="bg-white w-[210mm] min-h-[297mm] shadow-lg print:shadow-none print:w-full pl-[30mm] pr-[20mm] pt-[30mm] pb-[20mm] mx-auto box-border proposal-page text-justify leading-[1.6]" style={{ pageBreakAfter: 'always' }}>
           <h2 className="text-center uppercase mb-8">BAB III<br/>PENAWARAN SPONSORSHIP</h2>
           <div className="space-y-6">
             <p>Kesempatan emas bagi Brand, Perusahaan, Institusi, atau Toko Anda untuk tampil dan mendukung keberlangsungan serta kemeriahan perayaan Kemerdekaan di Desa Padasuka. Kami menawarkan tiga tingkatan paket sponsorship:</p>
             <div>
                <h3 className="mb-2 text-slate-700 uppercase">1. Paket Silver (Rp 500.000+)</h3>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Penyebutan nama/brand oleh MC 1x</li>
                    <li>Nama/brand di website kegiatan</li>
                    <li>Nama/brand masuk dalam daftar sponsor</li>
                    <li>Logo pada spanduk & banner utama acara</li>
                </ul>
             </div>
             <div>
                <h3 className="mb-2 text-amber-600 uppercase">2. Paket Gold (Rp 1.250.000)</h3>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Promosi Produk & Jasa oleh MC (3x Adlips/penyebutan)</li>
                    <li>Logo ukuran sedang pada kemeja/jersey panitia</li>
                    <li>Logo ukuran sedang pada spanduk & banner utama acara</li>
                    <li>Nama & logo di website kegiatan dengan badge Gold</li>
                </ul>
             </div>
             <div>
                <h3 className="mb-2 text-slate-900 uppercase">3. Paket Platinum (Rp 2.500.000)</h3>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Promosi eksklusif tanpa batas oleh MC sepanjang acara</li>
                    <li>Logo ukuran terbesar di posisi paling strategis</li>
                    <li>Logo eksklusif pada kemeja/jersey panitia</li>
                    <li>Stand booth promosi khusus di lokasi acara</li>
                </ul>
             </div>
             <div className="mt-8">
                 <p className="italic font-medium border-l-4 border-primary pl-4 py-1 text-sm bg-gray-50/50">
                    Bagi donatur masyarakat / warga yang ingin menyumbang secara sukarela di luar paket sponsor, kami menerima donasi sukarela dalam bentuk uang tunai, barang hadiah (doorprize), maupun konsumsi.
                 </p>
             </div>
           </div>
        </div>

        {/* Halaman 5: Bab IV Penutup */}
        <div className="bg-white w-[210mm] min-h-[297mm] shadow-lg print:shadow-none print:w-full pl-[30mm] pr-[20mm] pt-[30mm] pb-[20mm] mx-auto box-border proposal-page text-justify leading-[1.6]" style={{ pageBreakAfter: 'always' }}>
           <h2 className="text-center uppercase mb-8">BAB IV<br/>PENUTUP</h2>
           <p className="mb-12">Demikian proposal ini kami buat. Kami menyadari bahwa suksesnya kegiatan ini tidak terlepas dari dukungan moril maupun materil dari berbagai pihak. Oleh karena itu, kami sangat mengharapkan partisipasi, kerja sama, dan bantuan baik dari Instansi, Perusahaan, maupun para Donatur dermawan. Semoga niat baik dan kontribusi kita semua mendapat ridho serta balasan dari Tuhan Yang Maha Esa.</p>
           <div className="mt-16 text-center">
             <p className="mb-4">Baros, Agustus 2026</p>
             <p className="font-bold mb-16">Panitia Pelaksana Kegiatan<br/>HUT RI Ke-81 Desa Padasuka</p>
             <div className="flex justify-between w-full px-8 mb-16">
                <div className="text-center w-1/2">
                  <p className="font-semibold mb-20 underline">Ketua Pelaksana</p>
                  <p className="font-bold uppercase">( ............................ )</p>
                </div>
                <div className="text-center w-1/2">
                  <p className="font-semibold mb-20 underline">Sekretaris</p>
                  <p className="font-bold uppercase">( ............................ )</p>
                </div>
             </div>
             <div className="mt-12 text-center w-full clear-both">
                <p className="font-semibold mb-6">Mengetahui,</p>
                <div className="flex justify-between w-full px-8">
                  <div className="text-center w-1/2">
                    <p className="font-semibold mb-20 underline">Kepala Desa Padasuka</p>
                    <p className="font-bold uppercase">( ............................ )</p>
                  </div>
                  <div className="text-center w-1/2">
                    <p className="font-semibold mb-20 underline">Ketua Karang Taruna</p>
                    <p className="font-bold uppercase">( ............................ )</p>
                  </div>
                </div>
             </div>
           </div>
        </div>

      </div>

      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background-color: white !important;
          }
          .proposal-page {
             width: 210mm !important;
             height: 297mm !important;
             min-height: 297mm !important;
             box-shadow: none !important;
             margin: 0 !important;
             padding-top: 30mm !important;
             padding-bottom: 20mm !important;
             padding-left: 30mm !important;
             padding-right: 20mm !important;
          }
        }
      `}</style>
    </div>
  );
}
