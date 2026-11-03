# SI-PAD Lamsel — Dokumentasi Desain Antarmuka

> **Nama sistem:** SI-PAD Kabupaten Lampung Selatan  
> **Instansi:** BPPRD Kabupaten Lampung Selatan  
> **Tujuan desain:** Mendukung pemungutan retribusi wisata, validasi tiket di gerbang, pembayaran digital/tunai, pemantauan penerimaan PAD, dan layanan e-ticketing wisatawan.  
> **Sumber:** Prototipe HTML yang diberikan pengguna. Angka, identitas, dan transaksi yang tercantum di bawah merupakan data contoh/simulasi dari desain, bukan pernyataan data operasional sebenarnya.

---

## 1. Gambaran Umum

Desain SI-PAD Lamsel menggabungkan antarmuka operasional petugas lapangan, portal e-ticketing wisatawan, dashboard eksekutif BPPRD, dan portal wisatawan berbasis PWA. Gaya visualnya menggunakan tampilan dashboard modern dengan kartu informasi, sudut membulat, ikon Material Symbols, serta tipografi Inter dan Plus Jakarta Sans.

### Sasaran pengguna

- **Petugas pos/gate:** memindai QR tiket, memeriksa validitas tiket, membuka palang, mencetak struk, dan mencatat transaksi tunai.
- **Koordinator pos/kasir:** memantau performa shift, transaksi masuk, kas fisik, dan log audit.
- **Admin/eksekutif BPPRD:** memantau penerimaan PAD, jumlah wisatawan, performa objek wisata, status gerbang, dan rekonsiliasi transaksi.
- **Wisatawan:** memilih destinasi, menentukan tanggal dan jumlah pengunjung, memilih kendaraan, menghitung retribusi, serta melihat simulasi e-tiket.

---

## 2. Sistem Visual dan Design Tokens

### 2.1 Tipografi

| Penggunaan | Font |
|---|---|
| Judul dan heading | Plus Jakarta Sans |
| Isi, label, angka, dan tabel | Inter |
| Ikon | Material Symbols Outlined |

### 2.2 Palet warna utama

| Token / warna | Nilai | Penggunaan |
|---|---|---|
| Primary | `#0037B0` | Aksi utama, navigasi aktif, status sukses, grafik utama |
| Primary container | `#1D4ED8` | Tombol utama dan aksen |
| Background | `#F7F9FB` | Latar halaman |
| Surface | `#F7F9FB` | Permukaan dasar |
| Surface container low | `#F2F4F6` | Latar kartu dan kelompok informasi |
| Surface container | `#ECEEF0` | Panel sekunder |
| On-surface | `#191C1E` | Teks utama |
| On-surface variant | `#434655` | Teks pendukung |
| Outline | `#747686` | Label sekunder dan elemen pembatas |
| Error | `#BA1A1A` | Status gagal, tiket duplikat, dan peringatan |
| Error container | `#FFDAD6` | Latar pesan kesalahan |
| Tertiary | `#6B3700` | Pembayaran tunai dan kasir |
| Tertiary container | `#8D4B00` | Aksen loket tunai |

### 2.3 Karakter komponen

- Kartu menggunakan sudut membulat dan bayangan ringan.
- Tombol aksi utama menggunakan warna biru; aksi tunai menggunakan warna terakota/cokelat.
- Status dibedakan dengan label/chip yang jelas, seperti valid, ditolak, aktif, dan offline.
- Dashboard menggunakan kartu KPI, grafik, tabel transaksi, dan panel status.
- Antarmuka petugas dirancang berkontras tinggi agar mudah dibaca di lingkungan lapangan.
- Layout desktop memanfaatkan sidebar dan header; portal wisatawan mengutamakan pemesanan yang mudah dipahami dan responsif.

---

## 3. Layar A — Validator Lapangan dan POS Gate Scanner

### 3.1 Tujuan

Antarmuka petugas untuk memindai dan memvalidasi e-tiket wisatawan di gerbang, memproses tiket tunai darurat, serta melihat ringkasan operasional shift.

### 3.2 Navigasi utama

