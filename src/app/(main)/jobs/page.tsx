// This is a new file
"use client";

import { useData } from "@/components/Providers";
import Loading from '../loading';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useMemo } from "react";

export default function JobsPage() {
  const { jobVacancies, isLoading } = useData();

  const activeJobs = useMemo(() => 
    jobVacancies.filter(job => job.isActive).sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
  , [jobVacancies]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-12">
        <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Join Our Team
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We're looking for passionate individuals to help us brew the perfect cup of coffee and create amazing experiences for our customers.
        </p>
      </div>

      {activeJobs.length > 0 ? (
        <div className="mx-auto max-w-2xl space-y-8">
          {activeJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{job.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4" />
                        <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>Posted on {format(new Date(job.postedDate), 'd MMMM yyyy')}</span>
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="whitespace-pre-line">
                  {job.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                 <p className="text-sm text-muted-foreground">
                    Interested? Please send your CV to <a href={`mailto:${'hr@kopimikafe.com'}`} className="text-primary font-medium hover:underline">{'hr@kopimikafe.com'}</a> with the job title as the subject.
                 </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground border-dashed border-2 rounded-lg p-12">
          <p className="text-lg font-medium">No open vacancies at the moment.</p>
          <p>We're always looking for talent. Feel free to send us your CV!</p>
        </div>
      )}
    </div>
  );
}
