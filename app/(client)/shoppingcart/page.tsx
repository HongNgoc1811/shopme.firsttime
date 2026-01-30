'use client'
import React, {useEffect, useState} from "react";
import { Image, Button, Card, CardBody, Divider, Input } from "@heroui/react";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react"; // Cần cài lucide-react
interface CartItem {
    id: number
    quantity: number
    product_option: {
        id: number
        color: string
        size: string
        inventory: number
        product: {
            id: number
            name: string
            price: number
            picture: string
        }
    }
}
export default function ShoppingCart() {
    // Dữ liệu mẫu trong giỏ hàng
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(true)
    const subtotal = cartItems.reduce(
        (acc, item) =>
            acc + item.product_option.product.price * item.quantity,
        0
    )
    useEffect(() => {
        console.log('cartItems', cartItems)
    }, [cartItems]);
    const shipping = 50000
    const total = subtotal + shipping
    useEffect(() => {
        async function loadCart() {
            try {
                const res = await fetch("/api/cart", { cache: "no-store" });
                if (!res.ok) {
                    // Thử đọc lỗi từ JSON nếu có, nếu không thì hiện status
                    const errorData = await res.json().catch(() => ({}));
                    console.error("API error:", res.status, errorData.message);
                    return;
                }
                const data = await res.json();
                setCartItems(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error("Load cart error:", e);
            } finally {
                setLoading(false);
            }
        }
        loadCart();
    }, []);
    const increaseQty = async (item: CartItem) => {
        const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                product_option_id: item.product_option.id,
                quantity: 1,
            }),
        })
        if (!res.ok) {
            alert("Không thể thêm sản phẩm (hết hàng hoặc lỗi)")
            return
        }
        setCartItems(prev =>
            prev.map(i =>
                i.id === item.id
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            )
        )
    }
    const decreaseQty = async (item: CartItem) => {
        const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                product_option_id: item.product_option.id,
                quantity: -1,
            }),
        })
        if (!res.ok) return
        setCartItems(prev =>
            item.quantity === 1
                ? prev.filter(i => i.id !== item.id) // 👈 xóa khỏi UI
                : prev.map(i =>
                    i.id === item.id
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                )
        )
    }
    const removeItem = async (item: CartItem) => {
        const res = await fetch("/api/cart", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                product_option_id: item.product_option.id,
            }),
        })

        if (!res.ok) return

        setCartItems(prev => prev.filter(i => i.id !== item.id))
    }
    return (
        <section className="min-h-screen py-24 px-6 bg-white dark:bg-[#020203] transition-colors">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-10 flex items-center gap-3">
                    Giỏ hàng của bạn
                    <span className="text-sm font-normal text-gray-500">({cartItems.length} sản phẩm)</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* CỘT 1: DANH SÁCH SẢN PHẨM */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 md:gap-6 border-b border-gray-100 dark:border-white/5 pb-6">
                                <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-100 dark:bg-white/5 rounded-2xl overflow-hidden">
                                    <Image src={ "/picturehomepage.png"}
                                           alt={item.product_option.product.name} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.product_option.product.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {item.product_option.color} | {item.product_option.size || "Tiêu chuẩn"}
                                            </p>
                                        </div>
                                        <p className="font-bold text-pink-500">
                                            {item.product_option.product.price.toLocaleString()}đ
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        {/* Bộ tăng giảm số lượng */}
                                        <div className="flex items-center gap-3 bg-gray-100 dark:bg-white/5 rounded-full px-3 py-1">
                                            <button onClick={() => decreaseQty(item)}  className="p-1 hover:text-purple-500"><MinusIcon size={16} /></button>
                                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => increaseQty(item)} className="p-1 hover:text-purple-500"><PlusIcon size={16} /></button>
                                        </div>
                                        <button onClick={() => removeItem(item)} className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm">
                                            <TrashIcon size={16} /> Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CỘT 2: TÓM TẮT THANH TOÁN */}
                    <div className="lg:col-span-1">
                        <Card className="bg-gray-50 dark:bg-white/5 border-none p-6 shadow-none">
                            <CardBody className="gap-4">
                                <h3 className="text-xl font-bold mb-2">Tổng đơn hàng</h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Tạm tính</span>
                                        <span className="text-gray-900 dark:text-white">{subtotal.toLocaleString()}đ</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Phí vận chuyển</span>
                                        <span className="text-gray-900 dark:text-white">{shipping.toLocaleString()}đ</span>
                                    </div>
                                    <Divider className="my-2 dark:bg-white/10" />
                                    <div className="flex justify-between text-xl font-bold">
                                        <span>Tổng cộng</span>
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                                            {total.toLocaleString()}đ
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <Input
                                        label="Mã giảm giá"
                                        variant="bordered"
                                        size="sm"
                                        classNames={{ inputWrapper: "rounded-xl border-gray-200 dark:border-white/10" }}
                                    />
                                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold h-12 rounded-xl shadow-lg shadow-purple-500/20">
                                        THANH TOÁN NGAY
                                    </Button>
                                    <Button variant="light" className="w-full text-gray-500 font-medium h-12" radius="lg">
                                        Tiếp tục mua sắm
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Thông tin hỗ trợ */}
                        <div className="mt-6 p-4 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
                            <p className="text-xs text-gray-500 text-center uppercase tracking-widest font-bold">
                                🛡️ Bảo hành chính hãng 24 tháng
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}