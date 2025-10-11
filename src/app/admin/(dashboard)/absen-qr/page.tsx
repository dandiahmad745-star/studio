// This is a new file
"use client";

import { useEffect, useState, useRef } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/components/Providers';
import { Button } from '@/components/ui/button';
import { Printer, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load the QR code component
import dynamic from 'next/dynamic';
const QRCodeCanvas = dynamic(
    () => import('qrcode.react').then(mod => mod.QRCodeCanvas),
    { 
        ssr: false,
        loading: () => <Skeleton className="w-[256px] h-[256px] bg-muted" />
    }
);


export default function AbsenQrPage() {
    const { settings, isLoading } = useData();
    const [qrValue, setQrValue] = useState('');
    const qrCardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Ensure this runs only on the client
        if (typeof window !== 'undefined') {
            const url = `${window.location.origin}/absen`;
            setQrValue(url);
        }
    }, []);

    const handlePrint = () => {
        const printContent = qrCardRef.current;
        if (!printContent) return;

        const originalContents = document.body.innerHTML;
        const printSection = printContent.innerHTML;
        
        document.body.innerHTML = `
            <html>
                <head>
                    <title>Print QR Code</title>
                    <style>
                        @media print {
                            body { 
                                display: flex; 
                                justify-content: center; 
                                align-items: center; 
                                height: 100vh;
                                margin: 0;
                            }
                            @page { 
                                size: auto;
                                margin: 20mm; 
                            }
                        }
                    </style>
                </head>
                <body>
                    ${printSection}
                </body>
            </html>
        `;

        window.print();
        document.body.innerHTML = originalContents;
        // The page needs to be reloaded to re-initialize React components
        window.location.reload();
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <PageHeader title="QR Code untuk Absen" description="Cetak QR Code ini dan tempel di dekat pintu masuk untuk memudahkan barista melakukan absen.">
                <Button onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Cetak QR Code
                </Button>
            </PageHeader>
            <div className="flex justify-center items-center">
                 <div ref={qrCardRef}>
                    <Card className="w-fit text-center">
                        <CardHeader>
                            {isLoading ? (
                                <>
                                    <Skeleton className="h-8 w-48 mx-auto" />
                                    <Skeleton className="h-4 w-64 mx-auto mt-2" />
                                </>
                            ) : (
                                <>
                                    <CardTitle className="font-headline text-3xl">Absen Masuk</CardTitle>
                                    <CardDescription>Scan untuk mencatat kehadiran Anda di {settings.name}.</CardDescription>
                                </>
                            )}
                        </CardHeader>
                        <CardContent className="flex justify-center items-center p-8">
                            {qrValue ? (
                                <QRCodeCanvas
                                    value={qrValue}
                                    size={256}
                                    bgColor={"#ffffff"}
                                    fgColor={"#000000"}
                                    level={"H"}
                                    includeMargin={true}
                                />
                            ) : (
                                <div className="w-[256px] h-[256px] flex justify-center items-center bg-muted rounded-md">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                 </div>
            </div>
        </div>
    );
}
