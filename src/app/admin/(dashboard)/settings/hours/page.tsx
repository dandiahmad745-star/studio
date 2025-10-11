"use client";

import PageHeader from "@/components/admin/PageHeader";
import OperatingHoursForm from "@/components/admin/OperatingHoursForm";
import { useData } from "@/components/Providers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function OperatingHoursPage() {
    const {isLoading} = useData();

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <PageHeader title="Operating Hours" description="Set your weekly opening and closing times." />
            <Card>
                <CardHeader>
                    <CardTitle>Weekly Schedule</CardTitle>
                    <CardDescription>Let customers know when you're open.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                         <div className="space-y-4">
                            {[...Array(7)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <Skeleton className="h-8 w-24" />
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-8 w-20" />
                                        <Skeleton className="h-8 w-20" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <OperatingHoursForm />}
                </CardContent>
            </Card>
        </div>
    );
}
