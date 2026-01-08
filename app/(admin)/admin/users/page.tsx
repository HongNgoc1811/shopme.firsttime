
'use client'
import dynamic from "next/dynamic";
const TableUser = dynamic(() => import("@/components/tables/users/TableUser"), {ssr: false});
export  default function Users(){
    return(
        <TableUser/>
    )
}