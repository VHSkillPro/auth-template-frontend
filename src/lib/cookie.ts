import { IToken } from '@/types';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

/**
 * Saves the access and refresh tokens into the provided cookie store.
 *
 * @param cookieStore - The cookie store to set the tokens in.
 * @param token - An object containing the access and refresh tokens along with their expiration times.
 *
 * @remarks
 * Both tokens are set as HTTP-only cookies with the specified expiration and path.
 */
export const saveToken = (
  cookieStore: ReadonlyRequestCookies,
  token: IToken
) => {
  cookieStore.set('accessToken', token.accessToken, {
    httpOnly: true,
    maxAge: token.accessTokenExpiration,
    path: '/',
    sameSite: 'lax',
  });

  cookieStore.set('refreshToken', token.refreshToken, {
    httpOnly: true,
    maxAge: token.refreshTokenExpiration,
    path: '/',
    sameSite: 'lax',
  });
};
