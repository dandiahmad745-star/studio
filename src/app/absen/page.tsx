"use client";

import { useData } from "@/components/Providers";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { addDays, format, startOfWeek } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaveRequestForm from "@/components/barista/LeaveRequestForm";
import { Schedule } from "@/lib/types";

export default function BaristaAbsenPage() {
  const { baristas, schedules, isLoading } = useData();

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
          Lihat jadwal Anda dan ajukan cuti di sini.
        </p>
      </div>

      <Tabs defaultValue="schedule">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedule">Jadwal Minggu Ini</TabsTrigger>
            <TabsTrigger value="leave">Ajukan Cuti/Izin</TabsTrigger>
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
                            <>
                                <div key={barista.id} className="font-medium py-2">{barista.name}</div>
                                {weekDates.map(date => {
                                    const shift = getShiftForBarista(barista.id, date);
                                    return (
                                        <div key={date.toISOString()} className="text-center py-2 text-sm border-t">
                                            {shift}
                                        </div>
                                    )
                                })}
                            </>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="leave">
            <Card>
                <CardHeader>
                    <CardTitle>Formulir Pengajuan Cuti/Izin</CardTitle>
                </CardHeader>
                <CardContent>
                    <LeaveRequestForm />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
