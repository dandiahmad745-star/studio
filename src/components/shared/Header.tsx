"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Coffee, Menu, Gift, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useData } from '../Providers';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Menu', icon: Coffee },
  { href: '/promotions', label: 'Promotions', icon: Gift },
  { href: '/reviews', label: 'Reviews', icon: MessageSquare },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { settings } = useData();

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
        <Link href="/" className="flex items-center gap-2">
            {settings.logo && (
                <Image src={settings.logo} alt="logo" width={40} height={40} className="rounded-full" />
            )}
          <span className="hidden font-headline text-xl font-bold sm:inline-block">
            {settings.name}
          </span>
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
                <div className="flex h-full flex-col">
                    <Link href="/" className="mb-6 flex items-center gap-2">
                        {settings.logo && (
                            <Image src={settings.logo} alt="logo" width={40} height={40} className="rounded-full" />
                        )}
                        <span className="font-headline text-xl font-bold">
                            {settings.name}
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
