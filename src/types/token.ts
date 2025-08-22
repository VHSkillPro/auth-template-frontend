/**
 * Represents authentication tokens and their expiration details.
 *
 * @property accessToken - The JWT access token used for authentication.
 * @property refreshToken - The JWT refresh token used to obtain new access tokens.
 * @property accessTokenExpiration - The expiration time (in seconds or milliseconds) of the access token.
 * @property refreshTokenExpiration - The expiration time (in seconds or milliseconds) of the refresh token.
 */
export interface IToken {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiration: number;
    refreshTokenExpiration: number;
}