Sidebar menampilkan identitas SI-PAD LAMSEL dan BPPRD Kalianda, dengan menu:

- Dashboard BPPRD
- Validator Lapangan
- Pratinjau Turis
- Monitoring Real-Time PAD
- POS & Gate Scanner
- Titik Pos Kalianda
- Rekonsiliasi Kas PAD
- Audit Petugas Pos

Panel status di bagian bawah sidebar menampilkan status QRIS Switcher, NMID, dan Kasda Lampung Selatan.

### 3.3 Header petugas dan perangkat

Bagian terminal petugas menampilkan:

- Nama dan avatar/inisial petugas.
- Jabatan/role petugas dan NIP.
- Jam kerja atau rentang shift.
- Nama lokasi pos, misalnya Pos 1 Pantai Marina Kalianda.
- Status koneksi/sinkronisasi.
- Persentase baterai.
- Identitas printer thermal yang terhubung.

### 3.4 Pemindai QR

Komponen pemindai berbentuk area kamera dengan bingkai target pemindaian dan garis laser animasi. Instruksi utama:

> Arahkan QR Code E-Tiket Wisatawan ke Dalam Kotak.

Informasi tambahan menyebut deteksi QRIS dan tiket PWA. Kontrol yang tersedia pada desain:

- Torch ON/OFF.
- Ganti kamera.
- Kontrol bunyi/beep.

### 3.5 Verifikasi manual

Jika layar ponsel wisatawan retak atau QR tidak dapat terbaca, petugas dapat memasukkan kode tiket melalui kolom **Bypass Manual**. Contoh kode pada desain: `LMS-20241012-0842`. Tombol **Verifikasi** memicu tampilan hasil validasi.

### 3.6 Hasil validasi tiket

**Status berhasil / valid** menampilkan:

- Pesan “TIKET VALID - SILAKAN MASUK”.
- Status gerbang, misalnya Lolos Pintu A.
- Kode pemesanan.
- Waktu pemindaian.
- Manifest rombongan (jumlah orang dan kendaraan).
- Destinasi dan pintu masuk.
- Tombol **Cetak Struk Thermal**.
- Tombol **Buka Palang Otomatis**.

**Status peringatan / tiket terpakai** menampilkan:

- Pesan bahwa tiket telah digunakan atau sudah dipindai.
- Status Ditolak Gate.
- Riwayat pemindaian sebelumnya, termasuk waktu, pos, dan petugas.
- Peringatan untuk pemeriksaan lebih lanjut jika ada indikasi duplikasi.
- Tombol **Banding Kasir**.
- Tombol **Laporkan Duplikasi**.

Desain menyediakan tombol simulasi untuk berpindah antara kondisi valid dan kondisi peringatan.

### 3.7 Loket tunai darurat

Panel **Loket Tunai Darurat** menyediakan kalkulator penerbitan karcis fisik/porporasi ketika pembayaran digital tidak digunakan atau mode offline diperlukan.

| Kategori | Tarif contoh pada desain |
|---|---:|
| 1 orang dewasa | Rp10.000 |
| 1 kendaraan roda dua (motor) | Rp5.000 |
| 1 kendaraan roda empat (mobil) | Rp20.000 |

Fitur yang ditampilkan:

- Tombol tambah dan kurang jumlah setiap kategori.
- Penghitungan total otomatis.
- Tombol **Reset**.
- Tombol **Cetak Karcis Retribusi Berporporasi**.
- Status “Mode Offline Siap”.

### 3.8 Ringkasan shift

Panel **Ringkasan Validasi Lapangan** menampilkan informasi shift dan pos serta metrik berikut sebagai contoh data pada prototipe:

| Metrik | Nilai contoh |
|---|---:|
| Kendaraan lolos | 342 |
| Laju kendaraan | +18/jam |
| Wisatawan masuk | 1.120 jiwa |
| Anak-anak | 148 |
| Rasio cashless QRIS | 88,4% |
| Kas fisik pos | Rp1.450.000 |
| Karcis tunai | 11,6% |

