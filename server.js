const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const APP_DIR = path.join(__dirname, 'Quiz PPSI - Mutia Afif Ramadhani 24311124', 'Aplikasi');
const ROOT_DIR = path.join(__dirname, 'Quiz PPSI - Mutia Afif Ramadhani 24311124');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  // Normalize URL and remove query params
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let reqPath = decodeURIComponent(parsedUrl.pathname);

  // Default to index.html for root
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  // First check inside Aplikasi directory
  let filePath = path.join(APP_DIR, reqPath);

  // If not found inside Aplikasi, also check parent project directory (for docs, word, etc.)
  if (!fs.existsSync(filePath)) {
    const fallbackPath = path.join(ROOT_DIR, reqPath);
    if (fs.existsSync(fallbackPath) && fs.statSync(fallbackPath).isFile()) {
      filePath = fallbackPath;
    }
  }

  // Security check: ensure path is within ROOT_DIR or APP_DIR
  if (!filePath.startsWith(ROOT_DIR) && !filePath.startsWith(APP_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="id">
        <head><title>404 Not Found</title></head>
        <body style="font-family:sans-serif; text-align:center; padding:50px;">
          <h2>404 - File Tidak Ditemukan</h2>
          <p>Halaman atau file <code>${reqPath}</code> tidak ditemukan.</p>
          <a href="/" style="color:#0037B0; font-weight:bold;">Kembali ke Halaman Utama SI-PAD Lamsel</a>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.warn(`Port ${PORT} sedang dipakai, mencoba port ${Number(PORT) + 1}...`);
    server.listen(Number(PORT) + 1);
  } else {
    console.error('Server error:', e);
  }
});

server.listen(PORT, () => {
  const actualPort = server.address().port;
  console.log('================================================================');
  console.log('   🚀 SI-PAD LAMSEL (E-Retribusi Wisata Kalianda) BERJALAN!');
  console.log('================================================================');
  console.log(`\n  👉 Akses di Browser: http://localhost:${actualPort}`);
  console.log(`  📁 Lokasi File: ${APP_DIR}\n`);
  console.log('  Tekan Ctrl + C di terminal untuk menghentikan server.');
  console.log('================================================================');
});

