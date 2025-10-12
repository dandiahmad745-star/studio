
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MenuItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Youtube } from 'lucide-react';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';

interface MenuItemCardProps {
  item: MenuItem;
}

const YouTubeEmbed = ({ url }: { url: string }) => {
    // Regex to extract video ID from various YouTube URL formats
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) {
        return <p className="text-red-500">Invalid YouTube URL provided.</p>;
    }

    return (
        <div className="relative w-full overflow-hidden" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
            <iframe
                className="absolute top-0 left-0 bottom-0 right-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const hasVideo = item.youtubeVideoUrl && item.youtubeVideoUrl.trim() !== '';

  const CardContentTrigger = (
    <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group">
      <CardHeader className="p-0">
        <div className="relative w-full aspect-square">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
            data-ai-hint={`${item.category.toLowerCase()} ${item.name.toLowerCase()}`}
          />
          {hasVideo && (
            <div className="absolute top-2 right-2 flex items-center justify-center rounded-full bg-black/50 p-2 backdrop-blur-sm">
              <Youtube className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
      </CardHeader>
      <div className="flex-grow p-4">
        <CardTitle className="mb-1 font-headline text-xl">{item.name}</CardTitle>
        <CardDescription className="text-sm line-clamp-2">{item.description}</CardDescription>
      </div>
      <CardFooter className="p-4 pt-0">
        <p className="font-semibold text-primary">
          Rp{item.price.toLocaleString('id-ID')}
        </p>
      </CardFooter>
    </Card>
  );

  if (!hasVideo) {
    return CardContentTrigger;
  }

  return (
    <Dialog>
        <DialogTrigger asChild>
            {CardContentTrigger}
        </DialogTrigger>
        <DialogContent className="max-w-2xl p-0">
            <div className="aspect-video">
                {item.youtubeVideoUrl && <YouTubeEmbed url={item.youtubeVideoUrl} />}
            </div>
            <DialogHeader className="p-6">
                <DialogTitle className="font-headline text-3xl">{item.name}</DialogTitle>
                <div className='flex justify-between items-baseline'>
                    <DialogDescription className="text-base">{item.category}</DialogDescription>
                    <p className="font-semibold text-primary text-xl">
                        Rp{item.price.toLocaleString('id-ID')}
                    </p>
                </div>
            </DialogHeader>
            <div className="px-6 pb-6">
                <p className="text-muted-foreground">{item.description}</p>
            </div>
        </DialogContent>
    </Dialog>
  );
}
