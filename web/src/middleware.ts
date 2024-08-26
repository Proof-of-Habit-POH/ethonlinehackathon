import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the user is trying to access the main page
  if (pathname === "/") {
    // Check for the presence of a wallet address in the session or cookie
    // This is a placeholder - you'll need to implement your own logic to check for the wallet address

    const hasWalletAddress = request.cookies.get("walletAddress");
    console.log("Middleware:haswalletaddress", hasWalletAddress);

    if (!hasWalletAddress) {
      // Redirect to login page if no wallet address is found
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Continue to the next middleware or to the final destination
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
