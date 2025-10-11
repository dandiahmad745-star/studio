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
import { baristaSchema } from '@/lib/validators';
import { useData } from '../Providers';
import { useToast } from '@/hooks/use-toast';
import { Barista } from '@/lib/types';
import Image from 'next/image';

type BaristaFormValues = z.infer<typeof baristaSchema>;

interface BaristaFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  barista: Barista | null;
}

export default function BaristaForm({ isOpen, setIsOpen, barista }: BaristaFormProps) {
  const { setBaristas } = useData();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<BaristaFormValues>({
    resolver: zodResolver(baristaSchema),
    defaultValues: barista || {
      name: '',
      bio: '',
      image: '',
      instagram: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (barista) {
        form.reset(barista);
        setImagePreview(barista.image);
      } else {
        form.reset({
          name: '',
          bio: '',
          image: '',
          instagram: '',
        });
        setImagePreview(null);
      }
    }
  }, [barista, form, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        form.setValue('image', result, { shouldValidate: true });
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(data: BaristaFormValues) {
    if (barista) {
      // Edit
      setBaristas((prev) => prev.map((b) => (b.id === barista.id ? { ...b, ...data, id: b.id } : b)));
      toast({ title: 'Success', description: 'Barista data updated.' });
    } else {
      // Add
      const newBarista = { ...data, id: `barista-${Date.now()}` };
      setBaristas((prev) => [newBarista, ...prev]);
      toast({ title: 'Success', description: 'New barista added.' });
    }
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{barista ? 'Edit Barista' : 'Add New Barista'}</DialogTitle>
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
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram Handle (without @)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="rian.kopi" />
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
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
