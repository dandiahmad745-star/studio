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
import React from 'react';

const customerMessageFormSchema = customerMessageSchema.extend({
    message: z.string().min(1, "Pesan tidak boleh kosong."),
});

type MessageFormValues = z.infer<typeof customerMessageFormSchema>;

interface ChatDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  barista: Barista | null;
}

export default function ChatDialog({ isOpen, setIsOpen, barista }: ChatDialogProps) {
  const { setCustomerMessages } = useData();
  const { toast } = useToast();
  const [isSent, setIsSent] = React.useState(false);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(customerMessageFormSchema),
    defaultValues: {
        customerName: '',
        message: '',
    },
  });

  React.useEffect(() => {
    if (!isOpen) {
        // Reset form and state when dialog is closed
        setTimeout(() => {
            form.reset();
            setIsSent(false);
        }, 300);
    }
  }, [isOpen, form]);


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
    setIsSent(true);

    setTimeout(() => {
        setIsOpen(false);
    }, 2000);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Kirim Pesan untuk {barista?.name}</DialogTitle>
           {!isSent && <DialogDescription>Tinggalkan pesan dan barista kami akan segera mengetahuinya.</DialogDescription>}
        </DialogHeader>
        
        {isSent ? (
            <div className="flex justify-start my-4">
                <div className="rounded-lg bg-muted px-4 py-2 text-muted-foreground">
                    oke terimakasih nanti ku sampaikan ke barista deh hehe ❤️
                </div>
            </div>
        ) : (
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
        )}

      </DialogContent>
    </Dialog>
  );
}
