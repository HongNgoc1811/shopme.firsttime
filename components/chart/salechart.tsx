"use client";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight } from "lucide-react";

// Dữ liệu mẫu doanh thu 6 tháng
const data = [
    { name: "Tháng 1", total: 4000 },
    { name: "Tháng 2", total: 3000 },
    { name: "Tháng 3", total: 5000 },
    { name: "Tháng 4", total: 2780 },
    { name: "Tháng 5", total: 1890 },
    { name: "Tháng 6", total: 2390 },
];

export default function SalesChart() {
    return (
        <Card className="lg:col-span-2 shadow-sm border-none mt-6">
            <CardHeader className="flex justify-between items-center px-6 pt-6">
                <div>
                    <h3 className="text-lg font-bold">Doanh thu theo thời gian</h3>
                    <p className="text-small text-default-400">Hiệu suất 6 tháng gần nhất</p>
                </div>
                <Button size="sm" variant="flat" endContent={<ArrowUpRight size={16}/>}>
                    Chi tiết
                </Button>
            </CardHeader>
            <CardBody className="px-2 pb-6">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#006FEE" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#006FEE" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{fontSize: 12, fill: '#888'}}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{fontSize: 12, fill: '#888'}}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#006FEE"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorTotal)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardBody>
        </Card>
    );
}