# **Product Requirement Document (PRD)**

| Atribut | Keterangan |
| :---- | :---- |
| **Nama Produk** | **SI-PAD Lamsel (Modul E-Retribusi Wisata Kalianda)** |
| **Versi** | 1.0 (Dokumen Final PRD MVP) |
| **Status** | Siap untuk Tahap Desain UI/UX & Pengembangan |
| **Target Launch** | Q3 2026 |
| **Stakeholders** | BPPRD Kab. Lampung Selatan, Dinas Pariwisata Lamsel, Pengelola Wisata Kalianda, Wisatawan |

## **1\. Problem Statement**

### **Masalah Utama**

Sistem pemungutan retribusi pariwisata di kawasan wisata Kalianda, Kabupaten Lampung Selatan (seperti Pantai Marina, Kedu Warna, Canti, dan Dermaga Bom) masih didominasi oleh pencatatan karcis manual berbasis kertas dan pembayaran tunai. Hal ini menimbulkan beberapa masalah kritis:

> 1. **Kebocoran Pendapatan Asli Daerah (PAD):** Praktik pencatatan manual dan transaksi tunai rawan penyalahgunaan, seperti pendaurulangan karcis fisik bekas dan transaksi di pintu masuk tanpa pemberian karcis resmi.  
> 2. **Keterlambatan & Ketidakakuratan Data:** BPPRD dan Dinas Pariwisata tidak memiliki akses data jumlah wisatawan dan penerimaan retribusi secara *real-time*. Rekapitulasi manual bulanan rentan kesalahan dan manipulasi.  
> 3. **Pengalaman Wisatawan yang Buruk:** Penumpukan kendaraan dan antrean panjang di gerbang masuk wisata pada akhir pekan/libur nasional karena proses pembayaran tunai serta pencarian uang kembalian yang memakan waktu.

### **Tujuan Produk**

Mengubah sistem retribusi konvensional menjadi **platform digital terintegrasi berbasis *cashless*** yang dapat menutup 100% celah kebocoran tunai, mempercepat proses masuk di pintu gerbang (\< 2 detik per verifikasi), dan menyajikan *dashboard real-time* penerimaan PAD bagi Pemkab Lampung Selatan.

## **2\. Target User & User Stories**

### **Target User**

> 1. **Wisatawan:** Masyarakat lokal/luar daerah yang berkunjung ke objek wisata Kalianda.  
> 2. **Petugas Pos Lapangan (Validator):** Staf lapangan yang bertugas memverifikasi tiket di pintu masuk objek wisata.  
> 3. **Admin BPPRD / Dinas Pariwisata:** Analis dan pengambil keputusan yang mengelola data master, tarif, serta laporan keuangan daerah.

### **User Stories**

#### **A. Wisatawan**

* Sebagai **Wisatawan**, saya ingin membeli tiket masuk dan parkir objek wisata Kalianda secara *online* via QRIS/E-Wallet, agar saya tidak perlu antre panjang dan membawa uang tunai di lokasi.  
* Sebagai **Wisatawan**, saya ingin menerima bukti *E-Ticket* ber-QR Code yang mudah disimpan di smartphone, agar proses masuk di gerbang lokasi wisata cepat dan praktis.

#### **B. Petugas Lapangan**

* Sebagai **Petugas Lapangan**, saya ingin memindai QR Code *E-Ticket* wisatawan menggunakan smartphone dengan respon cepat, agar tidak terjadi penumpukan antrean di pintu masuk.  
* Sebagai **Petugas Lapangan**, saya ingin mencatat transaksi tunai darurat dan mencetak struk secara otomatis via printer thermal, agar seluruh penerimaan tunai tetap tercatat resmi di sistem.

#### **C. Admin BPPRD / Dinas Pariwisata**

* Sebagai **Admin BPPRD**, saya ingin melihat *dashboard real-time* grafik penerimaan PAD per lokasi wisata, agar saya dapat memantau pencapaian target penerimaan daerah secara akurat.  
* Sebagai **Admin BPPRD**, saya ingin mengunduh laporan rekapitulasi keuangan dalam format Excel/PDF dan melihat *audit log*, agar proses audit keuangan dapat dipertanggungjawabkan tanpa manipulasi.

