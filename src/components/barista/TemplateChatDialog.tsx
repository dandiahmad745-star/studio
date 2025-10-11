// This is a new file
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { customerMessageSchema } from '@/lib/validators';
import { useData } from '../Providers';
import { Barista, CustomerMessage } from '@/lib/types';
import { getMessageTemplates } from '@/lib/database';
import { Heart, Send } from 'lucide-react';
import React, { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';

type MessageFormValues = z.infer<typeof customerMessageSchema>;

interface TemplateChatDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  barista: Barista | null;
}

const AutoReply = () => (
    <div className="flex justify-start">
        <div className="rounded-lg bg-muted px-4 py-2 text-muted-foreground">
            oke terimakasih nanti ku sampaikan ke barista deh hehe ❤️
        </div>
    </div>
);


export default function TemplateChatDialog({ isOpen, setIsOpen, barista }: TemplateChatDialogProps) {
  const { setCustomerMessages } = useData();
  const [showReply, setShowReply] = useState(false);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(customerMessageSchema),
    defaultValues: {
        customerName: '',
        message: '',
    },
  });

  const templates = barista ? getMessageTemplates(barista.name) : [];

  function handleSend(message: string) {
    if (!barista) return;

    // Validate customer name before sending
    form.trigger('customerName').then((isValid) => {
        if (!isValid) return;

        const customerName = form.getValues('customerName');

        const newMessage: CustomerMessage = {
          id: `msg-${Date.now()}`,
          customerName: customerName,
          baristaId: barista.id,
          baristaName: barista.name,
          message: message,
          date: new Date().toISOString(),
          status: 'unread',
        };

        setCustomerMessages((prev) => [newMessage, ...prev]);
        setShowReply(true);

        setTimeout(() => {
            setIsOpen(false);
            form.reset();
            setShowReply(false);
        }, 2000); // Close dialog after 2 seconds
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
            setShowReply(false);
            form.reset();
        }
        setIsOpen(open);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Kirim Pesan untuk {barista?.name}</DialogTitle>
          <DialogDescription>Isi nama Anda dan pilih salah satu pesan di bawah ini.</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
             {!showReply ? (
                <Form {...form}>
                    <form>
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
                         <div className="mt-4 space-y-2">
                            <FormLabel>Pilih Pesan</FormLabel>
                            <ScrollArea className="h-[200px] w-full rounded-md border p-2">
                                <div className="space-y-2">
                                {templates.map((template, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        className="w-full justify-start text-left h-auto whitespace-normal"
                                        onClick={() => handleSend(template)}
                                    >
                                        {template}
                                    </Button>
                                ))}
                                </div>
                            </ScrollArea>
                         </div>
                    </form>
                </Form>
             ) : (
                <AutoReply />
             )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
