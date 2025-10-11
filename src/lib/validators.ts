import { z } from 'zod';
import { medicalLeaveReasons } from './database';

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
  whatsappNumberForAbsence: z.string().optional(),
  playlistUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

export const baristaSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: "Name is required" }),
    bio: z.string().min(1, { message: "Bio is required" }),
    image: z.string().min(1, { message: "Image is required" }),
    instagram: z.string().optional().or(z.literal('')),
    favoriteDrink: z.string().optional(),
    skills: z.array(z.string()).optional(),
});

export const leaveRequestSchema = z.object({
    baristaId: z.string().min(1, "Please select a barista."),
    startDate: z.date({ required_error: 'Start date is required.' }),
    endDate: z.date({ required_error: 'End date is required.' }),
    reason: z.string().min(1, "Please select a reason."),
    doctorNoteImage: z.string().optional(),
}).refine(data => data.endDate >= data.startDate, {
    message: 'End date cannot be before start date',
    path: ['endDate'],
}).refine(data => {
    // If the reason is medical, a doctor's note is required.
    if (medicalLeaveReasons.includes(data.reason)) {
      return !!data.doctorNoteImage;
    }
    return true;
}, {
    message: "Surat keterangan dokter wajib diunggah untuk alasan medis.",
    path: ['doctorNoteImage'],
});

export const jobVacancySchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    type: z.enum(['Full-time', 'Part-time', 'Internship']),
    isActive: z.boolean(),
});

export const customerMessageSchema = z.object({
    customerName: z.string().min(1, { message: "Your name is required." }),
    message: z.string().min(1, { message: "Please select a message." }),
});
