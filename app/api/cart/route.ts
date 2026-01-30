import {NextResponse} from "next/server";
import {supabaseAdmin} from "@/utils/supabase/admin";
import {supabaseClient} from "@/utils/supabase/client";
import {createSupabaseServer} from "@/utils/supabase/server";

export async function GET() {
    try {
        const sp = await createSupabaseServer();
        const {data: {user}} = await sp.auth.getUser();
        console.log("user", user);
        if (!user) return NextResponse.json({message: "Unauthorized"}, {status: 401});

        // Truy vấn dựa trên cấu trúc bảng thực tế của bạn
        const { data, error } = await supabaseAdmin
            .from("cart")
            .select(`
                id,
                quantity,
                product_option:product_id (
                    id,
                    color,
                    size,
                    inventory,
                    product:id_product (
                        id,
                        name,
                        price,
                        picture
                    )
                )
            `)
            .eq("user_id", user.id);
console.log(data);
        if (error) {
            console.error("Supabase Error:", error.message);
            return NextResponse.json({message: error.message}, {status: 500});
        }

        return NextResponse.json(data ?? []);
    } catch (e: any) {
        return NextResponse.json({message: e.message}, {status: 500});
    }
}

export async function POST(req: Request) {
    try {
        const sp = await createSupabaseServer();
        const {data: {user}} = await sp.auth.getUser();
        console.log(user);
        if (!user) return NextResponse.json({message: "Unauthorized"}, {status: 401});

        const {product_option_id, quantity = 1} = await req.json();

        // Kiểm tra tồn kho
        const { data: option } = await supabaseAdmin
            .from("product_option")
            .select("inventory")
            .eq("id", product_option_id)
            .single();

        if (!option || option.inventory < quantity) {
            return NextResponse.json({ message: "Không đủ tồn kho" }, { status: 400 });
        }

        // Kiểm tra sản phẩm đã có trong giỏ chưa (cột là product_id)
        const { data: existedCart } = await supabaseAdmin
            .from("cart")
            .select("*")
            .eq("user_id", user.id)
            .eq("product_id", product_option_id)
            .single();

        if (existedCart) {
            const newQty = existedCart.quantity + quantity;
            if (newQty <= 0) {
                await supabaseAdmin.from("cart").delete().eq("id", existedCart.id);
                return NextResponse.json({ message: "Removed from cart" });
            }
            await supabaseAdmin
                .from("cart")
                .update({ quantity: newQty })
                .eq("id", existedCart.id);
            return NextResponse.json({ message: "Updated quantity" });
        }

       const {data,error}= await supabaseAdmin.from("cart").insert({
            user_id: user.id,
            product_id: product_option_id, // Cột trong bảng cart của bạn là product_id
            quantity,
        });
console.log(data);
console.log(error);
        return NextResponse.json({message: "Added to cart"});
    } catch (e: any) {
        return NextResponse.json({message: e.message}, {status: 500});
    }
}

export async function DELETE(req: Request) {
    try {
        const {data: {user}} = await supabaseClient.auth.getUser();
        if (!user) return NextResponse.json({message: "Unauthorized"}, {status: 401});

        const {product_option_id} = await req.json();

        await supabaseAdmin
            .from("cart")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", product_option_id);

        return NextResponse.json({message: "Deleted"});
    } catch (e: any) {
        return NextResponse.json({message: e.message}, {status: 500});
    }
}