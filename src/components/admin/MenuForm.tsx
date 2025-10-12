
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
import { menuItemSchema } from '@/lib/validators';
import { useData } from '../Providers';
import { useToast } from '@/hooks/use-toast';
import { MenuItem } from '@/lib/types';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { compressImage } from '@/lib/image-compression';

type MenuFormValues = z.infer<typeof menuItemSchema>;

interface MenuFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  item: MenuItem | null;
}

export default function MenuForm({ isOpen, setIsOpen, item }: MenuFormProps) {
  const { setMenuItems, categories } = useData();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      image: '',
      youtubeVideoUrl: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (item) {
        form.reset({
          ...item,
          youtubeVideoUrl: item.youtubeVideoUrl || '',
        });
        setImagePreview(item.image);
      } else {
        form.reset({
          name: '',
          description: '',
          price: 0,
          category: '',
          image: '',
          youtubeVideoUrl: '',
        });
        setImagePreview(null);
      }
    }
  }, [item, form, isOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedDataUrl = await compressImage(file, { maxWidth: 800, maxHeight: 800 });
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

  function onSubmit(data: MenuFormValues) {
    if (item) {
      // Edit
      setMenuItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, ...data, id: i.id } : i)));
      toast({ title: 'Success', description: 'Menu item updated.' });
    } else {
      // Add
      const newItem = { ...data, id: `menu-${Date.now()}` };
      setMenuItems((prev) => [newItem, ...prev]);
      toast({ title: 'Success', description: 'New menu item added.' });
    }
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md grid-rows-[auto_1fr_auto] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-rows-[1fr_auto] gap-4 overflow-hidden">
            <div className="space-y-4 overflow-y-auto pr-2">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input {...field} />
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
                        <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                        <Input type="number" step="1" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
                <FormField
                    control={form.control}
                    name="youtubeVideoUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>YouTube Video URL (Optional)</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="https://www.youtube.com/watch?v=..." />
                        </FormControl>
                         <DialogDescription className="text-xs">
                            Paste a link to a YouTube video for this item.
                        </DialogDescription>
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
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
