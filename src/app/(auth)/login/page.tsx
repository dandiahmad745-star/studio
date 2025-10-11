
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loginSchema } from '@/lib/validators';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/Providers';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const { customerLogin } = useAuth();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: LoginFormValues) {
    if (customerLogin(data.email, data.password)) {
      toast({
        title: 'Login Berhasil!',
        description: 'Selamat datang kembali!',
      });
      router.push('/profile');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Gagal',
        description: 'Email atau password salah. Silakan coba lagi.',
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Member Login</CardTitle>
          <CardDescription>Masuk untuk melihat poin dan profil Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
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
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