Tersedia grafik **Trafik Alur Validasi Per Jam** untuk memperlihatkan volume aktivitas berdasarkan jam, dengan periode padat yang ditandai pada desain.

### 3.9 Log audit gate

Tabel menampilkan lima transaksi terakhir dengan kolom:

- Waktu
- Booking ID
- Kategori/kendaraan
- Nominal retribusi
- Metode pembayaran
- Status pintu

Contoh metode/status yang ditampilkan: QRIS Kasda, PWA E-Tiket, Karcis Tunai, Duplikasi, Terbuka, dan Tertutup.

### 3.10 Interaksi yang tampak pada prototipe

- Menambah/mengurangi jumlah kategori pada kalkulator tunai.
- Menghitung ulang total tagihan.
- Mengosongkan jumlah dengan tombol Reset.
- Mengganti kartu valid dan peringatan.
- Menyalakan/mematikan torch.
- Menampilkan notifikasi simulasi cetak karcis.

> **Catatan implementasi:** pemindaian kamera, integrasi QRIS/Kasda, printer Bluetooth, dan pembukaan palang memerlukan integrasi perangkat/backend. Tampilan prototipe saja tidak membuktikan integrasi tersebut telah berjalan.

---

## 4. Layar B — Portal E-Ticketing Wisatawan Kalianda

### 4.1 Tujuan

Portal publik bagi wisatawan untuk mencari destinasi, menentukan kebutuhan kunjungan, menghitung retribusi, dan melihat pratinjau e-tiket.

### 4.2 Header dan informasi layanan

Header memuat logo/identitas SI-PAD, label Lamsel, dan identitas BPPRD Kabupaten Lampung Selatan. Desain juga memiliki banner pemberitahuan layanan/regulasi.

### 4.3 Hero section

Pesan utama:

> Jelajahi Pesisir Kalianda Tanpa Antre di Gerbang.

Hero section berisi narasi layanan, penanda layanan aktif, elemen kepercayaan, dan visual destinasi/aktivitas PAD.

### 4.4 Formulir reservasi

Widget **Reservasi Tiket Instan** berisi:

1. **Pemilihan destinasi** melalui pilihan/pills.
2. **Tanggal kunjungan**.
3. **Jumlah pengunjung** melalui stepper.
4. **Kategori kendaraan**.
5. **Rincian perhitungan retribusi** yang diperbarui sesuai pilihan.
6. **Tombol aksi utama** untuk melanjutkan proses reservasi.

Formulir ditata dalam kartu terpisah agar pengguna dapat melihat pilihan dan ringkasan biaya secara jelas.

### 4.5 Destinasi unggulan

Empat destinasi yang ditampilkan dalam desain:

- Pantai Marina Kalianda
- Pantai Kedu Warna
- Dermaga Wisata Canti
- Dermaga Bom Kalianda / area kuliner

Setiap kartu destinasi menyajikan identitas destinasi dan elemen visual pendukung.

### 4.6 Pratinjau e-tiket

Bagian **Simulasi E-Tiket Sah BPPRD** menampilkan desain tiket bergaya boarding pass/karcis digital, dengan:

- Header identitas tiket.
- Informasi pemesanan.
- QR code sekali pakai sebagai elemen visual.
- Rincian metadata tiket.
- Garis perforasi/struk.
- Tombol aksi tiket.

QR pada desain adalah visual prototipe; validitas tiket sebenarnya harus ditentukan oleh sistem backend.

### 4.7 FAQ dan bantuan

Bagian FAQ memuat accordion pertanyaan terkait retribusi dan ketentuan wisata. Terdapat pula banner kontak/bantuan pemerintah.

---

## 5. Layar C — Dashboard Eksekutif Monitoring PAD BPPRD

### 5.1 Tujuan

Dashboard untuk memantau performa penerimaan Pendapatan Asli Daerah (PAD) dari retribusi wisata pesisir Kalianda, memantau aktivitas gerbang, dan meninjau transaksi untuk rekonsiliasi.

### 5.2 Header dan filter

