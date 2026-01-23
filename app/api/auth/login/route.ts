import {supabaseAdmin} from "@/utils/supabase/admin";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const {data, error} = await supabaseAdmin.auth.signInWithPassword(body)
        if (error) return NextResponse.json(error, {status: 500})
        return NextResponse.json(data.user, {status: 200})

    } catch (e) {
        console.log(e)
        return NextResponse.json(e.message, {status: 500})
    }

}