// This is a new file
"use client";

import React, { useState, useRef, useEffect, startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Send, Bot, User } from 'lucide-react';
import { Barista } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { baristaChat } from '@/ai/flows/barista-chat-flow';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';


const chatMessageSchema = z.object({
    message: z.string().min(1, "Pesan tidak boleh kosong."),
});

type ChatMessageFormValues = z.infer<typeof chatMessageSchema>;

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  barista: Barista | null;
}

export default function ChatDialog({ isOpen, setIsOpen, barista }: ChatDialogProps) {
    const { toast } = useToast();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const form = useForm<ChatMessageFormValues>({
        resolver: zodResolver(chatMessageSchema),
        defaultValues: {
            message: '',
        },
    });

    useEffect(() => {
        if (isOpen && barista) {
            setMessages([
                {
                    role: 'assistant',
                    content: `Halo! Saya ${barista.name}. Ada yang bisa saya bantu?`,
                }
            ]);
        } else {
            // Reset state when dialog closes
            setTimeout(() => {
                form.reset();
                setMessages([]);
                setIsLoading(false);
            }, 300);
        }
    }, [isOpen, barista, form]);

    useEffect(() => {
        // Scroll to bottom when a new message is added
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);


    const onSubmit = async (data: ChatMessageFormValues) => {
        if (!barista) return;

        const userMessage: ChatMessage = { role: 'user', content: data.message };
        
        startTransition(() => {
            setMessages((prev) => [...prev, userMessage]);
            setIsLoading(true);
            form.reset();
        });

        try {
            const aiResponse = await baristaChat(barista, messages, userMessage.content);
            const assistantMessage: ChatMessage = { role: 'assistant', content: aiResponse };
            
            startTransition(() => {
                setMessages((prev) => [...prev, assistantMessage]);
            });
        } catch (error) {
            console.error("AI chat error:", error);
            toast({
                variant: 'destructive',
                title: 'Oops! Something went wrong.',
                description: 'The AI barista is taking a coffee break. Please try again later.',
            });
            // remove the user message if AI fails
             setMessages((prev) => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };

    if (!barista) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-lg grid-rows-[auto,1fr,auto] max-h-[80svh] p-0">
                <DialogHeader className="p-4 border-b">
                    <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 shrink-0">
                            <Image src={barista.image} alt={barista.name} fill className="rounded-full object-cover" />
                        </div>
                        <div>
                            <DialogTitle>Ngobrol dengan {barista.name}</DialogTitle>
                            <DialogDescription>AI yang berperan sebagai {barista.name}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1" viewportRef={scrollAreaRef}>
                    <div className="space-y-4 p-4">
                        {messages.map((message, index) => (
                            <div key={index} className={cn("flex items-end gap-2", message.role === 'user' ? 'justify-end' : 'justify-start')}>
                                {message.role === 'assistant' && (
                                    <AvatarIcon>
                                        <Bot className="h-5 w-5" />
                                    </AvatarIcon>
                                )}
                                <div className={cn(
                                    "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                                    message.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                )}>
                                    {message.content}
                                </div>
                                {message.role === 'user' && (
                                    <AvatarIcon>
                                        <User className="h-5 w-5" />
                                    </AvatarIcon>
                                )}
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-end gap-2 justify-start">
                                <AvatarIcon>
                                    <Bot className="h-5 w-5" />
                                </AvatarIcon>
                                <div className="bg-muted px-3 py-2 rounded-lg flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-0"></span>
                                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-150"></span>
                                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-300"></span>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <DialogFooter className="p-4 border-t">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-start gap-2">
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input
                                                placeholder={`Tanya sesuatu pada ${barista.name}...`}
                                                {...field}
                                                autoComplete='off'
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" size="icon" disabled={isLoading}>
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Kirim</span>
                            </Button>
                        </form>
                    </Form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


const AvatarIcon = ({ children }: { children: React.ReactNode }) => (
    <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
        {children}
    </div>
);
