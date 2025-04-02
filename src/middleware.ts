import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  try {
    const res = await fetch(`${req.nextUrl.origin}/api/auth`, {
      method: 'GET',
      headers: { Cookie: req.headers.get('cookie') || '' },
    })
    const data = await res.json()

    if (!data?.success) {
      url.pathname = '/sign-in'
      return NextResponse.redirect(url)
    }
  } catch (error) {
    console.error('Middleware auth check failed:', error)
    url.pathname = '/sign-in'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!sign-in|sign-up|api/|_next/|static/|favicon.ico).*)'],
}