## **3\. Functional Requirements (Fitur Aplikasi)**

### **Skala Prioritas:**

* **P0 (Critical / MVP):** Wajib ada untuk meluncurkan sistem pada tahap awal.  
* **P1 (High / Important):** Fitur pendukung penting yang dikembangkan bersamaan atau langsung setelah MVP.

| ID Fitur | Modul | Deskripsi Fungsi | Prioritas |
| :---- | :---- | :---- | :---- |
| **FR-01** | **Autentikasi & Akses** | Akses publik untuk wisatawan (tanpa wajib login). Autentikasi berbasis peran (*Role-Based Access Control*) untuk Petugas Lapangan dan Admin BPPRD. | **P0** |
| **FR-02** | **Katalog & Form Order** | Wisatawan dapat memilih destinasi Kalianda, tanggal kunjungan, jumlah orang, dan jenis kendaraan (Motor/Mobil/Bus) dengan kalkulasi harga otomatis. | **P0** |
| **FR-03** | **Payment Gateway** | Integrasi pembayaran non-tunai multi-kanal (QRIS, E-Wallet, Virtual Account Bank Lampung). | **P0** |
| **FR-04** | **Penerbitan E-Ticket** | Sistem menerbitkan *E-Ticket* ber-QR Code unik (*single-use token*) yang terenkripsi setelah pembayaran terverifikasi lunas. | **P0** |
| **FR-05** | **Mobile QR Validator** | Aplikasi Android/PWA petugas lapangan untuk memindai QR Code, memverifikasi status (*Valid/Terpakai/Kadaluarsa*), dan mengubah status tiket menjadi *Terpakai*. | **P0** |
| **FR-06** | **Transaksi Tunai Pos** | Fitur khusus petugas pos untuk menginput pembayaran tunai darurat dan mencetak struk karcis fisik via printer Bluetooth thermal. | **P0** |
| **FR-07** | **Executive Dashboard** | *Dashboard* web untuk Admin BPPRD menampilkan KPI Total PAD, jumlah pengunjung per lokasi, dan perbandingan transaksi *Cashless vs Cash*. | **P0** |
| **FR-08** | **Offline Sync Engine** | Aplikasi validator petugas dapat menyimpan data hasil scan lokal saat sinyal internet terputus di pantai dan melakukan *auto-sync* begitu terhubung internet. | **P1** |
| **FR-09** | **Manajemen Master Data** | Admin dapat menambah/mengubah data destinasi wisata, memutakhirkan tarif retribusi resmi, dan mengatur kuota harian. | **P1** |
| **FR-10** | **Audit Log & Anomali** | Pencatatan otomatis setiap aksi pengguna internal dan deteksi dini pola pemindaian yang mencurigakan (*red flag alert*). | **P1** |
| **FR-11** | **Ekspor Laporan PAD** | Fitur ekspor laporan penerimaan keuangan dan rekapitulasi pengunjung dalam format PDF, Excel, dan CSV sesuai standar pelaporan Pemda. | **P1** |

## **4\. Non-Functional Requirements (NFR)**

### **1\. Performa & Kecepatan**

* **Waktu Verifikasi QR:** Pemindaian dan respons validasi pada aplikasi validator lapangan harus selesai dalam waktu **\< 2 detik**.  
* **Kapasitas Pemesanan:** Sistem mampu menangani setidaknya **500 transaksi bersamaan (*concurrent transactions*)** pada jam sibuk tanpa penurunan performa.  
* **Kecepatan Memuat Halaman:** *Dashboard* Admin dan *Portal Wisatawan* harus termuat penuh dalam waktu **\< 3 detik** pada jaringan 4G.

### **2\. Keamanan (Security)**

