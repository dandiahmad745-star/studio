// This is a new file
"use client";

import { useData } from '@/components/Providers';
import PageHeader from '@/components/admin/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useMemo } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function MessagesPage() {
  const { customerMessages, setCustomerMessages, isLoading } = useData();
  const { toast } = useToast();

  const sortedMessages = useMemo(() => {
    return [...customerMessages].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [customerMessages]);

  const handleMarkAsRead = (messageId: string) => {
    setCustomerMessages(prev =>
      prev.map(msg => (msg.id === messageId ? { ...msg, status: 'read' } : msg))
    );
  };

  const handleDelete = (messageId: string) => {
    setCustomerMessages(prev => prev.filter(msg => msg.id !== messageId));
    toast({
      title: "Message Deleted",
      description: "The customer message has been permanently deleted.",
    });
  };
  
  const unreadCount = useMemo(() => customerMessages.filter(m => m.status === 'unread').length, [customerMessages]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Pesan Customer" description="Lihat dan kelola pesan yang dikirim dari pelanggan." />
      <Card>
        <CardHeader>
          <CardTitle>Kotak Masuk</CardTitle>
          <CardDescription>
            Total {customerMessages.length} pesan. {unreadCount > 0 ? `${unreadCount} pesan belum dibaca.` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading messages...</p>
          ) : sortedMessages.length > 0 ? (
            <Accordion type="multiple" className="w-full">
              {sortedMessages.map(message => (
                <AccordionItem key={message.id} value={message.id}>
                  <AccordionTrigger 
                    className="hover:no-underline"
                    onClick={() => message.status === 'unread' && handleMarkAsRead(message.id)}
                  >
                    <div className="flex w-full items-center justify-between gap-4 pr-4">
                        <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                                {message.status === 'unread' && <span className="h-2 w-2 rounded-full bg-primary" />}
                                <span className="font-medium">{message.customerName}</span>
                                <span className="text-muted-foreground text-sm font-normal">ke {message.baristaName}</span>
                            </div>
                            <p className="text-sm text-muted-foreground font-normal truncate">
                                {message.message}
                            </p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                            {format(new Date(message.date), 'd MMM yyyy, HH:mm')}
                        </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p className="whitespace-pre-wrap text-base">{message.message}</p>
                    <div className="flex justify-end">
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Aksi ini tidak dapat dibatalkan. Ini akan menghapus pesan secara permanen.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(message.id)} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center text-muted-foreground border-dashed border-2 rounded-lg p-12">
              <p className="text-lg font-medium">Belum ada pesan.</p>
              <p>Pesan dari pelanggan akan muncul di sini.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
