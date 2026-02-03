import {supabaseAdmin} from "@/utils/supabase/admin";
import {NextResponse} from "next/server";
import {createSupabaseServer} from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = await createSupabaseServer()
    // Kiểm tra user hiện tại
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // Kiểm tra role admin trong DB
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
    if (profile?.role !== 'Admin') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    try {
        const body = await req.json()
        const sp= await createSupabaseServer()
        const {data, error} = await sp.auth.signInWithPassword(body)
        if (error) return NextResponse.json(error, {status: 500})
        return NextResponse.json(data.user, {status: 200})

    } catch (e) {
        console.log(e)
        return NextResponse.json(e.message, {status: 500})
    }

}