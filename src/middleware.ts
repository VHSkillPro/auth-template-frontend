import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { api } from './lib/api-client';
import { IProfile, IToken } from './types';
import API from './config/api';
import { IDataApiResponse } from './types/response';

const intlMiddleware = createMiddleware(routing);

/**
 * Determines whether a given pathname starts with any of the supported locale prefixes.
 *
 * Checks if the pathname begins with `/{locale}/` or exactly matches `/{locale}` for any locale
 * defined in `routing.locales`.
 *
 * @param pathname - The URL pathname to check for a locale prefix.
 * @returns `true` if the pathname starts with a supported locale, otherwise `false`.
 */
const startWithLocale = (pathname: string) => {
  return routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
};

// Authentication-related URLs
const AUTH_URLS = [
  '/sign-in',
  '/sign-up',
  '/verify-email',
  '/resend-verification-email',
  '/reset-password',
  '/send-reset-password-email',
];

/**
 * Checks if the given pathname starts with any of the authentication URLs for any supported locale.
 *
 * Iterates through all authentication URLs and locales, and returns `true` if the pathname begins
 * with a combination of locale and authentication URL (e.g., `/en/login`). Otherwise, returns `false`.
 *
 * @param pathname - The URL pathname to check.
 * @returns `true` if the pathname starts with a locale-prefixed authentication URL, otherwise `false`.
 */
const startWithAuthUrl = (pathname: string) => {
  for (const url of AUTH_URLS) {
    for (const locale of routing.locales) {
      if (
        pathname.startsWith(`/${locale}${url}/`) ||
        pathname === `/${locale}${url}`
      ) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Retrieves the user profile using the provided access token.
 *
 * @param accessToken - The JWT access token used for authentication.
 * @returns A promise that resolves to the user's profile data.
 */
const getProfile = async (accessToken: string) => {
  const data = api.get<IDataApiResponse<IProfile>>(API.AUTH.GET_PROFILE, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
};

/**
 * Handles redirection to the sign-in page for unauthenticated requests.
 *
 * This middleware function checks if the incoming request is targeting an authentication-related page.
 * If not, it redirects the user to the `/sign-in` page and deletes any existing authentication cookies
 * (`accessToken` and `refreshToken`). If the request is for an authentication page, it proceeds normally
 * while also deleting the authentication cookies.
 *
 * @param request - The incoming Next.js request object.
 * @returns A `NextResponse` object that either redirects to the sign-in page or allows the request to proceed.
 */
const redirectLogin = (request: NextRequest) => {
  const isAuthPage = startWithAuthUrl(request.nextUrl.pathname);

  if (!isAuthPage) {
    const response = NextResponse.redirect(new URL('/sign-in', request.url));
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
  }

  const response = NextResponse.next();
  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');
  return response;
};

/**
 * Sends a request to refresh the authentication token using the provided refresh token.
 *
 * @param refreshToken - The refresh token to use for obtaining a new authentication token.
 * @returns A promise that resolves to the API response containing the new token.
 */
const refresh = async (refreshToken: string) => {
  const data = api.post<IDataApiResponse<IToken>>(API.AUTH.REFRESH, {
    refreshToken,
  });
  return data;
};

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|500|flags).*)',
  ],
};

export default async function middleware(request: NextRequest) {
  // Check if the pathname starts with a locale
  if (!startWithLocale(request.nextUrl.pathname)) {
    return intlMiddleware(request);
  }

  // Get locale
  const currentLocale = request.nextUrl.pathname.split('/')[1];

  // Log request information
  if (process.env.NODE_ENV === 'development') {
    console.log('>>> Middleware called for', request.nextUrl.pathname);
  }

  const accessToken = request.cookies.get('accessToken')?.value || ' ';
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // Determine the global response based on authentication URLs
  const globalResponse = startWithAuthUrl(request.nextUrl.pathname)
    ? NextResponse.redirect(new URL(`/${currentLocale}/`, request.url))
    : NextResponse.next();

  // Get profile data
  const profileData = await getProfile(accessToken);

  // If accessToken valid
  if (profileData.success) {
    return globalResponse;
  }

  // If server error
  if (profileData.statusCode === 500) {
    return NextResponse.redirect(new URL('/500', request.url));
  }

  // If refreshToken is not available, redirect to login
  if (!refreshToken) {
    return redirectLogin(request);
  }

  // Attempt to refresh the access token
  const refreshData = await refresh(refreshToken);

  // If refresh token is valid
  if (refreshData.success) {
    const newAccessToken = (refreshData as IDataApiResponse<IToken>).data
      .accessToken;
    const newRefreshToken = (refreshData as IDataApiResponse<IToken>).data
      .refreshToken;

    globalResponse.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      maxAge: (refreshData as IDataApiResponse<IToken>).data
        .accessTokenExpiration,
      sameSite: 'lax',
      path: '/',
    });

    globalResponse.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: (refreshData as IDataApiResponse<IToken>).data
        .refreshTokenExpiration,
      sameSite: 'lax',
      path: '/',
    });

    globalResponse.headers.set('Authorization', `Bearer ${newAccessToken}`);
    return globalResponse;
  }

  // If refresh token is not valid
  if (refreshData.statusCode === 500) {
    return NextResponse.redirect(new URL('/500', request.url));
  }

  return redirectLogin(request);
}
