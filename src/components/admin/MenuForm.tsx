"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { menuItemSchema } from '@/lib/validators';
import { useData } from '../Providers';
import { useToast } from '@/hooks/use-toast';
import { MenuItem } from '@/lib/types';
import Image from 'next/image';

type MenuFormValues = z.infer<typeof menuItemSchema>;

interface MenuFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  item: MenuItem | null;
}

export default function MenuForm({ isOpen, setIsOpen, item }: MenuFormProps) {
  const { setMenuItems } = useData();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: item || {
      name: '',
      description: '',
      price: 0,
      category: '',
      image: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (item) {
        form.reset(item);
        setImagePreview(item.image);
      } else {
        form.reset({
          name: '',
          description: '',
          price: 0,
          category: '',
          image: '',
        });
        setImagePreview(null);
      }
    }
  }, [item, form, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        form.setValue('image', result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(data: MenuFormValues) {
    if (item) {
      // Edit
      setMenuItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, ...data } : i)));
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <Input type="number" step="1" {...field} />
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
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                <FormMessage />
            </FormItem>
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
