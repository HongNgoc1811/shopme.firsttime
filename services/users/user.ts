import {supabaseAdmin} from "@/utils/supabase/admin";
import {NextResponse} from "next/server";

export const UserService = {
    async getAll() {
        const {data, error} = await supabaseAdmin
            .from('users')
            .select('*')
            .order('created_at', {ascending: false})
        return {data, error}
    },
    async create(insertData: any) {
        const {data, error} = await supabaseAdmin
            .from('users')
            .insert([insertData])
            .select()
            .single()
        return {data, error}
    },
    async getById(id: number) {
        const {data, error} = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', id)
            .single()
        return {data, error}
    },
    async update(id: number, updateData: any) {
        const { data, error } = await supabaseAdmin
            .from('users')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()
        return {data, error}
    },
    async delete(id: number) {
        const { error } = await supabaseAdmin
            .from('users')
            .delete()
            .eq('id',id)
        return{error}
    },
    async getByUid(uid_user: string) {
        const {data, error} = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('uid_user', uid_user)
            .single()
        return {data, error}
    },

}