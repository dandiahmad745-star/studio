
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, Menu, Gift, MessageSquare, Clock, Users, Briefcase, Music, Star, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useData, useAuth } from '../Providers';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';
import { useEffect, useState } from 'react';
import { getShopStatus } from '@/lib/shop-status';
import { Badge } from '../ui/badge';
import PageTransitionLoader from './PageTransitionLoader';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';


const mainNavLinks = [
  { href: '/', label: 'Menu', icon: Coffee },
  { href: '/promotions', label: 'Promotions', icon: Gift },
  { href: '/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/baristas', label: 'Our Baristas', icon: Users },
  { href: '/membership', label: 'Membership', icon: Star },
];

const MobileLink = ({ href, children, onClick }: { href: string, children: React.ReactNode, onClick?: () => void }) => (
  <Link href={href} onClick={onClick} className={cn(
    'flex items-center gap-2 rounded-md px-3 py-2 text-lg font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-accent-foreground',
    usePathname() === href && 'bg-primary/10 text-primary'
  )}>
    {children}
  </Link>
);

const MobileExternalLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className='flex items-center gap-2 rounded-md px-3 py-2 text-lg font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-accent-foreground'
    >
        {children}
    </a>
);


export default function Header() {
  const pathname = usePathname();
  const { settings, isLoading } = useData();
  const { currentUser, customerLogout } = useAuth();
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
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


  const renderNavLinks = (links: typeof mainNavLinks) =>
    links.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          pathname === link.href
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
        )}
      >
        <link.icon className="h-5 w-5" />
        {link.label}
      </Link>
    ));

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <PageTransitionLoader />
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            {isLoading ? (
              <Skeleton className="h-10 w-10 rounded-full" />
            ) : (
              settings.logo && (
                <Image
                  src={settings.logo}
                  alt="logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )
            )}
          </Link>
          <div className="flex flex-col items-start leading-none">
            <span className="font-headline text-xl font-bold">
              {isLoading ? <Skeleton className="h-6 w-32" /> : settings.name}
            </span>
            {shopStatus && (
              <Badge
                variant={shopStatus.isOpen ? 'default' : 'destructive'}
                className={cn(
                  'mt-1 w-fit gap-1.5 px-2 py-0.5 text-xs font-medium leading-none',
                  shopStatus.isOpen
                    ? 'bg-green-600/10 text-green-700 border-green-600/20'
                    : 'bg-red-600/10 text-red-700 border-red-600/20'
                )}
              >
                <Clock className="h-3 w-3" />
                <span>{shopStatus.message}</span>
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
            <nav className="hidden items-center gap-2 md:flex">
                {renderNavLinks(mainNavLinks)}
                 {currentUser ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar>
                                    <AvatarFallback>{currentUser.fullName.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{currentUser.fullName}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/profile">
                                    <UserCircle className="mr-2 h-4 w-4" />
                                    <span>Profil</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={customerLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Keluar</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Link href="/login">
                        <Button>Login</Button>
                    </Link>
                )}
            </nav>
            <div className="md:hidden">
                <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
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
                        <Link href="/" onClick={() => setIsMobileSheetOpen(false)} className="mb-6 flex items-center gap-2">
                            {isLoading ? (
                                <Skeleton className="h-10 w-10 rounded-full" />
                            ) : settings.logo && (
                                <Image src={settings.logo} alt="logo" width={40} height={40} className="rounded-full" />
                            )}
                            <span className="font-headline text-xl font-bold">
                                {isLoading ? <Skeleton className="h-6 w-32" /> : settings.name}
                            </span>
                        </Link>
                        <nav className="flex flex-1 flex-col gap-4">
                            {mainNavLinks.map(link => (
                                <MobileLink href={link.href} key={`mob-${link.href}`} onClick={() => setIsMobileSheetOpen(false)}>
                                    <link.icon className="h-5 w-5" />
                                    {link.label}
                                </MobileLink>
                            ))}
                            <MobileLink href="/jobs" onClick={() => setIsMobileSheetOpen(false)}>
                                <Briefcase className="h-5 w-5" />
                                Lowongan Kerja
                            </MobileLink>
                            {settings.playlistUrl && (
                                <MobileExternalLink href={settings.playlistUrl}>
                                    <Music className="h-5 w-5" />
                                    Playlist Kafe
                                </MobileExternalLink>
                            )}
                        </nav>
                         <div className="mt-6">
                            {currentUser ? (
                                <div className="space-y-2">
                                     <MobileLink href="/profile" onClick={() => setIsMobileSheetOpen(false)}>
                                        <UserCircle className="h-5 w-5" />
                                        Profil
                                    </MobileLink>
                                    <Button variant="outline" className="w-full justify-start" onClick={() => { customerLogout(); setIsMobileSheetOpen(false); }}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Keluar
                                    </Button>
                                </div>
                            ) : (
                                <Link href="/login" className="w-full" onClick={() => setIsMobileSheetOpen(false)}>
                                    <Button className="w-full">Login</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </SheetContent>
                </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
