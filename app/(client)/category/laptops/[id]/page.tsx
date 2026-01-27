"use client";

import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Button, Chip} from "@heroui/react";

const statusColorMap = {
    available: "success",
    unavailable: "danger",
    low_stock: "warning",
};
export default function LaptopDetailPage() {
    const {id} = useParams();
    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        async function reloadProduct() {
            const res = await fetch(`/api/admin/products/${id}`, {method: "GET",})
            const data = await res.json()
            const productMap = data?.reduce((acc: any, item: any) => {
                const productId = item.products.id;

                if (!acc[productId]) {
                    acc[productId] = {
                        ...item.products,
                        option: [],
                    };
                }
                acc[productId].option.push({
                    id: item.id,
                    id_product: item.id_product,
                    color: item.color,
                    size: item.size,
                    inventory: item.inventory,
                    created_at: item.created_at,
                });

                return acc;
            }, {});
            const product = productMap
                ? Object.values(productMap)[0]
                : null;
            console.log("product", product);
            setProduct(product)
        }

        reloadProduct()
    }, [id])

    if (!product) return null;

    return (
        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <img
                src='/picturehomepage.png'
                className="rounded-xl border"
            />

            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold">{product.name}</h1>

                <p className="text-3xl text-red-500">
                    {product.price} đ
                </p>

                <Chip color={statusColorMap[product.status]}>{product.status}</Chip>
                <p className="text-gray-600">{product.description}</p>
                {product.option?.map((option) => (
                    <div key={option.id}>
                        <p className="text-gray-600">Color: {option.color}</p>
                        <p className="text-gray-600">Size: {option.size || '-'}</p>
                        <p className="text-gray-600">Inventory: {option.inventory}</p>
                    </div>
                ))}
                <Button color="primary">Thêm vào giỏ hàng</Button>
            </div>
        </div>
    );
}
