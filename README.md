# SI-PAD Lamsel — Modul E-Retribusi Wisata Kawasan Pesisir Kalianda
> **Sistem Informasi Pengelolaan Pendapatan Asli Daerah (PAD) Kabupaten Lampung Selatan**  
> Proyek Kuis Mata Kuliah **Perencanaan & Pengembangan Sistem Informasi (PPSI)**  
> **Universitas Teknokrat Indonesia**

---

## 👤 Identitas Pengembang
* **Nama** : Mutia Afif Ramadhani
* **NPM** : 24311124
* **Program Studi** : Sistem Informasi (SI 23A)
* **Instansi Mitra** : BPPRD & Dinas Pariwisata Kabupaten Lampung Selatan

---

## 🌐 Demo Live Online
* 🚀 **Vercel Production Deployment**: [https://sipad-lamsel-kalianda.vercel.app](https://sipad-lamsel-kalianda.vercel.app)

---

## 📖 Gambaran Sistem
SI-PAD Lamsel Modul E-Retribusi Wisata Kalianda merupakan solusi digitalisasi retribusi daerah untuk menutup celah kebocoran pendapatan, mengeliminasi penggunaan tiket fisik konvensional, mempercepat proses antrean di pintu masuk objek wisata (< 2 detik), dan menyajikan laporan rekonsiliasi kas daerah secara *real-time*.

### 📱 4 Layar Utama Aplikasi:
1. **Layar A — Validator Lapangan & POS Gate Scanner:**  
   Pemindai QR Code e-ticket dengan validasi single-use token, simulasi palang gerbang otomatis (*barrier gate*), kalkulator karcis darurat tunai, serta cetak struk thermal printer PT-210 disertai efek audio buzzer/beep via Web Audio API.
2. **Layar B — Portal E-Ticketing Wisatawan:**  
   Pemesanan e-tiket resmi wisata pesisir Kalianda (Pantai Marina, Kedu Warna, Canti, dll.), kalkulasi tarif per pengunjung & kendaraan, dan simulasi checkout pembayaran QRIS/E-Wallet.
3. **Layar C — Dashboard Eksekutif BPPRD & Kasda:**  
   Monitoring penerimaan PAD real-time, grafik tren transaksi, persentase capaian target daerah, dan log audit transaksi petugas pos.
4. **Layar D — Portal PWA Wisatawan & Tiket Digital:**  
   Tampilan karcis digital smartphone siap scan dengan QR code dinamis terenkripsi.

---

## 💻 Cara Menjalankan Secara Lokal (Localhost)

### Opsi 1: Klik Ganda (Windows)
Cukup klik dua kali file:
```
Jalankan_Localhost.bat
```
Server akan aktif dan membuka browser secara otomatis ke `http://localhost:3000`.

### Opsi 2: Menggunakan Node.js
```bash
npm start
# atau
node server.js
```
Akses di browser: [http://localhost:3000](http://localhost:3000)

---

## 📁 Struktur Direktori
```text
├── Quiz PPSI - Mutia Afif Ramadhani 24311124/
│   ├── Aplikasi/            # Source code prototipe SPA (HTML, CSS, JS)
│   │   ├── css/style.css
│   │   ├── js/app.js
│   │   ├── js/audio.js
│   │   ├── js/qr.js
│   │   ├── js/store.js
│   │   ├── index.html
│   │   └── prd.md
│   ├── WORD/                # Laporan & berkas kuis docx
│   └── Dokumentasi_Desain_SI-PAD_Lamsel.md
├── server.js                # Localhost HTTP Server
├── Jalankan_Localhost.bat   # Launcher script Windows
├── vercel.json              # Konfigurasi deployment Vercel
└── README.md
```
