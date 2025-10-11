

"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useData } from "@/components/Providers";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { addDays, format, startOfWeek } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaveRequestForm from "@/components/barista/LeaveRequestForm";
import { Schedule, Barista, LeaveRequest } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Send, AlertTriangle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";


const ClockInTab = ({ baristas, schedules }: { baristas: Barista[], schedules: Schedule[] }) => {
    const { settings } = useData();
    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [selectedBaristaId, setSelectedBaristaId] = useState<string>('');

    useEffect(() => {
        const getCameraPermission = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setHasCameraPermission(true);
    
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings.',
            });
          }
        };
    
        getCameraPermission();
    
        return () => {
          // Cleanup: stop video stream when component unmounts
          if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
          }
        };
      }, [toast]);

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const context = canvas.getContext('2d');
        context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
    };

    const resetCapture = () => {
        setCapturedImage(null);
    };

    const getShiftForToday = useCallback((baristaId: string): string => {
        const todayString = format(new Date(), 'yyyy-MM-dd');
        const schedule = schedules.find(s => s.baristaId === baristaId && s.date === todayString);
        return schedule ? schedule.shift : 'Off';
    }, [schedules]);

    const sendWhatsAppMessage = () => {
        if (!selectedBaristaId) return;
        const barista = baristas.find(b => b.id === selectedBaristaId);
        if (!barista) return;

        const shift = getShiftForToday(selectedBaristaId);
        const time = format(new Date(), 'HH:mm');

        const message = `*ABSENSI MASUK*%0A%0A*Nama:* ${barista.name}%0A*Tanggal:* ${format(new Date(), 'd MMMM yyyy')}%0A*Jam Masuk:* ${time}%0A*Shift:* ${shift}%0A%0ATerima kasih.`;
        
        // Use the specified phone number
        const phoneNumber = '6285848651208';
        
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
        setCapturedImage(null); // Close dialog
    };
    
    const selectedBaristaShift = useMemo(() => {
        if (!selectedBaristaId) return null;
        return getShiftForToday(selectedBaristaId);
    }, [selectedBaristaId, getShiftForToday]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Absen Masuk</CardTitle>
                <CardDescription>Pilih nama Anda, ambil foto, lalu kirim absen melalui WhatsApp.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {hasCameraPermission === false && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Kamera Tidak Tersedia</AlertTitle>
                        <AlertDescription>
                            Izin kamera diperlukan untuk fitur ini. Mohon aktifkan di pengaturan browser Anda.
                        </AlertDescription>
                    </Alert>
                )}
                
                <div className="space-y-2">
                    <label className="text-sm font-medium">Nama Barista</label>
                    <Select onValueChange={setSelectedBaristaId} value={selectedBaristaId} disabled={!hasCameraPermission}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih nama Anda..." />
                        </SelectTrigger>
                        <SelectContent>
                            {baristas.map(barista => (
                                <SelectItem key={barista.id} value={barista.id}>{barista.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {selectedBaristaId && (
                         <p className="text-sm text-muted-foreground">Jadwal hari ini: <span className="font-bold">{selectedBaristaShift}</span></p>
                    )}
                </div>

                <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
                    <video ref={videoRef} className={cn("w-full h-full object-cover", !hasCameraPermission && 'hidden')} autoPlay muted playsInline />
                    {!hasCameraPermission && <Camera className="h-16 w-16 text-muted-foreground" />}
                </div>

                <Button onClick={capturePhoto} className="w-full" disabled={!selectedBaristaId || !hasCameraPermission}>
                    <Camera className="mr-2 h-4 w-4"/>
                    Ambil Foto Absen
                </Button>
                
                {/* Hidden canvas for capturing photo */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {/* Confirmation Dialog */}
                <AlertDialog open={!!capturedImage} onOpenChange={(open) => !open && setCapturedImage(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Absen</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin mengirim foto ini sebagai bukti absen masuk?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        {capturedImage && <img src={capturedImage} alt="Captured" className="rounded-md aspect-video object-cover" />}
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={resetCapture}>Ambil Ulang</AlertDialogCancel>
                            <AlertDialogAction onClick={sendWhatsAppMessage}>
                                <Send className="mr-2 h-4 w-4"/>
                                Kirim via WhatsApp
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
};


const LeaveRequestHistory = ({ requests, baristas }: { requests: LeaveRequest[], baristas: Barista[] }) => {
    const [selectedBaristaId, setSelectedBaristaId] = useState<string>('');

    const filteredRequests = useMemo(() => {
        if (!selectedBaristaId) return [];
        return requests
            .filter(req => req.baristaId === selectedBaristaId)
            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }, [requests, selectedBaristaId]);
    
    const getBaristaName = (baristaId: string) => {
        return baristas.find(b => b.id === baristaId)?.name || 'Unknown';
    };


    return (
        <div className="space-y-4">
            <div className="max-w-xs">
                <Select onValueChange={setSelectedBaristaId} value={selectedBaristaId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih nama Anda untuk melihat riwayat" />
                    </SelectTrigger>
                    <SelectContent>
                        {baristas.map(barista => (
                            <SelectItem key={barista.id} value={barista.id}>{barista.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            {selectedBaristaId ? (
                filteredRequests.length > 0 ? (
                    <div className="space-y-4">
                        {filteredRequests.map(request => (
                             <div key={request.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                <div>
                                    <p className="font-semibold">{request.reason}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(request.startDate), 'd MMM yyyy')} - {format(new Date(request.endDate), 'd MMM yyyy')}
                                    </p>
                                </div>
                                <Badge variant={
                                    request.status === 'Approved' ? 'default' :
                                    request.status === 'Rejected' ? 'destructive' :
                                    'secondary'
                                } className="w-fit">
                                    {request.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground border-dashed border p-8 rounded-lg">
                        <p>Belum ada riwayat pengajuan untuk {getBaristaName(selectedBaristaId)}.</p>
                    </div>
                )
            ) : (
                <div className="text-center text-muted-foreground border-dashed border p-8 rounded-lg">
                    <p>Pilih nama Anda di atas untuk melihat riwayat pengajuan.</p>
                </div>
            )}
        </div>
    );
};


export default function BaristaAbsenPage() {
  const { baristas, schedules, leaveRequests, isLoading } = useData();
  const [activeTab, setActiveTab] = useState("schedule");

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Start on Monday
  const weekDates = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const getShiftForBarista = (baristaId: string, date: Date): Schedule['shift'] => {
    const dateString = format(date, 'yyyy-MM-dd');
    const schedule = schedules.find(s => s.baristaId === baristaId && s.date === dateString);
    return schedule ? schedule.shift : 'Off';
  };

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Portal Barista
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Absen masuk, lihat jadwal, dan ajukan cuti di sini.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="clock-in">Absen Masuk</TabsTrigger>
            <TabsTrigger value="schedule">Jadwal Minggu Ini</TabsTrigger>
            <TabsTrigger value="leave">Ajukan Cuti/Izin</TabsTrigger>
            <TabsTrigger value="history">Riwayat Pengajuan</TabsTrigger>
        </TabsList>
        <TabsContent value="clock-in">
            <ClockInTab baristas={baristas} schedules={schedules} />
        </TabsContent>
        <TabsContent value="schedule">
            <Card>
                <CardHeader>
                    <CardTitle>Jadwal Kerja: {format(weekStart, 'd MMM')} - {format(addDays(weekStart, 6), 'd MMM yyyy')}</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <div className="grid gap-4" style={{gridTemplateColumns: `120px repeat(7, 1fr)`}}>
                         {/* Header Row */}
                        <div className="font-semibold">Barista</div>
                        {weekDates.map(date => (
                            <div key={date.toISOString()} className="text-center font-semibold">
                                <div>{format(date, 'EEE')}</div>
                                <div className="text-sm text-muted-foreground">{format(date, 'd/M')}</div>
                            </div>
                        ))}
                        {/* Data Rows */}
                        {baristas.map(barista => (
                            <React.Fragment key={barista.id}>
                                <div className="font-medium py-2">{barista.name}</div>
                                {weekDates.map(date => {
                                    const shift = getShiftForBarista(barista.id, date);
                                    return (
                                        <div key={date.toISOString()} className="text-center py-2 text-sm border-t">
                                            {shift}
                                        </div>
                                    )
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="leave">
            <Card>
                <CardHeader>
                    <CardTitle>Formulir Pengajuan Cuti/Izin</CardTitle>
                    <CardDescription>Isi formulir di bawah ini untuk mengajukan cuti atau izin.</CardDescription>
                </CardHeader>
                <CardContent>
                    <LeaveRequestForm />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="history">
            <Card>
                <CardHeader>
                    <CardTitle>Riwayat Pengajuan Cuti/Izin</CardTitle>
                    <CardDescription>Lihat status semua pengajuan Anda di sini.</CardDescription>
                </CardHeader>
                <CardContent>
                    <LeaveRequestHistory requests={leaveRequests} baristas={baristas} />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    

    
