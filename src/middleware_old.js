import { NextResponse } from "next/server";

export function middleware(request) {

  return NextResponse.next();

}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/airtime/:path*",
    "/data/:path*",
    "/electricity/:path*",
    "/exam-pin/:path*",
    "/transactions/:path*",
    "/fund-wallet/:path*",
  ],
};