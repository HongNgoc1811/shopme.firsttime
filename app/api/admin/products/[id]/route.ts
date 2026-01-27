import { NextResponse } from 'next/server'
import {UserService} from "@/services/users/user";
import {ProductService} from "@/services/products/product";
import {ProductOptionService} from "@/services/products/product_option";

type Params = {
    params: { id: string }
}

// GET /api/users/:id
export async function GET(_: Request, context:{params:Promise<{id:string}>}) {
    const {id}= await context.params;
    const { data, error } = await ProductOptionService.getAllbyProductId(id)

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
    try {
        const {id}= await context.params;
        const { error } = await ProductService.delete(Number(id))
        console.log(error)
        const body = await req.json()
        console.log("products", body)
        if (body) {
            const itemProduct = {
                name: body.name,
                price: body.price,
                description: body.description,
                picture: body.picture,
                product_type: body.product_type,
                status: body.status,
            }
            const {data, error} = await ProductService.create(itemProduct)
            {
                body.variants.map(async (item, index) => {
                    const itemProductOption = {
                        id_product: data.id,
                        size: item.size,
                        color: item.color,
                        inventory:item.inventory,
                    }
                    const {data: Option, error: OptionProduct} = await ProductOptionService.create(itemProductOption)
                    console.log("------hien thi roi", data)
                    console.log("----loi roi-", error)
                    console.log("---------Data Option----", Option)
                    console.log("---------Error Option----", OptionProduct)
                })
            }
        }
        return NextResponse.json("data")

    }catch(err) {
        console.log(err)
    }
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
