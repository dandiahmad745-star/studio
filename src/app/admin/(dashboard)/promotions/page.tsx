"use client";

import { useState } from 'react';
import { useData } from '@/components/Providers';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Promotion } from '@/lib/types';
import PageHeader from '@/components/admin/PageHeader';
import PromoForm from '@/components/admin/PromoForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function PromotionsManagementPage() {
  const { promotions, setPromotions, isLoading } = useData();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);
  
  const handleAddNew = () => {
    setSelectedPromo(null);
    setIsFormOpen(true);
  };

  const handleEdit = (promo: Promotion) => {
    setSelectedPromo(promo);
    setIsFormOpen(true);
  };
  
  const handleDelete = (promoId: string) => {
    setPromotions(prev => prev.filter(promo => promo.id !== promoId));
    toast({
        title: "Success",
        description: "Promotion has been deleted.",
    });
  };

  const getStatus = (promo: Promotion) => {
    const now = new Date();
    const from = new Date(promo.validFrom);
    const until = new Date(promo.validUntil);
    if (now < from) return <Badge variant="secondary">Upcoming</Badge>;
    if (now > until) return <Badge variant="outline">Expired</Badge>;
    return <Badge className="bg-green-600 hover:bg-green-600/90">Active</Badge>;
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Promotions Management" description="Create and manage special offers for your customers.">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Promotion
        </Button>
      </PageHeader>
      
      <PromoForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        promo={selectedPromo}
      />

      <Card>
        <CardHeader>
          <CardTitle>Promotions List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Validity</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Loading promotions...
                  </TableCell>
                </TableRow>
              ) : promotions.length > 0 ? (
                promotions.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell className="font-medium">{promo.title}</TableCell>
                    <TableCell>{getStatus(promo)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(new Date(promo.validFrom), 'MMM d, yyyy')} - {format(new Date(promo.validUntil), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => handleEdit(promo)}>Edit</DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the promotion "{promo.title}".
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(promo.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No promotions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
