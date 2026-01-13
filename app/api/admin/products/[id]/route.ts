import { NextResponse } from 'next/server'
import {UserService} from "@/services/users/user";
import {ProductService} from "@/services/products/product";

type Params = {
    params: { id: string }
}

// GET /api/users/:id
export async function GET(_: Request, context:{params:Promise<{id:string}>}) {
    const {id}= await context.params;
    const { data, error } = await ProductService.getById(Number(id))

    if (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 404 }
        )
    }

    return NextResponse.json(data)
}

// PUT /api/users/:id
export async function PUT(req: Request,context:{params:Promise<{id:string}>}) {
    const body = await req.json()
    const {id}= await context.params;
    const { data, error } = await ProductService.update(Number(id),body)
console.log(body)
    if (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        )
    }

    return NextResponse.json(data)
}

// DELETE /api/users/:id
export async function DELETE(_: Request, context:{params:Promise<{id:string}>}) {

    const {id}= await context.params;
    const { error } = await ProductService.delete(Number(id))

    if (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        )
    }

    return NextResponse.json({ success: true })
}
