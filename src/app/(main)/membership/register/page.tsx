
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { membershipRegistrationSchema } from '@/lib/validators';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

type RegistrationFormValues = z.infer<typeof membershipRegistrationSchema>;

export default function RegisterPage() {
  const { toast } = useToast();

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(membershipRegistrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
    },
  });

  function onSubmit(data: RegistrationFormValues) {
    console.log(data);
    toast({
      title: "Segera Hadir!",
      description: "Fitur pendaftaran dan login member akan segera tersedia. Terima kasih atas antusiasme Anda!",
    });
  }

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-8 sm:py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Daftar Member</CardTitle>
          <CardDescription>Isi data di bawah ini untuk menjadi bagian dari keluarga Kopimi Kafe.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama lengkap Anda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@anda.com" {...field} />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Tanggal Lahir (untuk hadiah spesial!)</FormLabel>
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
                                <span>Pilih tanggal</span>
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
                                disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
               />
              <Button type="submit" className="w-full">Daftar Sekarang</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
