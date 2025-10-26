// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {verifyToken} from "@/lib/jwt";
export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value
    const isValid = token ? verifyToken(token) : null

    const url = req.nextUrl.clone()
    
    if (!isValid && url.pathname !== "/login") {
        url.pathname = "/login"
        return NextResponse.redirect(url)
    }
    
    if (isValid && url.pathname === "/login") {
        url.pathname = "/dashboard"
        return NextResponse.redirect(url)
    }
    
    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!_next/static|favicon.ico).*)"],
}
