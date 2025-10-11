import { z } from 'zod';

export const menuItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number' }),
  category: z.string().min(1, { message: 'Category is required' }),
  image: z.string().min(1, { message: 'Image is required' }),
});

export const promotionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  validFrom: z.date({ required_error: 'Start date is required.' }),
  validUntil: z.date({ required_error: 'End date is required.' }),
}).refine(data => !data.validFrom || !data.validUntil || data.validUntil > data.validFrom, {
  message: 'End date must be after start date',
  path: ['validUntil'],
});

export const reviewSchema = z.object({
  id: z.string().optional(),
  customerName: z.string().min(1, { message: 'Your name is required' }),
  rating: z.coerce.number().min(1, { message: 'Rating is required' }).max(5, { message: 'Rating must be between 1 and 5' }),
  comment: z.string().min(1, { message: 'A comment is required' }),
  date: z.string().optional(),
  reply: z.string().optional(),
});

export const reviewReplySchema = z.object({
  reply: z.string().min(1, { message: 'Reply cannot be empty' }),
});

const dayHoursSchema = z.object({
    isOpen: z.boolean(),
    open: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time format (HH:mm)" }).or(z.literal('')),
    close: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time format (HH:mm)" }).or(z.literal('')),
});

export const operatingHoursSchema = z.object({
  monday: dayHoursSchema,
  tuesday: dayHoursSchema,
  wednesday: dayHoursSchema,
  thursday: dayHoursSchema,
  friday: dayHoursSchema,
  saturday: dayHoursSchema,
  sunday: dayHoursSchema,
});


export const settingsSchema = z.object({
  name: z.string().min(1, { message: 'Shop name is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  phone: z.string().min(1, { message: 'Phone number is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  logo: z.string().min(1, { message: 'Logo is required' }),
  operatingHours: operatingHoursSchema.optional(),
});

export const baristaSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: "Name is required" }),
    bio: z.string().min(1, { message: "Bio is required" }),
    image: z.string().min(1, { message: "Image is required" }),
    instagram: z.string().optional(),
});
