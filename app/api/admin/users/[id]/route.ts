import { NextResponse } from 'next/server'
import {UserService} from "@/services/users/user";

type Params = {
    params: { id: string }
}

// GET /api/users/:id
export async function GET(_: Request, context:{params:Promise<{id:string}>}) {
const {id}= await context.params;
    const { data, error } = await UserService.getById(Number(id))

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
    const { data, error } = await UserService.update(Number(id),body)

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
    const { error } = await UserService.delete(Number(id))

    if (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        )
    }

    return NextResponse.json({ success: true })
}
