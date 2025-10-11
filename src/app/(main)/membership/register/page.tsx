
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { membershipRegistrationSchema } from '@/lib/validators';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type RegistrationFormValues = z.infer<typeof membershipRegistrationSchema>;

export default function RegisterPage() {
  const { toast } = useToast();

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(membershipRegistrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      nickname: '',
      favoriteDrink: '',
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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                    name="nickname"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nama Panggilan</FormLabel>
                        <FormControl>
                        <Input placeholder="Panggilan akrab" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

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

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Tanggal Lahir</FormLabel>
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
                             <FormDescription className="text-xs">
                                Untuk kejutan spesial di hari ulang tahunmu!
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="favoriteDrink"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Minuman Favorit</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Kopi Susu, V60" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
              
               <FormField
                control={form.control}
                name="visitTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kapan Biasanya Kamu Mampir?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih waktu favoritmu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pagi">Pagi (08:00 - 12:00)</SelectItem>
                        <SelectItem value="Siang">Siang (12:00 - 17:00)</SelectItem>
                        <SelectItem value="Malam">Malam (17:00 - 22:00)</SelectItem>
                        <SelectItem value="Tidak Tentu">Tidak Tentu</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="mainReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apa yang paling kamu cari di kafe kami?</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Contoh: Tempat kerja yang nyaman, kopi yang enak, spot foto, dll." {...field} />
                    </FormControl>
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
