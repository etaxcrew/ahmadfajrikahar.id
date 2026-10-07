/**
 * SUMBER TUNGGAL SELURUH TEKS SITUS
 * ---------------------------------
 * Semua copy landing page tinggal di sini — komponen tidak boleh hardcode teks.
 * Draft asal: `content-notaris-afk.md`. Aturan isi: `CLAUDE.md`.
 *
 * KODE ETIK NOTARIS (WAJIB):
 *  - DILARANG mencantumkan kisaran/nominal biaya di mana pun dalam file ini.
 *  - Testimoni hanya boleh tayang dengan izin publikasi dari klien.
 *  - Bahasa formal-informatif; tanpa superlatif atau gaya iklan agresif.
 *
 * KONVENSI PLACEHOLDER:
 *  - Setiap nilai yang belum final ditandai komentar `// TODO: ...` tepat di atasnya
 *    dan didaftarkan ulang di `PLACEHOLDER_CHECKLIST` paling bawah file ini.
 *  - Placeholder TIDAK ditampilkan sebagai label di halaman (keputusan pemilik, 7 Okt 2026).
 *    Penandanya cukup di kode: komentar TODO, flag `isPlaceholder`, dan checklist di bawah.
 *    `next build` mencetak peringatan selama masih ada testimoni placeholder.
 */

/* -------------------------------------------------------------------------- */
/*  Tipe                                                                      */
/* -------------------------------------------------------------------------- */

