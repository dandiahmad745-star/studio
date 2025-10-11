"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, useData } from '../Providers';
import { Button } from '../ui/button';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from '../ui/sidebar';
import { Coffee, Gift, LayoutDashboard, LogOut, MessageSquare, Settings } from 'lucide-react';
import Image from 'next/image';

const adminNavLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/menu', label: 'Menu', icon: Coffee },
  { href: '/admin/promotions', label: 'Promotions', icon: Gift },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { settings } = useData();

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border">
         <div className="flex items-center gap-2 p-2">
            {settings.logo && (
                <Image src={settings.logo} alt="logo" width={40} height={40} className="rounded-full" />
            )}
            <div className='overflow-hidden'>
                <p className="truncate font-semibold text-sidebar-foreground">{settings.name}</p>
                <p className="text-xs truncate text-sidebar-foreground/70">Admin Panel</p>
            </div>
         </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {adminNavLinks.map((link) => (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href} className="w-full">
                <SidebarMenuButton
                  isActive={pathname === link.href}
                  className="w-full justify-start"
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={logout}>
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </>
  );
}
