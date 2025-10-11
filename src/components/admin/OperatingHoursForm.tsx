"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { operatingHoursSchema } from '@/lib/validators';
import { useData } from '../Providers';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { OperatingHours } from '@/lib/types';
import { cn } from '@/lib/utils';
import { initialShopSettings } from '@/lib/database';

type OperatingHoursFormValues = z.infer<typeof operatingHoursSchema>;

const daysOfWeek: (keyof OperatingHours)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function OperatingHoursForm() {
  const { settings, setSettings } = useData();
  const { toast } = useToast();

  const form = useForm<OperatingHoursFormValues>({
    resolver: zodResolver(operatingHoursSchema),
    defaultValues: settings.operatingHours || initialShopSettings.operatingHours,
  });

  useEffect(() => {
    // Ensure form values are never undefined
    const currentHours = settings.operatingHours || initialShopSettings.operatingHours;
    const sanitizedHours = daysOfWeek.reduce((acc, day) => {
        const dayHours = currentHours[day];
        acc[day] = {
            isOpen: dayHours.isOpen,
            open: dayHours.open || '',
            close: dayHours.close || '',
        };
        return acc;
    }, {} as OperatingHoursFormValues);
    form.reset(sanitizedHours);
  }, [settings.operatingHours, form]);

  function onSubmit(data: OperatingHoursFormValues) {
    setSettings(prev => ({
        ...prev,
        operatingHours: data,
    }));
    toast({
      title: 'Hours Saved',
      description: 'Your operating hours have been updated.',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4 rounded-md border p-4">
            {daysOfWeek.map((day, index) => {
                const isChecked = form.watch(`${day}.isOpen`);
                return (
                    <div key={day} className="grid grid-cols-3 items-center gap-4">
                        <div className="flex items-center gap-2">
                             <FormField
                                control={form.control}
                                name={`${day}.isOpen`}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="capitalize font-normal">{day}</FormLabel>
                                    </FormItem>
                                )}
                            />
                        </div>
                       
                        <div className={cn("col-span-2 grid grid-cols-2 gap-2 transition-opacity", !isChecked && "opacity-50 pointer-events-none")}>
                             <FormField
                                control={form.control}
                                name={`${day}.open`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`${day}.close`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                )
            })}
        </div>

        <div className="flex justify-end">
            <Button type="submit">Save Hours</Button>
        </div>
      </form>
    </Form>
  );
}
