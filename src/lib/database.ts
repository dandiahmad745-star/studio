import { MenuItem, Promotion, Review, ShopSettings, Barista, Schedule, LeaveRequest, JobVacancy, CustomerMessage, Database } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find((img) => img.id === id)?.imageUrl || '';

const initialMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Espresso',
    description: 'Minuman kopi konsentrat yang diseduh dengan menyemprotkan sedikit air yang hampir mendidih melalui biji kopi yang digiling halus.',
    price: 25000,
    category: 'Minuman',
    image: findImage('coffee-2'),
  },
  {
    id: '2',
    name: 'Latte',
    description: 'Minuman kopi yang dibuat dengan espresso dan susu kukus, dengan lapisan busa tipis di atasnya.',
    price: 35000,
    category: 'Minuman',
    image: findImage('coffee-1'),
  },
  {
    id: '3',
    name: 'Croissant',
    description: 'Roti mentega yang renyah dan bersisik, terinspirasi dari bentuk kipferl Austria.',
    price: 20000,
    category: 'Makanan',
    image: findImage('pastry-1'),
  },
  {
    id: '4',
    name: 'Club Sandwich',
    description: 'Sandwich lezat dengan kalkun, bacon, selada, tomat, dan mayones.',
    price: 75000,
    category: 'Makanan',
    image: findImage('sandwich-1'),
  },
  {
    id: '5',
    name: 'Orange Juice',
    description: 'Jus jeruk peras segar, penuh vitamin.',
    price: 40000,
    category: 'Minuman',
    image: findImage('juice-1'),
  },
];

const initialPromotions: Promotion[] = [
  {
    id: 'promo-1',
    title: 'Happy Hour!',
    description: 'Dapatkan diskon 50% untuk semua minuman kopi dari jam 3 sore sampai 5 sore di hari kerja.',
    validFrom: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    validUntil: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
  },
  {
    id: 'promo-2',
    title: 'Promo Pastry',
    description: 'Beli kopi apa saja dan dapatkan croissant hanya dengan Rp 10.000.',
    validFrom: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    validUntil: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
  },
];

