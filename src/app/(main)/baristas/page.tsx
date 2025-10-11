"use client";

import { useData } from '@/components/Providers';
import Loading from '../loading';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Instagram, Coffee, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Barista } from '@/lib/types';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import TemplateChatDialog from '@/components/barista/TemplateChatDialog';

const BaristaCard = ({ barista }: { barista: Barista }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <>
      <Dialog>
        <Card className="group flex flex-col text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <DialogTrigger asChild>
            <div className='flex-grow cursor-pointer'>
              <CardHeader className="p-0">
                <div className="relative mx-auto mt-6 h-40 w-40">
                  <Image
                    src={barista.image}
                    alt={barista.name}
                    fill
                    sizes="160px"
                    className="rounded-full object-cover border-4 border-background shadow-md transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="font-headline text-2xl">{barista.name}</CardTitle>
                <CardDescription className="mt-2 text-base text-muted-foreground truncate">{barista.bio}</CardDescription>
              </CardContent>
            </div>
          </DialogTrigger>
          <CardFooter className="p-4 border-t grid grid-cols-2 gap-2">
              <Button variant="ghost" className="w-full" onClick={() => setIsChatOpen(true)}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Kirim Pesan
              </Button>
              <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                      Lihat Profil
                  </Button>
              </DialogTrigger>
          </CardFooter>
        </Card>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="relative mx-auto -mt-16 mb-4 h-32 w-32">
              <Image
                src={barista.image}
                alt={barista.name}
                fill
                sizes="128px"
                className="rounded-full object-cover border-4 border-background shadow-lg"
              />
            </div>
            <DialogTitle className="text-center font-headline text-3xl">{barista.name}</DialogTitle>
            {barista.favoriteDrink && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Coffee className="h-4 w-4" />
                <span className="font-medium">Favorite:</span> {barista.favoriteDrink}
              </div>
            )}
            <DialogDescription className="text-center text-base py-4">
              {barista.bio}
            </DialogDescription>
          </DialogHeader>
          {barista.skills && barista.skills.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 px-6">
                  {barista.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
              </div>
          )}
          {barista.instagram && (
            <div className="flex justify-center pb-4">
              <Link href={`https://instagram.com/${barista.instagram}`} target="_blank" rel="noopener noreferrer">
                <Button>
                  <Instagram className="mr-2 h-4 w-4" />
                  @{barista.instagram}
                </Button>
              </Link>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <TemplateChatDialog isOpen={isChatOpen} setIsOpen={setIsChatOpen} barista={barista} />
    </>
  );
};


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
          <BaristaCard key={barista.id} barista={barista} />
        ))}
      </div>
    </div>
  );
}