Komponen header memuat identitas dashboard dan kontrol untuk tindakan cepat/rekonsiliasi. Filter digunakan untuk membatasi data yang dipantau berdasarkan periode atau konteks operasional yang tersedia pada prototipe.

### 5.3 Kartu KPI

Empat indikator utama yang ditampilkan:

1. **Penerimaan PAD**
2. **Volume wisatawan**
3. **Rasio cashless vs tunai**
4. **Status pos gerbang aktif**

Angka pada kartu merupakan contoh data dalam desain dan bukan angka resmi.

### 5.4 Analitik penerimaan dan destinasi

Panel analitik meliputi:

- **Tren Penerimaan PAD Per Jam (Hari Ini):** grafik tren penerimaan, garis target, area realisasi, dan penanda jam puncak.
- **Distribusi Pendapatan Per Objek Wisata:** grafik donat dan daftar destinasi.
- **Terminal Validasi QR Real-Time:** feed aktivitas pemindaian, termasuk transaksi sukses, transaksi tunai darurat, dan peringatan duplikasi.

Persentase distribusi destinasi yang terlihat pada desain:

| Destinasi | Persentase contoh |
|---|---:|
| Pantai Marina | 45% |
| Pantai Kedu Warna | 29,5% |
| Dermaga Canti | 16% |
| Dermaga Bom | 9,5% |

### 5.5 Tabel transaksi dan rekonsiliasi

Tabel transaksi mendukung pemeriksaan data penerimaan dan status transaksi. Contoh baris pada desain meliputi transaksi berhasil, anomali/duplikasi, transaksi tunai darurat, dan rombongan bus.

Bagian tabel juga menampilkan kontrol pencarian, pagination, agregat, dan pemberitahuan audit/kepatuhan.

### 5.6 Tujuan operasional dashboard

- Membantu pemantauan penerimaan PAD.
- Memberikan gambaran volume wisatawan dan aktivitas gerbang.
- Membandingkan kontribusi destinasi.
- Menyoroti anomali transaksi.
- Mendukung pemeriksaan dan rekonsiliasi keuangan daerah.

---

## 6. Layar D — Portal Wisatawan PWA Kalianda

### 6.1 Tujuan

Versi portal yang lebih berorientasi pada perangkat mobile, dengan alur pemesanan ringkas dan pratinjau e-tiket dalam satu pengalaman yang mudah digunakan.

### 6.2 Struktur layar

- Banner instalasi PWA dan identitas layanan pemerintah.
- Hero section dengan pesan “Jelajahi Pesisir Kalianda Tanpa Antre di Gerbang”.
- Widget **Reservasi Instan Retribusi**.
- Pemilih destinasi wisata.
- Pemilih tanggal kunjungan.
- Stepper jumlah pengunjung dewasa.
- Pemilih kategori kendaraan.
- Rincian perhitungan biaya.
- Tombol aksi utama.
- Kartu **Simulasi E-Tiket Aktif**.
- Daftar destinasi terpadu.
- Panduan masuk gerbang otomatis.
- FAQ pengunjung.

### 6.3 Kartu e-tiket

Kartu e-tiket menampilkan:

- Label status pembayaran, misalnya “Lunas”.
- Detail tiket dan kunjungan.
- QR bergaya holografik/visual.
- Identitas “E-TIKET WISATA RESMI”.
- Bagian pratinjau dokumen/tiket.

Status pada mockup perlu dibedakan dari status transaksi yang telah diverifikasi backend.

### 6.4 Prinsip pengalaman pengguna

- Formulir reservasi ringkas dan cocok untuk layar kecil.
- Pilihan destinasi, tanggal, jumlah pengunjung, dan kendaraan mudah ditemukan.
- Ringkasan tarif ditampilkan sebelum pengguna melanjutkan.
- Status tiket dan informasi QR ditampilkan dengan jelas.

---

## 7. Navigasi dan Modul yang Teridentifikasi

Berdasarkan navigasi dan bagian prototipe, modul yang tampak mencakup:

