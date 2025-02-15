import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default withAuth(
  async function middleware(req) {
    try {
      const token = await getToken({ req });
      if (!token) {
        return NextResponse.redirect(new URL("/signin", req.url));
      }
      return NextResponse.next();
    } catch (error) {
      console.error("Error in middleware:", error);
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,    
    },
  }
);

export const config = {
  matcher: ["/api/:path*"],
};