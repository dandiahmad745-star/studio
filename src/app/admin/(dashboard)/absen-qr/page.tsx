
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

        // Create an iframe to print from
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);
        
        const printDocument = iframe.contentWindow?.document;
        if (!printDocument) return;

        printDocument.open();
        printDocument.write(`
            <html>
                <head>
                    <title>Print QR Code</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
                        body {
                            font-family: 'Poppins', sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                            -webkit-print-color-adjust: exact;
                        }
                        .print-card {
                           border: 1px solid #e5e7eb;
                           border-radius: 0.5rem;
                           padding: 1.5rem;
                           text-align: center;
                           width: 350px;
                        }
                        .print-title {
                            font-size: 1.875rem;
                            font-weight: 600;
                        }
                        .print-description {
                            color: #6b7280;
                            font-size: 0.875rem;
                        }
                        .print-content {
                            padding: 2rem;
                        }
                        @page { 
                            size: auto;
                            margin: 20mm; 
                        }
                    </style>
                </head>
                <body>
                    <div class="print-card">
                       <div class="print-title">Absen Masuk</div>
                       <div class="print-description">Scan untuk mencatat kehadiran Anda di ${settings.name}.</div>
                       <div class="print-content">
                           ${printContent.querySelector('canvas')?.outerHTML || ''}
                       </div>
                    </div>
                </body>
            </html>
        `);
        printDocument.close();
        
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();

        // Clean up the iframe after printing
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 500);
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <PageHeader title="QR Code untuk Absen" description="Cetak QR Code ini dan tempel di dekat pintu masuk untuk memudahkan barista melakukan absen.">
                <Button onClick={handlePrint} disabled={!qrValue || isLoading}>
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