| Modul | Fungsi yang digambarkan |
|---|---|
| Dashboard BPPRD | Pemantauan KPI dan analitik PAD |
| Validator Lapangan | Validasi tiket oleh petugas |
| Pratinjau Turis | Pratinjau portal wisatawan |
| Monitoring Real-Time PAD | Pemantauan transaksi dan penerimaan |
| POS & Gate Scanner | Pemindaian QR dan validasi akses gerbang |
| Titik Pos Kalianda | Navigasi menuju pengelolaan titik pos |
| Rekonsiliasi Kas PAD | Peninjauan transaksi dan kas |
| Audit Petugas Pos | Navigasi menuju audit petugas |
| Portal E-Ticketing | Pemesanan retribusi wisata |
| Portal Wisatawan PWA | Alur pemesanan mobile dan tampilan tiket |

Nama modul pada tabel mencerminkan label yang terlihat dalam prototipe; cakupan fitur lengkap tiap modul perlu dikonfirmasi melalui kebutuhan produk.

---

## 8. Status dan Kondisi Antarmuka

| Kondisi | Tampilan yang dirancang |
|---|---|
| Tiket valid | Pesan sukses dan tombol untuk melanjutkan akses |
| Tiket terpakai/duplikat | Pesan peringatan, riwayat scan, dan tindakan pelaporan |
| Pembayaran digital | Label metode QRIS Kasda atau PWA E-Tiket |
| Pembayaran tunai | Label karcis tunai dan kalkulator POS |
| Mode offline | Label kesiapan kasir offline |
| Gerbang terbuka | Status akses berhasil |
| Gerbang tertutup | Status penolakan/akses tidak diberikan |
| Koneksi/sinkronisasi | Status koneksi ditampilkan pada header/perangkat |
| PWA e-tiket | Pratinjau tiket dengan status dan QR visual |

---

## 9. Catatan Validasi Sebelum Pengembangan

Hal-hal berikut belum dapat dipastikan hanya dari desain HTML dan sebaiknya ditentukan dalam PRD atau spesifikasi teknis:

1. Struktur role dan hak akses final setiap pengguna.
2. Tarif retribusi resmi per orang, kendaraan, destinasi, dan kategori lain.
3. Aturan anak-anak, rombongan, pengecualian, pembatalan, dan pengembalian dana.
4. Siklus status tiket serta aturan tiket sekali pakai.
5. Prosedur ketika QR gagal dipindai atau tiket terdeteksi duplikat.
6. Prosedur offline, sinkronisasi ulang, dan pencegahan transaksi ganda.
7. Integrasi QRIS, Kasda, printer thermal, kamera, dan palang otomatis.
8. Format audit log, retensi data, dan kebutuhan keamanan.
9. Sumber data dashboard, definisi KPI, periode agregasi, dan aturan rekonsiliasi.
10. Aksesibilitas, responsivitas lintas perangkat, serta dukungan jaringan lapangan.

## 10. Batasan Prototipe

- Angka KPI, identitas petugas, kode booking, riwayat scan, nominal transaksi, dan persentase destinasi merupakan data yang dicantumkan pada contoh desain.
- Interaksi yang berjalan di sisi antarmuka—seperti pengubah jumlah, kalkulasi nominal, pergantian status simulasi, dan notifikasi cetak—tidak sama dengan integrasi backend.
- QR yang digambarkan belum membuktikan adanya tanda tangan digital, enkripsi payload, validasi server, atau mekanisme anti-replay.
- Integrasi perangkat fisik dan layanan pembayaran memerlukan implementasi serta pengujian terpisah.

---

## 11. Ringkasan

Desain SI-PAD Lamsel memadukan empat pengalaman utama: **validasi lapangan/POS**, **portal e-ticketing**, **dashboard eksekutif PAD**, dan **portal wisatawan PWA**. Visualnya menggunakan palet biru sebagai warna utama, warna terakota untuk alur tunai, kartu KPI dan analitik untuk petugas pengelola, serta formulir pemesanan yang sederhana untuk wisatawan. Dokumen ini merangkum elemen yang terlihat dalam prototipe dan menandai aspek yang masih memerlukan keputusan kebutuhan atau validasi teknis.