export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceGroup {
  /** Dipakai komponen untuk memilih ikon penanda: "notaris" | "ppat" */
  id: string;
  /** Nama jabatan/kewenangan, dipakai sebagai judul kartu */
  title: string;
  /** Label ranah kewenangan — pembeda cepat antara Notaris dan PPAT */
  badge: string;
  /** Satu kalimat penjelas batas kewenangan — membedakan Notaris vs PPAT */
  scope: string;
  items: string[];
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface Testimonial {
  /** Wajib true selama teks masih contoh (memicu peringatan saat `next build`). */
  isPlaceholder: boolean;
  quote: string;
  /** Nama atau inisial klien — hanya tayang dengan izin publikasi */
  author: string;
  /** Jenis layanan yang digunakan klien */
  service: string;
  /** Opsional, mis. "Limboto" */
  location?: string;
  /**
   * Opsional — foto klien, HANYA dengan izin publikasi. Taruh berkas di
   * `public/images/testimoni/` (persegi, min. 160x160px). Tanpa foto, avatar
   * menampilkan monogram inisial.
   */
  photo?: { src: string; alt: string };
}

export interface FaqItem {
  question: string;
  answer: string;
}

/* -------------------------------------------------------------------------- */
/*  Identitas & kontak                                                        */
/* -------------------------------------------------------------------------- */

export const site = {
  /** Nama lengkap + gelar, dipakai di H1, metadata, dan JSON-LD */
  notaryName: "Ahmad Fajri Kahar, S.H., M.Kn.",
  officeName: "Kantor Notaris & PPAT Ahmad Fajri Kahar",
  shortName: "Notaris & PPAT Ahmad Fajri Kahar",
  role: "Notaris & Pejabat Pembuat Akta Tanah (PPAT)",
  /**
   * DATA FINAL — domain produksi (dikonfirmasi 8 Okt 2026). Selama domain belum aktif,
   * situs tayang di subdomain *.vercel.app; URL dasar yang dipakai metadata diatur
   * otomatis oleh lib/site-url.ts.
   */
  domain: "ahmadfajrikahar.id",
  url: "https://ahmadfajrikahar.id",
} as const;

/**
 * SEO — metadata halaman, Open Graph, dan data terstruktur (JSON-LD).
 * Kode etik: tidak ada harga/priceRange, rating, atau klaim superlatif di sini.
 */
export const seo = {
  /** <= 60 karakter agar tidak terpotong di hasil pencarian */
  title: "Notaris & PPAT Ahmad Fajri Kahar — Limboto, Gorontalo",
  /** 120–160 karakter; memuat kata kunci lokal secara wajar */
  description:
    "Kantor Notaris & PPAT Ahmad Fajri Kahar, S.H., M.Kn. di Kayubulan, Limboto, Kabupaten Gorontalo. Melayani akta notaris dan akta tanah. Konsultasi via WhatsApp.",
  /** Teks alternatif gambar Open Graph */
  ogImageAlt:
    "Kantor Notaris & PPAT Ahmad Fajri Kahar, S.H., M.Kn. — Kayubulan, Limboto, Kabupaten Gorontalo",
  /** Bahasa & wilayah untuk Open Graph */
  locale: "id_ID",
  /** Alamat terstruktur untuk JSON-LD (schema.org PostalAddress) — sama dengan data final alamat */
  postalAddress: {
    streetAddress: "Kayubulan",
    addressLocality: "Limboto",
    addressRegion: "Gorontalo",
    postalCode: "96214",
    addressCountry: "ID",
  },
  /** Wilayah layanan — sejalan dengan jawaban FAQ "Wilayah layanan" */
  areaServed: ["Kabupaten Gorontalo", "Kota Gorontalo", "Kabupaten Gorontalo Utara", "Kabupaten Boalemo"],
} as const;

export const contact = {
  /** DATA FINAL — sudah dikonfirmasi, jangan diubah */
  phoneDisplay: "0821-9593-3733",
  /** Format internasional tanpa tanda baca, untuk tautan wa.me dan tel: */
  phoneIntl: "6282195933733",
  /** DATA FINAL — sudah dikonfirmasi, jangan diubah */
  addressStreet: "Kayubulan, Kec. Limboto",
  addressRegion: "Kabupaten Gorontalo, Gorontalo",
  addressPostalCode: "96214",
  addressFull: "Kayubulan, Kec. Limboto, Kabupaten Gorontalo, Gorontalo 96214",

  /** DATA FINAL — sudah dikonfirmasi, jangan diubah */
  email: "info@notarisafk.id",

  /** DATA FINAL — sudah dikonfirmasi, jangan diubah */
  instagramHandle: "@notaris.afk",
  instagramUrl: "https://instagram.com/notaris.afk",

  /** DATA FINAL — sudah dikonfirmasi (diperbarui 8 Okt 2026). Satu entri = satu baris tampilan. */
  officeHours: ["Senin–Jumat, 08.00–17.00 WITA", "Sabtu, 09.00–15.00 WITA"],
  officeHoursNote:
    "Di luar jam tersebut, silakan tinggalkan pesan melalui WhatsApp atau form kontak.",
  /**
   * Format terstruktur (gaya schema.org openingHours) — dipakai JSON-LD (Tahap 9) dan
   * indikator "Sedang buka/tutup" di Info Kantor. Harus selalu sama dengan `officeHours`.
   */
  officeHoursSchema: ["Mo-Fr 08:00-17:00", "Sa 09:00-15:00"],
  /** Zona waktu kantor (WITA) untuk menghitung status buka/tutup */
  timeZone: "Asia/Makassar",
} as const;

/** Pesan pra-isi CTA WhatsApp — sesuai draft konten */
export const whatsapp = {
  prefilledMessage:
    "Halo, saya ingin berkonsultasi mengenai layanan notaris/PPAT.",
  get url() {
    return `https://wa.me/${contact.phoneIntl}?text=${encodeURIComponent(
      this.prefilledMessage,
    )}`;
  },
} as const;

export const maps = {
  /**
   * DATA FINAL — listing resmi kantor di Google Maps (dikonfirmasi pemilik, 8 Okt 2026).
   * Sumber: https://maps.app.goo.gl/9rPwG7F5GifB4fRi7
   * Nama listing: "KANTOR NOTARIS & PPAT AHMAD FAJRI KAHAR, S.H., M.Kn." — plus code JXFJ+M49 Kayubulan.
   *
   * `cid` adalah ID listing (desimal dari 0xc58160818866e477). Embed berbasis cid
   * menampilkan pin + kartu nama kantor, tanpa perlu API key.
   */
  cid: "14231762406922970231",
  latitude: 0.6249177,
  longitude: 122.9803728,
  shareUrl: "https://maps.app.goo.gl/9rPwG7F5GifB4fRi7",
  embedUrl: "https://maps.google.com/maps?cid=14231762406922970231&z=17&output=embed",
  /** Rute ke titik pin listing kantor */
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=0.6249177%2C122.9803728",
  embedTitle:
    "Peta lokasi Kantor Notaris & PPAT Ahmad Fajri Kahar di Kayubulan, Limboto",
} as const;


/* -------------------------------------------------------------------------- */
/*  Navigasi                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Label di atas judul tiap section, bergaya penomoran akta: "Pasal 1 — Layanan".
 * Nomor diambil dari urutan `nav` di bawah, jadi selalu sama dengan "Daftar isi"
 * di menu mobile. Ubah urutan section = ubah urutan `nav`.
 */
export const sectionLabel = {
  prefix: "Pasal",
} as const;

/** Teks menu navigasi mobile */
export const navMenu = {
  tocTitle: "Daftar isi",
  /** Ikon kontak di kanan navbar desktop (>= 1280px); nilai kontak diambil dari `contact` */
  iconLinks: {
    whatsapp: "WhatsApp",
    email: "Email",
    instagram: "Instagram",
    newTab: "(membuka tab baru)",
  },
} as const;

export const nav: NavItem[] = [
  { label: "Layanan", href: "#layanan" },
  { label: "Alur Layanan", href: "#alur-layanan" },
  { label: "Info Kantor", href: "#info-kantor" },
  { label: "Testimoni", href: "#testimoni" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontak", href: "#kontak" },
];

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

export const hero = {
  /** H1 tunggal di seluruh halaman */
  title: "Kepastian Hukum, Ditangani dengan Amanah",
  subtitle:
    "Kantor Notaris & PPAT Ahmad Fajri Kahar, S.H., M.Kn. — melayani jasa kenotariatan dan pertanahan di Kabupaten Gorontalo dan sekitarnya.",
  primaryCta: {
    label: "Konsultasi Sekarang",
    /** Tujuan tautan: whatsapp.url */
    ariaLabel: "Konsultasi sekarang melalui WhatsApp",
  },
  secondaryCta: {
    label: "Lihat Layanan",
    href: "#layanan",
  },
  /** Keterangan ringkas di bawah CTA */
  locationNote: "Kayubulan, Kec. Limboto — Kabupaten Gorontalo",
  /** Teks dekoratif yang melingkari seal di panel visual (aria-hidden) */
  sealRing: "NOTARIS · PPAT · KABUPATEN GORONTALO · NOTARIS · PPAT · KABUPATEN GORONTALO ·",

  // TODO: foto kantor/tim final — belum tersedia.
  // Selama `null`, Hero menampilkan panel motif seal/akta sebagai pengganti visual.
  // Cara mengganti tanpa refactor: taruh berkas di `public/images/`, lalu isi
  //   image: { src: "/images/kantor.jpg", alt: "<deskripsi bermakna>" }
  // Slot sudah terkunci pada rasio 4:5 — aset ideal 880x1100px (atau kelipatannya).
  image: null as { src: string; alt: string } | null,
} as const;

/* -------------------------------------------------------------------------- */
/*  Layanan — Notaris vs PPAT dibedakan jelas                                 */
/* -------------------------------------------------------------------------- */

export const layanan = {
  title: "Dua kewenangan, satu kantor",
  intro:
    "Notaris dan PPAT adalah dua jabatan dengan kewenangan berbeda. Berikut layanan yang kami tangani pada masing-masing kewenangan.",
  groups: [
    {
      id: "notaris",
      title: "Notaris",
      badge: "Ranah kenotariatan",
      scope:
        "Berwenang membuat akta autentik untuk berbagai keperluan hukum: pendirian badan usaha, perjanjian, hibah, wasiat, dan kuasa.",
      items: [
        "Akta pendirian PT, CV, Yayasan, dan Koperasi",
        "Akta perjanjian dan kontrak bisnis",
        "Akta hibah dan wasiat",
        "Akta kuasa",
        "Legalisasi dan waarmerking dokumen",
        "Akta perkawinan (perjanjian pra-nikah)",
      ],
    },
    {
      id: "ppat",
      title: "PPAT",
      badge: "Ranah pertanahan",
      scope:
        "Pejabat Pembuat Akta Tanah — khusus menangani akta atas perbuatan hukum mengenai hak atas tanah dan bangunan.",
      items: [
        "Akta Jual Beli (AJB) tanah dan bangunan",
        "Akta Hibah tanah",
        "Akta Pembagian Hak Bersama (APHB)",
        "Akta Pemberian Hak Tanggungan (APHT) — pengurusan agunan bank",
        "Pengecekan dan balik nama sertifikat",
      ],
    },
  ] satisfies ServiceGroup[],
  /** Sesuai kode etik: arahkan ke konsultasi, bukan ke daftar tarif */
  footnote:
    "Kebutuhan Anda belum tercantum di atas? Silakan hubungi kami untuk informasi lebih lanjut.",
  footnoteCta: {
    label: "Hubungi kami",
    href: "#kontak",
  },
  /**
   * Teks untuk slider kartu layanan di layout mobile (< 768px).
   * Di tablet/desktop kartu ditampilkan sebagai grid, slider tidak aktif.
   * `{n}` dan `{total}` diganti angka saat render.
   */
  slider: {
    label: "Kartu layanan",
    slideLabel: "{n} dari {total}",
    goToSlide: "Tampilkan kartu {n}",
    pause: "Hentikan perpindahan otomatis",
    play: "Jalankan perpindahan otomatis",
  },
} as const;

/* -------------------------------------------------------------------------- */
/*  Alur Layanan                                                              */
/* -------------------------------------------------------------------------- */

export const alurLayanan = {
  title: "Dari konsultasi sampai dokumen di tangan Anda",
  intro:
    "Setiap berkas melewati tahapan yang sama, sehingga Anda tahu posisi proses Anda di setiap langkah.",
  steps: [
    {
      step: 1,
      title: "Konsultasi awal",
      description:
        "Diskusikan kebutuhan Anda via WhatsApp, form kontak, atau datang langsung ke kantor.",
    },
    {
      step: 2,
      title: "Pengumpulan dokumen",
      description:
        "Kantor menginformasikan dokumen yang perlu Anda siapkan sesuai jenis layanan.",
    },
    {
      step: 3,
      title: "Penyusunan draf akta",
      description:
        "Draf disusun sesuai kebutuhan dan disesuaikan dengan keinginan para pihak.",
    },
    {
      step: 4,
      title: "Pembacaan & penandatanganan akta",
      description:
        "Dilakukan di hadapan notaris/PPAT sesuai jadwal yang disepakati bersama.",
    },
    {
      step: 5,
      title: "Pendaftaran & penyerahan dokumen",
      description:
        "Akta didaftarkan bila diperlukan, kemudian diserahkan kepada klien.",
    },
  ] satisfies ProcessStep[],
} as const;

/* -------------------------------------------------------------------------- */
/*  Info Kantor                                                               */
/* -------------------------------------------------------------------------- */

export const infoKantor = {
  title: "Berkunjung ke kantor kami",
  intro:
    "Kami menerima kunjungan langsung pada jam operasional. Disarankan membuat janji terlebih dahulu agar Anda tidak menunggu.",
  labels: {
    address: "Alamat",
    hours: "Jam Operasional",
    phone: "Telepon / WhatsApp",
    email: "Email",
    instagram: "Instagram",
  },
  /** Judul kecil pengelompok di dalam kartu info */
  groups: {
    visit: "Kunjungan",
    reach: "Hubungi langsung",
  },
  appointmentCta: {
    label: "Buat janji temu",
    ariaLabel: "Buat janji temu melalui WhatsApp",
  },
  directionsLabel: "Petunjuk arah",
  directionsAriaLabel: "Petunjuk arah ke kantor di Google Maps (membuka tab baru)",
  /** Indikator status kantor berdasarkan jam saat ini di zona WITA */
  officeStatus: {
    open: "Sedang buka",
    closed: "Sedang tutup",
    /** contoh: "tutup pukul 17.00" */
    closesAt: "tutup pukul",
    /** contoh: "buka pukul 08.00" (hari yang sama) */
    opensToday: "buka pukul",
    /** contoh: "buka besok 08.00" */
    opensTomorrow: "buka besok",
    /** contoh: "buka Senin 08.00" */
    opensOn: "buka",
  },
} as const;

/* -------------------------------------------------------------------------- */
/*  Testimoni — SEMUA MASIH PLACEHOLDER                                       */
/* -------------------------------------------------------------------------- */

export const testimoni = {
  title: "Apa kata klien kami",
  intro: "Kesan klien yang telah memberikan izin publikasi kepada kantor kami.",
  /**
   * [TESTIMONI PLACEHOLDER — ganti sebelum publish]
   *
   * TODO: ketiga entri di bawah masih CONTOH, bukan testimoni asli. Ganti dengan
   * testimoni nyata dari klien yang sudah memberi izin publikasi nama/inisial
   * (kode etik notaris), lalu ubah `isPlaceholder` menjadi false.
   * Selama masih ada entri placeholder, `next build` mencetak peringatan.
   *
   * Entri pertama tampil sebagai kutipan utama (kartu besar). Format pengisian:
   *   {
   *     isPlaceholder: false,
   *     quote: "Kutipan klien apa adanya, tanpa klaim berlebihan.",
   *     author: "R. H.",                  // nama/inisial sesuai izin
   *     service: "Akta jual beli tanah",
   *     location: "Limboto",              // opsional
   *     photo: { src: "/images/testimoni/rh.jpg", alt: "Foto R. H." }, // opsional, dengan izin
   *   }
   */
  items: [
    {
      isPlaceholder: true,
      quote:
        "Pelayanan profesional dan proses dijelaskan dengan jelas dari awal sampai akta selesai.",
      author: "Klien",
      service: "Layanan kenotariatan",
    },
    {
      isPlaceholder: true,
      quote:
        "Responsif dan membantu memahami dokumen yang rumit dengan bahasa yang mudah dimengerti.",
      author: "Klien",
      service: "Layanan kenotariatan",
    },
    {
      isPlaceholder: true,
      quote:
        "Proses pengurusan akta jual beli tanah berjalan lancar dan tepat waktu.",
      author: "Klien",
      service: "Akta jual beli tanah",
    },
  ] satisfies Testimonial[],
} as const;

/* -------------------------------------------------------------------------- */
/*  FAQ — tanpa kisaran biaya (kode etik)                                     */
/* -------------------------------------------------------------------------- */

export const faq = {
  title: "Pertanyaan yang sering diajukan",
  /** Kotak bantuan di samping daftar pertanyaan */
  help: {
    title: "Pertanyaan Anda belum terjawab?",
    text: "Tanyakan langsung kepada kami. Kami akan membalas pada jam operasional.",
    ctaLabel: "Tanyakan via WhatsApp",
    ctaAriaLabel: "Tanyakan pertanyaan Anda melalui WhatsApp",
  },
  items: [
    {
      question: "Berapa biaya jasa notaris/PPAT di kantor ini?",
      answer:
        "Sesuai kode etik profesi notaris, kami tidak mempublikasikan tarif secara terbuka. Silakan hubungi kami untuk konsultasi awal dan informasi biaya sesuai kebutuhan Anda.",
    },
    {
      question: "Apa perbedaan Notaris dan PPAT?",
      answer:
        "Notaris berwenang membuat akta autentik untuk berbagai keperluan hukum (pendirian usaha, perjanjian, wasiat, hibah, dan lain-lain), sementara PPAT (Pejabat Pembuat Akta Tanah) khusus menangani akta terkait tanah seperti jual beli, hibah tanah, dan hak tanggungan. Kantor kami melayani keduanya.",
    },
    {
      question: "Dokumen apa saja yang perlu saya siapkan?",
      answer:
        "Dokumen yang dibutuhkan berbeda tergantung jenis layanan. Silakan hubungi kami agar kami dapat memberikan daftar dokumen yang sesuai dengan kebutuhan Anda.",
    },
    {
      question: "Berapa lama proses pembuatan akta?",
      answer:
        "Lama proses bervariasi tergantung jenis akta dan kelengkapan dokumen. Kami akan menginformasikan estimasi waktu setelah konsultasi awal.",
    },
    {
      question: "Apakah bisa konsultasi terlebih dahulu sebelum memutuskan?",
      answer:
        "Tentu. Anda dapat menghubungi kami via WhatsApp atau form kontak untuk mendiskusikan kebutuhan Anda tanpa komitmen.",
    },
    {
      question: "Wilayah layanan mencakup daerah mana saja?",
      answer:
        "Kami melayani klien di Kabupaten Gorontalo dan sekitarnya, termasuk Kota Gorontalo, Gorontalo Utara, dan Boalemo.",
    },
    {
      question: "Bagaimana cara membuat janji konsultasi?",
      answer:
        "Anda bisa menghubungi kami langsung via tombol WhatsApp di situs ini, mengisi form kontak, atau datang langsung ke kantor pada jam operasional.",
    },
  ] satisfies FaqItem[],
} as const;

/* -------------------------------------------------------------------------- */
/*  Kontak & form                                                             */
/* -------------------------------------------------------------------------- */

export const kontak = {
  title: "Hubungi kami",
  intro:
    "Cara tercepat adalah melalui WhatsApp. Anda juga dapat mengirim pesan lewat form di bawah — kami akan membalas pada jam operasional.",
  whatsappCta: {
    label: "Chat via WhatsApp",
    ariaLabel: "Hubungi kami melalui WhatsApp",
  },
  form: {
    title: "Kirim pesan",
    /** Keterangan wajib/opsional tampil di dekat label, bukan hanya lewat tanda bintang (a11y) */
    fields: {
      nama: {
        label: "Nama",
        placeholder: "Nama lengkap Anda",
        required: true,
        errorRequired: "Nama wajib diisi.",
      },
      kontak: {
        label: "No. WhatsApp atau Email",
        placeholder: "08xx-xxxx-xxxx atau nama@email.com",
        required: true,
        hint: "Kami memakai ini hanya untuk membalas pesan Anda.",
        errorRequired: "Nomor WhatsApp atau email wajib diisi.",
        errorInvalid: "Masukkan nomor WhatsApp atau alamat email yang valid.",
      },
      kebutuhan: {
        label: "Kebutuhan",
        placeholder: "Pilih jenis layanan",
        required: true,
        errorRequired: "Silakan pilih jenis kebutuhan Anda.",
      },
      pesan: {
        label: "Pesan",
        placeholder: "Ceritakan singkat kebutuhan Anda.",
        required: false,
        hint: "Opsional. Mohon tidak mengirim data pribadi sensitif melalui form ini.",
      },
    },
    /** Opsi dropdown "Kebutuhan" — sejalan dengan dua kewenangan di section Layanan */
    kebutuhanOptions: [
      "Pendirian badan usaha (PT, CV, Yayasan, Koperasi)",
      "Perjanjian atau kontrak bisnis",
      "Hibah, wasiat, atau kuasa",
      "Legalisasi / waarmerking dokumen",
      "Perjanjian pra-nikah",
      "Jual beli tanah dan bangunan (AJB)",
      "Hibah tanah / APHB",
      "Hak tanggungan (APHT) / agunan bank",
      "Pengecekan atau balik nama sertifikat",
      "Lainnya / belum yakin",
    ],
    submitLabel: "Kirim pesan",
    submitLoadingLabel: "Mengirim…",
    successMessage:
      "Terima kasih, pesan Anda telah terkirim. Tim kami akan menghubungi Anda secepatnya.",
    errorMessage:
      "Maaf, terjadi kendala saat mengirim pesan. Silakan coba lagi atau hubungi kami langsung via WhatsApp.",
    /** Dipakai saat server membalas 429 (terlalu banyak kiriman dari satu IP) */
    rateLimitMessage:
      "Pesan Anda sudah kami terima beberapa kali. Mohon tunggu beberapa menit, atau hubungi kami langsung via WhatsApp.",
    /** Ditampilkan di atas form saat ada field yang belum benar */
    validationSummary:
      "Mohon periksa kembali kolom yang ditandai di bawah ini.",
    requiredHint: "wajib",
    optionalHint: "opsional",
    privacyNote:
      "Pesan Anda diteruskan langsung ke email kantor dan tidak dibagikan ke pihak lain.",
  },
} as const;

/* -------------------------------------------------------------------------- */
/*  Footer                                                                    */
/* -------------------------------------------------------------------------- */

export const footer = {
  tagline:
    "Melayani jasa kenotariatan dan pertanahan di Kabupaten Gorontalo dan sekitarnya.",
  navTitle: "Halaman",
  contactTitle: "Kontak",
  officeTitle: "Kantor",
  backToTop: "Kembali ke atas",
  /** {year} diganti tahun berjalan saat render */
  copyright: "© {year} Kantor Notaris & PPAT Ahmad Fajri Kahar, S.H., M.Kn.",
  disclaimer:
    "Informasi pada situs ini bersifat umum dan bukan merupakan nasihat hukum atas perkara tertentu.",
} as const;

/* -------------------------------------------------------------------------- */
/*  Checklist placeholder — periksa sebelum go-live                           */
/* -------------------------------------------------------------------------- */

/**
 * Daftar terpusat semua data yang BELUM final.
 * Kosongkan daftar ini (dan set semua `*IsPlaceholder` ke false) sebelum publish.
 */
export const PLACEHOLDER_CHECKLIST = [
  "Testimoni — ketiga entri testimoni.items masih contoh, butuh izin publikasi klien",
  "Foto kantor/tim — belum tersedia; slot gambar disiapkan di komponen (Tahap 3+)",
  "Favicon / logo seal — sementara app/icon.svg dari motif seal; ganti bila ada aset final",
  "OG image — belum ada aset final (Tahap 9)",
] as const;
