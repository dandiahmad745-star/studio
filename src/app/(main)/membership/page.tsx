
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Gift, Zap } from "lucide-react";
import Link from "next/link";

const loyaltyProgram = {
    name: "Kopi Kawan",
    description: "Program loyalitas gratis untuk pelanggan setia Kopimi Kafe. Kumpulkan poin dan tukarkan dengan hadiah menarik!",
    features: [
        "Keanggotaan gratis seumur hidup",
        "Dapatkan 100 poin untuk setiap pembelian kelipatan Rp 10.000",
        "Tukarkan poin dengan produk gratis atau diskon",
        "Kejutan spesial di hari ulang tahunmu",
        "Akses ke promo khusus member",
    ],
    cta: "Gabung Sekarang, Gratis!",
    href: "/membership/register"
};

export default function MembershipPage() {
    return (
        <div className="bg-muted/30">
            <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-8 sm:py-12">
                <Card className="w-full max-w-2xl overflow-hidden shadow-lg">
                    <div className="grid md:grid-cols-2">
                        <div className="p-8">
                            <CardHeader className="p-0">
                                <div className="mb-4 flex items-center gap-3">
                                    <Gift className="h-8 w-8 text-primary" />
                                    <CardTitle className="font-headline text-3xl">{loyaltyProgram.name}</CardTitle>
                                </div>
                                <CardDescription className="text-base">{loyaltyProgram.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="mt-6 p-0">
                                <ul className="space-y-4">
                                    {loyaltyProgram.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </div>
                        <div className="flex flex-col justify-between bg-muted/50 p-8">
                            <div className="space-y-4 text-center">
                                <Zap className="mx-auto h-12 w-12 text-accent" />
                                <h3 className="font-headline text-2xl">Cara Kerja Poin</h3>
                                <p className="text-muted-foreground">
                                    Poin akan diinput oleh kasir kami setiap kali Anda melakukan transaksi. Cukup sebutkan nomor telepon atau email terdaftar Anda.
                                </p>
                                <div className="rounded-lg border bg-background p-4">
                                    <p className="font-bold text-primary">100 Poin</p>
                                    <p className="text-sm">untuk setiap</p>
                                    <p className="font-semibold">Rp 10.000 Pembelian</p>
                                </div>
                            </div>
                            <Link href={loyaltyProgram.href} className="w-full mt-6">
                                <Button className="w-full" size="lg">
                                    {loyaltyProgram.cta}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
