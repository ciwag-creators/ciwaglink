import { NextResponse } from "next/server";

export function middleware(request) {

  const protectedRoutes = [
    "/dashboard",
    "/airtime",
    "/data",
    "/electricity",
    "/exam-pin",
    "/transactions",
    "/fund-wallet"
  ];

  const token = request.cookies.get(
    "sb-access-token"
  );

  if (
    protectedRoutes.some(route =>
      request.nextUrl.pathname.startsWith(route)
    ) && !token
  ) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  return NextResponse.next();
}
