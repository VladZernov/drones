import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(req: NextRequest) {
    console.log("MIDDLEWARE - " + req.nextUrl.pathname);

    if (req.nextUrl.pathname.startsWith('/login') ||
        req.nextUrl.pathname.startsWith('/api/auth')) {

        return NextResponse.next()
    }

    console.log("MIDDLEWARE PASSED");

    const token = await getToken({req})

    const isProtected =
        !(req.nextUrl.pathname.startsWith('/drone/') ||
            req.nextUrl.pathname.startsWith('/api/drone/'));

    console.log("isLoggedIn " + token);
    console.log("isProtected " + isProtected);

    if (isProtected && !token) {
        return NextResponse.redirect(
            new URL('/login', req.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|manifest.json).*)'],
};
