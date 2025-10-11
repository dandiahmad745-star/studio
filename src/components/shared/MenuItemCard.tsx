import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MenuItem } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={`${item.category.toLowerCase()} ${item.name.toLowerCase()}`}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="mb-1 font-headline text-xl">{item.name}</CardTitle>
        <CardDescription className="text-sm">{item.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <p className="font-semibold text-primary">
          Rp{item.price.toLocaleString('id-ID')}
        </p>
      </CardFooter>
    </Card>
  );
}
