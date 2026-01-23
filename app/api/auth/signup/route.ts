import {UserService} from "@/services/users/user";
import {supabaseAdmin} from "@/utils/supabase/admin";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json()
        console.log("user", body)
        let dataUser;
        if (body.profile) {
            const itemProfile = {
                ...body.profile,
            }
            const {data, error} = await UserService.create(itemProfile)
            // console.log("------hien thi roi",data)
            // console.log("----loi roi-",error)
            // console.log("---------profile----",itemProfile)
            if (data) {
                dataUser = data;
            }
            if (error) return NextResponse.json(error, {status: 500})
        }
        if (body.auth) {
            const {data: dataAuth, error: errorAuth} = await supabaseAdmin.auth.admin.createUser({
                email: body.auth.email,
                password: body.auth.password,
                email_confirm: true,
                user_metadata: {
                    full_name: body.profile.name,
                    avatar_url: body.profile.avatar_url,
                    role: body.profile.role,
                },
            });
            // console.log("---loi auth", errorAuth)
            // console.log("----hien thi auth",dataAuth)
            if (errorAuth) return NextResponse.json(errorAuth, {status: 500})
        }

        return NextResponse.json(dataUser, {status: 200})

    } catch (e) {
        console.log(e)
        return NextResponse.json(e.message, {status: 500})
    }

}