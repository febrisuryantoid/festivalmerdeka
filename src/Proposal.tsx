import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Proposal() {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
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
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
             className="flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-lg font-sans font-medium transition-colors"
          >
            <Printer className="w-4 h-4" /> Cetak / PDF
          </button>
        </div>
      </div>

      <div className="mt-16 print:mt-0 flex flex-col items-center gap-8 print:gap-0">
        
        {/* Halaman 1: Cover */}
        <div className="bg-white w-[210mm] min-h-[297mm] shadow-lg print:shadow-none print:w-full px-[30mm] pt-[30mm] pb-[20mm] relative mx-auto box-border proposal-page flex flex-col justify-between" style={{ pageBreakAfter: 'always' }}>
          
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold uppercase tracking-wider mb-8">PROPOSAL KEGIATAN<br/>SEMARAK KEMERDEKAAN KE-81</h1>
            
            <div className="flex justify-center my-12 hidden">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logo_kabupaten_serang.png" className="h-32 object-contain" alt="" />
            </div>

            <img src="https://upload.wikimedia.org/wikipedia/id/f/f8/Logo_Karang_Taruna_New.png" alt="Karang Taruna" className="h-40 mx-auto my-12" />
            
            <div className="space-y-4">
              <h2 className="text-xl font-bold uppercase text-red-700">FESTIVAL LOMBA DAN HIBURAN</h2>
              <h3 className="text-lg font-semibold uppercase">DESA PADASUKA, BAROS</h3>
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
        <div className="bg-white w-[210mm] min-h-[297mm] shadow-lg print:shadow-none print:w-full pl-[30mm] pr-[20mm] pt-[30mm] pb-[20mm] mx-auto box-border text-justify leading-[1.6]" style={{ pageBreakAfter: 'always' }}>
          
          <h2 className="font-bold text-center text-lg uppercase mb-8">BAB I<br/>PENDAHULUAN</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold mb-2">A. Latar Belakang</h3>
              <p>Momen peringatan Hari Ulang Tahun (HUT) Kemerdekaan Republik Indonesia selalu menjadi waktu yang ditunggu-tunggu oleh seluruh lapisan masyarakat. Perayaan 17 Agustus bukan sekadar seremonial belaka, melainkan sebuah refleksi sejarah perjuangan bangsa yang mengandung nilai-nilai patriotisme, gotong royong, dan persatuan yang kokoh. Di usia Kemerdekaan RI yang ke-81 ini, semangat nasionalisme patut terus dikobarkan, terlebih di kalangan generasi muda tingkat pedesaan sebagai ujung tombak kemajuan bangsa.</p>
              <p className="mt-2">Desa Padasuka, sebagai salah satu entitas masyarakat di Kecamatan Baros, memiliki pemuda-pemudi potensial dan masyarakat yang dinamis. Dalam rangka menjaga dan meningkatkan soliditas serta silaturahmi antarwarga, Karang Taruna Desa Padasuka merasa perlu menginisiasi sebuah acara peringatan tingkat desa yang terencana dan meriah. Melalui Festival Kemerdekaan ini, diharapkan berbagai kompetisi baik olahraga raga jasmani maupun eSport digital dapat menjadi ajang adu bakat sekaligus perekat kerukunan.</p>
            </div>

            <div>
              <h3 className="font-bold mb-2">B. Maksud dan Tujuan</h3>
              <ul className="list-[lower-alpha] pl-6 space-y-1">
                <li>Memeriahkan Peringatan HUT ke-81 Kemerdekaan Republik Indonesia.</li>
                <li>Menumbuhkan rasa nasionalisme, cinta tanah air, dan mengenang jasa pahlawan.</li>
                <li>Mempererat tali persaudaraan dan silaturahmi antarwarga se-Desa Padasuka.</li>
                <li>Menyediakan wadah positif dan sportif melalui perlombaan tradisional serta kompetisi modern (eSport).</li>
                <li>Mengembangkan semangat produktif pemuda-pemudi Karang Taruna Padasuka.</li>
              </ul>
            </div>

             <div>
              <h3 className="font-bold mb-2">C. Dasar Kegiatan</h3>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Pancasila dan UUD 1945.</li>
                <li>Program Kerja Tahunan Karang Taruna Desa Padasuka Tahun 2026.</li>
                <li>Hasil Musyawarah Pemuda dan Tokoh Masyarakat Desa Padasuka.</li>
              </ol>
            </div>
            
          </div>
        </div>

        {/* Halaman 3: Bab II */}
        <div className="bg-white w-[210mm] min-h-[297mm] shadow-lg print:shadow-none print:w-full pl-[30mm] pr-[20mm] pt-[30mm] pb-[20mm] mx-auto box-border text-justify leading-[1.6]" style={{ pageBreakAfter: 'always' }}>
          
           <h2 className="font-bold text-center text-lg uppercase mb-8">BAB II<br/>PELAKSANAAN KEGIATAN</h2>
           
           <div className="space-y-6">
             <div>
               <h3 className="font-bold mb-2">A. Nama dan Tema Kegiatan</h3>
               <p>Kegiatan ini bernama <strong>"Festival Kemerdekaan Desa Padasuka - Semarak HUT RI ke-81"</strong>. Dengan tema <strong>"Merdeka Bersama, Bangkit Berkarya!"</strong>, kegiatan ini memadukan semangat perlombaan tradisional yang kental akan budaya, dengan modernitas perlombaan eSport yang menyasar kreativitas generasi masa kini.</p>
             </div>

             <div>
               <h3 className="font-bold mb-2">B. Waktu dan Tempat</h3>
               <p>Rangkaian kegiatan rencananya akan diselenggarakan pada:</p>
               <table className="mt-2 text-sm w-full font-sans">
                 <tbody>
                   <tr>
                     <td className="py-1 w-40 font-semibold align-top">• Hari/Tanggal</td>
                     <td className="py-1">: Sabtu - Senin, 15 - 17 Agustus 2026</td>
                   </tr>
                   <tr>
                     <td className="py-1 font-semibold align-top">• Waktu</td>
                     <td className="py-1">: 08.00 WIB s/d Selesai</td>
                   </tr>
                   <tr>
                     <td className="py-1 font-semibold align-top">• Tempat</td>
                     <td className="py-1">: Lapangan Utama Padasuka, Balai Desa & Sekitarnya</td>
                   </tr>
                 </tbody>
               </table>
             </div>

             <div>
               <h3 className="font-bold mb-2">C. Jenis Kegiatan / Perlombaan</h3>
               <p>Kategori lomba dibagi menjadi unsur Tradisional & Digital (eSport):</p>
               <ul className="list-decimal pl-6 mt-2 space-y-2">
                 <li><strong>Tradisional & Hiburan</strong><br/>Balap Karung Helm, Tarik Tambang, Makan Kerupuk, Panjat Pinang, Senam Massal Ibu-ibu, Lomba Memasak Nasi Liwet.</li>
                 <li><strong>Olahraga Jasmani</strong><br/>Futsal Mini Sarung, Reuni Volly Kampung.</li>
                 <li><strong>Kompetisi eSport (Target Min. 32 Slot/Game)</strong>
                    <p className="mt-1 text-sm">Khusus untuk cabang eSport, diberlakukan pembagian kategori berdasarkan jenjang usia dengan biaya pendaftaran dan rincian hadiah Juara 1 & 2 (J1 & J2) sebagai berikut:</p>
                    <table className="w-full text-xs mt-2 border-collapse border border-gray-800">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-800 p-1 text-left">Kategori</th>
                          <th className="border border-gray-800 p-1 text-center">Biaya/Orang</th>
                          <th className="border border-gray-800 p-1 text-center">Mobile Legends</th>
                          <th className="border border-gray-800 p-1 text-center">Free Fire</th>
                          <th className="border border-gray-800 p-1 text-center">FC 26</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-800 p-1 font-semibold">SD</td>
                          <td className="border border-gray-800 p-1 text-center">Rp 5.000</td>
                          <td className="border border-gray-800 p-1 text-center">J1: 150K | J2: 75K</td>
                          <td className="border border-gray-800 p-1 text-center">J1: 120K | J2: 60K</td>
                          <td className="border border-gray-800 p-1 text-center">J1: 30K | J2: 15K</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-800 p-1 font-semibold">SMP</td>
                          <td className="border border-gray-800 p-1 text-center">Rp 8.000</td>
                          <td className="border border-gray-800 p-1 text-center">J1: 250K | J2: 100K</td>
                          <td className="border border-gray-800 p-1 text-center">J1: 200K | J2: 100K</td>
                          <td className="border border-gray-800 p-1 text-center">J1: 50K | J2: 25K</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-800 p-1 font-semibold">SMA</td>
                          <td className="border border-gray-800 p-1 text-center">Rp 10.000</td>
                          <td className="border border-gray-800 p-1 text-center">J1: 350K | J2: 150K</td>
                          <td className="border border-gray-800 p-1 text-center">J1: 250K | J2: 125K</td>
                          <td className="border border-gray-800 p-1 text-center">J1: 75K | J2: 35K</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-800 p-1 font-semibold">Umum</td>
                          <td className="border border-gray-800 p-1 text-center">Rp 15.000</td>
                          <td className="border border-gray-800 p-1 text-center">J1: 500K | J2: 250K</td>
                          <td className="border border-gray-800 p-1 text-center">J1: 400K | J2: 200K</td>
                          <td className="border border-gray-800 p-1 text-center">J1: 100K | J2: 50K</td>
                        </tr>
                      </tbody>
                    </table>
                 </li>
               </ul>
             </div>

              <div>
               <h3 className="font-bold mb-2">D. Peserta Acara</h3>
               <p>Peserta mencakup seluruh lapisan masyarakat Desa Padasuka dari usia anak-anak, pelajar, hingga umum (maksimal usia 50 tahun untuk kategori tertentu) serta masyarakat desa tetangga dalam ruang lingkup cabang eSport.</p>
             </div>
           </div>
        </div>

        {/* Halaman 4: Bab III RAB dan Sponsorship */}
        <div className="bg-white w-[210mm] min-h-[297mm] shadow-lg print:shadow-none print:w-full pl-[30mm] pr-[20mm] pt-[30mm] pb-[20mm] mx-auto box-border text-justify leading-[1.6]" style={{ pageBreakAfter: 'always' }}>
           <h2 className="font-bold text-center text-lg uppercase mb-8">BAB III<br/>PENAWARAN SPONSORSHIP</h2>
           
           <div className="space-y-6">
             <p>Kesempatan emas bagi Brand, Perusahaan, Institusi, atau Toko Anda untuk tampil dan mendukung keberlangsungan serta kemeriahan perayaan Kemerdekaan di Desa Padasuka. Kami menawarkan tiga tingkatan paket sponsorship:</p>
             
             <div>
                <h3 className="font-bold mb-2 text-slate-700 uppercase">1. Paket Silver (Rp 20.000 / Slot)</h3>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Pemuatan Nama/Logo di Banner Acara (Kecil)</li>
                    <li>Disebutkan oleh MC (1x Adlips pengumuman)</li>
                </ul>
             </div>

             <div>
                <h3 className="font-bold mb-2 text-yellow-600 uppercase">2. Paket Gold (Rp 50.000 / Slot)</h3>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Posisi Logo Premium di Banner Utama (Sedang)</li>
                    <li>Promosi Produk oleh MC (2x Adlips/penyebutan)</li>
                    <li>Diberikan spot khusus gelar Produk/Brosur di Area Acara</li>
                </ul>
             </div>

             <div>
                <h3 className="font-bold mb-2 text-slate-900 uppercase">3. Paket Platinum (Rp 150.000+ / Slot Eksklusif)</h3>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Logo Terbesar di Center Banner & Kaos Panitia</li>
                    <li>Promosi MC Tanpa Batas / Adlips eksklusif sepanjang acara</li>
                    <li>Spanduk Khusus Brand Anda di berbagai Titik Strategis sekitar panggung</li>
                </ul>
             </div>

             <div className="mt-8">
                 <p className="italic font-medium border-l-4 border-primary pl-4 py-1 text-sm bg-gray-50/50">
                    Bagi donatur masyarakat / warga yang ingin menyumbang secara sukarela di luar paket sponsor, kami menerima donasi sukarela dalam bentuk uang tunai, barang hadiah (doorprize), maupun konsumsi.
                 </p>
             </div>
           </div>
        </div>

        {/* Halaman 5: Bab IV Penutup dan Pengesahan */}
        <div className="bg-white w-[210mm] min-h-[297mm] shadow-lg print:shadow-none print:w-full pl-[30mm] pr-[20mm] pt-[30mm] pb-[20mm] mx-auto box-border text-justify leading-[1.6]" style={{ pageBreakAfter: 'always' }}>
           
           <h2 className="font-bold text-center text-lg uppercase mb-8">BAB IV<br/>PENUTUP</h2>
           
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
             page-break-after: always;
             page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
