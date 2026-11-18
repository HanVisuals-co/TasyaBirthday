# Website Ulang Tahun Interaktif Bertema Winnie the Pooh

Website scrapbook interaktif dengan nuansa hangat Hundred Acre Wood, lengkap dengan gerbang PIN 4 digit, amplop pembuka, penghitung hari bersama, galeri polaroid, kuis trivia kenangan, toples alasan sayang, tiup lilin kue ulang tahun via mikrofon/klik, dan surat cinta rahasia.

## Cara Mengisi Data Pribadi Kamu

1. **Siapkan Foto & Lagu (Opsional)**:
   - Taruh foto-foto kenangan kalian di folder `assets/images/` (misalnya `foto1.jpg`, `foto2.jpg`).
   - Taruh file lagu kenangan berformat `.mp3` di folder `assets/audio/` (misalnya `lagu-kita.mp3`). Jika dikosongkan, website otomatis memutar melodi kotak musik lembut.

2. **Edit File `config.js`**:
   - Buka file `config.js` menggunakan Notepad atau teks editor apa pun.
   - Ubah `girlfriendName`, `senderName`, `anniversaryPin` (4 angka tanggal jadian), dan `relationshipStartDate`.
   - Masukkan path foto di bagian `polaroids`, misalnya `"assets/images/foto1.jpg"`.
   - Sesuaikan soal dan jawaban di bagian `quizzes`, daftar alasan sayang di `loveReasons`, serta isi surat cinta di `loveLetterBody`.

3. **Cara Melihat Hasilnya Langsung**:
   - Cukup klik dua kali (double-click) file `index.html` untuk langsung membukanya di Chrome, Edge, atau Safari!

4. **Cara Bagikan Lewat Link (Hosting Gratis)**:
   - Buka [Vercel](https://vercel.com) atau [Netlify Drop](https://app.netlify.com/drop).
   - Tarik (drag & drop) seluruh folder proyek ini ke halaman tersebut.
   - Dalam hitungan detik, kamu akan mendapatkan link publik (URL) yang siap dikirim ke pacarmu lewat chat!
