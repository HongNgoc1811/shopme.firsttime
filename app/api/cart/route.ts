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
        const { data: { user } } = await sp.auth.getUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const { product_option_id, quantity = 1 } = await req.json();

        // 1️ Lấy cart trước
        const { data: existedCart } = await supabaseAdmin
            .from("cart")
            .select("*")
            .eq("user_id", user.id)
            .eq("product_id", product_option_id)
            .single();
        // 2 TRƯỜNG HỢP GIẢM
        if (quantity < 0) {
            if (!existedCart) {
                return NextResponse.json({ message: "Cart not found" }, { status: 404 });
            }
            const newQty = existedCart.quantity + quantity;
            if (newQty <= 0) {
                await supabaseAdmin
                    .from("cart")
                    .delete()
                    .eq("id", existedCart.id);
                return NextResponse.json({ message: "Removed from cart" });
            }
            await supabaseAdmin
                .from("cart")
                .update({ quantity: newQty })
                .eq("id", existedCart.id);
            return NextResponse.json({ message: "Decreased quantity" });
        }
        // 3 TRƯỜNG HỢP TĂNG → mới check tồn kho
        const { data: option } = await supabaseAdmin
            .from("product_option")
            .select("inventory")
            .eq("id", product_option_id)
            .single();
        if (!option || option.inventory < quantity) {
            return NextResponse.json(
                { message: "Không đủ tồn kho" },
                { status: 400 }
            );
        }
        if (existedCart) {
            const newQty = existedCart.quantity + quantity;
            await supabaseAdmin
                .from("cart")
                .update({ quantity: newQty })
                .eq("id", existedCart.id);
            return NextResponse.json({ message: "Increased quantity" });
        }
        await supabaseAdmin.from("cart").insert({
            user_id: user.id,
            product_id: product_option_id,
            quantity,
        });
        return NextResponse.json({ message: "Added to cart" });
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const sp = await createSupabaseServer();
        const { data: { user } } = await sp.auth.getUser();
        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        const { product_option_id } = await req.json();
        const { error } = await supabaseAdmin
            .from("cart")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", product_option_id);
        if (error) {
            console.error("Delete cart error:", error);
            return NextResponse.json(
                { message: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json({ message: "Deleted" });
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}