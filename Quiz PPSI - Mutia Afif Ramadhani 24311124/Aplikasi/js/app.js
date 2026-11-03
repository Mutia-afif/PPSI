// ==========================================================================
// SI-PAD LAMSEL — MAIN APPLICATION CONTROLLER
// Handles UI Events, Modals, Camera Simulator, Sound Cues, and Reactive State
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const store = window.SIPADStore;
  const sound = window.soundEngine;
  const qr = window.QRRenderer;

  // Active Screen State
  let currentScreen = 'screen-a'; // 'screen-a' | 'screen-b' | 'screen-c' | 'screen-d'

  // POS Calculator State
  let posState = {
    dewasa: 1,
    motor: 0,
    mobil: 1,
    bus: 0
  };

  // Wisatawan Booking State
  let bookingState = {
    destinasiId: 1,
    tglKunjungan: new Date().toISOString().split('T')[0],
    dewasa: 2,
    anak: 0,
    kendaraan: 'Mobil', // 'Motor', 'Mobil', 'Bus', 'None'
    namaWisatawan: 'Wisatawan Kalianda',
    kontak: '0812-7890-4432'
  };

  // ==========================================================================
  // NAVIGATION & SCREEN SWITCHING
  // ==========================================================================
  function switchScreen(screenId) {
    currentScreen = screenId;

    // Update screen visibility
    document.querySelectorAll('.screen-view').forEach(screen => {
      screen.classList.toggle('active', screen.id === screenId);
    });

    // Update sidebar navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.target === screenId);
    });

    // Update role switcher in topbar
    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.target === screenId);
    });

    // Update Topbar Title
    const titleMap = {
      'screen-a': { title: 'Validator Lapangan & POS Gate', sub: 'Pos 1 Pantai Marina Kalianda — Gate Scanner' },
      'screen-b': { title: 'Portal E-Ticketing Wisatawan', sub: 'Pemesanan Resmi E-Retribusi Kawasan Wisata Kalianda' },
      'screen-c': { title: 'Dashboard Eksekutif PAD BPPRD', sub: 'Monitoring Penerimaan & Rekonsiliasi Kas Daerah Real-Time' },
      'screen-d': { title: 'Portal Wisatawan PWA & E-Tiket', sub: 'Pratinjau Karcis Digital Sah Ber-QR Single-Use Token' }
    };

    const headerInfo = titleMap[screenId] || titleMap['screen-a'];
    document.getElementById('topbar-main-title').textContent = headerInfo.title;
    document.getElementById('topbar-sub-title').textContent = headerInfo.sub;

    // Trigger screen specific refresh
    if (screenId === 'screen-d') {
      renderActivePWATicket();
    } else if (screenId === 'screen-c') {
      renderCharts();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Sidebar link clicks
  document.querySelectorAll('.nav-item[data-target]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchScreen(link.dataset.target);
      // Close mobile sidebar if open
      document.querySelector('.sidebar').classList.remove('mobile-open');
    });
  });

  // Topbar role switcher buttons
  document.querySelectorAll('.role-btn[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      switchScreen(btn.dataset.target);
    });
  });

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      document.querySelector('.sidebar').classList.toggle('mobile-open');
    });
  }

  // Real-time Clock in Terminal Header
  function updateClock() {
    const clockEl = document.getElementById('terminal-clock-time');
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString('id-ID', { hour12: false }) + ' WIB';
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  // ==========================================================================
  // OFFLINE MODE & QUEUE SYNC
  // ==========================================================================
  const offlineBtn = document.getElementById('offline-toggle-btn');
  function updateOfflineUI(isOffline) {
    if (!offlineBtn) return;
    offlineBtn.classList.toggle('is-offline', isOffline);
    const textEl = offlineBtn.querySelector('.offline-status-text');
    const dotEl = document.getElementById('sidebar-kasda-dot');
    const labelEl = document.getElementById('sidebar-kasda-text');

    if (isOffline) {
      textEl.textContent = 'Mode Offline (Antrean Lokal)';
      if (dotEl) dotEl.className = 'status-dot offline';
      if (labelEl) labelEl.textContent = 'Lokal Terisolasi';
      showToast('Mode Offline Diaktifkan: Hasil scan & kasir disimpan di antrean perangkat.', 'warning');
    } else {
      textEl.textContent = 'Online / 4G Kasda';
      if (dotEl) dotEl.className = 'status-dot';
      if (labelEl) labelEl.textContent = 'Terhubung Normal';
    }

    // Check offline queue count
    const queue = store.getOfflineQueue();
    const syncBadge = document.getElementById('offline-sync-badge');
    if (syncBadge) {
      syncBadge.textContent = queue.length;
      syncBadge.style.display = queue.length > 0 ? 'inline-block' : 'none';
    }
  }

  if (offlineBtn) {
    offlineBtn.addEventListener('click', () => {
      const state = store.toggleOfflineMode();
      updateOfflineUI(state);
    });
  }

  const syncQueueBtn = document.getElementById('btn-sync-offline-queue');
  if (syncQueueBtn) {
    syncQueueBtn.addEventListener('click', () => {
      const count = store.syncOfflineQueue();
      if (count > 0) {
        sound.playCashRegister();
        showToast(`Berhasil menyinkronkan ${count} transaksi offline ke Server Kasda BPPRD!`, 'success');
        updateOfflineUI(false);
      } else {
        showToast('Tidak ada transaksi di antrean lokal untuk disinkronkan.', 'warning');
      }
    });
  }

  // Audio Mute Toggle Button
  const muteBtn = document.getElementById('toggle-sound-btn');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      muteBtn.classList.toggle('active', isMuted);
      muteBtn.querySelector('.material-symbols-outlined').textContent = isMuted ? 'volume_off' : 'volume_up';
      showToast(isMuted ? 'Suara Beep Dinonaktifkan' : 'Suara Beep Diaktifkan', 'info');
    });
  }

  // ==========================================================================
  // SCREEN A: SCANNER & VALIDASI TIKET
  // ==========================================================================
  const bypassInput = document.getElementById('bypass-ticket-input');
  const bypassForm = document.getElementById('bypass-ticket-form');
  const validationCard = document.getElementById('validation-result-card');

  function renderValidationResult(result) {
    if (!validationCard) return;

    if (result.status === 'VALID') {
      sound.playSuccessBeep();
      validationCard.className = 'validation-card state-valid';
      validationCard.innerHTML = `
        <div class="validation-badge-banner">
          <div class="icon-box">
            <span class="material-symbols-outlined" style="font-size: 28px;">check_circle</span>
          </div>
          <div class="validation-banner-text">
            <h3>TIKET VALID — SILAKAN MASUK</h3>
            <p>Gerbang: Lolos Pintu A • Dipindai: ${result.ticket.verifiedAt}</p>
          </div>
        </div>
        <div class="ticket-manifest-box">
          <div class="manifest-row">
            <span class="manifest-label">Destinasi</span>
            <span class="manifest-value highlight">${result.ticket.destinasiNama}</span>
          </div>
          <div class="manifest-row">
            <span class="manifest-label">Kode Booking</span>
            <span class="manifest-value">${result.ticket.kodeTiket}</span>
          </div>
          <div class="manifest-row">
            <span class="manifest-label">Wisatawan</span>
            <span class="manifest-value">${result.ticket.wisatawanNama}</span>
          </div>
          <div class="manifest-row">
            <span class="manifest-label">Manifest Rombongan</span>
            <span class="manifest-value">${result.ticket.jumlahDewasa} Dewasa ${result.ticket.jumlahAnak > 0 ? ', ' + result.ticket.jumlahAnak + ' Anak' : ''} • ${result.ticket.kendaraan}</span>
          </div>
          <div class="manifest-row">
            <span class="manifest-label">Total Retribusi Resmi</span>
            <span class="manifest-value" style="color: #16A34A; font-weight: 800;">Rp${result.ticket.totalBayar.toLocaleString('id-ID')} (LUNAS via ${result.ticket.metodeBayar})</span>
          </div>
        </div>
        <div class="validation-actions-bar">
          <button class="btn-gate-open" id="btn-trigger-gate">
            <span class="material-symbols-outlined">sensor_door</span>
            Buka Palang Otomatis
          </button>
          <button class="btn-print-thermal" id="btn-trigger-print-thermal">
            <span class="material-symbols-outlined">print</span>
            Cetak Struk Thermal
          </button>
        </div>
      `;

      // Attach button events
      document.getElementById('btn-trigger-gate').addEventListener('click', triggerBarrierGateModal);
      document.getElementById('btn-trigger-print-thermal').addEventListener('click', () => {
        openThermalReceiptModalForTicket(result.ticket);
      });

    } else if (result.status === 'DUPLICATE') {
      sound.playDuplicateBuzzer();
      validationCard.className = 'validation-card state-duplicate';
      validationCard.innerHTML = `
        <div class="validation-badge-banner">
          <div class="icon-box">
            <span class="material-symbols-outlined" style="font-size: 28px;">dangerous</span>
          </div>
          <div class="validation-banner-text">
            <h3>PERINGATAN: TIKET SUDAH TERPAKAI</h3>
            <p>Status: Ditolak Gate • Dugaan Duplikasi / Pemakaian Berulang</p>
          </div>
        </div>
        <div class="ticket-manifest-box" style="border-color: #FCA5A5; background-color: #FFF5F5;">
          <div class="manifest-row">
            <span class="manifest-label">Kode Booking</span>
            <span class="manifest-value" style="color: #BA1A1A;">${result.ticket.kodeTiket}</span>
          </div>
          <div class="manifest-row">
            <span class="manifest-label">Destinasi</span>
            <span class="manifest-value">${result.ticket.destinasiNama}</span>
          </div>
          <div class="manifest-row">
            <span class="manifest-label">Riwayat Scan Pertama</span>
            <span class="manifest-value" style="color: #BA1A1A;">${result.ticket.verifiedAt} (${result.ticket.verifiedGate || 'Pintu Gerbang'})</span>
          </div>
          <div class="manifest-row">
            <span class="manifest-label">Petugas Pemeriksa</span>
            <span class="manifest-value">${result.ticket.verifiedByUser || 'Petugas Lapangan'}</span>
          </div>
          <div class="manifest-row">
            <span class="manifest-label">Tindakan SOP</span>
            <span class="manifest-value" style="color: #7F1D1D;">Kunci Palang & Tahan Kendaraan untuk Pemeriksaan Kasir</span>
          </div>
        </div>
        <div class="validation-actions-bar">
          <button class="btn-secondary" style="color: #BA1A1A; border-color: #F87171;" id="btn-report-duplicate">
            <span class="material-symbols-outlined">flag</span>
            Laporkan Duplikasi ke Audit
          </button>
          <button class="btn-primary" style="background-color: var(--tertiary);" id="btn-bypass-to-cash">
            <span class="material-symbols-outlined">payments</span>
            Arahkan ke Loket Tunai
          </button>
        </div>
      `;

      document.getElementById('btn-report-duplicate').addEventListener('click', () => {
        showToast('Laporan anomali duplikasi tiket telah dikirim ke Tim Audit BPPRD!', 'warning');
      });

      document.getElementById('btn-bypass-to-cash').addEventListener('click', () => {
        document.getElementById('pos-calculator-section').scrollIntoView({ behavior: 'smooth' });
      });

    } else {
      sound.playDuplicateBuzzer();
      validationCard.className = 'validation-card state-duplicate';
      validationCard.innerHTML = `
        <div class="validation-badge-banner">
          <div class="icon-box">
            <span class="material-symbols-outlined">error</span>
          </div>
          <div class="validation-banner-text">
            <h3>TIKET TIDAK DITEMUKAN</h3>
            <p>${result.message}</p>
          </div>
        </div>
      `;
    }

    renderShiftStats();
    renderAuditLogsTable();
  }

  // Handle Manual Bypass Submission
  if (bypassForm) {
    bypassForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = bypassInput.value;
      if (!code) {
        showToast('Masukkan kode tiket atau token QR', 'warning');
        return;
      }
      const res = store.verifyTicket(code);
      renderValidationResult(res);
      bypassInput.value = '';
    });
  }

  // Preset Test Triggers
  document.getElementById('test-btn-valid')?.addEventListener('click', () => {
    // Find first unverified ticket or reset if needed
    const tickets = store.getAllTickets();
    let unverified = tickets.find(t => t.statusTiket === 'BELUM_DIGUNAKAN');
    if (!unverified) {
      unverified = store.createOrder({
        destinasiId: 1,
        dewasa: 3,
        anak: 0,
        kendaraan: 'Mobil',
        subtotalTiket: 45000,
        subtotalParkir: 20000,
        asuransiJasaRaharja: 3000,
        totalBayar: 68000,
        namaWisatawan: 'Keluarga Rahmad (Test)',
        metodeBayar: 'QRIS'
      });
    }
    const res = store.verifyTicket(unverified.kodeTiket);
    renderValidationResult(res);
  });

  document.getElementById('test-btn-duplicate')?.addEventListener('click', () => {
    // Check ticket 102 which is already marked TERPAKAI
    const res = store.verifyTicket('LMS-20241012-0715');
    renderValidationResult(res);
  });

  document.getElementById('test-btn-active-pwa')?.addEventListener('click', () => {
    const active = store.getActiveTicket();
    if (active) {
      const res = store.verifyTicket(active.kodeTiket);
      renderValidationResult(res);
    }
  });

  // Torch ON/OFF toggle simulator
  const torchBtn = document.getElementById('toggle-torch-btn');
  if (torchBtn) {
    torchBtn.addEventListener('click', () => {
      torchBtn.classList.toggle('active');
      const isOn = torchBtn.classList.contains('active');
      const viewfinder = document.querySelector('.viewfinder-wrapper');
      if (viewfinder) {
        viewfinder.style.boxShadow = isOn ? '0 0 35px rgba(255, 255, 255, 0.45)' : 'none';
      }
      showToast(isOn ? 'Senter Flash Gerbang AKTIF' : 'Senter Flash MATI', 'info');
    });
  }

  // ==========================================================================
  // POS LOKET TUNAI DARURAT (CASH DESK CALCULATOR)
  // ==========================================================================
  function updatePOSCalculation() {
    const subDewasa = posState.dewasa * 10000;
    const subMotor = posState.motor * 5000;
    const subMobil = posState.mobil * 20000;
    const subBus = posState.bus * 50000;
    const grandTotal = subDewasa + subMotor + subMobil + subBus;

    document.getElementById('qty-dewasa').textContent = posState.dewasa;
    document.getElementById('qty-motor').textContent = posState.motor;
    document.getElementById('qty-mobil').textContent = posState.mobil;
    document.getElementById('qty-bus').textContent = posState.bus;

    document.getElementById('pos-grand-total').textContent = 'Rp' + grandTotal.toLocaleString('id-ID');
  }

  document.querySelectorAll('.stepper-btn[data-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      const delta = parseInt(btn.dataset.delta, 10);
      posState[type] = Math.max(0, posState[type] + delta);
      updatePOSCalculation();
    });
  });

  document.getElementById('btn-pos-reset')?.addEventListener('click', () => {
    posState = { dewasa: 0, motor: 0, mobil: 0, bus: 0 };
    updatePOSCalculation();
    showToast('Kalkulator tunai telah di-reset', 'info');
  });

  document.getElementById('btn-pos-print-cash')?.addEventListener('click', () => {
    const receipt = store.processCashPOS({
      dewasa: posState.dewasa,
      motor: posState.motor,
      mobil: posState.mobil,
      bus: posState.bus
    });

    if (!receipt) {
      showToast('Pilih minimal 1 item retribusi untuk dicetak', 'warning');
      return;
    }

    sound.playCashRegister();
    openThermalReceiptModalForCash(receipt);
    renderShiftStats();
    renderAuditLogsTable();
  });

  // ==========================================================================
  // SCREEN B: PORTAL WISATAWAN & INSTANT RESERVATION
  // ==========================================================================
  function calculateWisatawanReservation() {
    const dest = store.getDestinationById(bookingState.destinasiId);
    if (!dest) return;

    let subtotalTiket = (bookingState.dewasa * dest.tiketDewasa) + (bookingState.anak * dest.tiketAnak);
    let subtotalParkir = 0;
    if (bookingState.kendaraan === 'Motor') subtotalParkir = dest.parkirMotor;
    else if (bookingState.kendaraan === 'Mobil') subtotalParkir = dest.parkirMobil;
    else if (bookingState.kendaraan === 'Bus') subtotalParkir = dest.parkirBus;

    const asuransi = (bookingState.dewasa + bookingState.anak) * 1000;
    const totalBayar = subtotalTiket + subtotalParkir + asuransi;

    // Update DOM
    document.getElementById('bd-tiket-val').textContent = 'Rp' + subtotalTiket.toLocaleString('id-ID');
    document.getElementById('bd-parkir-val').textContent = 'Rp' + subtotalParkir.toLocaleString('id-ID');
    document.getElementById('bd-asuransi-val').textContent = 'Rp' + asuransi.toLocaleString('id-ID');
    document.getElementById('bd-total-val').textContent = 'Rp' + totalBayar.toLocaleString('id-ID');

    bookingState.subtotalTiket = subtotalTiket;
    bookingState.subtotalParkir = subtotalParkir;
    bookingState.asuransiJasaRaharja = asuransi;
    bookingState.totalBayar = totalBayar;
  }

  // Destination Pills Click
  document.querySelectorAll('.dest-pill-item[data-id]').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.dest-pill-item').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      bookingState.destinasiId = Number(pill.dataset.id);
      calculateWisatawanReservation();
    });
  });

  // Vehicle Pills Click
  document.querySelectorAll('.vehicle-pill-opt[data-vehicle]').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.vehicle-pill-opt').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      bookingState.kendaraan = pill.dataset.vehicle;
      calculateWisatawanReservation();
    });
  });

  // Steppers for Visitors
  document.getElementById('btn-dewasa-minus')?.addEventListener('click', () => {
    bookingState.dewasa = Math.max(1, bookingState.dewasa - 1);
    document.getElementById('val-dewasa').textContent = bookingState.dewasa;
    calculateWisatawanReservation();
  });
  document.getElementById('btn-dewasa-plus')?.addEventListener('click', () => {
    bookingState.dewasa += 1;
    document.getElementById('val-dewasa').textContent = bookingState.dewasa;
    calculateWisatawanReservation();
  });

  document.getElementById('btn-anak-minus')?.addEventListener('click', () => {
    bookingState.anak = Math.max(0, bookingState.anak - 1);
    document.getElementById('val-anak').textContent = bookingState.anak;
    calculateWisatawanReservation();
  });
  document.getElementById('btn-anak-plus')?.addEventListener('click', () => {
    bookingState.anak += 1;
    document.getElementById('val-anak').textContent = bookingState.anak;
    calculateWisatawanReservation();
  });

  // Date input change
  document.getElementById('booking-date-input')?.addEventListener('change', (e) => {
    bookingState.tglKunjungan = e.target.value;
  });

  // Checkout Button -> Opens QRIS Modal
  document.getElementById('btn-checkout-qris')?.addEventListener('click', () => {
    calculateWisatawanReservation();
    const dest = store.getDestinationById(bookingState.destinasiId);
    
    // Set details in modal
    document.getElementById('qris-modal-dest').textContent = dest.nama;
    document.getElementById('qris-modal-nominal').textContent = 'Rp' + bookingState.totalBayar.toLocaleString('id-ID');
    document.getElementById('qris-modal-booking').textContent = `LMS-${Date.now().toString().slice(-6)}`;

    // Draw dynamic QRIS on canvas
    const qrisCanvas = document.getElementById('qris-pay-canvas');
    if (qrisCanvas) {
      qr.draw(qrisCanvas, `00020101021226600016ID.GOV.BPPRD.LMS0115${bookingState.totalBayar}5802ID53033606304ABCD`, {
        size: 210,
        darkColor: '#0F172A',
        logoText: 'QRIS'
      });
    }

    openModal('qris-pay-modal');
  });

  // Simulate Instant QRIS Payment Success
  document.getElementById('btn-simulate-qris-paid')?.addEventListener('click', () => {
    const createdTicket = store.createOrder({
      destinasiId: bookingState.destinasiId,
      tglKunjungan: bookingState.tglKunjungan,
      dewasa: bookingState.dewasa,
      anak: bookingState.anak,
      kendaraan: bookingState.kendaraan,
      subtotalTiket: bookingState.subtotalTiket,
      subtotalParkir: bookingState.subtotalParkir,
      asuransiJasaRaharja: bookingState.asuransiJasaRaharja,
      totalBayar: bookingState.totalBayar,
      namaWisatawan: 'Wisatawan Kalianda',
      kontak: '0812-7890-4432',
      metodeBayar: 'QRIS'
    });

    closeModal('qris-pay-modal');
    sound.playSuccessBeep();
    showToast(`Pembayaran QRIS Berhasil! E-Tiket diterbitkan dengan Kode: ${createdTicket.kodeTiket}`, 'success');

    // Switch to Screen D (PWA E-Ticket)
    setTimeout(() => {
      switchScreen('screen-d');
    }, 400);
  });

  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      item.classList.toggle('open');
    });
  });

  // ==========================================================================
  // SCREEN D: PWA E-TIKET AKTIF (BOARDING PASS)
  // ==========================================================================
  function renderActivePWATicket() {
    const ticket = store.getActiveTicket();
    if (!ticket) return;

    document.getElementById('pwa-dest-name').textContent = ticket.destinasiNama;
    document.getElementById('pwa-booking-code').textContent = ticket.kodeTiket;
    document.getElementById('pwa-manifest-text').textContent = `${ticket.jumlahDewasa} Dewasa ${ticket.jumlahAnak > 0 ? ', ' + ticket.jumlahAnak + ' Anak' : ''} • ${ticket.kendaraan}`;
    document.getElementById('pwa-visit-date').textContent = ticket.tglKunjungan;
    document.getElementById('pwa-total-pay').textContent = 'Rp' + ticket.totalBayar.toLocaleString('id-ID');
    document.getElementById('pwa-pay-method').textContent = ticket.metodeBayar;

    const statusChip = document.getElementById('pwa-status-chip');
    if (ticket.statusTiket === 'TERPAKAI') {
      statusChip.className = 'bp-status-chip used';
      statusChip.innerHTML = '<span class="material-symbols-outlined" style="font-size: 14px;">check</span> SUDAH DIPINDAI';
    } else {
      statusChip.className = 'bp-status-chip';
      statusChip.innerHTML = '<span class="material-symbols-outlined" style="font-size: 14px;">verified</span> LUNAS — SIAP DIPINDAI';
    }

    // Render Canvas QR Code
    const qrCanvas = document.getElementById('pwa-ticket-qr-canvas');
    if (qrCanvas) {
      qr.draw(qrCanvas, ticket.qrToken || ticket.kodeTiket, {
        size: 200,
        darkColor: '#002B8C',
        logoText: 'BPPRD'
      });
    }
  }

  // Quick Action: "Kirim Tiket ini ke Validator Lapangan"
  document.getElementById('btn-pwa-send-to-validator')?.addEventListener('click', () => {
    const ticket = store.getActiveTicket();
    if (!ticket) return;

    switchScreen('screen-a');
    bypassInput.value = ticket.kodeTiket;
    const res = store.verifyTicket(ticket.kodeTiket);
    renderValidationResult(res);
  });

  document.getElementById('btn-pwa-download')?.addEventListener('click', () => {
    showToast('Mengunduh E-Tiket PDF Sah BPPRD Kabupaten Lampung Selatan...', 'info');
  });

  // ==========================================================================
  // SCREEN C: DASHBOARD EKSEKUTIF BPPRD
  // ==========================================================================
  function renderExecutiveKPIs() {
    const data = store.getData();
    const stats = data.executiveStats;

    document.getElementById('kpi-total-pad').textContent = 'Rp' + stats.totalPADHariIni.toLocaleString('id-ID');
    document.getElementById('kpi-volume-wisatawan').textContent = stats.volumeWisatawan.toLocaleString('id-ID') + ' Jiwa';
    document.getElementById('kpi-rasio-digital').textContent = stats.rasioDigital + '%';
    document.getElementById('kpi-gerbang-aktif').textContent = stats.gerbangAktif;
  }

  function renderCharts() {
    renderExecutiveKPIs();
    renderHourlyTrendChart();
    renderDonutChart();
    renderLiveStreamFeed();
    renderReconciliationTable();
  }

  function renderHourlyTrendChart() {
    const svgEl = document.getElementById('hourly-trend-svg');
    if (!svgEl) return;

    // Simulated 12-hour hourly PAD revenue (07.00 to 18.00 WIB)
    const hours = ['07.00', '08.00', '09.00', '10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00', '17.00', '18.00'];
    const values = [4.2, 8.5, 14.2, 22.8, 29.5, 34.0, 31.2, 28.6, 24.1, 19.3, 12.0, 6.4]; // in Millions
    const maxVal = 40;

    const width = 600;
    const height = 200;
    const paddingX = 40;
    const paddingY = 25;

    const points = values.map((val, idx) => {
      const x = paddingX + (idx / (values.length - 1)) * (width - paddingX * 2);
      const y = height - paddingY - (val / maxVal) * (height - paddingY * 2);
      return { x, y, val };
    });

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const cur = points[i];
      const cx1 = (prev.x + cur.x) / 2;
      pathD += ` C ${cx1} ${prev.y}, ${cx1} ${cur.y}, ${cur.x} ${cur.y}`;
    }

    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

    svgEl.innerHTML = `
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0037B0" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#0037B0" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <!-- Grid lines -->
      <line x1="${paddingX}" y1="${height - paddingY}" x2="${width - paddingX}" y2="${height - paddingY}" stroke="#E2E8F0" stroke-width="1"/>
      <line x1="${paddingX}" y1="${height / 2}" x2="${width - paddingX}" y2="${height / 2}" stroke="#E2E8F0" stroke-dasharray="4" stroke-width="1"/>
      
      <!-- Target threshold line -->
      <line x1="${paddingX}" y1="${height - paddingY - (25 / maxVal) * (height - paddingY * 2)}" x2="${width - paddingX}" y2="${height - paddingY - (25 / maxVal) * (height - paddingY * 2)}" stroke="#10B981" stroke-dasharray="6" stroke-width="1.5"/>
      <text x="${width - paddingX - 100}" y="${height - paddingY - (25 / maxVal) * (height - paddingY * 2) - 6}" font-size="10" fill="#059669" font-weight="700">Garis Target PAD</text>

      <!-- Fill Area -->
      <path d="${areaD}" fill="url(#chartGradient)"/>
      <!-- Curve stroke -->
      <path d="${pathD}" fill="none" stroke="#0037B0" stroke-width="3"/>

      <!-- Peak marker on 12.00 (index 5) -->
      <circle cx="${points[5].x}" cy="${points[5].y}" r="6" fill="#1D4ED8" stroke="#FFFFFF" stroke-width="2"/>
      <rect x="${points[5].x - 45}" y="${points[5].y - 32}" width="90" height="22" rx="4" fill="#0F172A"/>
      <text x="${points[5].x}" y="${points[5].y - 17}" font-size="10" fill="#FFFFFF" text-anchor="middle" font-weight="700">Puncak: Rp34Jt</text>

      <!-- Labels -->
      ${points.map((p, i) => `
        <text x="${p.x}" y="${height - 6}" font-size="9" fill="#64748B" text-anchor="middle" font-family="'Inter', sans-serif">${hours[i]}</text>
      `).join('')}
    `;
  }

  function renderDonutChart() {
    const svgEl = document.getElementById('donut-chart-svg');
    if (!svgEl) return;

    // Percentages: Marina 45%, Kedu 29.5%, Canti 16%, Bom 9.5%
    const slices = [
      { pct: 0.45, color: '#0037B0', name: 'Pantai Marina' },
      { pct: 0.295, color: '#D97706', name: 'Pantai Kedu Warna' },
      { pct: 0.16, color: '#059669', name: 'Dermaga Canti' },
      { pct: 0.095, color: '#7C3AED', name: 'Dermaga Bom' }
    ];

    const cx = 100, cy = 100, r = 70;
    const circ = 2 * Math.PI * r;

    let accumulatedOffset = 0;
    let circleSegments = '';

    slices.forEach(slice => {
      const strokeLen = slice.pct * circ;
      const strokeGap = circ - strokeLen;
      const offset = -accumulatedOffset;
      circleSegments += `
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${slice.color}" stroke-width="26"
          stroke-dasharray="${strokeLen} ${strokeGap}" stroke-dashoffset="${offset}"
          transform="rotate(-90 ${cx} ${cy})"/>
      `;
      accumulatedOffset += strokeLen;
    });

    svgEl.innerHTML = `
      ${circleSegments}
      <circle cx="${cx}" cy="${cy}" r="55" fill="#FFFFFF"/>
      <text x="${cx}" y="${cy - 4}" font-size="11" font-weight="600" fill="#64748B" text-anchor="middle">Total PAD</text>
      <text x="${cx}" y="${cy + 14}" font-size="14" font-weight="900" fill="#0F172A" text-anchor="middle">100%</text>
    `;
  }

  function renderLiveStreamFeed() {
    const container = document.getElementById('live-stream-container');
    if (!container) return;

    const logs = store.getAuditLogs().slice(0, 4);
    container.innerHTML = logs.map(l => `
      <div class="feed-log-row ${l.tipe === 'ANOMALY' ? 'is-anomaly' : ''}">
        <div>
          <strong style="color: ${l.tipe === 'ANOMALY' ? '#F87171' : '#38BDF8'};">[${l.waktu}]</strong>
          <span>${l.kodeBooking} — ${l.detail}</span>
        </div>
        <span class="badge-status ${l.tipe === 'VALID' ? 'valid' : l.tipe === 'ANOMALY' ? 'anomaly' : 'cash'}">
          ${l.statusGate}
        </span>
      </div>
    `).join('');
  }

  function renderReconciliationTable() {
    const tbody = document.getElementById('reconciliation-table-body');
    if (!tbody) return;

    const tickets = store.getAllTickets();
    tbody.innerHTML = tickets.map(t => `
      <tr>
        <td><strong>${t.kodeTiket}</strong></td>
        <td>${t.createdDate || 'Hari Ini'}</td>
        <td>${t.destinasiNama}</td>
        <td>${t.wisatawanNama}</td>
        <td>${t.jumlahDewasa} Dewasa, ${t.kendaraan}</td>
        <td><strong>Rp${t.totalBayar.toLocaleString('id-ID')}</strong></td>
        <td><span class="badge-status ${t.metodeBayar === 'QRIS' ? 'valid' : 'cash'}">${t.metodeBayar}</span></td>
        <td>
          <span class="badge-status ${t.statusTiket === 'TERPAKAI' ? 'anomaly' : 'valid'}">
            ${t.statusTiket === 'TERPAKAI' ? 'TERPAKAI' : 'BELUM DIGUNAKAN'}
          </span>
        </td>
      </tr>
    `).join('');
  }

  // ==========================================================================
  // SCREEN A: SHIFT STATS & AUDIT LOGS
  // ==========================================================================
  function renderShiftStats() {
    const data = store.getData();
    const shift = data.shiftStats;

    const elVehicles = document.getElementById('shift-kendaraan-lolos');
    if (elVehicles) elVehicles.textContent = shift.kendaraanLolos;

    const elVisitors = document.getElementById('shift-wisatawan-masuk');
    if (elVisitors) elVisitors.textContent = shift.wisatawanMasuk + ' Jiwa';

    const elRatio = document.getElementById('shift-rasio-cashless');
    if (elRatio) elRatio.textContent = shift.rasioCashless + '%';

    const elCash = document.getElementById('shift-kas-fisik');
    if (elCash) elCash.textContent = 'Rp' + shift.kasFisik.toLocaleString('id-ID');
  }

  function renderAuditLogsTable() {
    const tbody = document.getElementById('audit-log-gate-body');
    if (!tbody) return;

    const logs = store.getAuditLogs().slice(0, 5);
    tbody.innerHTML = logs.map(l => `
      <tr>
        <td>${l.waktu}</td>
        <td><strong>${l.kodeBooking}</strong></td>
        <td>${l.kategori}</td>
        <td>Rp${l.nominal.toLocaleString('id-ID')}</td>
        <td>${l.metode}</td>
        <td>
          <span class="badge-status ${l.tipe === 'VALID' ? 'valid' : l.tipe === 'ANOMALY' ? 'anomaly' : 'cash'}">
            ${l.statusGate}
          </span>
        </td>
      </tr>
    `).join('');
  }

  // ==========================================================================
  // MODALS: THERMAL RECEIPT & BARRIER GATE ANIMATION
  // ==========================================================================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('open');
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
  }

  document.querySelectorAll('.modal-close-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
    });
  });

  // Barrier Gate Swing Animation Trigger
  function triggerBarrierGateModal() {
    sound.playGateOpenChime();
    openModal('gate-animation-modal');

    const gateArm = document.getElementById('barrier-arm-element');
    const gateBulb = document.getElementById('barrier-light-bulb');
    const gateStatusText = document.getElementById('gate-modal-status-text');

    if (gateArm) gateArm.classList.add('is-open');
    if (gateBulb) gateBulb.className = 'gate-light-bulb green';
    if (gateStatusText) gateStatusText.textContent = 'PALANG TERBUKA — KENDARAAN SILAKAN MASUK';

    // Auto-close after 3.5 seconds
    setTimeout(() => {
      if (gateArm) gateArm.classList.remove('is-open');
      if (gateBulb) gateBulb.className = 'gate-light-bulb';
      if (gateStatusText) gateStatusText.textContent = 'PALANG DITUTUP KEMBALI OTOMATIS';
      setTimeout(() => {
        closeModal('gate-animation-modal');
      }, 700);
    }, 3200);
  }

  // 58mm Thermal Receipt Generator
  function openThermalReceiptModalForTicket(ticket) {
    const container = document.getElementById('thermal-receipt-content');
    if (!container) return;

    container.innerHTML = `
      <div class="thermal-receipt-paper">
        <div class="thermal-header">
          <h4>PEMKAB LAMPUNG SELATAN</h4>
          <p style="font-size: 11px;">BADAN PENGELOLA PAJAK & RETRIBUSI DAERAH</p>
          <p style="font-size: 10px;">BUKTI RETRIBUSI RESMI KAWASAN KALIANDA</p>
        </div>
        <div class="thermal-divider"></div>
        <div class="thermal-row">
          <span>Pos:</span>
          <span>Pos 1 Marina</span>
        </div>
        <div class="thermal-row">
          <span>No. Booking:</span>
          <strong>${ticket.kodeTiket}</strong>
        </div>
        <div class="thermal-row">
          <span>Waktu:</span>
          <span>${ticket.verifiedAt || new Date().toLocaleTimeString('id-ID')} WIB</span>
        </div>
        <div class="thermal-row">
          <span>Petugas:</span>
          <span>Ahmad Fauzi (NIP. ...002)</span>
        </div>
        <div class="thermal-divider"></div>
        <div class="thermal-row">
          <span>${ticket.destinasiNama}</span>
        </div>
        <div class="thermal-row">
          <span>Dewasa (${ticket.jumlahDewasa}x)</span>
          <span>Rp${(ticket.jumlahDewasa * 15000).toLocaleString('id-ID')}</span>
        </div>
        <div class="thermal-row">
          <span>Parkir (${ticket.kendaraan})</span>
          <span>Rp${ticket.subtotalParkir.toLocaleString('id-ID')}</span>
        </div>
        <div class="thermal-row">
          <span>Asuransi Jasa Raharja</span>
          <span>Rp${ticket.asuransiJasaRaharja.toLocaleString('id-ID')}</span>
        </div>
        <div class="thermal-total-row">
          <span>TOTAL LUNAS:</span>
          <span>Rp${ticket.totalBayar.toLocaleString('id-ID')}</span>
        </div>
        <div class="thermal-row">
          <span>Metode:</span>
          <span>${ticket.metodeBayar} Kasda</span>
        </div>
        <div class="thermal-divider"></div>
        <div style="text-align: center; font-size: 10px; margin-top: 8px;">
          <p>*** SIMPAN KARCIS INI ***</p>
          <p>Sebagai Tanda Bukti Retribusi Sah Pemkab Lamsel Bebas Pungli</p>
        </div>
      </div>
    `;

    openModal('thermal-receipt-modal');
  }

  function openThermalReceiptModalForCash(receipt) {
    const container = document.getElementById('thermal-receipt-content');
    if (!container) return;

    container.innerHTML = `
      <div class="thermal-receipt-paper">
        <div class="thermal-header">
          <h4>PEMKAB LAMPUNG SELATAN</h4>
          <p style="font-size: 11px;">BPPRD KABUPATEN LAMPUNG SELATAN</p>
          <p style="font-size: 10px;">KARCIS RETRIBUSI BERPORPORASI FISIK</p>
        </div>
        <div class="thermal-divider"></div>
        <div class="thermal-row">
          <span>No Seri:</span>
          <strong>${receipt.nomorPorporasi}</strong>
        </div>
        <div class="thermal-row">
          <span>Waktu:</span>
          <span>${receipt.waktu}</span>
        </div>
        <div class="thermal-row">
          <span>Pos:</span>
          <span>${receipt.pos}</span>
        </div>
        <div class="thermal-row">
          <span>Petugas:</span>
          <span>${receipt.petugas}</span>
        </div>
        <div class="thermal-divider"></div>
        ${receipt.items.map(item => `
          <div class="thermal-row">
            <span>${item.label} (${item.qty}x)</span>
            <span>Rp${item.subtotal.toLocaleString('id-ID')}</span>
          </div>
        `).join('')}
        <div class="thermal-total-row">
          <span>TOTAL TUNAI:</span>
          <span>Rp${receipt.total.toLocaleString('id-ID')}</span>
        </div>
        <div class="thermal-divider"></div>
        <div style="text-align: center; font-size: 10px; margin-top: 8px;">
          <p>*** BUKTI RETRIBUSI TUNAI RESMI ***</p>
          <p>Telah tercatat di Rekonsiliasi Kas Pos Lapangan</p>
        </div>
      </div>
    `;

    openModal('thermal-receipt-modal');
  }

  // Print button in modal
  document.getElementById('btn-execute-print-thermal')?.addEventListener('click', () => {
    showToast('Mengirim perintah cetak ke Printer Bluetooth PT-210...', 'info');
    setTimeout(() => {
      showToast('Karcis 58mm Berhasil Dicetak!', 'success');
      closeModal('thermal-receipt-modal');
    }, 900);
  });

  // Export report simulation in Executive Dashboard
  document.getElementById('btn-export-report')?.addEventListener('click', () => {
    showToast('Mengekspor Laporan Keuangan PAD Format PDF & Excel Resmi...', 'info');
    setTimeout(() => {
      showToast('File "Laporan_PAD_Kalianda_20261020.xlsx" siap diunduh!', 'success');
    }, 800);
  });

  // Global Toast Function
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'check_circle' : type === 'warning' || type === 'error' ? 'warning' : 'info';
    toast.innerHTML = `
      <span class="material-symbols-outlined">${icon}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3400);
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  calculateWisatawanReservation();
  renderShiftStats();
  renderAuditLogsTable();
  renderExecutiveKPIs();
  updateOfflineUI(store.isOffline());

  // Listen to store changes
  store.subscribe(() => {
    renderShiftStats();
    renderAuditLogsTable();
    renderExecutiveKPIs();
    if (currentScreen === 'screen-d') renderActivePWATicket();
    if (currentScreen === 'screen-c') renderCharts();
  });
});
