
'use client'
import dynamic from "next/dynamic";
const TableOrder = dynamic(() => import("@/components/tables/orders/TableOrder"), {ssr: false});
export  default function Orders(){
    return(
        <TableOrder/>
    )
}