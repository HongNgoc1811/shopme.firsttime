"use client";

import { Avatar, Button, Divider } from "@heroui/react";
import { User, Package, ShoppingCart } from "lucide-react";

const menu = [
    { label: "Dashboard", href: "/admin", icon: <User size={18} /> },
    { label: "User", href: "/admin/users", icon: <User size={18} /> },
    { label: "Product", href: "/admin/products", icon: <Package size={18} /> },
    { label: "Order", href: "/admin/orders", icon: <ShoppingCart size={18} /> },
];

export default function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col shadow-lg bg-background">
            <div className="flex flex-1 flex-col overflow-hidden p-4">
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5"
                        >
                            <path d="M3 6h18l-2 13H5L3 6zm5-3h8l1 2H7l1-2z" />
                        </svg>
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-lg font-bold tracking-tight">ShopMe</span>
                        <span className="text-xs text-default-500">E-commerce Admin</span>
                    </div>
                </div>

                <nav className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
                    {menu.map((item) => (
                        <Button
                            key={item.href}
                            as="a"
                            href={item.href}
                            variant="light"
                            startContent={item.icon}
                            className="justify-start"
                        >
                            {item.label}
                        </Button>
                    ))}
                </nav>
            </div>

            <div className="shrink-0 space-y-3 p-4 pt-0">
                <Divider />

                <div className="flex items-center gap-3">
                    <Avatar src="https://i.pravatar.cc/150" name="Ngoc" size="sm" />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">Nguyễn Ngọc</span>
                        <span className="text-xs text-default-500">admin@admin.com</span>
                    </div>
                </div>

                <p className="text-center text-xs text-default-400">ShopMe</p>
            </div>
        </aside>
    );
}
