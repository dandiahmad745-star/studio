"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/admin/PageHeader';
import { Info, Clock, ArrowRight } from 'lucide-react';
import { useData } from '@/components/Providers';
import { Skeleton } from '@/components/ui/skeleton';


const settingsItems = [
    {
        href: '/admin/settings/general',
        title: 'General Settings',
        description: 'Manage shop name, address, and logo.',
        icon: Info,
    },
    {
        href: '/admin/settings/hours',
        title: 'Operating Hours',
        description: 'Set your weekly opening and closing times.',
        icon: Clock,
    },
];

export default function SettingsDashboardPage() {
    const {isLoading} = useData();

    if(isLoading) {
        return (
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <PageHeader title="Shop Settings" description="Manage your cafe's information and operating hours." />
                <div className="grid gap-6 md:grid-cols-2">
                    {[...Array(2)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-24" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <PageHeader title="Shop Settings" description="Manage your cafe's information and operating hours." />
      <div className="grid gap-6 md:grid-cols-2">
        {settingsItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <Card className="group h-full transition-all hover:border-primary hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="font-headline">{item.title}</CardTitle>
                    <item.icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm font-medium text-primary">
                  Go to section
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
