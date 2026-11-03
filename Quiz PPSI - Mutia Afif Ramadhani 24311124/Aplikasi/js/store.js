// Global Reactive Data Store & State Logic for SI-PAD Lamsel
// Implements ERD: destinasi, kategori_tarif, transaksi, tiket, detail_tiket_item, users, log_audit, shift_stats

(function(global) {
  const STORAGE_KEY = 'SIPAD_LAMSEL_DATABASE_V1';

  const DEFAULT_DESTINATIONS = [
    {
      id: 1,
      nama: 'Pantai Marina Kalianda',
      tagline: 'Pantai eksotis formasi batu karang alami & sunset memukau',
      lokasi: 'Merak Belantung, Kec. Kalianda, Lampung Selatan',
      tiketDewasa: 15000,
      tiketAnak: 5000,
      parkirMotor: 5000,
      parkirMobil: 20000,
      parkirBus: 50000,
      kuotaHarian: 3500,
      terisiHariIni: 2180,
      jamBuka: '07.00 - 18.00 WIB',
      persenDistribusi: 45.0,
      imageGradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      badge: 'Destinasi Terfavorit'
    },
    {
      id: 2,
      nama: 'Pantai Kedu Warna',
      tagline: 'Sensasi glamping tepi pantai dengan panorama Gunung Rajabasa',
      lokasi: 'Jl. Sinar Laut, Way Urang, Kalianda',
      tiketDewasa: 15000,
      tiketAnak: 5000,
      parkirMotor: 5000,
      parkirMobil: 20000,
      parkirBus: 50000,
      kuotaHarian: 2500,
      terisiHariIni: 1450,
      jamBuka: '08.00 - 21.00 WIB',
      persenDistribusi: 29.5,
      imageGradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      badge: 'Best Sunset View'
    },
    {
      id: 3,
      nama: 'Dermaga Wisata Canti',
      tagline: 'Gerbang penyeberangan pulau & wisata bahari terpadu',
      lokasi: 'Desa Canti, Kec. Rajabasa Kalianda',
      tiketDewasa: 10000,
      tiketAnak: 3000,
      parkirMotor: 5000,
      parkirMobil: 15000,
      parkirBus: 40000,
      kuotaHarian: 1500,
      terisiHariIni: 820,
      jamBuka: '06.00 - 17.30 WIB',
      persenDistribusi: 16.0,
      imageGradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      badge: 'Pusat Wisata Bahari'
    },
    {
      id: 4,
      nama: 'Dermaga Bom Kalianda',
      tagline: 'Sentra kuliner seafood segar & dermaga pancing bersejarah',
      lokasi: 'Jl. Kesuma Bangsa, Dermaga Bom Kalianda',
      tiketDewasa: 5000,
      tiketAnak: 2000,
      parkirMotor: 3000,
      parkirMobil: 10000,
      parkirBus: 25000,
      kuotaHarian: 2000,
      terisiHariIni: 640,
      jamBuka: '14.00 - 23.00 WIB',
      persenDistribusi: 9.5,
      imageGradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
      badge: 'Sentra Kuliner Pesisir'
    }
  ];

  function getInitialData() {
    const today = new Date().toISOString().split('T')[0];

    const initialTickets = [
      {
        id: 101,
        transaksiId: 'TRX-KLD-20261020-0012',
        kodeTiket: 'LMS-20241012-0842',
        qrToken: 'TOKEN_MARINA_0012_VALID_HASH_7781',
        destinasiId: 1,
        destinasiNama: 'Pantai Marina Kalianda',
        wisatawanNama: 'Budi Santoso',
        wisatawanKontak: '0812-7890-4432',
        tglKunjungan: today,
        jumlahDewasa: 3,
        jumlahAnak: 1,
        kendaraan: 'Mobil',
        subtotalTiket: 50000,
        subtotalParkir: 20000,
        asuransiJasaRaharja: 4000,
        totalBayar: 74000,
        metodeBayar: 'QRIS',
        statusTiket: 'BELUM_DIGUNAKAN', // Ready to scan!
        verifiedAt: null,
        verifiedByUser: null,
        verifiedGate: null,
        createdDate: '2026-10-20 08:35:10'
      },
      {
        id: 102,
        transaksiId: 'TRX-KLD-20261020-0008',
        kodeTiket: 'LMS-20241012-0715',
        qrToken: 'TOKEN_KEDU_0008_USED_HASH_3321',
        destinasiId: 2,
        destinasiNama: 'Pantai Kedu Warna',
        wisatawanNama: 'Indah Prameswari',
        wisatawanKontak: '0857-1122-3344',
        tglKunjungan: today,
        jumlahDewasa: 2,
        jumlahAnak: 0,
        kendaraan: 'Motor',
        subtotalTiket: 30000,
        subtotalParkir: 5000,
        asuransiJasaRaharja: 2000,
        totalBayar: 37000,
        metodeBayar: 'QRIS',
        statusTiket: 'TERPAKAI', // Already scanned for duplicate testing!
        verifiedAt: '10:14:22 WIB',
        verifiedByUser: 'Petugas Rian Kurniawan',
        verifiedGate: 'Pintu B - Kedu Barat',
        createdDate: '2026-10-20 07:15:00'
      },
      {
        id: 103,
        transaksiId: 'TRX-KLD-20261020-0033',
        kodeTiket: 'LMS-20241020-0992',
        qrToken: 'TOKEN_MARINA_0033_VALID_HASH_9912',
        destinasiId: 1,
        destinasiNama: 'Pantai Marina Kalianda',
        wisatawanNama: 'Hendrawan Pratama',
        wisatawanKontak: '0813-8899-7711',
        tglKunjungan: today,
        jumlahDewasa: 2,
        jumlahAnak: 0,
        kendaraan: 'Motor',
        subtotalTiket: 30000,
        subtotalParkir: 5000,
        asuransiJasaRaharja: 2000,
        totalBayar: 37000,
        metodeBayar: 'QRIS',
        statusTiket: 'BELUM_DIGUNAKAN',
        verifiedAt: null,
        verifiedByUser: null,
        verifiedGate: null,
        createdDate: '2026-10-20 09:12:00'
      }
    ];

    const initialAuditLogs = [
      {
        id: 1,
        waktu: '11:42:15 WIB',
        kodeBooking: 'LMS-20241012-0715',
        kategori: '2 Dewasa, 1 Motor',
        nominal: 37000,
        metode: 'QRIS Kasda',
        statusGate: 'Tertutup (Duplikasi)',
        detail: 'Peringatan duplikasi: Tiket telah di-scan sebelumnya di Pintu B',
        tipe: 'ANOMALY'
      },
      {
        id: 2,
        waktu: '11:38:04 WIB',
        kodeBooking: 'POS-CASH-8821',
        kategori: '3 Dewasa, 1 Mobil',
        nominal: 50000,
        metode: 'Karcis Tunai',
        statusGate: 'Terbuka',
        detail: 'Penerbitan Karcis Retribusi Porporasi Fisik di Pos 1 Marina',
        tipe: 'CASH'
      },
      {
        id: 3,
        waktu: '11:29:50 WIB',
        kodeBooking: 'TRX-KLD-0044',
        kategori: 'Rombongan Bus (35 Org)',
        nominal: 575000,
        metode: 'QRIS Kasda',
        statusGate: 'Terbuka',
        detail: 'Validasi Tiket Rombongan Bus Wisatawan Palembang',
        tipe: 'VALID'
      },
      {
        id: 4,
        waktu: '11:15:20 WIB',
        kodeBooking: 'LMS-20241012-0810',
        kategori: '2 Dewasa, 1 Mobil',
        nominal: 50000,
        metode: 'PWA E-Tiket',
        statusGate: 'Terbuka',
        detail: 'Scan QR PWA E-Tiket Sah BPPRD di Gate 1',
        tipe: 'VALID'
      },
      {
        id: 5,
        waktu: '10:55:18 WIB',
        kodeBooking: 'POS-CASH-8819',
        kategori: '1 Dewasa, 1 Motor',
        nominal: 15000,
        metode: 'Karcis Tunai',
        statusGate: 'Terbuka',
        detail: 'Penerbitan Karcis Darurat Loket Masuk',
        tipe: 'CASH'
      }
    ];

    return {
      destinasi: DEFAULT_DESTINATIONS,
      tiket: initialTickets,
      auditLogs: initialAuditLogs,
      activeTicketId: 101, // Selected ticket for PWA view and quick test
      offlineMode: false,
      offlineQueue: [],
      shiftStats: {
        kendaraanLolos: 342,
        lajuKendaraan: 18,
        wisatawanMasuk: 1120,
        anakAnak: 148,
        rasioCashless: 88.4,
        kasFisik: 1450000,
        karcisTunaiPersen: 11.6
      },
      executiveStats: {
        totalPADHariIni: 142850000,
        targetPADHariIni: 127000000,
        persenPencapaian: 112.4,
        volumeWisatawan: 8420,
        rasioDigital: 89.2,
        rasioTunai: 10.8,
        gerbangAktif: '4 / 4'
      }
    };
  }

  class Store {
    constructor() {
      this.listeners = [];
      this.load();
    }

    load() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          this.data = JSON.parse(stored);
        } else {
          this.data = getInitialData();
          this.save();
        }
      } catch (e) {
        console.warn("Storage load failed, reverting to default initial data", e);
        this.data = getInitialData();
      }
    }

    save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        this.notify();
      } catch (e) {
        console.error("Storage save failed", e);
      }
    }

    resetAll() {
      this.data = getInitialData();
      this.save();
    }

    subscribe(listener) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    }

    notify() {
      this.listeners.forEach(fn => fn(this.data));
    }

    // ========== GETTERS ==========
    getData() {
      return this.data;
    }

    getDestinations() {
      return this.data.destinasi;
    }

    getDestinationById(id) {
      return this.data.destinasi.find(d => d.id === Number(id));
    }

    getActiveTicket() {
      return this.data.tiket.find(t => t.id === this.data.activeTicketId) || this.data.tiket[0];
    }

    getAllTickets() {
      return this.data.tiket;
    }

    getAuditLogs() {
      return this.data.auditLogs;
    }

    isOffline() {
      return !!this.data.offlineMode;
    }

    getOfflineQueue() {
      return this.data.offlineQueue || [];
    }

    // ========== ACTIONS ==========
    setActiveTicket(ticketId) {
      this.data.activeTicketId = Number(ticketId);
      this.save();
    }

    toggleOfflineMode() {
      this.data.offlineMode = !this.data.offlineMode;
      this.save();
      return this.data.offlineMode;
    }

    // WISATAWAN: Create Order
    createOrder(payload) {
      const dest = this.getDestinationById(payload.destinasiId);
      const id = Date.now();
      const codeSeq = String(Math.floor(1000 + Math.random() * 9000));
      const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const kodeBooking = `LMS-${todayStr}-${codeSeq}`;
      const kodeTrx = `TRX-KLD-${todayStr}-${codeSeq}`;
      const qrToken = `HMAC_SHA256_LMS_${dest.id}_${id}_TOKEN_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      const newTicket = {
        id,
        transaksiId: kodeTrx,
        kodeTiket: kodeBooking,
        qrToken,
        destinasiId: dest.id,
        destinasiNama: dest.nama,
        wisatawanNama: payload.namaWisatawan || 'Wisatawan Kalianda',
        wisatawanKontak: payload.kontak || '0812-xxxx-xxxx',
        tglKunjungan: payload.tglKunjungan,
        jumlahDewasa: Number(payload.dewasa) || 1,
        jumlahAnak: Number(payload.anak) || 0,
        kendaraan: payload.kendaraan || 'Mobil',
        subtotalTiket: payload.subtotalTiket,
        subtotalParkir: payload.subtotalParkir,
        asuransiJasaRaharja: payload.asuransiJasaRaharja,
        totalBayar: payload.totalBayar,
        metodeBayar: payload.metodeBayar || 'QRIS',
        statusTiket: 'BELUM_DIGUNAKAN',
        verifiedAt: null,
        verifiedByUser: null,
        verifiedGate: null,
        createdDate: new Date().toLocaleTimeString('id-ID') + ' WIB'
      };

      // Add to ticket list and set as active ticket
      this.data.tiket.unshift(newTicket);
      this.data.activeTicketId = id;

      // Update executive numbers
      this.data.executiveStats.totalPADHariIni += payload.totalBayar;
      this.data.executiveStats.volumeWisatawan += (newTicket.jumlahDewasa + newTicket.jumlahAnak);

      this.save();
      return newTicket;
    }

    // PETUGAS: Verify Ticket (by code or QR token)
    verifyTicket(query, gateName = 'Pintu A - Gate Utama', officer = 'Ahmad Fauzi') {
      const cleaned = (query || '').trim().toUpperCase();
      const ticket = this.data.tiket.find(t => 
        (t.kodeTiket && t.kodeTiket.toUpperCase() === cleaned) ||
        (t.qrToken && t.qrToken.toUpperCase() === cleaned) ||
        (t.transaksiId && t.transaksiId.toUpperCase() === cleaned)
      );

      const nowTimeStr = new Date().toLocaleTimeString('id-ID') + ' WIB';

      if (!ticket) {
        return {
          status: 'NOT_FOUND',
          message: 'Nomor kode booking atau QR Token tidak terdaftar di sistem Kasda Lamsel.',
          ticket: null
        };
      }

      // Check if in offline mode
      if (this.data.offlineMode) {
        // Record to offline queue
        this.data.offlineQueue.push({
          type: 'VERIFY',
          ticketId: ticket.id,
          timestamp: nowTimeStr,
          gate: gateName,
          officer
        });
      }

      // Check if ALREADY USED (Duplicate rejection)
      if (ticket.statusTiket === 'TERPAKAI') {
        const logItem = {
          id: Date.now(),
          waktu: nowTimeStr,
          kodeBooking: ticket.kodeTiket,
          kategori: `${ticket.jumlahDewasa} Dewasa, ${ticket.kendaraan}`,
          nominal: ticket.totalBayar,
          metode: ticket.metodeBayar,
          statusGate: 'Tertutup (Duplikasi)',
          detail: `PERINGATAN DUPLIKASI! Tiket ini telah diverifikasi pada ${ticket.verifiedAt} di ${ticket.verifiedGate || 'Pintu Gerbang'} oleh ${ticket.verifiedByUser || 'Petugas Lapangan'}`,
          tipe: 'ANOMALY'
        };
        this.data.auditLogs.unshift(logItem);
        this.save();

        return {
          status: 'DUPLICATE',
          message: 'TIKET SUDAH TERPAKAI / DUPLIKAT',
          ticket,
          log: logItem
        };
      }

      // SUCCESS: Mark as TERPAKAI (Single-use locked)
      ticket.statusTiket = 'TERPAKAI';
      ticket.verifiedAt = nowTimeStr;
      ticket.verifiedByUser = officer;
      ticket.verifiedGate = gateName;

      // Update shift stats
      this.data.shiftStats.kendaraanLolos += 1;
      this.data.shiftStats.wisatawanMasuk += (ticket.jumlahDewasa + ticket.jumlahAnak);

      const logItem = {
        id: Date.now(),
        waktu: nowTimeStr,
        kodeBooking: ticket.kodeTiket,
        kategori: `${ticket.jumlahDewasa} Dewasa, ${ticket.kendaraan}`,
        nominal: ticket.totalBayar,
        metode: ticket.metodeBayar === 'QRIS' ? 'QRIS Kasda' : 'PWA E-Tiket',
        statusGate: 'Terbuka',
        detail: `Validasi Berhasil: ${ticket.destinasiNama} (${ticket.wisatawanNama})`,
        tipe: 'VALID'
      };
      this.data.auditLogs.unshift(logItem);
      this.save();

      return {
        status: 'VALID',
        message: 'TIKET VALID - SILAKAN MASUK',
        ticket,
        log: logItem
      };
    }

    // PETUGAS: Loket Tunai Darurat (Cash POS with Thermal Receipt)
    processCashPOS(payload) {
      const { dewasa = 0, motor = 0, mobil = 0, bus = 0, posName = 'Pos 1 Pantai Marina Kalianda' } = payload;
      
      const subDewasa = dewasa * 10000;
      const subMotor = motor * 5000;
      const subMobil = mobil * 20000;
      const subBus = bus * 50000;
      const total = subDewasa + subMotor + subMobil + subBus;

      if (total <= 0) return null;

      const nowTimeStr = new Date().toLocaleTimeString('id-ID') + ' WIB';
      const seq = Math.floor(1000 + Math.random() * 9000);
      const bookingCode = `POS-CASH-${seq}`;

      const receiptData = {
        id: Date.now(),
        kodeStruk: bookingCode,
        nomorPorporasi: `PRP/LAMSEL/2026/${seq}`,
        waktu: nowTimeStr,
        pos: posName,
        petugas: 'Ahmad Fauzi (NIP. 19880412 201201 1 002)',
        items: [
          dewasa > 0 ? { label: 'Karcis Dewasa', qty: dewasa, harga: 10000, subtotal: subDewasa } : null,
          motor > 0 ? { label: 'Parkir Roda 2', qty: motor, harga: 5000, subtotal: subMotor } : null,
          mobil > 0 ? { label: 'Parkir Roda 4', qty: mobil, harga: 20000, subtotal: subMobil } : null,
          bus > 0 ? { label: 'Parkir Bus Pariwisata', qty: bus, harga: 50000, subtotal: subBus } : null
        ].filter(Boolean),
        total,
        modeOffline: this.data.offlineMode
      };

      if (this.data.offlineMode) {
        this.data.offlineQueue.push({
          type: 'CASH_SALE',
          receiptData
        });
      }

      // Update shift stats
      this.data.shiftStats.kasFisik += total;
      this.data.shiftStats.wisatawanMasuk += dewasa;
      this.data.shiftStats.kendaraanLolos += (motor + mobil + bus);

      // Update executive numbers
      this.data.executiveStats.totalPADHariIni += total;
      this.data.executiveStats.volumeWisatawan += dewasa;

      // Add audit log
      this.data.auditLogs.unshift({
        id: Date.now(),
        waktu: nowTimeStr,
        kodeBooking: bookingCode,
        kategori: `${dewasa} Dewasa, ${motor + mobil + bus} Kndrn`,
        nominal: total,
        metode: 'Karcis Tunai',
        statusGate: 'Terbuka',
        detail: `Penerbitan Karcis Porporasi Darurat (${receiptData.nomorPorporasi})`,
        tipe: 'CASH'
      });

      this.save();
      return receiptData;
    }

    // Sync Offline Queue
    syncOfflineQueue() {
      const count = this.data.offlineQueue.length;
      if (count === 0) return 0;

      const nowTimeStr = new Date().toLocaleTimeString('id-ID') + ' WIB';
      this.data.auditLogs.unshift({
        id: Date.now(),
        waktu: nowTimeStr,
        kodeBooking: 'SYNC-AUTO-KASDA',
        kategori: `${count} Antrean`,
        nominal: 0,
        metode: 'Sinkronisasi Otomatis',
        statusGate: 'Terhubung',
        detail: `Berhasil menyinkronkan ${count} transaksi lokal ke server pusat BPPRD Kasda`,
        tipe: 'VALID'
      });

      this.data.offlineQueue = [];
      this.data.offlineMode = false;
      this.save();
      return count;
    }
  }

  global.SIPADStore = new Store();
})(window);
