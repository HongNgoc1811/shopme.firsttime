'use client';

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/react";
import { Link } from "@heroui/link";
import { title, subtitle } from "@/components/primitives";
import {
    ShoppingCart,
    ShieldCheck,
    Truck,
    Star,
    Cpu,
    Smartphone,
    Headphones,
} from "lucide-react";

export default function Home() {
    return (
        <section className="relative  overflow-hidden">

            {/* BACKGROUND GLOW */}
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-purple-500 to-pink-500 blur-[120px] opacity-30" />

            {/* HERO */}
            <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-default-100 px-4 py-1 text-sm mb-6">
                        <Star size={14} className="text-yellow-400" />
                        <span>Top shop công nghệ 2026</span>
                    </div>

                    <h1 className={title({ size: "lg" })}>
                        Nâng cấp <span className={title({ color: "violet" })}>công nghệ</span>
                        <br /> theo cách thông minh
                    </h1>

                    <p className={subtitle({ class: "mt-6 max-w-xl" })}>
                        Laptop, điện thoại, phụ kiện chính hãng.
                        Giá tốt – giao nhanh – bảo hành uy tín.
                    </p>

                    <div className="mt-8 flex gap-4">
                        <Button
                            size="lg"
                            color="primary"
                            className="shadow-xl"
                            startContent={<ShoppingCart size={18} />}
                        >
                            Mua ngay
                        </Button>

                        <Button size="lg" variant="bordered">
                            Xem khuyến mãi
                        </Button>
                    </div>

                    {/* TRUST */}
                    <div className="mt-10 flex gap-6 text-sm text-default-500">
                        <Trust icon={<ShieldCheck />} text="Hàng chính hãng" />
                        <Trust icon={<Truck />} text="Giao nhanh 24h" />
                    </div>
                </div>

                {/* IMAGE */}
                <div className="relative">
                    <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-purple-400 to-pink-400 blur-2xl opacity-40" />
                    <img
                        src="/picturehomepage.png"
                        className="relative rounded-[30px] shadow-2xl"
                        alt="Tech products"
                    />
                </div>
            </div>

            {/* CATEGORIES */}
            <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
                <h2 className={title({ size: "sm" })}>Danh mục sản phẩm</h2>

                <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <Category icon={<Cpu />} name="Laptop" />
                    <Category icon={<Smartphone />} name="Điện thoại" />
                    <Category icon={<Headphones />} name="Tai nghe" />
                    <Category icon={<Cpu />} name="Phụ kiện" />
                </div>
            </div>

            {/* FEATURES */}
            <div className="relative z-10 py-20 bg-default-100/60 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-3 gap-8">
                    <Feature
                        title="Chính hãng 100%"
                        desc="Cam kết nguồn gốc rõ ràng"
                    />
                    <Feature
                        title="Giao hàng nhanh"
                        desc="Toàn quốc chỉ từ 24h"
                    />
                    <Feature
                        title="Thanh toán linh hoạt"
                        desc="COD, ví điện tử, chuyển khoản"
                    />
                </div>
            </div>

            {/* CTA */}
            <div className="relative z-10 text-center py-24">
                <h2 className={title({ size: "sm" })}>
                    Sẵn sàng mua sắm?
                </h2>
                <p className={subtitle({ class: "mt-4" })}>
                    Khám phá hàng trăm sản phẩm công nghệ mới nhất
                </p>

                <div className="mt-8">
                    <Link href="/products">
                        <Button size="lg" color="primary" className="shadow-xl">
                            Khám phá ngay
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

/* COMPONENTS */
function Category({ icon, name }: any) {
    return (
        <Card
            isPressable
            className="group rounded-3xl border-none bg-background/60 backdrop-blur-xl hover:scale-[1.04] transition"
        >
            <CardBody className="flex flex-col items-center gap-4 py-12">
                <div className="text-purple-500 group-hover:scale-110 transition">
                    {icon}
                </div>
                <p className="font-semibold">{name}</p>
            </CardBody>
        </Card>
    );
}

function Feature({ title, desc }: any) {
    return (
        <div className="rounded-3xl bg-background/70 backdrop-blur-xl p-8 shadow-lg">
            <p className="font-semibold text-lg">{title}</p>
            <p className="mt-2 text-default-500">{desc}</p>
        </div>
    );
}

function Trust({ icon, text }: any) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-purple-500">{icon}</span>
            <span>{text}</span>
        </div>
    );
}
