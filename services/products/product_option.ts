import {supabaseAdmin} from "@/utils/supabase/server";
import {NextResponse} from "next/server";

const table = "product_option"
const id ="id_product"
export const ProductOptionService = {
    async getAll() {
        const {data, error} = await supabaseAdmin
            .from(table)
            .select('*,products(*)')
            .order('created_at', {ascending: false})
        return {data, error}
    },
    async create(insertData: any) {
        const {data, error} = await supabaseAdmin
            .from(table)
            .insert([insertData])
            .select()
            .single()
        return {data, error}
    },
    async getById(idItem: number) {
        const {data, error} = await supabaseAdmin
            .from(table)
            .select('*')
            .eq(id, idItem)
            .single()
        return {data, error}
    },
    async update(idItem: number, updateData: any) {
        const { data, error } = await supabaseAdmin
            .from(table)
            .update(updateData)
            .eq(id, idItem)
            .select()
            .single()
        return {data, error}
    },
    async delete(idItem: number) {
        const { error } = await supabaseAdmin
            .from(table)
            .delete()
            .eq(id,idItem)
        return{error}
    }

}