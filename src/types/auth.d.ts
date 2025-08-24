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

/**
 * Represents a user profile with authentication and authorization details.
 *
 * @property {number} id - Unique identifier for the user.
 * @property {string} email - User's email address.
 * @property {string} firstName - User's first name.
 * @property {string} lastName - User's last name.
 * @property {string[]} permissions - List of permissions assigned to the user.
 * @property {boolean} enabled - Indicates if the user account is enabled.
 * @property {boolean} locked - Indicates if the user account is locked.
 * @property {boolean} superuser - Indicates if the user has superuser privileges.
 * @property {Date} createdAt - Timestamp when the user profile was created.
 * @property {Date} updatedAt - Timestamp when the user profile was last updated.
 */
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

/**
 * Represents the form data required to send a reset password email.
 *
 * @property email - The email address of the user requesting a password reset.
 */
export interface ISendResetPasswordEmailForm {
  email: string;
}

/**
 * Represents the form data required to reset a user's password.
 *
 * @property password - The new password to be set.
 * @property repassword - Confirmation of the new password.
 */
export interface IResetPasswordForm {
  token: string;
  password: string;
  repassword: string;
}

/**
 * Represents an object containing the URL of a user's avatar image.
 *
 * @property avatarUrl - The URL string pointing to the user's avatar image.
 */
export interface IAvatarURL {
  avatarUrl: string;
}
