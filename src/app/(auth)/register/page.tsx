
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { registrationSchema } from '@/lib/validators';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/Providers';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function RegisterPage() {
  const { toast } = useToast();
  const { customerRegister } = useAuth();
  const router = useRouter();

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(data: RegistrationFormValues) {
    const { success, message } = customerRegister(data.fullName, data.email, data.password);
    if (success) {
      toast({
        title: "Pendaftaran Berhasil!",
        description: "Selamat datang! Anda akan diarahkan ke halaman profil.",
      });
      router.push('/profile');
    } else {
      toast({
        variant: "destructive",
        title: "Pendaftaran Gagal",
        description: message,
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Daftar Member</CardTitle>
          <CardDescription>Buat akun gratis untuk mulai mengumpulkan poin.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Minimal 6 karakter" {...field} />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Ulangi password" {...field} />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">Daftar Sekarang</Button>
            </form>
          </Form>
           <p className="mt-4 text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Login di sini
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
