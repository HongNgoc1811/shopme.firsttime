'use client'
import React, {useEffect, useState} from "react";
import {
    Card,
    CardBody,
    CardFooter,
    Image,
} from "@heroui/react";
import {Link} from "@heroui/link";
import {useProducts} from "@/hook/product/getProducts";

export default function AccessoriesPage() {
    const [accessories, setAccessories] = useState([]);
    const {products} = useProducts();
    useEffect(() => {
        setAccessories(products)
    }, [products]);
    return (
        <section className="max-w-7xl mx-auto px-2 py-2 bg-white">
            <h2 className="text-3xl font-bold mb-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Phụ kiện
            </h2>

            {/* Grid danh sách Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
                {accessories.filter((item) => item.product_type.includes('accessories')).map((item) => (
                    <Card
                        key={item.id}
                        isPressable
                        className="bg-gradient-to-r from-purple-400 to-pink-300 border border-white/10 hover:border-purple-500/50 transition-all group"
                    >
                        <CardBody className="p-0 overflow-hidden">
                            <Image
                                alt='image'
                                className="w-full object-cover h-[250px] group-hover:scale-110 transition-transform duration-500"
                                src={'/picturehomepage.png'}
                            />
                        </CardBody>
                        <CardFooter className="flex flex-col items-start gap-2 p-5">
                            <b className="text-lg text-white">{item.name}</b>
                            <p className="text-pink-600 font-semibold">{item.price}</p>
                            <Link href={`/category/laptops/${item.id}`}>Xem chi tiết</Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    ) ;
}