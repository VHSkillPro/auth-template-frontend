/**
 * Represents the data structure for the sign-in form.
 *
 * @property {string} email - The user's email address.
 * @property {string} password - The user's password.
 */
export interface ISignInForm {
  email: string;
  password: string;
}

/**
 * Represents the data structure for the sign-up form.
 *
 * @property email - The user's email address.
 * @property password - The user's chosen password.
 * @property repassword - The confirmation of the user's password.
 * @property firstName - The user's first name.
 * @property lastName - The user's last name.
 */
export interface ISignUpForm {
  email: string;
  password: string;
  repassword: string;
  firstName: string;
  lastName: string;
}

/**
 * Represents the payload required to resend a verification email.
 *
 * @property email - The email address to which the verification email should be sent.
 */
export interface IResendVerificationEmailForm {
  email: string;
}

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

export interface IProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  permissions: string[];
  enabled: boolean;
  locked: boolean;
  superuser: boolean;
  createdAt: Date;
  updatedAt: Date;
}
