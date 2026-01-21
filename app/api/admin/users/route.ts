import {NextResponse} from 'next/server'
import {UserService} from "@/services/users/user";
import {supabaseClient} from "@/utils/supabase/client";
import {supabaseAdmin} from "@/utils/supabase/admin";

// GET /api/users
export async function GET() {

    const {data, error} = await UserService.getAll()

    if (error) {
        return NextResponse.json(
            {message: error.message},
            {status: 500}
        )
    }

    return NextResponse.json(data)
}

// POST /api/users
export async function POST(req: Request) {
    try {
        const body = await req.json()
        console.log("user",body)
        if(body.profile){
            const itemProfile = {
                ...body.profile,
            }
            const { data, error } = await UserService.create(itemProfile)
            console.log("------hien thi roi",data)
            console.log("----loi roi-",error)
            console.log("---------profile----",itemProfile)
        }
        if(body.auth){
            const {data: dataAuth, error: errorAuth} = await  supabaseAdmin.auth.admin.createUser({
                    email: body.auth.email,
                    password: body.auth.password,
                    email_confirm: true,
                });
             console.log("---loi auth", errorAuth)
             console.log("----hien thi auth",dataAuth)
        }
        //

        // if (error) {
        //     return NextResponse.json(
        //         { message: error.message },
        //         { status: 500 }
        //     )
        // }

        return NextResponse.json("", {status: 201})
    }catch (e) {
        console.log(e)
        return NextResponse.json(e.message, {status: 500})
    }

}
