"use client";

import { useData } from "../Providers";

export default function Footer() {
    const { settings } = useData();

    return (
        <footer className="bg-muted text-muted-foreground">
            <div className="container mx-auto px-4 py-6 text-center text-sm">
                <p className="font-bold">{settings.name}</p>
                <p>{settings.address}</p>
                <p>{settings.phone} | {settings.email}</p>
                <p className="mt-4">&copy; {new Date().getFullYear()} {settings.name}. All Rights Reserved.</p>
            </div>
        </footer>
    );
}
