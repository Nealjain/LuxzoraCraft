import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Check if user is trying to access admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      // Check if user is admin
      if (!req.nextauth.token?.isAdmin) {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }
    
    // Check if user is trying to access API admin routes
    if (req.nextUrl.pathname.startsWith('/api/admin')) {
      // Allow admin promotion endpoint without authentication
      if (req.nextUrl.pathname === '/api/admin/promote-user') {
        return NextResponse.next()
      }
      
      if (!req.nextauth.token?.isAdmin) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
        )
      }
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (req.nextUrl.pathname.startsWith('/api/auth') ||
            req.nextUrl.pathname.startsWith('/api/products') ||
            req.nextUrl.pathname.startsWith('/api/categories') ||
            req.nextUrl.pathname.startsWith('/api/reviews') ||
            req.nextUrl.pathname === '/api/admin/promote-user' ||
            req.nextUrl.pathname === '/api/test-db' ||
            req.nextUrl.pathname === '/' ||
            req.nextUrl.pathname.startsWith('/shop') ||
            req.nextUrl.pathname.startsWith('/product') ||
            req.nextUrl.pathname.startsWith('/about') ||
            req.nextUrl.pathname.startsWith('/contact') ||
            req.nextUrl.pathname.startsWith('/login') ||
            req.nextUrl.pathname.startsWith('/register') ||
            req.nextUrl.pathname.startsWith('/admin-setup')) {
          return true
        }
        
        // Require authentication for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/user/:path*',
    '/api/orders/:path*',
    '/account/:path*',
    '/checkout/:path*',
    '/cart/:path*'
  ]
}
