
"use client";

import React, { useState, useMemo } from "react";
import { useData } from "@/components/Providers";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { addDays, format, startOfWeek } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaveRequestForm from "@/components/barista/LeaveRequestForm";
import { Schedule, Barista, LeaveRequest } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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
          Lihat jadwal Anda, ajukan cuti, dan lihat riwayat pengajuan di sini.
        </p>
      </div>

      <Tabs defaultValue="schedule">
        <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schedule">Jadwal Minggu Ini</TabsTrigger>
            <TabsTrigger value="leave">Ajukan Cuti/Izin</TabsTrigger>
            <TabsTrigger value="history">Riwayat Pengajuan</TabsTrigger>
        </TabsList>
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