* **Enkripsi QR Code:** QR Code *E-Ticket* menggunakan token terenkripsi HMAC/SHA-256 untuk mencegah pemalsuan kode oleh pihak luar.  
* **Proteksi Transaksi:** Semua lalu lintas data menggunakan enkripsi HTTPS/TLS 1.3.  
* **Mekanisme Anti-Reuse:** Setiap QR Code hanya dapat dipindai dan digunakan **1 kali**. Begitu ter-scan, status di basis data langsung terkunci.

### **3\. Keandalan & Ketersediaan (Reliability & Availability)**

* **SLA Uptime:** Sistem backend dan basis data memiliki *uptime target* **99.5%**.  
* **Modul Luring (Offline Mode):** Validator lapangan wajib tetap dapat memverifikasi tiket terunduh meskipun koneksi internet di area pesisir pantai tidak stabil.

### **4\. Usabilitas & Aksesibilitas**

* **Responsif:** Antarmuka wisatawan dirancang *Mobile-First* (PWA/Browser) tanpa mewajibkan unduh aplikasi di Play Store/App Store.  
* **Antarmuka Petugas Ringkas:** UI aplikasi validator lapangan menggunakan tombol berukuran besar, kontras tinggi, serta indikator suara/vibrasi (Hijau \= Valid, Merah \= Ditolak).

## **5\. Skema Basis Data (Entity Relationship Diagram \- ERD)**

Berikut adalah struktur skema basis data relasional (*Relational Database Schema*) untuk mendukung sistem SI-PAD Lamsel.

Plaintext  
  \+-------------------+        \+---------------------+        \+-----------------------+  
  |       users       |        |   pos\_retribusi     |        |       destinasi       |  
  \+-------------------+        \+---------------------+        \+-----------------------+  
  | PK  id            |\<-------| PK  id              |   \+---\>| PK  id                |  
  |     nama          |        | FK  destinasi\_id    |---+    |     nama\_destinasi    |  
  |     email         |        |     nama\_pos        |        |     lokasi            |  
  |     password\_hash |        |     kode\_pos        |        |     status\_aktif      |  
  |     role          |        \+---------------------+        \+-----------------------+  
  | FK  pos\_id        |                                                   |  
  \+-------------------+                                                   |  
            |                                                             v  
            |                  \+---------------------+        \+-----------------------+  
            |                  |   kategori\_tarif    |        |        tiket          |  
            |                  \+---------------------+        \+-----------------------+  
            |                  | PK  id              |        | PK  id                |  
            |                  | FK  destinasi\_id    |--------| FK  transaksi\_id      |  
            |                  |     nama\_kategori   |        | FK  destinasi\_id      |  
            |                  |     tarif           |        |     qr\_code\_hash      |  
            |                  \+---------------------+        |     tgl\_kunjungan     |  
            |                                                 |     status\_tiket      |  
            |                                                 |     verified\_at       |  
            |                                                 | FK  verified\_by\_user  |  
            |                                                 \+-----------------------+  
            v                                                             ^  
  \+-------------------+        \+---------------------+                    |  
  |     log\_audit     |        |      transaksi      |                    |  
  \+-------------------+        \+---------------------+                    |  
  | PK  id            |        | PK  id              |--------------------+  
  | FK  user\_id       |        |     kode\_transaksi  |  
  |     aksi          |        |     wisatawan\_nama  |        \+-----------------------+  
  |     entitas       |        |     wisatawan\_kontak|        |  detail\_tiket\_item    |  
  |     nilai\_lama    |        |     total\_bayar     |        \+-----------------------+  
  |     nilai\_baru    |        |     metode\_bayar    |        | PK  id                |  
  |     ip\_address    |        |     status\_bayar    |        | FK  tiket\_id          |  
  |     created\_at    |        |     snap\_token      |        | FK  kategori\_tarif\_id |  
  \+-------------------+        |     paid\_at         |        |     jumlah            |  
                               \+---------------------+        |     subtotal          |  
                                                              \+-----------------------+

### **Rincian Tabel Basis Data**

#### **1\. Tabel destinasi**

