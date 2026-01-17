// import {supabaseAdmin} from "@/utils/supabase/server";
// import {NextResponse} from "next/server";
//
// export const OrderService = {
//     async getAll() {
//         const {data, error} = await supabaseAdmin
//             .from('orders')
//             .select('*')
//             .order('created_at', {ascending: false})
//         return {data, error}
//     },
//     async create(insertData: any) {
//         const {data, error} = await supabaseAdmin
//             .from('orders')
//             .insert([insertData])
//             .select()
//             .single()
//         return {data, error}
//     },
//     async getById(id: number) {
//         const {data, error} = await supabaseAdmin
//             .from('orders')
//             .select('*')
//             .eq('id', id)
//             .single()
//         return {data, error}
//     },
//     async update(id: number, updateData: any) {
//         const { data, error } = await supabaseAdmin
//             .from('orders')
//             .update(updateData)
//             .eq('id', id)
//             .select()
//             .single()
//         return {data, error}
//     },
//     async delete(id: number) {
//         const { error } = await supabaseAdmin
//             .from('orders')
//             .delete()
//             .eq('id',id)
//         return{error}
//     }
//
// }

import { supabaseAdmin } from "@/utils/supabase/server";

export const OrderService = {
        async getAll() {
            const { data, error } = await supabaseAdmin
                .from("orders")
                .select(`
                id,
                order_code,
                quantity,
                total_price,
                status,
                created_at,
                user_id,
                profiles:user_id (name, email),
                products:product_id (name, price)
            `)
                .order("created_at", { ascending: false });

            return { data, error };
        },

    async create(insertData: any) {
        const { data, error } = await supabaseAdmin
            .from("orders")
            .insert(insertData) //
            .select()
            .single();

        return { data, error };
    },

    async getById(id: number) {
        const { data, error } = await supabaseAdmin
            .from("orders")
            .select(`
        id,
        order_code,
            quantity,
        total_price,
        status,
        created_at,
        profiles (
          id,
          name
        ),
        products (
          id,
          name,
          price
        )
      `)
            .eq("id", id)
            .single();

        return { data, error };
    },

    async update(id: number, updateData: any) {
        const { data, error } = await supabaseAdmin
            .from("orders")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        return { data, error };
    },

    async delete(id: number) {
        const { error } = await supabaseAdmin
            .from("orders")
            .delete()
            .eq("id", id);

        return { error };
    }
};
