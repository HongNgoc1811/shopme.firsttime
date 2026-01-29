"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Chip, Divider, Card, CardBody } from "@heroui/react";
import { ShoppingCart, ShieldCheck, Truck, RefreshCw, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductOption {
    id: string | number;
    id_product: string | number;
    color: string;
    size: string;
    inventory: number;
}
interface Product {
    id: string | number;
    name: string;
    price: string | number;
    status: "available" | "unavailable" | "low_stock";
    description: string;
    option: ProductOption[];
}
const statusColorMap: Record<string, "success" | "danger" | "warning" | "default"> = {
    available: "success",
    unavailable: "danger",
    low_stock: "warning",
};

export default function SmartPhoneDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function reloadProduct() {
            try {
                setLoading(true);
                const res = await fetch(`/api/admin/products/${id}`, { method: "GET" });
                const data = await res.json();
                // KIỂM TRA NẾU DATA KHÔNG PHẢI MẢNG THÌ BIẾN NÓ THÀNH MẢNG
                const dataArray = Array.isArray(data) ? data : [data];
                if (dataArray.length === 0 || !dataArray[0]) {
                    setProduct(null);
                    return;
                }
                const productMap = dataArray.reduce((acc: any, item: any) => {
                    // Thêm kiểm tra an toàn cho item.products
                    const productId = item.products?.id || item.id;
                    if (!acc[productId]) {
                        acc[productId] = {
                            ...(item.products || item),
                            option: []
                        };
                    }
                    if (item.color || item.size) {
                        acc[productId].option.push({
                            id: item.id,
                            color: item.color,
                            size: item.size,
                            inventory: item.inventory,
                        });
                    }
                    return acc;
                }, {});
                const result = Object.values(productMap)[0] as Product;
                setProduct(result);
                if (result?.option?.length) setSelectedOption(result.option[0]);
            } catch (error) {
                console.error("Lỗi fetch:", error);
            } finally {
                setLoading(false);
            }
        }
        if (id) reloadProduct();
    }, [id]);

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-[#020203]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-purple-500 font-medium animate-pulse">Loading...</p>
            </div>
        </div>
    );

    if (!product) return (
        <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-[#020203]">
            <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
            <Button onPress={() => router.back()}>Quay lại</Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#020203] py-3 px- sm:px-6 transition-colors duration-500">
            <div className="max-w-6xl mx-auto">
                {/* Nút quay lại */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-purple-500 transition-colors mb-8 group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform"/>
                    <span>Quay lại cửa hàng</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

                    {/* KHỐI TRÁI: HÌNH ẢNH */}
                    <div className="space-y-4">
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#0a0a0b] border border-gray-200 dark:border-white/5 p-4 sm:p-10 shadow-2xl shadow-purple-500/5">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent opacity-30" />
                            <img
                                src='/picturehomepage.png'
                                className="relative z-10 w-4/5 h-auto object-contain transform hover:scale-110 transition-transform duration-700"
                                alt={product.name}
                            />
                            <div className="absolute bottom-10 w-1/2 h-4 bg-black/20 dark:bg-purple-500/10 blur-2xl rounded-[100%] z-0" />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: <ShieldCheck className="text-purple-500" />, label: "Bảo hành 24T" },
                                { icon: <Truck className="text-pink-500" />, label: "Giao nhanh 2h" },
                                { icon: <RefreshCw className="text-orange-500" />, label: "Đổi trả 7 ngày" }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center justify-center p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                    {item.icon}
                                    <span className="text-[10px] sm:text-xs font-bold mt-2 text-gray-500 uppercase tracking-tighter text-center">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* KHỐI PHẢI: CHI TIẾT */}
                    <div className="flex flex-col justify-center">
                        <div className="mb-8">
                            <Chip
                                variant="flat"
                                color={statusColorMap[product.status] || "default"}
                                className="mb-4 uppercase text-[10px] font-bold tracking-[0.2em] px-3"
                            >
                                {product.status.replace('_', ' ')}
                            </Chip>
                            <h1 className="text-2xl sm:text-4xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white leading-none">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <p className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400">
                                    {Number(product.price).toLocaleString()} <span className="text-lg">VNĐ</span>
                                </p>
                            </div>
                        </div>

                        <Divider className="my-4 opacity-50" />

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest">Mô tả sản phẩm</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                    {product.description || "Đang cập nhật nội dung mô tả sản phẩm..."}
                                </p>
                            </div>

                            {/* CHỌN CẤU HÌNH */}
                            <div>
                                <h3 className="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest">Tùy chọn phiên bản</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {product.option?.map((opt) => (
                                        <Card
                                            key={opt.id}
                                            isPressable
                                            onPress={() => setSelectedOption(opt)}
                                            className={`border-2 transition-all duration-300 ${
                                                selectedOption?.id === opt.id
                                                    ? "border-purple-500 bg-purple-500/5 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                                                    : "border-gray-200 dark:border-white/5 bg-transparent"
                                            }`}
                                        >
                                            <CardBody className="p-4 flex flex-row justify-between items-center">
                                                <div className="text-left">
                                                    <p className="font-bold text-gray-800 dark:text-white">Màu {opt.color}</p>
                                                    <p className="text-xs text-gray-500">{opt.size || 'Tiêu chuẩn'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-pink-500 uppercase tracking-widest">Kho: {opt.inventory}</p>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* NÚT THÊM VÀO GIỎ */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <Button
                                size="md"
                                className="flex-1 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-md shadow-[0_10px_40px_rgba(168,85,247,0.3)] hover:shadow-[0_10px_40px_rgba(168,85,247,0.5)] transition-all active:scale-95"
                                radius="lg"
                                startContent={<ShoppingCart size={24} strokeWidth={3} />}
                            >
                                THÊM VÀO GIỎ
                            </Button>
                            <Button
                                isIconOnly
                                variant="bordered"
                                size="lg"
                                className="h-16 w-16 border-gray-200 dark:border-white/10"
                                radius="lg"
                            >
                                🤍
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}