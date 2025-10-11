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
import { Coffee, Gift, LayoutDashboard, LogOut, MessageSquare, Settings, Users, FolderKanban, CalendarClock, Send, Briefcase, QrCode } from 'lucide-react';
import Image from 'next/image';

const adminNavLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/menu', label: 'Menu', icon: Coffee },
  { href: '/admin/categories', label: 'Categories', icon: FolderKanban },
  { href: '/admin/promotions', label: 'Promotions', icon: Gift },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/baristas', label: 'Baristas', icon: Users },
  { href: '/admin/schedule', label: 'Schedule', icon: CalendarClock },
  { href: '/admin/leave-requests', label: 'Leave Requests', icon: Send, notificationKey: 'leave' },
  { href: '/admin/jobs', label: 'Job Vacancies', icon: Briefcase },
  { href: '/admin/absen-qr', label: 'Absen QR Code', icon: QrCode },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { settings, leaveRequests } = useData();
  
  const pendingLeaveRequests = leaveRequests.filter(req => req.status === 'Pending').length;

  const hasNotification = (key?: string) => {
    if (key === 'leave' && pendingLeaveRequests > 0) {
      return true;
    }
    return false;
  };

  const isExactOrParent = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

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
                  isActive={isExactOrParent(link.href)}
                  className="w-full justify-start relative"
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                  {hasNotification(link.notificationKey) && (
                     <span className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-red-500"></span>
                  )}
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
