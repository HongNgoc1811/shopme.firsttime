import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

export function middleware(request: NextRequest) {
    console.log("Request URL:", request.nextUrl.pathname);
    // if (request.nextUrl.pathname.startsWith("/admin")) {
    //     const url = request.nextUrl.clone();
    //     url.pathname = '/auth/login'
    //     return NextResponse.redirect(url);
    // }
    // return NextResponse.next();
}

// export const config = {
//     matcher: ["/admin/:path*", "/api/admin/:path*"]
// };
