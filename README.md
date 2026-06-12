# 🇮🇩 Festival Merdeka 2026 - HUT RI ke-81

<div align="center">
  <img src="https://beeimg.com/images/k22145264424.png" alt="81 TH" width="120" style="filter: drop-shadow(0px 0px 4px rgba(215, 0, 31, 0.4));">
  <h3>Merdeka dan Berkarya!</h3>
</div>

<br />

Aplikasi untuk memeriahkan kemerdekaan Republik Indonesia dengan semangat kebersamaan dan sportivitas. Informasi jadwal dan pendaftaran lomba 17-an di Desa Padasuka.

---

## 📑 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Instalasi dan Konfigurasi](#-instalasi-dan-konfigurasi)
- [Struktur Folder](#-struktur-folder)
- [Pengembang](#-pengembang)

---

## ✨ Fitur Utama

1. 📱 **Responsif & PWA-Ready**: Aplikasi dapat diakses di berbagai perangkat (Mobile, Tablet, Desktop) dan dapat diinstall layaknya aplikasi native (Progressive Web App).
2. 🎮 **Pendaftaran eSport**: Sistem formulir pendaftaran khusus lomba eSport (Mobile Legends, Free Fire, EA FC).
3. 🏅 **Pendaftaran Tradisional**: Sistem informasi untuk pendaftaran lomba-lomba tradisional.
4. 🤝 **Sistem Sponsorship**: Menu penawaran dan formulir kemitraan / donatur untuk brand / usaha lokal.
5. 📊 **Sinkronisasi Data**: Terintegrasi langsung dengan database / spreadsheet untuk rekap pendaftaran panitia.

---

## 💻 Teknologi yang Digunakan

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion (Animasi)
- **Icons**: Lucide React
- **Hosting**: Google Cloud Run (via Google AI Studio)

---

## 🚀 Instalasi dan Konfigurasi

Jika Anda ingin menjalankan atau mengembangkan situs ini di lokal:

1. Clone repositori ini ke lokal mesin Anda:
   ```bash
   git clone https://github.com/[username]/festival-padasuka.git
   ```

2. Masuk ke direktori proyek:
   ```bash
   cd festival-padasuka
   ```

3. Install dependensi NPM:
   ```bash
   npm install
   ```

4. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```

5. Buka `http://localhost:3000` di browser Anda.

---

## 📂 Struktur Folder

```
/
├── public/                 # Aset statis & manifest file
├── src/
│   ├── components/         # Komponen UI React
│   ├── lib/                # Fungsi utilitas 
│   ├── App.tsx             # Entry point komponen utama
│   ├── index.css           # Styling global dengan Tailwind
│   └── main.tsx            # Entry point React
├── package.json            # Konfigurasi dependensi project
├── vite.config.ts          # Konfigurasi Vite bundler
└── README.md
```

---

## 👨‍💻 Pengembang

Dikembangkan dengan bangga oleh **Febri Suryanto**.

- 🌐 Website: [febrisuryanto.com](https://febrisuryanto.com)
- ✉️ Email: [hello@febrisuryanto.com](mailto:hello@febrisuryanto.com)

Ikut berkontribusi dalam membangun ekosistem desa digital yang modern dan bermanfaat!

<div align="center">
  <p>© 2026 Karang Taruna Desa Padasuka. All rights reserved.</p>
</div>