Menyimpan daftar objek wisata resmi di wilayah Kalianda.

* id (INT, PK, Auto Increment)  
* nama\_destinasi (VARCHAR 100\) — *contoh: Pantai Marina, Dermaga Bom*  
* lokasi (TEXT)  
* status\_aktif (BOOLEAN) — *default: true*

#### **2\. Tabel kategori\_tarif**

Menyimpan rincian tarif retribusi per objek wisata.

* id (INT, PK, Auto Increment)  
* destinasi\_id (INT, FK \-\> destinasi.id)  
* nama\_kategori (VARCHAR 50\) — *contoh: Tiket Masuk Orang, Parkir Motor, Parkir Mobil*  
* tarif (DECIMAL 12,2) — *contoh: 15000.00*

#### **3\. Tabel transaksi**

Menyimpan data induk transaksi pembayaran.

* id (BIGINT, PK, Auto Increment)  
* kode\_transaksi (VARCHAR 50, UNIQUE) — *contoh: TRX-KLD-20261020-001*  
* wisatawan\_nama (VARCHAR 100\)  
* wisatawan\_kontak (VARCHAR 50\)  
* total\_bayar (DECIMAL 12,2)  
* metode\_bayar (ENUM: 'QRIS', 'VA\_BANK', 'EWALLET', 'CASH')  
* status\_bayar (ENUM: 'PENDING', 'PAID', 'EXPIRED', 'FAILED')  
* snap\_token (VARCHAR 255, NULLABLE) — *Token dari Payment Gateway*  
* paid\_at (TIMESTAMP, NULLABLE)

#### **4\. Tabel tiket**

Menyimpan token QR Code dan status validasi tiket.

* id (BIGINT, PK, Auto Increment)  
* transaksi\_id (BIGINT, FK \-\> transaksi.id)  
* destinasi\_id (INT, FK \-\> destinasi.id)  
* qr\_code\_hash (VARCHAR 255, UNIQUE) — *Token unik terenkripsi*  
* tgl\_kunjungan (DATE)  
* status\_tiket (ENUM: 'BELUM\_DIGUNAKAN', 'TERPAKAI', 'EXPIRED') — *default: BELUM\_DIGUNAKAN*  
* verified\_at (TIMESTAMP, NULLABLE)  
* verified\_by\_user (INT, FK \-\> users.id, NULLABLE)

#### **5\. Tabel detail\_tiket\_item**

Menyimpan rincian kuantitas item dalam satu tiket.

* id (BIGINT, PK, Auto Increment)  
* tiket\_id (BIGINT, FK \-\> tiket.id)  
* kategori\_tarif\_id (INT, FK \-\> kategori\_tarif.id)  
* jumlah (INT) — *contoh: 3 (orang)*  
* subtotal (DECIMAL 12,2)

#### **6\. Tabel users**

Menyimpan data pengguna sistem internal (Admin & Petugas).

* id (INT, PK, Auto Increment)  
* nama (VARCHAR 100\)  
* email (VARCHAR 100, UNIQUE)  
* password\_hash (VARCHAR 255\)  
* role (ENUM: 'ADMIN\_BPPRD', 'SUPERVISOR', 'PETUGAS\_POS')  
* pos\_id (INT, FK \-\> pos\_retribusi.id, NULLABLE)

#### **7\. Tabel log\_audit**

Menyimpan riwayat seluruh aktivitas penting sistem untuk kebutuhan audit keuangan.

* id (BIGINT, PK, Auto Increment)  
* user\_id (INT, FK \-\> users.id)  
* aksi (VARCHAR 100\) — *contoh: UPDATE\_TARIF, VERIFIKASI\_TIKET, CETAK\_TUNAI*  
* entitas (VARCHAR 50\) — *contoh: tiket, kategori\_tarif*  
* nilai\_lama (JSON, NULLABLE)  
* nilai\_baru (JSON, NULLABLE)  
* ip\_address (VARCHAR 45\)  
* created\_at (TIMESTAMP)