const initialReviews: Review[] = [
  {
    id: 'review-1',
    customerName: 'Alice',
    rating: 5,
    comment: 'Kopi terbaik di kota! Suasananya sangat nyaman.',
    date: new Date().toISOString(),
    reply: 'Terima kasih, Alice! Kami sangat senang Anda menikmati kunjungan Anda.'
  },
  {
    id: 'review-2',
    customerName: 'Bob',
    rating: 4,
    comment: 'Tempat yang bagus untuk bekerja sambil minum secangkir kopi. Wifinya cepat.',
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
];

export const initialShopSettings: ShopSettings = {
  name: 'Kopimi Kafe',
  address: '123 Coffee Lane, Flavor Town, 12345',
  phone: '555-123-4567',
  email: 'hello@kopimikafe.com',
  logo: findImage('cafe-logo'),
  operatingHours: {
    monday: { isOpen: true, open: '08:00', close: '22:00' },
    tuesday: { isOpen: true, open: '08:00', close: '22:00' },
    wednesday: { isOpen: true, open: '08:00', close: '22:00' },
    thursday: { isOpen: true, open: '08:00', close: '22:00' },
    friday: { isOpen: true, open: '08:00', close: '22:00' },
    saturday: { isOpen: true, open: '09:00', close: '23:00' },
    sunday: { isOpen: false, open: '09:00', close: '23:00' },
  },
  whatsappNumberForAbsence: '6285848651208',
  playlistUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
};

const initialBaristas: Barista[] = [
    {
      id: 'barista-1',
      name: 'Rian',
      bio: 'Rian adalah kepala barista kami dengan pengalaman lebih dari 5 tahun. Spesialisasinya adalah latte art dan manual brew. Dia percaya bahwa setiap cangkir kopi adalah sebuah cerita yang menunggu untuk dinikmati.',
      image: findImage('barista-1'),
      instagram: 'rian.kopi',
      favoriteDrink: 'V60',
      skills: ['Latte Art', 'Manual Brew'],
    },
    {
      id: 'barista-2',
      name: 'Sari',
      bio: 'Sari sangat bersemangat tentang kopi dan suka bereksperimen dengan resep-resep baru. Jangan ragu untuk bertanya rekomendasinya! Dia selalu senang berbagi pengetahuannya tentang biji kopi dari seluruh dunia.',
      image: findImage('barista-2'),
      instagram: 'sari.brews',
      favoriteDrink: 'Caramel Macchiato',
      skills: ['Espresso Expert', 'Recipe Creation'],
    },
];

const initialCategories: string[] = ["Makanan", "Minuman", "Snack"];

const initialSchedules: Schedule[] = [];
const initialLeaveRequests: LeaveRequest[] = [];
const initialCustomerMessages: CustomerMessage[] = [];

const initialJobVacancies: JobVacancy[] = [
    {
        id: 'job-1',
        title: 'Barista (Full-time)',
        description: 'Kami mencari Barista berpengalaman untuk bergabung dengan tim kami. Anda harus bersemangat tentang kopi, ramah, dan dapat bekerja dalam lingkungan yang serba cepat. Pengalaman sebelumnya diutamakan.',
        type: 'Full-time',
        postedDate: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
        isActive: true,
    },
    {
        id: 'job-2',
        title: 'Kitchen Staff (Part-time)',
        description: 'Membantu persiapan makanan ringan dan menjaga kebersihan area dapur. Cocok untuk mahasiswa atau yang mencari pekerjaan paruh waktu. Tidak memerlukan pengalaman, yang penting mau belajar.',
        type: 'Part-time',
        postedDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
        isActive: true,
    },
];

export const initialDatabase: Database = {
    menuItems: initialMenuItems,
    promotions: initialPromotions,
    reviews: initialReviews,
    settings: initialShopSettings,
    baristas: initialBaristas,
    categories: initialCategories,
    schedules: initialSchedules,
    leaveRequests: initialLeaveRequests,
    jobVacancies: initialJobVacancies,
    customerMessages: initialCustomerMessages
};


export const leaveReasons = [
    'Cuti Tahunan', 'Sakit dengan Surat Dokter', 'Sakit tanpa Surat Dokter', 'Keperluan Keluarga Mendesak', 'Pernikahan', 
    'Melahirkan/Paternity', 'Duka Cita', 'Tugas Luar', 'Pendidikan/Pelatihan', 'Acara Keagamaan', 
    'Mengurus Dokumen Penting', 'Bencana Alam', 'Perbaikan Rumah Darurat', 'Menghadiri Pernikahan Kerabat', 'Merawat Anggota Keluarga Sakit',
    'Janji Temu Medis', 'Kelelahan (Burnout)', 'Hari Kesehatan Mental', 'Libur Tambahan (Unpaid)', 'Izin Setengah Hari (Pagi)',
    'Izin Setengah Hari (Siang)', 'Kerja dari Rumah (jika memungkinkan)', 'Kecelakaan', 'Menghadiri Wisuda', 'Libur Nasional Tambahan',
    'Menjadi Saksi di Pengadilan', 'Pemulihan Pasca Sakit', 'Donor Darah', 'Program Relawan', 'Urusan Bank/Pajak',
    'Kendaraan Bermasalah', 'Menghadiri Seminar', 'Ujian Akademis', 'Acara Sekolah Anak', 'Isolasi Mandiri',
    'Vaksinasi COVID-19', 'Efek Samping Vaksin', 'Keperluan Adat', 'Lain-lain (Memerlukan Keterangan)', 'Cuti Tidak Dibayar'
];

export const medicalLeaveReasons = [
    'Sakit dengan Surat Dokter',
    'Janji Temu Medis',
    'Kecelakaan',
    'Pemulihan Pasca Sakit',
    'Isolasi Mandiri',
    'Vaksinasi COVID-19',
    'Efek Samping Vaksin',
    'Donor Darah',
];
