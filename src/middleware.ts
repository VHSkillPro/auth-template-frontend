import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { api } from './lib/api-client';
import { IProfile, IToken } from './types';
import API from './config/api';
import { IDataApiResponse } from './types/response';

const intlMiddleware = createMiddleware(routing);

// Publicly accessible URLs
const PUBLIC_URLS = [
  '/sign-in',
  '/sign-up',
  '/verify-email',
  '/resend-verification-email',
  '/reset-password',
  '/send-reset-password-email',
];

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
  const pathname = request.nextUrl.pathname;
  let currentLocale = request.nextUrl.pathname.split('/')[1];
  if (
    currentLocale === null ||
    currentLocale === undefined ||
    currentLocale === '' ||
    !routing.locales.find((loc) => loc === currentLocale)
  ) {
    currentLocale = routing.defaultLocale;
  }

  const isPublicPage = PUBLIC_URLS.some((url) => {
    const localizedUrl = `/${currentLocale}${url}`;
    return (
      pathname === url ||
      pathname === localizedUrl ||
      pathname.startsWith(`${localizedUrl}/`)
    );
  });

  // If the request is for a public page
  if (isPublicPage) {
    const accessToken = request.cookies.get('accessToken')?.value;

    if (accessToken) {
      const profileData = await getProfile(accessToken);
      if (profileData.success) {
        return NextResponse.redirect(new URL(`/${currentLocale}`, request.url));
      }
    }

    return intlMiddleware(request);
  }

  console.log('>>> Protected Route Middleware:', pathname);

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const redirectToLogin = () => {
    const response = NextResponse.redirect(
      new URL(`/${currentLocale}/sign-in`, request.url)
    );
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
  };

  if (!accessToken && !refreshToken) {
    return redirectToLogin();
  }

  // Try accessing the profile with the access token
  if (accessToken) {
    const profileData = await getProfile(accessToken);

    if (profileData.success) {
      return intlMiddleware(request);
    }

    if (profileData.statusCode === 500) {
      return NextResponse.redirect(new URL('/500', request.url));
    }
  }

  if (!refreshToken) {
    return redirectToLogin();
  }

  const refreshData = await refresh(refreshToken);

  if (refreshData.success) {
    const response = intlMiddleware(request);

    const {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpiration,
      refreshTokenExpiration,
    } = (refreshData as IDataApiResponse<IToken>).data;

    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      maxAge: accessTokenExpiration,
      sameSite: 'lax',
      path: '/',
    });

    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: refreshTokenExpiration,
      sameSite: 'lax',
      path: '/',
    });

    return response;
  }

  if (refreshData.statusCode === 500) {
    return NextResponse.redirect(new URL('/500', request.url));
  }

  return redirectToLogin();
}
