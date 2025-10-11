"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { promotionSchema } from '@/lib/validators';
import { useData } from '../Providers';
import { useToast } from '@/hooks/use-toast';
import { Promotion } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';

type PromoFormValues = z.infer<typeof promotionSchema>;

interface PromoFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  promo: Promotion | null;
}

export default function PromoForm({ isOpen, setIsOpen, promo }: PromoFormProps) {
  const { setPromotions } = useData();
  const { toast } = useToast();

  const form = useForm<PromoFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: promo 
      ? { ...promo, validFrom: new Date(promo.validFrom), validUntil: new Date(promo.validUntil) } 
      : { title: '', description: '' },
  });

  useEffect(() => {
    if (isOpen) {
      if (promo) {
        form.reset({
          ...promo,
          validFrom: new Date(promo.validFrom),
          validUntil: new Date(promo.validUntil),
        });
      } else {
        form.reset({
          title: '',
          description: '',
          validFrom: undefined,
          validUntil: undefined,
        });
      }
    }
  }, [promo, form, isOpen]);

  function onSubmit(data: PromoFormValues) {
    const promotionData = {
        ...data,
        validFrom: data.validFrom.toISOString(),
        validUntil: data.validUntil.toISOString(),
    };

    if (promo) {
      // Edit
      setPromotions((prev) => prev.map((p) => (p.id === promo.id ? { ...p, ...promotionData, id: p.id } : p)));
      toast({ title: 'Success', description: 'Promotion updated.' });
    } else {
      // Add
      const newPromo = { ...promotionData, id: `promo-${Date.now()}` };
      setPromotions((prev) => [newPromo, ...prev]);
      toast({ title: 'Success', description: 'New promotion added.' });
    }
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{promo ? 'Edit Promotion' : 'Add New Promotion'}</DialogTitle>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="validFrom"
                render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Valid From</FormLabel>
                    <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                            )}
                        >
                            {field.value ? (
                            format(field.value, "PPP")
                            ) : (
                            <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        />
                    </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="validUntil"
                render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Valid Until</FormLabel>
                    <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                            )}
                        >
                            {field.value ? (
                            format(field.value, "PPP")
                            ) : (
                            <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        />
                    </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
                )}
            />
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
