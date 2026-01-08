
'use client'

import {
    Card,
    CardBody,
    CardHeader,
    Chip,
    Progress,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@heroui/react";
import {Button} from "@heroui/button";
import {ArrowUpRight, DollarSign, MoreVertical, TrendingUp, Users} from "lucide-react";
import {Package} from "lucide-react";
import SalesChart from "@/components/chart/salechart";

export  default function Dashboard(){
    return (
        <div className=" space-y-6">
            {/* 1. Stats Row: Các thẻ thông số nhanh */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
                <StatItem title="Doanh thu" value="128.430.000đ" icon={<DollarSign className="text-blue-600"/>} trend="+12.5%" isNegative/>
                <StatItem title="Đơn hàng mới" value="156" icon={<Package className="text-orange-600"/>} trend="+5.2%" isNegative/>
                <StatItem title="Khách hàng" value="2,420" icon={<Users className="text-purple-600"/>} trend="+18.7%" isNegative />
                <StatItem title="Tỷ lệ hủy" value="1.2%" icon={<TrendingUp className="text-red-600"/>} trend="-0.4%" isNegative />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 2. Main Analytics: Biểu đồ hoặc Tiến độ mục tiêu */}
                <Card className="lg:col-span-2 shadow-sm border-none">
                    <SalesChart/>
                </Card>
                {/* 3. Top Products: Sản phẩm bán chạy */}
                <Card className="shadow-sm border-none">
                    <CardHeader className="px-6 pt-6 font-bold text-lg">Sản phẩm bán chạy</CardHeader>
                    <CardBody className="space-y-5">
                        <ProductProgress name="iPhone 15 Pro" sales="120" value={85} color="primary" />
                        <ProductProgress name="MacBook Air M2" sales="85" value={60} color="secondary" />
                        <ProductProgress name="iPad Pro M2" sales="54" value={40} color="warning" />
                        <ProductProgress name="Apple Watch S9" sales="32" value={25} color="success" />
                    </CardBody>
                </Card>
            </div>

            {/* 4. Recent Transactions: Bảng giao dịch gần đây */}
            <Card className="shadow-sm border-none">
                <CardHeader className="flex justify-between items-center px-6 pt-6">
                    <h3 className="text-lg font-bold">Giao dịch gần đây</h3>
                    <Button isIconOnly size="sm" variant="light"><MoreVertical size={20}/></Button>
                </CardHeader>
                <CardBody className="p-0">
                    <Table aria-label="Recent transactions table" removeWrapper>
                        <TableHeader>
                            <TableColumn>MÃ ĐƠN</TableColumn>
                            <TableColumn>SẢN PHẨM</TableColumn>
                            <TableColumn>NGÀY</TableColumn>
                            <TableColumn>SỐ TIỀN</TableColumn>
                            <TableColumn>TRẠNG THÁI</TableColumn>
                        </TableHeader>
                        <TableBody>
                            <TableRow key="1">
                                <TableCell className="font-medium">#ORD-7721</TableCell>
                                <TableCell>Tai nghe Sony WH-1000XM5</TableCell>
                                <TableCell className="text-gray-500">07/01/2026</TableCell>
                                <TableCell>7.500.000đ</TableCell>
                                <TableCell><Chip size="sm" color="success" variant="flat">Thành công</Chip></TableCell>
                            </TableRow>
                            <TableRow key="2">
                                <TableCell className="font-medium">#ORD-7722</TableCell>
                                <TableCell>Bàn phím cơ Keychron K2</TableCell>
                                <TableCell className="text-gray-500">07/01/2026</TableCell>
                                <TableCell>1.850.000đ</TableCell>
                                <TableCell><Chip size="sm" color="warning" variant="flat">Đang giao</Chip></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </div>
    );
}

/* Component con cho các thẻ chỉ số */
function StatItem({ title, value, icon, trend, isNegative }) {
    return (
        <Card className="border-none shadow-sm overflow-hidden">
            <CardBody className="flex flex-row items-center gap-4 p-5">
                <div className="p-3 bg-gray-100 rounded-xl">{icon}</div>
                <div>
                    <p className="text-small text-default-500">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h4 className="text-xl font-bold">{value}</h4>
                        <span className={`text-[10px] font-bold ${isNegative ? "text-red-500" : "text-green-500"}`}>
              {trend}
            </span>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

/* Component con hiển thị tiến độ sản phẩm */
function ProductProgress({ name, sales, value, color }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-small">
                <span className="font-medium">{name}</span>
                <span className="text-default-400">{sales} đơn</span>
            </div>
            <Progress size="sm" value={value} color={color} aria-label={name} />
        </div>
    );
}
