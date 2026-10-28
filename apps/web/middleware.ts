import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role as string | undefined;
    const path = req.nextUrl.pathname;

    // Admin Dashboard Protection
    if (path.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin-login", req.url));
    }
    
    // Lab Portal Protection
    if (path.startsWith("/lab-portal") && role !== "LAB_PARTNER") {
      return NextResponse.redirect(new URL("/partner-login", req.url));
    }

    // Collector Portal Protection
    if (path.startsWith("/collector-portal") && role !== "COLLECTOR") {
      return NextResponse.redirect(new URL("/partner-login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Unprotected paths (will not trigger middleware logic if false)
        if (
          !path.startsWith("/admin") && 
          !path.startsWith("/lab-portal") && 
          !path.startsWith("/collector-portal") && 
          !path.startsWith("/dashboard") &&
          !path.startsWith("/checkout")
        ) {
          return true;
        }
        
        // Protected paths require a valid session token
        return !!token;
      },
    },
    pages: {
      signIn: "/login", // Default redirect for unauthenticated users
    }
  }
);

// Apply middleware to sensitive paths
export const config = { 
  matcher: [
    "/admin/:path*", 
    "/lab-portal/:path*", 
    "/collector-portal/:path*", 
    "/dashboard/:path*",
    "/checkout/:path*"
  ] 
};
