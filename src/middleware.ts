import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Public routes (Auth)
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return supabaseResponse
  }

  // Protected Routes - Enforce Session
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/waiter') ||
    pathname.startsWith('/kitchen') ||
    pathname.startsWith('/dashboard')
  ) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Role-Based Access Control
    // Here we read the role from user metadata or custom claims
    const userRole = user.user_metadata?.role || 'CUSTOMER'

    if (pathname.startsWith('/admin') && !['ADMIN', 'OWNER', 'MANAGER'].includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    if (pathname.startsWith('/waiter') && !['ADMIN', 'OWNER', 'MANAGER', 'WAITER'].includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    if (pathname.startsWith('/kitchen') && !['ADMIN', 'OWNER', 'MANAGER', 'CHEF', 'KITCHEN'].includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
