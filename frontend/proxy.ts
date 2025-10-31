import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const isValid = token ? verifyToken(token) : null;

    const url = req.nextUrl.clone();

    // Jika belum login dan bukan di /login → redirect ke /login
    if (!isValid && url.pathname !== "/login") {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Jika sudah login tapi buka /login → redirect ke /
    if (isValid && url.pathname === "/login") {
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    // Selain itu, lanjutkan request
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/", // agar route root ikut dicek
        "/((?!api|_next/static|_next/image|favicon.ico).*)", // hindari file statis
    ],
};
