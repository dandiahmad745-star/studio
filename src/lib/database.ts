import { MenuItem, Promotion, Review, ShopSettings, Barista } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find((img) => img.id === id)?.imageUrl || '';

export const initialMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Espresso',
    description: 'Minuman kopi konsentrat yang diseduh dengan menyemprotkan sedikit air yang hampir mendidih melalui biji kopi yang digiling halus.',
    price: 25000,
    category: 'Coffee',
    image: findImage('coffee-2'),
  },
  {
    id: '2',
    name: 'Latte',
    description: 'Minuman kopi yang dibuat dengan espresso dan susu kukus, dengan lapisan busa tipis di atasnya.',
    price: 35000,
    category: 'Coffee',
    image: findImage('coffee-1'),
  },
  {
    id: '3',
    name: 'Croissant',
    description: 'Roti mentega yang renyah dan bersisik, terinspirasi dari bentuk kipferl Austria.',
    price: 20000,
    category: 'Pastry',
    image: findImage('pastry-1'),
  },
  {
    id: '4',
    name: 'Club Sandwich',
    description: 'Sandwich lezat dengan kalkun, bacon, selada, tomat, dan mayones.',
    price: 75000,
    category: 'Sandwich',
    image: findImage('sandwich-1'),
  },
  {
    id: '5',
    name: 'Orange Juice',
    description: 'Jus jeruk peras segar, penuh vitamin.',
    price: 40000,
    category: 'Beverage',
    image: findImage('juice-1'),
  },
];

export const initialPromotions: Promotion[] = [
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

export const initialReviews: Review[] = [
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
  }
};

export const initialBaristas: Barista[] = [
    {
      id: 'barista-1',
      name: 'Rian',
      bio: 'Rian adalah kepala barista kami dengan pengalaman lebih dari 5 tahun. Spesialisasinya adalah latte art dan manual brew. Dia percaya bahwa setiap cangkir kopi adalah sebuah cerita yang menunggu untuk dinikmati.',
      image: findImage('barista-1'),
      instagram: 'rian.kopi',
    },
    {
      id: 'barista-2',
      name: 'Sari',
      bio: 'Sari sangat bersemangat tentang kopi dan suka bereksperimen dengan resep-resep baru. Jangan ragu untuk bertanya rekomendasinya! Dia selalu senang berbagi pengetahuannya tentang biji kopi dari seluruh dunia.',
      image: findImage('barista-2'),
      instagram: 'sari.brews',
    },
];
