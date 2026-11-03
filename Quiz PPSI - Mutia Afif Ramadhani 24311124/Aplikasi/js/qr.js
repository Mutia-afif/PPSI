// Lightweight QR Code Generator & Renderer for SI-PAD Lamsel
// Creates clean, visually authentic QR codes with finder patterns and deterministic data distribution

(function(global) {
  function drawQRToCanvas(canvas, text, options = {}) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = options.size || 220;
    const padding = options.padding || 12;
    const darkColor = options.darkColor || '#0B192C';
    const lightColor = options.lightColor || '#FFFFFF';

    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = lightColor;
    ctx.fillRect(0, 0, size, size);

    // Matrix resolution: 25x25 (Standard Version 2 QR)
    const N = 25;
    const innerSize = size - (padding * 2);
    const cell = innerSize / N;

    // Create 2D grid
    const grid = Array.from({ length: N }, () => Array(N).fill(false));

    // Draw 3 Finder Patterns at corners (top-left, top-right, bottom-left)
    function addFinder(r0, c0) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
            grid[r0 + r][c0 + c] = true;
          } else {
            grid[r0 + r][c0 + c] = false;
          }
        }
      }
    }

    addFinder(0, 0);          // Top-left
    addFinder(0, N - 7);      // Top-right
    addFinder(N - 7, 0);      // Bottom-left

    // Add separators around finders
    for (let i = 0; i < 8; i++) {
      if (N - 8 >= 0) {
        grid[7][i] = false;
        grid[i][7] = false;
        grid[7][N - 1 - i] = false;
        grid[i][N - 8] = false;
        grid[N - 8][i] = false;
        grid[N - 1 - i][7] = false;
      }
    }

    // Timing patterns
    for (let i = 8; i < N - 8; i++) {
      grid[6][i] = (i % 2 === 0);
      grid[i][6] = (i % 2 === 0);
    }

    // Alignment pattern near bottom-right (center at N-7, N-7)
    const ar = N - 7, ac = N - 7;
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        if (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) {
          grid[ar + r][ac + c] = true;
        } else {
          grid[ar + r][ac + c] = false;
        }
      }
    }

    // Deterministic pseudo-random hashing based on text to fill the remaining cells
    let hash = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }

    let seed = Math.abs(hash);
    function nextBit() {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return (seed >> 16) % 2 === 1;
    }

    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        // Skip finder zones
        const inTL = r < 8 && c < 8;
        const inTR = r < 8 && c >= N - 8;
        const inBL = r >= N - 8 && c < 8;
        const inTiming = (r === 6 && c >= 8 && c < N - 8) || (c === 6 && r >= 8 && r < N - 8);
        const inAlign = (r >= ar - 2 && r <= ar + 2 && c >= ac - 2 && c <= ac + 2);

        if (!inTL && !inTR && !inBL && !inTiming && !inAlign) {
          grid[r][c] = nextBit();
        }
      }
    }

    // Render cells onto canvas with rounded pixel aesthetic
    ctx.fillStyle = darkColor;
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (grid[r][c]) {
          const x = padding + c * cell;
          const y = padding + r * cell;
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(x, y, cell - 0.3, cell - 0.3, 1.2) : ctx.rect(x, y, cell, cell);
          ctx.fill();
        }
      }
    }

    // Center Logo Shield for QRIS or Pemkab branding if option set
    if (options.logoText) {
      const centerBoxSize = cell * 5.5;
      const cx = (size - centerBoxSize) / 2;
      const cy = (size - centerBoxSize) / 2;

      ctx.fillStyle = lightColor;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(cx - 3, cy - 3, centerBoxSize + 6, centerBoxSize + 6, 6);
      else ctx.rect(cx - 3, cy - 3, centerBoxSize + 6, centerBoxSize + 6);
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = darkColor;
      ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(options.logoText, size / 2, size / 2);
    }
  }

  global.QRRenderer = {
    draw: drawQRToCanvas
  };
})(window);
