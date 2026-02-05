import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { UserService } from "@/services/users/user"

export async function middleware(request: NextRequest) {
    const response = NextResponse.next()
    const pathname = request.nextUrl.pathname

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return request.cookies.get(name)?.value },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )

    //  Lấy user từ Supabase
    const { data: { user } } = await supabase.auth.getUser()
    // Chưa đăng nhập → login
    if (!user) {
        if (!pathname.startsWith('/auth')) {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
        return response
    }
    //  Lấy role từ DB
    const { data: userDb } = await UserService.getByUid(user.id)
    const isAdmin = userDb?.role === 'Admin'
    //  Nếu là Admin nhưng KHÔNG ở /admin → đẩy vào /admin
    if (isAdmin && !pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/admin', request.url))
    }
    // Nếu KHÔNG phải Admin nhưng vào /admin → đá về /
    if (!isAdmin && pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    return response
}
export const config = {
    matcher: [
        '/((?!auth|_next|favicon.ico|api).*)',
    ],
}