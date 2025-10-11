// This is a new file
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { customerMessageSchema } from '@/lib/validators';
import { useData } from '../Providers';
import { useToast } from '@/hooks/use-toast';
import { Barista, CustomerMessage } from '@/lib/types';
import { Heart, Send } from 'lucide-react';

type MessageFormValues = z.infer<typeof customerMessageSchema>;

interface ChatDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  barista: Barista | null;
}

export default function ChatDialog({ isOpen, setIsOpen, barista }: ChatDialogProps) {
  const { setCustomerMessages } = useData();
  const { toast } = useToast();

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(customerMessageSchema),
    defaultValues: {
        customerName: '',
        message: '',
    },
  });

  function onSubmit(data: MessageFormValues) {
    if (!barista) return;

    const newMessage: CustomerMessage = {
      ...data,
      id: `msg-${Date.now()}`,
      baristaId: barista.id,
      baristaName: barista.name,
      date: new Date().toISOString(),
      status: 'unread',
    };

    setCustomerMessages((prev) => [newMessage, ...prev]);
    toast({ 
        title: 'Pesan Terkirim!',
        description: `Pesan Anda untuk ${barista.name} telah dikirim.`,
     });
    setIsOpen(false);
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chat dengan {barista?.name}</DialogTitle>
          <DialogDescription>Tinggalkan pesan dan barista kami akan segera mengetahuinya.</DialogDescription>
        </DialogHeader>
        
        <div className="my-4 rounded-lg bg-muted p-4 text-center">
            <p className="flex items-center justify-center gap-2 text-muted-foreground">
                tunggu barista online ya kak <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Anda</FormLabel>
                  <FormControl>
                    <Input placeholder="Tulis nama Anda..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pesan Anda</FormLabel>
                  <FormControl>
                    <Textarea placeholder={`Tulis pesan untuk ${barista?.name}...`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
              <Button type="submit">
                <Send className="mr-2 h-4 w-4" />
                Kirim
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
