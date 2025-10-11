"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Coffee, Menu, Gift, MessageSquare, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useData } from '../Providers';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';
import { useEffect, useState } from 'react';
import { getShopStatus } from '@/lib/shop-status';
import { Badge } from '../ui/badge';

const navLinks = [
  { href: '/', label: 'Menu', icon: Coffee },
  { href: '/promotions', label: 'Promotions', icon: Gift },
  { href: '/reviews', label: 'Reviews', icon: MessageSquare },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { settings, isLoading } = useData();
  const [shopStatus, setShopStatus] = useState<{isOpen: boolean; message: string} | null>(null);

  useEffect(() => {
    if (!isLoading && settings.operatingHours) {
        const updateStatus = () => {
            const status = getShopStatus(settings.operatingHours);
            setShopStatus(status);
        };
        updateStatus();
        const intervalId = setInterval(updateStatus, 60000); // Check every minute
        return () => clearInterval(intervalId);
    }
  }, [isLoading, settings.operatingHours]);


  const renderNavLinks = (isMobile = false) =>
    navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          pathname === link.href
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground',
          isMobile && 'text-lg'
        )}
      >
        <link.icon className="h-5 w-5" />
        {link.label}
      </Link>
    ));

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
            {isLoading ? (
                <Skeleton className="h-10 w-10 rounded-full" />
            ) : settings.logo && (
                <Image src={settings.logo} alt="logo" width={40} height={40} className="rounded-full" />
            )}
          <div className='flex flex-col gap-0.5'>
            <span className="font-headline text-xl font-bold leading-none sm:inline-block">
                {isLoading ? <Skeleton className="h-6 w-32" /> : settings.name}
            </span>
            {shopStatus && (
                 <Badge 
                    variant={shopStatus.isOpen ? 'default' : 'destructive'} 
                    className={cn(
                        "w-fit gap-1.5 px-2 py-0.5 text-xs font-medium leading-none",
                        shopStatus.isOpen ? "bg-green-600/10 text-green-700 border-green-600/20" : "bg-red-600/10 text-red-700 border-red-600/20"
                    )}
                >
                    <Clock className="h-3 w-3" />
                    <span>{shopStatus.message}</span>
                </Badge>
            )}
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {renderNavLinks()}
        </nav>

        <div className="flex items-center gap-2">
          <Button onClick={() => router.push('/admin')}>
            Admin
          </Button>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                </SheetHeader>
                <div className="flex h-full flex-col">
                    <Link href="/" className="mb-6 flex items-center gap-2">
                        {isLoading ? (
                            <Skeleton className="h-10 w-10 rounded-full" />
                        ) : settings.logo && (
                            <Image src={settings.logo} alt="logo" width={40} height={40} className="rounded-full" />
                        )}
                        <span className="font-headline text-xl font-bold">
                            {isLoading ? <Skeleton className="h-6 w-32" /> : settings.name}
                        </span>
                    </Link>
                  <nav className="flex flex-col gap-4">
                    {renderNavLinks(true)}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
