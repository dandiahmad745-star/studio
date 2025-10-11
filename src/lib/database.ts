import { MenuItem, Promotion, Review, ShopSettings } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find((img) => img.id === id)?.imageUrl || '';

export const initialMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Espresso',
    description: 'A concentrated coffee beverage brewed by forcing a small amount of nearly boiling water through finely-ground coffee beans.',
    price: 2.5,
    category: 'Coffee',
    image: findImage('coffee-2'),
  },
  {
    id: '2',
    name: 'Latte',
    description: 'A coffee drink made with espresso and steamed milk, topped with a light layer of foam.',
    price: 3.5,
    category: 'Coffee',
    image: findImage('coffee-1'),
  },
  {
    id: '3',
    name: 'Croissant',
    description: 'A buttery, flaky, viennoiserie pastry inspired by the shape of the Austrian kipferl.',
    price: 2.0,
    category: 'Pastry',
    image: findImage('pastry-1'),
  },
  {
    id: '4',
    name: 'Club Sandwich',
    description: 'A delicious sandwich with turkey, bacon, lettuce, tomato, and mayonnaise.',
    price: 7.5,
    category: 'Sandwich',
    image: findImage('sandwich-1'),
  },
  {
    id: '5',
    name: 'Orange Juice',
    description: 'Freshly squeezed orange juice, full of vitamins.',
    price: 4.0,
    category: 'Beverage',
    image: findImage('juice-1'),
  },
];

export const initialPromotions: Promotion[] = [
  {
    id: 'promo-1',
    title: 'Happy Hour!',
    description: 'Get 50% off all coffee drinks from 3 PM to 5 PM on weekdays.',
    validFrom: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    validUntil: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
  },
  {
    id: 'promo-2',
    title: 'Pastry Combo',
    description: 'Buy any coffee and get a croissant for just $1.',
    validFrom: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    validUntil: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
  },
];

export const initialReviews: Review[] = [
  {
    id: 'review-1',
    customerName: 'Alice',
    rating: 5,
    comment: 'The best coffee in town! The atmosphere is so cozy.',
    date: new Date().toISOString(),
    reply: 'Thank you, Alice! We are so glad you enjoyed your visit.'
  },
  {
    id: 'review-2',
    customerName: 'Bob',
    rating: 4,
    comment: 'Great place to work and have a cup of joe. The wifi is fast.',
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
];

export const initialShopSettings: ShopSettings = {
  name: 'Kopimi Kafe',
  address: '123 Coffee Lane, Flavor Town, 12345',
  phone: '555-123-4567',
  email: 'hello@kopimikafe.com',
  logo: findImage('cafe-logo'),
};
