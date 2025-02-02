import { NextResponse, NextRequest } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';

// This matcher currently protects all routes.
const isProtectedRoute = createRouteMatcher(['/(.*)']);

// List of public routes that should not be protected.
const publicRoutes = ['/sign-up', '/sign-in', '/'];

export default clerkMiddleware(async (auth, req: NextRequest) => {

  // Await the auth function to get the resolved auth object.
  const resolvedAuth = await auth();

  const { pathname } = req.nextUrl;

  // Skip middleware processing for public routes.
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Extract the userId from the resolved authentication object.
  const { userId } = resolvedAuth as any as { userId?: string };

  // If no userId exists, then the user is not authenticated.
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-up', req.url));
  }

  // Use clerkClient by calling it and awaiting the instance.
  const client = await clerkClient();
  // Now you can access client.users.
  const user = await client.users.getUser(userId);

  // Check if the user has completed signup.
  if (!user.publicMetadata.signupComplete) {
    return NextResponse.redirect(new URL('/welcome', req.url));
  }

  // Allow the request to proceed.
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Exclude Next.js internals and static files.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes.
    '/(api|trpc)(.*)',
  ],
};
