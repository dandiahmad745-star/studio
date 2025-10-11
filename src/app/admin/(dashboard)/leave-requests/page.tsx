// This is a new file
"use client";

import { useData } from '@/components/Providers';
import PageHeader from '@/components/admin/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import { LeaveRequest } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';

export default function LeaveRequestsPage() {
  const { leaveRequests, setLeaveRequests, baristas, isLoading } = useData();
  const { toast } = useToast();

  const handleStatusChange = (requestId: string, newStatus: LeaveRequest['status']) => {
    setLeaveRequests(prev =>
      prev.map(req => (req.id === requestId ? { ...req, status: newStatus } : req))
    );
    toast({
      title: "Status Updated",
      description: `Leave request status has been changed to ${newStatus}.`,
    });
  };

  const getBaristaName = (baristaId: string) => {
    return baristas.find(b => b.id === baristaId)?.name || 'Unknown';
  };
  
  const sortedRequests = [...leaveRequests].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Leave Requests" description="Manage and respond to barista time-off requests." />
      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Barista</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead className="hidden md:table-cell">Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attachment</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">Loading requests...</TableCell>
                </TableRow>
              ) : sortedRequests.length > 0 ? (
                sortedRequests.map(request => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{getBaristaName(request.baristaId)}</TableCell>
                    <TableCell>
                      {format(new Date(request.startDate), 'd MMM')} - {format(new Date(request.endDate), 'd MMM yyyy')}
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">{request.reason}</TableCell>
                    <TableCell>
                      <Badge variant={
                        request.status === 'Approved' ? 'default' :
                        request.status === 'Rejected' ? 'destructive' :
                        'secondary'
                      }>{request.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {request.doctorNoteImage ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Paperclip className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-xl">
                            <DialogHeader>
                              <DialogTitle>Surat Keterangan Dokter</DialogTitle>
                              <DialogDescription>
                                Diajukan oleh {getBaristaName(request.baristaId)} untuk tanggal {format(new Date(request.startDate), 'd MMM yyyy')}.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="relative mt-4 h-[60vh] w-full">
                                <Image
                                    src={request.doctorNoteImage}
                                    alt="Surat Dokter"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => handleStatusChange(request.id, 'Approved')}>
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleStatusChange(request.id, 'Rejected')}>
                            Reject
                          </DropdownMenuItem>
                           <DropdownMenuItem onSelect={() => handleStatusChange(request.id, 'Pending')}>
                            Set as Pending
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">No leave requests found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
