import {NextResponse} from 'next/server'
import {OrderService} from "@/services/orders/order";

export async function GET() {
    try {
        const { data, error } = await OrderService.getAll();

        if (error) {
            console.error("Supabase Error:", error);
            return NextResponse.json({ message: error.message }, { status: 500 });
        }

        return NextResponse.json({ data: data ?? [] });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Gọi thẳng Service với object body (user_id, product_id, ...)
        const { data, error } = await OrderService.create(body);

        if (error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }

        return NextResponse.json({ data }, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}

// POST /api/users
// export async function POST(req: Request) {
//     try {
//         const body = await req.json();
//         const { user_id, items } = body;
//
//         if (!user_id || !Array.isArray(items) || items.length === 0) {
//             return NextResponse.json({ message: "Dữ liệu không hợp lệ" }, { status: 400 });
//         }
//
//         const orderRows = items.map((item: any) => ({
//             user_id: user_id,
//             product_id: item.product_id,
//             quantity: item.quantity,
//             total_price: (item.price || 0) * (item.quantity || 0),
//             status: item.status || "pending",
//         }));
//
//         const { data, error } = await OrderService.create(orderRows);
//
//         if (error) {
//             return NextResponse.json({ message: error.message }, { status: 500 });
//         }
//
//         return NextResponse.json({ data }, { status: 201 });
//     } catch (e: any) {
//         return NextResponse.json({ message: e.message }, { status: 500 });
//     }
// }
        //

        // if (error) {
        //     return NextResponse.json(
        //         { message: error.message },
        //         { status: 500 }
        //     )
        // }

    //     return NextResponse.json("", {status: 201})
    // } catch (e) {
    //     console.log(e)
    //     return NextResponse.json(e.message, {status: 500})




