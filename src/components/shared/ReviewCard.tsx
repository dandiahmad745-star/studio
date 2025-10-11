import { Review } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, StarHalf } from 'lucide-react';
import { format } from 'date-fns';

interface ReviewCardProps {
  review: Review;
}

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1 text-accent">
      {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="h-5 w-5 fill-current" />)}
      {halfStar && <StarHalf className="h-5 w-5 fill-current" />}
      {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="h-5 w-5" />)}
    </div>
  );
};


export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
            <Avatar>
                <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <p className="font-semibold">{review.customerName}</p>
                    <div className="hidden sm:flex items-center gap-2">
                        <StarRating rating={review.rating} />
                        <span className="text-sm text-muted-foreground">({review.rating.toFixed(1)})</span>
                    </div>
                </div>
                 <p className="text-sm text-muted-foreground">
                    {format(new Date(review.date), 'MMMM d, yyyy')}
                </p>
                <div className="flex sm:hidden items-center gap-2 mt-1">
                    <StarRating rating={review.rating} />
                </div>
            </div>
        </div>
        <p className="text-muted-foreground">{review.comment}</p>
        {review.reply && (
            <div className="ml-4 mt-2 rounded-lg border-l-4 border-primary bg-primary/5 p-4">
                <p className="font-semibold text-primary">Reply from Kopimi Kafe</p>
                <p className="text-sm text-primary/80">{review.reply}</p>
            </div>
        )}
    </div>
  );
}
