"use client";

import { useData } from '@/components/Providers';
import Loading from '../loading';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function BaristasPage() {
  const { baristas, isLoading } = useData();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <h1 className="mb-8 text-center font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
        Meet Our Baristas
      </h1>
      <p className="mb-12 text-center text-lg text-muted-foreground">
        The talented hands and friendly faces behind your favorite cup of coffee.
      </p>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {baristas.map((barista) => (
          <Card key={barista.id} className="overflow-hidden text-center">
            <CardHeader className="p-0">
                <div className="relative mx-auto mt-6 h-40 w-40">
                    <Image
                        src={barista.image}
                        alt={barista.name}
                        fill
                        sizes="160px"
                        className="rounded-full object-cover border-4 border-background shadow-md"
                    />
                </div>
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="font-headline text-2xl">{barista.name}</CardTitle>
              <CardDescription className="mt-4 text-base text-muted-foreground">{barista.bio}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
