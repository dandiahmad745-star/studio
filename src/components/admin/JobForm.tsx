// This is a new file
"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { jobVacancySchema } from '@/lib/validators';
import { useData } from '../Providers';
import { useToast } from '@/hooks/use-toast';
import { JobVacancy } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type JobFormValues = z.infer<typeof jobVacancySchema>;

interface JobFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  job: JobVacancy | null;
}

export default function JobForm({ isOpen, setIsOpen, job }: JobFormProps) {
  const { setJobVacancies } = useData();
  const { toast } = useToast();

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobVacancySchema),
    defaultValues: {
        title: '',
        description: '',
        type: 'Full-time',
        isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (job) {
        form.reset(job);
      } else {
        form.reset({
            title: '',
            description: '',
            type: 'Full-time',
            isActive: true,
        });
      }
    }
  }, [job, form, isOpen]);

  function onSubmit(data: JobFormValues) {
    if (job) {
      // Edit
      setJobVacancies((prev) => prev.map((j) => (j.id === job.id ? { ...j, ...data } : j)));
      toast({ title: 'Success', description: 'Job vacancy updated.' });
    } else {
      // Add
      const newJob: JobVacancy = { 
        ...data, 
        id: `job-${Date.now()}`,
        postedDate: new Date().toISOString(),
    };
      setJobVacancies((prev) => [newJob, ...prev]);
      toast({ title: 'Success', description: 'New job vacancy added.' });
    }
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{job ? 'Edit Job Vacancy' : 'Add New Job Vacancy'}</DialogTitle>
          <DialogDescription>
            Fill in the details for the job opening. It will be visible to the public if marked as active.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Head Barista" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a job type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the job responsibilities, requirements, etc." {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <FormLabel>Active Status</FormLabel>
                            <DialogDescription>
                                If active, this job will be visible on the public careers page.
                            </DialogDescription>
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
                />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
