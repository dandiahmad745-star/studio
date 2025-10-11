// This is a new file
"use client";

import { useState } from 'react';
import { useData } from '@/components/Providers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addDays, format, startOfWeek, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import { Barista, Schedule } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const shifts: Schedule['shift'][] = ['Morning', 'Afternoon', 'Night', 'Off'];

export default function ScheduleManagementPage() {
  const { baristas, schedules, setSchedules, isLoading } = useData();
  const { toast } = useToast();
  const [weekOffset, setWeekOffset] = useState(0);
  
  const weekStart = startOfWeek(addDays(new Date(), weekOffset * 7), { weekStartsOn: 1 }); // Start on Monday
  const weekDates = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const handleShiftChange = (baristaId: string, date: Date, shift: Schedule['shift']) => {
    const dateString = format(date, 'yyyy-MM-dd');
    
    setSchedules(prevSchedules => {
        const existingScheduleIndex = prevSchedules.findIndex(s => s.baristaId === baristaId && s.date === dateString);
        
        let newSchedules = [...prevSchedules];

        if (existingScheduleIndex !== -1) {
            // Update existing schedule
            newSchedules[existingScheduleIndex] = { ...newSchedules[existingScheduleIndex], shift };
        } else {
            // Add new schedule entry
            newSchedules.push({ date: dateString, baristaId, shift });
        }
        
        return newSchedules;
    });

    toast({
        title: "Jadwal Diperbarui",
        description: `Jadwal untuk ${baristas.find(b => b.id === baristaId)?.name} telah diubah.`,
    });
  };

  const getShiftForBarista = (baristaId: string, date: Date): Schedule['shift'] => {
    const dateString = format(date, 'yyyy-MM-dd');
    const schedule = schedules.find(s => s.baristaId === baristaId && s.date === dateString);
    return schedule ? schedule.shift : 'Off';
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Schedule Management" description="Set and manage weekly barista schedules." />
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Weekly Schedule</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setWeekOffset(weekOffset - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {format(weekStart, 'd MMM')} - {format(addDays(weekStart, 6), 'd MMM yyyy')}
              </span>
              <Button variant="outline" size="icon" onClick={() => setWeekOffset(weekOffset + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid gap-2" style={{gridTemplateColumns: `120px repeat(7, 1fr)`}}>
                    {/* Header Row */}
                    <div className="font-semibold sticky left-0 bg-card">Barista</div>
                    {weekDates.map(date => (
                        <div key={date.toISOString()} className="text-center font-semibold p-2">
                            <div>{format(date, 'EEE')}</div>
                            <div className="text-sm text-muted-foreground">{format(date, 'd/M')}</div>
                        </div>
                    ))}

                    {/* Data Rows */}
                    {baristas.map(barista => (
                        <>
                            <div key={barista.id} className="font-medium py-2 sticky left-0 bg-card flex items-center">{barista.name}</div>
                            {weekDates.map(date => {
                                const currentShift = getShiftForBarista(barista.id, date);
                                return (
                                    <div key={date.toISOString()} className="p-2 border-t flex items-center justify-center">
                                       <Select
                                            value={currentShift}
                                            onValueChange={(newShift: Schedule['shift']) => handleShiftChange(barista.id, date, newShift)}
                                        >
                                            <SelectTrigger className="w-[120px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {shifts.map(shift => (
                                                    <SelectItem key={shift} value={shift}>{shift}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )
                            })}
                        </>
                    ))}
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
