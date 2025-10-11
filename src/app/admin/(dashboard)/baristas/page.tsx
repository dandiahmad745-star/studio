"use client";

import { useState } from 'react';
import { useData } from '@/components/Providers';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { Barista } from '@/lib/types';
import PageHeader from '@/components/admin/PageHeader';
import BaristaForm from '@/components/admin/BaristaForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function BaristasManagementPage() {
  const { baristas, setBaristas, isLoading } = useData();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBarista, setSelectedBarista] = useState<Barista | null>(null);

  const handleAddNew = () => {
    setSelectedBarista(null);
    setIsFormOpen(true);
  };

  const handleEdit = (barista: Barista) => {
    setSelectedBarista(barista);
    setIsFormOpen(true);
  };
  
  const handleDelete = (baristaId: string) => {
    setBaristas(prev => prev.filter(item => item.id !== baristaId));
    toast({
        title: "Success",
        description: "Barista has been deleted.",
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Barista Management" description="Add, edit, and manage your team of baristas.">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Barista
        </Button>
      </PageHeader>
      
      <BaristaForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        barista={selectedBarista}
      />

      <Card>
        <CardHeader>
          <CardTitle>Barista List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Bio</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Loading baristas...
                  </TableCell>
                </TableRow>
              ) : baristas.length > 0 ? (
                baristas.map((barista) => (
                  <TableRow key={barista.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={barista.name}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={barista.image}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{barista.name}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-sm truncate">{barista.bio}</TableCell>
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
                            <DropdownMenuItem onSelect={() => handleEdit(barista)}>Edit</DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the barista "{barista.name}".
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(barista.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No baristas found.
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
