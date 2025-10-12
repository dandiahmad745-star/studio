// This is a new file
"use client";

import { useState } from 'react';
import { useData } from '@/components/Providers';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/admin/PageHeader';
import { GalleryImage } from '@/lib/types';
import Image from 'next/image';
import GalleryForm from '@/components/admin/GalleryForm';

export default function GalleryManagementPage() {
  const { galleryImages, setGalleryImages, isLoading } = useData();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const handleAddNew = () => {
    setSelectedImage(null);
    setIsFormOpen(true);
  };

  const handleEdit = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsFormOpen(true);
  };
  
  const handleDelete = (imageId: string) => {
    setGalleryImages(prev => prev.filter(item => item.id !== imageId));
    toast({
        title: "Success",
        description: "Image has been deleted from the gallery.",
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Gallery Management" description="Add, edit, and manage your cafe's photo gallery.">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Image
        </Button>
      </PageHeader>
      
      <GalleryForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        image={selectedImage}
        onEdit={handleEdit}
      />

      <Card>
        <CardHeader>
          <CardTitle>Gallery Images</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading images...</p>
          ) : galleryImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((image) => (
                <Card key={image.id} className="group overflow-hidden">
                    <CardContent className="p-0">
                        <div className="relative aspect-square w-full">
                            <Image
                                src={image.image}
                                alt={image.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="icon">
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </AlertDialogTrigger>
                                     <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                            This will permanently delete the image "{image.title}" from your gallery.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(image.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </CardContent>
                    <div className="p-4">
                        <h3 className="font-semibold truncate">{image.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{image.description}</p>
                    </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground border-dashed border-2 rounded-lg p-12">
              <p className="text-lg font-medium">Your gallery is empty.</p>
              <p>Click "Add New Image" to start building your gallery.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
