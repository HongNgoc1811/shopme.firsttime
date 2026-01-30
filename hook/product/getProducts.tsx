'use client'
import {useEffect, useState} from "react"

export function useProducts() {
    const [products, setProducts] = useState<any[]>([])
    useEffect(() => {
        async function reloadProduct() {
            const res = await fetch("/api/admin/products", {
                method: "GET",
            })
            const data = await res.json()
            const raw = Array.isArray(data) ? data : data?.data ?? []
            const listProduct = Object.values(
                raw.reduce((acc: any, item: any) => {
                    const productId = item.products.id

                    // nếu product chưa tồn tại
                    if (!acc[productId]) {
                        acc[productId] = {
                            ...item.products,
                            option: [],
                        };
                    }
                    // push option
                    acc[productId].option.push({
                        id: item.id,
                        id_product: item.id_product,
                        color: item.color,
                        size: item.size, // convert size thành array
                        inventory: item.inventory,
                        created_at: item.created_at,
                    });

                    return acc;
                }, {})
            );
            console.log(listProduct);
            setProducts(listProduct)
        }

        reloadProduct()
    }, [])
    return {products}
}
