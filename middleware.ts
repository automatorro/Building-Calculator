import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: ()  => request.cookies.getAll(),
        setAll: (toSet) => {
          toSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          toSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  /* Refresh sesiune — obligatoriu pentru SSR */
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  /* Rute protejate */
  const PROTECTED = ['/projects', '/catalog', '/settings']
  const isProtected = PROTECTED.some(p => pathname.startsWith(p))

  /* Pagini auth (login, register etc.) */
  const isAuth = pathname.startsWith('/auth')

  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(url)
  }

  /* Utilizator autentificat pe pagini auth → redirect la proiecte */
  if (user && isAuth) {
    const url = request.nextUrl.clone()
    url.pathname = '/projects'
    url.search   = ''
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
