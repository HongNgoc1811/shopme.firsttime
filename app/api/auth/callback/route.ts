import {NextResponse} from "next/server";
import {createSupabaseServer} from "@/utils/supabase/server";
import {UserService} from "@/services/users/user";
import {data} from "framer-motion/m";

export async function GET(request: Request) {
    const {searchParams, origin} = new URL(request.url);
    const code = searchParams.get("code");

    let next = searchParams.get("next") || "/";
    if (!next.startsWith("/")) next = "/";
    if (!code) {
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    const supabase = await createSupabaseServer();

    // 🔥 DÒNG QUAN TRỌNG NHẤT
    const {data: sessionData, error} = await supabase.auth.exchangeCodeForSession(code);
    const user = sessionData.user;
    console.log("useruseruser", user);
    const itemCreatUserconst = {
            name: user.user_metadata.full_name,
            role: "User",
            status: "active",
            avatar_url: user.user_metadata.avatar_url,
            age: null,
            email: user.email,

    }
    const { data: dataUser, error: errorUser } = await UserService.create(itemCreatUserconst)
    console.log("------hien thi roi",errorUser)
    if (error) {
        console.error("Exchange error:", error);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    return NextResponse.redirect(`${origin}${next}`);
}
