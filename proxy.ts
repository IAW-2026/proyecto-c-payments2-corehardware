import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";


const isProtectedRoute = createRouteMatcher([
    "/buyer(.*)",
    "/seller(.*)",
    "/admin(.*)",
]);
const validRoles = ["buyer", "seller", "admin"] as const;
type Role = (typeof validRoles)[number];


function isRole(value: unknown): value is Role {
  return (
    typeof value === "string" &&
    (validRoles as readonly string[]).includes(value)
  );
}


function canAccess(role: Role, path: string): boolean {
  if (path.startsWith("/buyer")) return role === "buyer" || role === "admin";
  if (path.startsWith("/seller")) return role === "seller" || role === "admin";
  if (path.startsWith("/admin")) return role === "admin";
  return true;
}


function homeFor(role: Role): string {
    if (role === "buyer") return "/buyer";
    if (role === "seller") return "/seller";
    if (role === "admin") return "/admin";
    return "/";
}


export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();

    if (isProtectedRoute(req)) {
        const { userId } = await auth();

        if (!userId) {
            const signInUrl = new URL("/sign-in", req.url);
            signInUrl.searchParams.set("redirect_url", req.url);
            return NextResponse.redirect(signInUrl);
        } else {
            const client = await clerkClient();
            const user = await client.users.getUser(userId);
            const rawRole = user.publicMetadata?.role;

            if (!isRole(rawRole)) {
                return new NextResponse("Forbidden", { status: 403 });
            }

            if (!canAccess(rawRole, req.nextUrl.pathname)) {
                return NextResponse.redirect(new URL(homeFor(rawRole), req.url));
            }

            return NextResponse.next();
        }
    }
    
    if (userId && (req.nextUrl.pathname === "/" || req.nextUrl.pathname === "/sign-up" )) {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const rawRole = user.publicMetadata?.role;
        
        if (!isRole(rawRole)) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        return NextResponse.redirect(new URL(homeFor(rawRole), req.url));
    }
});


export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for Clerk's auto-proxy path
        '/__clerk/(.*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};