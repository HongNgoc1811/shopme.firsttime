// import {supabaseAdmin} from "@/utils/supabase/admin";
// import {NextResponse} from "next/server";
// import {supabaseClient} from "@/utils/supabase/client";
//
// export async function GET(){
//     const {data: {user}} = await supabaseAdmin.auth.getUser();
//     console.log("useruseruser", user);
//     const {error}= await supabaseAdmin.auth.signOut();
//     console.log(error);
//     if(error) {
//         return NextResponse.json({status: "error", message: error.message}, {status: 400});
//     }
//     const response= NextResponse.json({status: "sucess"});
// console.log(response.cookies.getAll());
//     response.cookies.getAll().forEach(cookie => {
//         response.cookies.delete(cookie.name);
//     });
//     return response;
// }

import { NextResponse } from "next/server";
import {createSupabaseServer} from "@/utils/supabase/server";

export async function POST() {
    const supabase = await createSupabaseServer();

    const { error } = await supabase.auth.signOut();

    if (error) {
        return NextResponse.json(
            { status: "error", message: error.message },
            { status: 400 }
        );
    }

    return NextResponse.json({ status: "success" });
}
