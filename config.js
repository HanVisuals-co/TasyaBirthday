/**
 * ============================================================================
 * KONFIGURASI PRIBADI WEBSITE ULANG TAHUN WINNIE THE POOH
 * ============================================================================
 * Silakan ubah teks, tanggal, foto, lagu, kuis, dan surat cinta di bawah ini.
 * Kamu cukup mengedit file ini saja tanpa perlu menyentuh file kode lainnya!
 */

const CONFIG = {
  // 1. Data Dasar & PIN Gerbang Masuk
  girlfriendName: "Tasya", // Nama atau panggilan kesayangan pacar kamu
  senderName: "From Ihan", // Nama kamu di bagian penutup surat
  anniversaryPin: "1904", // 4 digit angka PIN (contoh: 1904 untuk 19 April)
  pinHint: "",

  // 2. Penghitung Waktu Bersama (Format: YYYY-MM-DDTHH:MM:SS)
  relationshipStartDate: "2025-04-19T23:10:00",

  // 3. Lagu Latar (BGM)
  // Taruh file .mp3 lagu kalian di folder assets/audio/ lalu tulis namanya di sini,
  // contoh: "assets/audio/lagu-kita.mp3".
  // Jika dibiarkan kosong (""), website akan otomatis memutar melodi kotak musik lembut!
  musicUrl: "assets/audio/marry-your-daughter.m4a",
  musicTitle: "Marry Your Daughter - Brian McKnight",

  // 4. Teks Sampul Scrapbook
  scrapbookTitle: "Happy birthday,",
  coverNickname: "Honey",
  scrapbookSubtitle: "Sebuah buku kenangan kecil dari Ihan, khusus untukmu.",

  // 5. Galeri Foto Polaroid Kenangan
  // Taruh foto kalian di folder assets/images/ lalu ubah path "image" di bawah.
  // Jika belum ada foto, biarkan "image" kosong ("") untuk menampilkan ilustrasi lucu sementara.
  polaroids: [
    {
      image: "assets/images/foto1.jpg",
      date: "First date",
      caption: "Probably the happiest day of my life i've ever been, never imagine there's day i'll become ur bf.",
      rotation: -3
    },
    {
      image: "assets/images/foto2.png?v=2",
      date: "Bunga pertama dari aku",
      caption: "and i'll never forgot how happy you are for when getting flowers from me.",
      rotation: 2.5
    },
    {
      image: "assets/images/foto3.jpg",
      date: "U come to malang",
      caption: "One of my dream comes true, can take you around malang, from morning to night.",
      rotation: -2
    },
    {
      image: "assets/images/foto4.jpg",
      date: "bandung, home of my fav person",
      caption: "and the fate has brought me here to prove us that we can meet and will always be together again.",
      rotation: 3
    }
  ],

  // 6. Kuis Trivia Kenangan Kita (3 Pertanyaan)
  // Jawabannya mengacu pada index pilihan (0 = pilihan pertama, 1 = kedua, dst.)
  quizzes: [
    {
      question: "Diri kamu yang buat Ihan jadi jatuh cinta (kepelet)",
      options: [
        "a. Kecantikan kamu",
        "b. Kamu yang suka marah marah",
        "c. Gemes kayak pooh",
        "d. Semua jawaban benar"
      ],
      correctIndex: 3,
      poohReaction: "Benar! Memang semuanya bikin Ihan kepelet habis!"
    },
    {
      question: "Sifat Ihan yang paling kamu sukai",
      options: [
        "a. Rajin (AHHAHAHAH)",
        "b. Baik, suka menabung",
        "c. SIKIT SIKIT CEMBURU",
        "d. Penyabar masyaAllah"
      ],
      correctIndex: 3,
      poohReaction: "Tepat sekali! MasyaAllah penyabarnya Ihan memang tiada tanding."
    },
    {
      question: "Coba tebak wapres selanjutnya siapa",
      options: [
        "a. MH (M. Hoihan)",
        "b. MY (M. Yoihan)",
        "c. TK (Tarissa Khairunnisa)",
        "d. pikir aja sendiri mas!"
      ],
      correctIndex: 3,
      poohReaction: "HAHAHA betul! Ketiga stiker madu sudah terkumpul. Kamu siap buka toples rahasia!"
    }
  ],

  // 7. Toples Madu: Alasan Mengapa Aku Menyayangimu (Reasons Why I Love You)
  loveReasons: [
    "U'r my everything, the one who speaks louder than my mind.",
    "In case you forgot, i've been chasing u half of my life.",
    "Your heart is honest, you'll never lies when you like it, it'll showed miles away and work for the opposite too.",
    "Safest place, when days get rough, your hug made me forgot every mess day.",
    "U can get mad very easily HIHI, it's cute for some of the times."
  ],

  // 8. Surat Cinta Rahasia (Grand Finale)
  loveLetterTitle: "Untukmu, di Hari Spesialmu",
  loveLetterBody: [
    "Selamat ulang tahun, Sayangkuuu.",
    "Seperti kata Winnie the Pooh: 'How lucky I am to have something that makes saying goodbye so hard.' Kamu adalah 'something' itu.",
    "Makasihh sayang, udah bertahan, dan menjadi versi dirimu yang sangat sangat luar biasa hingga hari ini (I'm very proud of you tho). Semoga di usiamu yang baru, semua langkahmu dimudahkan, kesehatanmu selalu terjaga, dan senyummu gaakan pernah pudar.",
    "I'm maybe not a perfect person, But, I Promise that I'll always take care of your heart carefully when you're feelin low, ore even when u made it to top of the world, this days and forward. Likewise."
  ],
  loveLetterClosing: "Selamat bertambah usia, cintanya akuu.",

  // 9. Photobooth 2 Foto (Tema Winnie the Pooh)
  photobooth: {
    whatsappNumber: "6281334535073",
    whatsappMessage: "Haloo Ihan! Makasih banyak kado Hirono Harry Potter-nya, ini hasil photobooth aku!",
    stripFooterTitle: "Happy Birthday, Tasya!",
    stripFooterSubtitle: "Special Day - From Ihan"
  }
};
