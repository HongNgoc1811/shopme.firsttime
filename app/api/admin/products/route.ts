import {NextResponse} from 'next/server'
import {UserService} from "@/services/users/user";
import {supabaseClient} from "@/utils/supabase/client";
import {supabaseAdmin} from "@/utils/supabase/admin";
import {ProductService} from "@/services/products/product";
import {ProductOptionService} from "@/services/products/product_option";

// GET /api/users
export async function GET() {

    const {data, error} = await ProductOptionService.getAll()

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

        //

        // if (error) {
        //     return NextResponse.json(
        //         { message: error.message },
        //         { status: 500 }
        //     )
        // }

        return NextResponse.json("", {status: 201})
    } catch (e) {
        console.log(e)
        return NextResponse.json(e.message, {status: 500})
    }

}
