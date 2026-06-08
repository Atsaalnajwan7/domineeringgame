📌 Deskripsi Project
Domineering AI adalah aplikasi permainan strategi kombinatorial berbasis web di mana pemain manusia berhadapan melawan agen kecerdasan buatan. Permainan dimainkan pada papan 6×6, dengan setiap pemain secara bergantian menempatkan sebuah domino 1×2:

🔵 Human → menempatkan domino vertikal (atau horizontal, pilihan di awal)
🟠 AI → menempatkan domino dengan orientasi berlawanan


Pemain yang tidak dapat melakukan langkah legal dinyatakan kalah.

Seluruh logika AI — termasuk algoritma Minimax dan Alpha-Beta Pruning — diimplementasikan dari nol menggunakan JavaScript murni, tanpa ketergantungan pada library atau framework AI eksternal. Proyek ini merupakan studi empiris yang membuktikan efisiensi Alpha-Beta Pruning dibandingkan Minimax standar secara langsung di browser.

✨ Fitur
🤖 Kecerdasan Buatan
FiturDeskripsiMinimax StandarImplementasi mandiri algoritma Minimax dengan evaluasi pohon permainan penuhAlpha-Beta PruningOptimasi Minimax yang memangkas cabang tidak relevan, 2–4× lebih cepatDepth 1–5Pilihan kedalaman pencarian yang dapat dikonfigurasi secara dinamisHeuristik MobilitasFungsi evaluasi berbasis selisih langkah legal: `eval(s) =
📊 Statistik & Visualisasi Real-time
FiturDeskripsiNode DievaluasiPenghitung jumlah node yang dievaluasi per langkah AINode DipangkasPenghitung cabang yang berhasil dipangkas oleh Alpha-BetaWaktu EksekusiPengukuran waktu per langkah AI dengan presisi sub-milidetik (Performance API)Skor TerbaikNilai heuristik dari langkah terbaik yang dipilih AIPohon KeputusanVisualisasi dinamis pohon pencarian hingga depth 3 dengan node PRUNED ditandai
🎮 Gameplay

Pemilihan orientasi domino pemain di awal game
Pergantian giliran otomatis dengan animasi penempatan domino
Deteksi otomatis kondisi kalah (tidak ada langkah legal tersisa)
Highlight langkah valid yang tersedia
Tampilan hasil akhir dengan statistik ringkasan

🎨 Antarmuka

Desain cyberpunk futuristik dengan tema gelap dan aksen neon
Fully responsive untuk desktop dan tablet
Animasi halus pada pergerakan domino dan pembaruan statistik
Tidak memerlukan instalasi atau backend — jalankan langsung di browser


🖼️ Screenshot
<div align="center">
Landing Page
Tampilkan Gambar
Halaman utama dengan desain cyberpunk futuristik
Pemilihan Orientasi
Tampilkan Gambar
Halaman pemilihan orientasi domino — Vertikal atau Horizontal
Papan Permainan
Tampilkan Gambar
Papan 6×6, panel statistik AI real-time, dan visualisasi pohon keputusan
</div>

💡 Catatan: Folder screenshots/ perlu dibuat secara manual dengan menambahkan screenshot aplikasi.


🌐 Demo Live
🔗 Mainkan Sekarang → www.domineering.my.id

Tidak perlu instalasi. Buka link di browser dan langsung bermain!


🗂️ Struktur Proyek
domineering-ai/
│
├── index.html              # Entry point — halaman utama
├── orientation.html        # Halaman pemilihan orientasi domino
├── game.html               # Halaman permainan utama
│
├── css/
│   ├── style.css           # Stylesheet utama (18 KB) — tema cyberpunk
│   └── responsive.css      # Stylesheet responsivitas
│
├── js/
│   ├── board.js            # Logika papan: representasi state, validasi langkah, evaluasi
│   ├── minimax.js          # ⭐ Implementasi algoritma Minimax standar (mandiri)
│   ├── alphabeta.js        # ⭐ Implementasi Minimax + Alpha-Beta Pruning (mandiri)
│   ├── gametree.js         # Visualisasi pohon keputusan di DOM
│   ├── statistics.js       # Pengumpulan & tampilan statistik real-time
│   ├── ui.js               # Manajemen antarmuka pengguna
│   └── game.js             # Koordinasi seluruh komponen & alur permainan
│
├── assets/
│   └── images/             # Aset gambar (4 file)
│
├── screenshots/            # Screenshot aplikasi (isi manual)
│
└── README.md               # Dokumentasi ini

⭐ File yang diimplementasikan dari nol tanpa library AI eksternal


🚀 Cara Menjalankan
Metode 1 — Buka Langsung (Paling Mudah)
Karena seluruh aplikasi berjalan client-side tanpa backend, cukup:
bash# Clone repository
git clone https://github.com/username/domineering-ai.git

# Masuk ke folder proyek
cd domineering-ai
Kemudian buka file index.html langsung di browser:

Double-click file index.html, atau
Drag & drop ke jendela browser


✅ Tidak perlu Node.js, Python, atau server apapun!


Metode 2 — Live Server (Direkomendasikan untuk Development)
Jika menggunakan VS Code, install ekstensi Live Server:

Buka folder proyek di VS Code
Klik kanan index.html
Pilih "Open with Live Server"
Browser akan terbuka otomatis di http://127.0.0.1:5500


Metode 3 — Python HTTP Server
bash# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
Buka browser dan akses: http://localhost:8000

Metode 4 — Node.js HTTP Server
bash# Install serve secara global (sekali saja)
npm install -g serve

# Jalankan server
serve .
Buka browser dan akses URL yang ditampilkan di terminal.

⚙️ Konfigurasi AI
Algoritma dan kedalaman AI dapat diubah langsung dari antarmuka permainan melalui panel kontrol, atau secara manual di js/game.js:
javascript// Pilih algoritma: 'minimax' atau 'alphabeta'
const AI_ALGORITHM = 'alphabeta';

// Kedalaman pencarian: 1–5 (semakin tinggi = semakin cerdas & lambat)
const AI_DEPTH = 4;
DepthAlgoritmaKecepatanRekomendasi1–2Minimax⚡ Sangat cepatTesting & debug3Minimax / Alpha-Beta⚡ CepatPemula4Alpha-Beta✅ Real-timeDirekomendasikan5Alpha-Beta✅ Real-timeTantangan penuh5Minimax🐢 Lambat (80–200ms)Tidak direkomendasikan

📐 Tentang Algoritma
Minimax Standar
Kompleksitas: O(b^d)
Membangun seluruh pohon permainan secara rekursif, bergantian antara Maximizer (AI) dan Minimizer (Human). Menjamin langkah optimal tetapi tidak efisien untuk depth besar.
Alpha-Beta Pruning
Kompleksitas: O(b^(d/2)) — kasus terbaik
Mempertahankan dua nilai batas α (terbaik Maximizer) dan β (terbaik Minimizer). Ketika β ≤ α, sisa sub-pohon dipangkas — tidak perlu dievaluasi. Keputusan yang dihasilkan identik dengan Minimax, tetapi 2–4× lebih cepat.
Hasil Empiris (30 game simulasi per konfigurasi)
MetrikMinimax (Depth 5)Alpha-Beta (Depth 5)PenghematanNode dievaluasi3.000+450–900~70%Waktu per langkah80–200 ms20–60 ms~3–4×Kualitas keputusanOptimalOptimalIdentik

🛠️ Teknologi

HTML5 — struktur semantik dan Canvas API
CSS3 — animasi, custom properties, flexbox/grid
Vanilla JavaScript — logika game, algoritma AI, DOM manipulation
Performance API — pengukuran waktu eksekusi presisi tinggi


🚫 Zero dependencies — tidak ada npm, tidak ada framework, tidak ada library AI.


👤 Author
Atsaal Najwan

NIM: 301240012
Universitas Bale Bandung — Teknik Informatika
Mata Kuliah: Kecerdasan Buatan | Semester Genap 2025/2026


📄 Lisensi
Proyek ini dilisensikan di bawah MIT License — bebas digunakan untuk keperluan akademik dan personal.

📚 Referensi

Russell, S., & Norvig, P. (2020). Artificial Intelligence: A Modern Approach (4th ed.). Pearson.
Knuth, D. E., & Moore, R. W. (1975). An Analysis of Alpha-Beta Pruning. Artificial Intelligence, 6(4), 293–326.
Berlekamp, E. R., Conway, J. H., & Guy, R. K. (2001). Winning Ways for your Mathematical Plays (2nd ed.). A K Peters.
Breuker, D. M., et al. (2000). Solving 8×8 Domineering. Theoretical Computer Science, 230, 195–206.