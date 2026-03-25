import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import authRouteAccess from "@/lib/authRouteAccess";

const { getAuthRedirectPath } = authRouteAccess;

// This function can be marked `async` if using `await` inside
export async function proxy(req) {
  const token = await getToken({ req });
  const redirectPath = getAuthRedirectPath(req.nextUrl.pathname, Boolean(token));

  if (redirectPath) {
    return NextResponse.redirect(new URL(redirectPath, req.url));
  }

  return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request) { ... }

export const config = {
  // Next statically analyzes proxy matchers, so this must stay inline.
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
