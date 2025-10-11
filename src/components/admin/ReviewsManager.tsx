"use client";

import { useState } from 'react';
import { useData } from '../Providers';
import { Review } from '@/lib/types';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Trash2, MessageSquare, Edit2, CornerDownRight } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewReplySchema } from '@/lib/validators';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Textarea } from '../ui/textarea';
import ReviewCard from '../shared/ReviewCard';

type ReplyFormValues = z.infer<typeof reviewReplySchema>;

const ReplyForm = ({ reviewId, currentReply, onSave }: { reviewId: string; currentReply?: string; onSave: () => void }) => {
  const { setReviews } = useData();
  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(reviewReplySchema),
    defaultValues: { reply: currentReply || '' },
  });

  const onSubmit = (data: ReplyFormValues) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, reply: data.reply } : r));
    onSave();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2 mt-2">
        <CornerDownRight className="h-5 w-5 mt-2 text-muted-foreground" />
        <FormField
          control={form.control}
          name="reply"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Textarea placeholder="Write a reply..." {...field} className="min-h-[60px]" />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" size="sm">Save</Button>
      </form>
    </Form>
  );
};

export default function ReviewsManager() {
  const { reviews, setReviews } = useData();
  const { toast } = useToast();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleDelete = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    toast({ title: "Success", description: "Review has been deleted." });
  };

  const sortedReviews = [...reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (reviews.length === 0) {
    return <p className="text-center text-muted-foreground">No reviews yet.</p>;
  }

  return (
    <div className="space-y-6">
      {sortedReviews.map((review, index) => (
        <div key={review.id}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <ReviewCard review={review} />
            </div>
            <div className="flex gap-1 ml-4">
              <Button size="icon" variant="ghost" onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}>
                {review.reply ? <Edit2 className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                <span className="sr-only">Reply</span>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This will permanently delete the review from {review.customerName}.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(review.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          {replyingTo === review.id && (
            <ReplyForm 
              reviewId={review.id} 
              currentReply={review.reply} 
              onSave={() => {
                setReplyingTo(null);
                toast({ title: "Success", description: "Reply has been saved." });
              }} 
            />
          )}
          {index < sortedReviews.length - 1 && <Separator className="mt-6" />}
        </div>
      ))}
    </div>
  );
}
