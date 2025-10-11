import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Promotion } from '@/lib/types';
import { format } from 'date-fns';

interface PromoCardProps {
  promo: Promotion;
}

export default function PromoCard({ promo }: PromoCardProps) {
  const validFrom = format(new Date(promo.validFrom), 'MMM d, yyyy');
  const validUntil = format(new Date(promo.validUntil), 'MMM d, yyyy');

  return (
    <Card className="flex h-full flex-col border-l-4 border-accent bg-accent/5">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-accent-foreground">{promo.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{promo.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Valid from {validFrom} to {validUntil}
        </p>
      </CardFooter>
    </Card>
  );
}
