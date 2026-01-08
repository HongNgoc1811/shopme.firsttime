import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "@/app/(client)/providers";
import { NavbarAdmin } from "@/components/admin/navbar";
import Sidebar from "@/components/admin/sidebar";

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    icons: {
        icon: "/favicon.ico",
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html suppressHydrationWarning lang="en">
        <body
            className={clsx(
                "min-h-screen text-foreground bg-background font-sans antialiased",
                fontSans.variable,
            )}
        >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="flex h-screen flex-col">
                <NavbarAdmin />

                <div className="flex flex-1 pt-16">
                    {/* Sidebar fixed */}
                    <Sidebar />

                    {/* Main content – chừa chỗ cho sidebar */}
                    <main className="ml-64 flex-1 overflow-y-auto px-6 py-6">
                        {children}
                    </main>
                </div>

                <footer className="w-full flex items-center justify-center py-3 border-t">
                    <Link
                        isExternal
                        className="flex items-center gap-1 text-current"
                        href="https://heroui.com"
                    >
                        <span className="text-default-600">Powered by</span>
                        <p className="text-primary">HeroUI</p>
                    </Link>
                </footer>
            </div>

        </Providers>
        </body>
        </html>
    );
}
