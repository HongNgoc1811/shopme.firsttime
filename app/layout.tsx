import "@/styles/globals.css";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";
import {Providers} from "@/app/(client)/providers";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html  lang="en" suppressHydrationWarning>
        <body
            suppressHydrationWarning
            className={clsx(
                "min-h-screen text-foreground bg-background font-sans antialiased",
                fontSans.variable,
            )}
        >
        <Providers  themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            {children}
        </Providers>
        </body>
        </html>
    );
}
