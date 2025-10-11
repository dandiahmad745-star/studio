"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/admin/PageHeader';
import { Coffee, Gift, MessageSquare, Settings, ArrowRight, Users, CalendarClock, Send } from 'lucide-react';
import { useData } from '@/components/Providers';
import { Skeleton } from '@/components/ui/skeleton';

const dashboardItems = [
  {
    href: '/admin/menu',
    title: 'Menu Management',
    description: 'Add, edit, and manage menu items.',
    icon: Coffee,
  },
  {
    href: '/admin/promotions',
    title: 'Promotions',
    description: 'Create and manage special offers.',
    icon: Gift,
  },
  {
    href: '/admin/reviews',
    title: 'Reviews',
    description: 'View and reply to customer feedback.',
    icon: MessageSquare,
  },
  {
    href: '/admin/baristas',
    title: 'Barista Management',
    description: 'Manage your team of baristas.',
    icon: Users,
  },
  {
    href: '/admin/schedule',
    title: 'Schedule Management',
    description: 'Set and manage weekly schedules.',
    icon: CalendarClock,
  },
  {
    href: '/admin/leave-requests',
    title: 'Leave Requests',
    description: 'Approve or reject leave requests.',
    icon: Send,
  },
  {
    href: '/admin/settings',
    title: 'Shop Settings',
    description: 'Manage general shop information.',
    icon: Settings,
  },
];

export default function AdminDashboardPage() {
    const {isLoading} = useData();

    if(isLoading) {
        return (
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <PageHeader title="Admin Dashboard" description="Welcome to your shop management center." />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(7)].map((_, i) => (
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
      <PageHeader title="Admin Dashboard" description="Welcome to your shop management center." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardItems.map((item) => (
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
