"use client";

import { useData } from "@/components/Providers";
import ReviewCard from "@/components/shared/ReviewCard";
import ReviewForm from "@/components/shared/ReviewForm";
import { Separator } from "@/components/ui/separator";
import Loading from "../loading";

export default function ReviewsPage() {
  const { reviews, isLoading } = useData();

  const sortedReviews = [...reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <h1 className="mb-8 text-center font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
        What Our Customers Say
      </h1>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h2 className="mb-4 font-headline text-2xl font-semibold">Leave a Review</h2>
          <ReviewForm />
        </div>
        <div className="lg:col-span-2">
           <h2 className="mb-4 font-headline text-2xl font-semibold">Recent Reviews</h2>
           <div className="space-y-6">
            {sortedReviews.length > 0 ? (
                sortedReviews.map((review, index) => (
                <div key={review.id}>
                    <ReviewCard review={review} />
                    {index < sortedReviews.length - 1 && <Separator className="mt-6"/>}
                </div>
            ))
            ) : (
                <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                    <p>Be the first to leave a review!</p>
                </div>
            )}
           </div>
        </div>
      </div>
    </div>
  );
}
