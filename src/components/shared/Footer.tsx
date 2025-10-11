"use client";

import Link from "next/link";
import { useData } from "../Providers";
import { Skeleton } from "../ui/skeleton";

export default function Footer() {
    const { settings, isLoading } = useData();

    if(isLoading) {
        return (
            <footer className="bg-muted text-muted-foreground">
                <div className="container mx-auto flex flex-col items-center gap-2 px-4 py-6 text-center text-sm">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="mt-4 h-4 w-56" />
                </div>
            </footer>
        )
    }

    return (
        <footer className="bg-muted text-muted-foreground">
            <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-6 text-center text-sm">
                <div>
                    <p className="font-bold">{settings.name}</p>
                    <p>{settings.address}</p>
                    <p>{settings.phone} | {settings.email}</p>
                </div>
                <p className="mt-4">&copy; {new Date().getFullYear()} {settings.name}. All Rights Reserved.</p>
            </div>
        </footer>
    );
}
