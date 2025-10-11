
"use client";

import { useAuth } from "@/components/Providers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Coffee, PlusCircle, Star } from "lucide-react";

export default function ProfilePage() {
  const { currentUser, addPoints } = useAuth();
  const { toast } = useToast();

  const pointsForFreeCoffee = 2500;

  if (!currentUser) {
    return null; 
  }

  const progress = Math.min((currentUser.points / pointsForFreeCoffee) * 100, 100);

  const handleAddPoints = () => {
    addPoints(currentUser.id, 100);
    toast({
        title: "Poin Ditambahkan!",
        description: "100 poin berhasil ditambahkan ke akun Anda.",
    });
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-8">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                Profil Member
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Selamat datang, {currentUser.fullName}!
            </p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Informasi Akun</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Nama Lengkap</p>
                    <p>{currentUser.fullName}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{currentUser.email}</p>
                </div>
            </CardContent>
        </Card>

        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span>Poin Loyalitas Anda</span>
                </CardTitle>
                <CardDescription>Kumpulkan poin dan tukarkan dengan hadiah menarik.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-5xl font-bold text-primary">{currentUser.points.toLocaleString('id-ID')}</p>
                <p className="text-muted-foreground">Total Poin</p>
            </CardContent>
        </Card>
        
        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-primary" />
                    <span>Hadiah Berikutnya: Kopi Gula Aren Gratis</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Progress value={progress} className="w-full" />
                <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                    <span>{currentUser.points.toLocaleString('id-ID')} Poin</span>
                    <span>{pointsForFreeCoffee.toLocaleString('id-ID')} Poin</span>
                </div>
                {currentUser.points >= pointsForFreeCoffee && (
                    <p className="mt-4 text-center font-semibold text-green-600">
                        Selamat! Anda bisa menukarkan Kopi Gula Aren gratis sekarang!
                    </p>
                )}
            </CardContent>
        </Card>

        <Card className="mt-6 bg-muted/30">
            <CardHeader>
                <CardTitle>Simulasi</CardTitle>
                <CardDescription>
                   Ini adalah alat simulasi untuk developer. Klik untuk menambahkan poin ke akun Anda seolah-olah Anda melakukan pembelian.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleAddPoints} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Simulasikan Tambah 100 Poin
                </Button>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
