import {supabaseAdmin} from "@/utils/supabase/admin";
import {NextResponse} from "next/server";

export const ProductService = {
    async getAll() {
        const {data, error} = await supabaseAdmin
            .from('products')
            .select('*')
            .order('created_at', {ascending: false})
        return {data, error}
    },
    async create(insertData: any) {
        const {data, error} = await supabaseAdmin
            .from('products')
            .insert([insertData])
            .select()
            .single()
        return {data, error}
    },
    async getById(id: number) {
        const {data, error} = await supabaseAdmin
            .from('products')
            .select('*')
            .eq('id', id)
            .single()
        return {data, error}
    },
    async update(id: number, updateData: any) {
        const { data, error } = await supabaseAdmin
            .from('products')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()
        return {data, error}
    },
    async delete(id: number) {
        const { error } = await supabaseAdmin
            .from('products')
            .delete()
            .eq('id',id)
        return{error}
    }

}