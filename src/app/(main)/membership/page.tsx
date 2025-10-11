"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

const membershipTiers = [
    {
        name: "Kopi Kawan",
        price: "Gratis",
        description: "Untuk penikmat kopi kasual.",
        features: [
            "Newsletter mingguan dengan info kopi terbaru",
            "Akses ke acara komunitas",
            "Notifikasi promo lebih awal",
        ],
        cta: "Daftar Sekarang",
        isPopular: false,
        href: "/membership/register"
    },
    {
        name: "Kopi Sahabat",
        price: "Rp 50.000",
        priceSuffix: "/bulan",
        description: "Untuk penggemar kopi sejati.",
        features: [
            "Semua keuntungan Kopi Kawan",
            "Diskon 10% untuk semua minuman",
            "Satu minuman gratis di bulan ulang tahunmu",
            "Akses ke workshop dasar",
        ],
        cta: "Pilih Sahabat",
        isPopular: true,
        href: "/membership/register"
    },
    {
        name: "Kopi Keluarga",
        price: "Rp 150.000",
        priceSuffix: "/bulan",
        description: "Pengalaman kopi paling premium.",
        features: [
            "Semua keuntungan Kopi Sahabat",
            "Diskon 15% untuk semua item",
            "Akses ke semua workshop",
            "Merchandise eksklusif setiap 3 bulan",
        ],
        cta: "Pilih Keluarga",
        isPopular: false,
        href: "/membership/register"
    },
];

export default function MembershipPage() {
    return (
        <div className="container mx-auto px-4 py-8 sm:py-12">
            <div className="text-center mb-12">
                <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                    Jadi Bagian dari Keluarga Kami
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Pilih tingkatan membership yang paling cocok untukmu dan nikmati berbagai keuntungan eksklusif.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {membershipTiers.map((tier) => (
                    <Card key={tier.name} className={`flex flex-col ${tier.isPopular ? 'border-primary border-2 shadow-lg' : ''}`}>
                        {tier.isPopular && (
                            <div className="text-center py-1 bg-primary text-primary-foreground font-semibold text-sm rounded-t-lg">Paling Populer</div>
                        )}
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">{tier.name}</CardTitle>
                            <CardDescription>{tier.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="mb-6">
                                <span className="text-4xl font-bold">{tier.price}</span>
                                {tier.priceSuffix && <span className="text-muted-foreground">{tier.priceSuffix}</span>}
                            </div>
                            <ul className="space-y-3">
                                {tier.features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Link href={tier.href} className="w-full">
                                <Button className="w-full" variant={tier.isPopular ? 'default' : 'outline'}>
                                    {tier.cta}
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
