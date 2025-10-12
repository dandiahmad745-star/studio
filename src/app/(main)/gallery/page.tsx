// This is a new file
"use client";

import { useData } from "@/components/Providers";
import Loading from '../loading';
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GalleryImage } from "@/lib/types";

const GalleryItem = ({ image }: { image: GalleryImage }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group relative cursor-pointer break-inside-avoid">
          <Image
            src={image.image}
            alt={image.title}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto rounded-lg shadow-md"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center p-4">
            <div className="text-center text-white">
              <h3 className="font-bold text-lg">{image.title}</h3>
              <p className="text-sm">{image.description}</p>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-0">
        <div className="relative w-full aspect-video">
            <Image
                src={image.image}
                alt={image.title}
                fill
                className="object-contain"
            />
        </div>
        <DialogHeader className="p-6 pt-2">
            <DialogTitle>{image.title}</DialogTitle>
            <DialogDescription>{image.description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};


export default function GalleryPage() {
  const { galleryImages, isLoading } = useData();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-12">
        <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Gallery
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A glimpse into our world. The moments, the details, and the coffee that make us who we are.
        </p>
      </div>

      {galleryImages.length > 0 ? (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {galleryImages.map((image) => (
            <GalleryItem key={image.id} image={image} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground border-dashed border-2 rounded-lg p-12">
          <p className="text-lg font-medium">Our gallery is empty for now.</p>
          <p>We're busy making moments worth capturing. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
