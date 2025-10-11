"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { reviewSchema } from '@/lib/validators';
import { useData } from '../Providers';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function ReviewForm() {
  const { setReviews } = useData();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      customerName: '',
      rating: 0,
      comment: '',
    },
  });

  function onSubmit(data: ReviewFormValues) {
    const newReview = {
      ...data,
      id: `review-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);
    toast({
      title: 'Review Submitted!',
      description: 'Thank you for your feedback.',
    });
    form.reset();
    setRating(0);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div>
                   <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={cn(
                            'h-8 w-8 cursor-pointer transition-colors',
                            (hoverRating >= star || rating >= star)
                                ? 'text-accent fill-accent'
                                : 'text-gray-300'
                            )}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => {
                                field.onChange(star);
                                setRating(star);
                            }}
                        />
                        ))}
                    </div>
                    <Input type="hidden" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us what you think..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Submit Review</Button>
      </form>
    </Form>
  );
}
