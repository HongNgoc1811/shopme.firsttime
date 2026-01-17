
'use client'
import dynamic from "next/dynamic";
const TableProduct = dynamic(() => import("@/components/tables/products/TableProduct"), {ssr: false});
export  default function Products(){
    return(
        <TableProduct/>
    )
}