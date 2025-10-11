"use client";

import { useData } from '@/components/Providers';
import PageHeader from '@/components/admin/PageHeader';
import ReviewsManager from '@/components/admin/ReviewsManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReviewsManagementPage() {
    const { isLoading } = useData();

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <PageHeader title="Reviews Management" description="View, reply to, and manage customer feedback." />
            <Card>
                <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                ) : (
                    <ReviewsManager />
                )}
                </CardContent>
            </Card>
        </div>
    );
}
