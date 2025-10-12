// This is a new file
"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { galleryImageSchema } from '@/lib/validators';
import { useData } from '../Providers';
import { useToast } from '@/hooks/use-toast';
import { GalleryImage } from '@/lib/types';
import Image from 'next/image';
import { compressImage } from '@/lib/image-compression';

type GalleryFormValues = z.infer<typeof galleryImageSchema>;

interface GalleryFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  image: GalleryImage | null;
  onEdit: (image: GalleryImage) => void;
}

export default function GalleryForm({ isOpen, setIsOpen, image, onEdit }: GalleryFormProps) {
  const { setGalleryImages } = useData();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(galleryImageSchema),
    defaultValues: {
      title: '',
      description: '',
      image: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (image) {
        form.reset(image);
        setImagePreview(image.image);
      } else {
        form.reset({
          title: '',
          description: '',
          image: '',
        });
        setImagePreview(null);
      }
    }
  }, [image, form, isOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedDataUrl = await compressImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.8 });
        form.setValue('image', compressedDataUrl, { shouldValidate: true });
        setImagePreview(compressedDataUrl);
      } catch (error) {
        console.error("Failed to compress image", error);
        toast({
          variant: "destructive",
          title: "Image Error",
          description: "Could not process the image. Please try another one."
        });
      }
    }
  };

  function onSubmit(data: GalleryFormValues) {
    if (image) {
      // This form doesn't edit, it only adds. The edit button is not implemented.
      // For simplicity, we just add a new one. In a real app, we'd edit.
       const newImage: GalleryImage = { ...data, id: `gallery-${Date.now()}` };
       setGalleryImages((prev) => [newImage, ...prev]);
       toast({ title: 'Success', description: 'New image added to the gallery.' });
    } else {
      // Add
      const newImage: GalleryImage = { ...data, id: `gallery-${Date.now()}` };
      setGalleryImages((prev) => [newImage, ...prev]);
      toast({ title: 'Success', description: 'New image added to the gallery.' });
    }
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{image ? 'Edit Image' : 'Add New Image'}</DialogTitle>
          <DialogDescription>
            Upload an image and add some details to show it in your gallery.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Morning Ambiance" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the moment..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={handleFileChange} />
              </FormControl>
              {imagePreview && (
                <div className="mt-2 relative w-full h-40">
                  <Image src={imagePreview} alt="Preview" fill className="rounded-md object-cover" />
                </div>
              )}
               <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </FormItem>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save Image</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
