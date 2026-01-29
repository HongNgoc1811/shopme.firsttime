'use client'
import React, { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, Image, Button } from "@heroui/react";
import { Link } from "@heroui/link";
import { useProducts } from "@/hook/product/getProducts";

export default function LaptopPage() {
    const [accessories, setAccessories] = useState([]);
    const { products } = useProducts();

    useEffect(() => {
        if (products) setAccessories(products);
    }, [products]);

    return (
        // Nền thay đổi theo theme: Sáng (gray-50), Tối (zinc-950)
        <section className="min-h-screen max-w-7xl mx-auto px-4 py-12 bg-gray-50 dark:bg-[#050505] transition-colors duration-500">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                <div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400">
                        ACCESSORY FLAGSHIP
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
                        Sức mạnh dẫn đầu, thiết kế tương lai.
                    </p>
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hidden md:block"></div>
            </div>

            {/* Grid danh sách Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {accessories
                    .filter((item: any) => item.product_type?.includes('accessories'))
                    .map((item: any) => (
                        <Card
                            key={item.id}
                            isPressable
                            className="group border-none bg-white dark:bg-[#121212] shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
                        >
                            <CardBody className="p-0 overflow-hidden relative">
                                {/* Badge giảm giá hoặc New */}
                                <div className="absolute top-3 right-3 z-10">
                                <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-white/20">
                                    NEW ARRIVAL
                                </span>
                                </div>

                                <Image
                                    alt={item.name}
                                    className="w-full object-cover h-[220px] group-hover:scale-110 transition-transform duration-500"
                                    src={'/picturehomepage.png'} // Bạn có thể thay bằng item.picture nếu có
                                />
                            </CardBody>

                            <CardFooter className="flex flex-col items-start p-5 bg-white dark:bg-[#121212]">
                                <div className="w-full flex justify-between items-start mb-1">
                                    <b className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate">
                                        {item.name}
                                    </b>
                                </div>

                                <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                                    {Number(item.price).toLocaleString()}đ
                                </p>

                                <div className="flex gap-2 mt-4 w-full">
                                    <Button
                                        as={Link}
                                        href={`/category/laptops/${item.id}`}
                                        className="w-full bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-white font-bold group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:text-white transition-all"
                                        variant="flat"
                                        radius="lg"
                                    >
                                        Xem chi tiết
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
            </div>
        </section>
    );
}