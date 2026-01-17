
import {OrderService} from "@/services/orders/order";

type Params = {
    params: { id: string }
}

// GET /api/users/:id
import { NextResponse } from "next/server";

export async function GET(
    _: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    const { data, error } = await OrderService.getById(Number(id));

    if (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 404 }
        );
    }

    return NextResponse.json(data, { status: 200 });
}


// PUT /api/admin/orders/:id
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const body = await req.json();

        const itemOrder = {
            user_id: body.user_id,
            product_id: body.product_id,
            order_code: body.order_code,
            user_name: body.user_name,
            email: body.email,
            product_name: body.product_name,
            price: body.price,
            quantity: body.quantity,
            total_price: body.total_price,
            status: body.status,
        };

        const { data, error } = await OrderService.update(
            Number(id),
            itemOrder
        );

        if (error) {
            return NextResponse.json(
                { message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(data, { status: 200 });

    } catch (err) {
        console.error("PUT /orders/:id error:", err);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE /api/users/:id
export async function DELETE(_: Request, context:{params:Promise<{id:string}>}) {

    const {id}= await context.params;
    const { error } = await OrderService.delete(Number(id))

    if (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        )
    }
    return NextResponse.json({ success: true })
}
