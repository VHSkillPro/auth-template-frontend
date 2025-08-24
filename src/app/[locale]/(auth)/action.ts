'use server';

import API from '@/config/api';
import { api } from '@/lib/api-client';
import { IApiResponse, IAvatarURL, IDataApiResponse, IToken } from '@/types';
import { cookies } from 'next/headers';

/**
 * Retrieves the user's profile data by making an authenticated API request.
 *
 * This function fetches the access token from cookies and uses it to set the
 * Authorization header for the API call to the profile endpoint.
 *
 * @returns {Promise<any>} The profile data returned from the API.
 */
export const getProfileAction = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value || ' ';
  const data = await api.get<IDataApiResponse<IToken>>(API.AUTH.GET_PROFILE, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
};

/**
 * Retrieves the avatar URL for the authenticated user.
 *
 * This function fetches the access token from cookies and uses it to make an authenticated
 * API request to obtain the user's avatar URL.
 *
 * @returns A promise that resolves to the API response containing the avatar URL.
 */
export const getAvatarURLAction = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value || ' ';
  const data = await api.get<IDataApiResponse<IAvatarURL>>(
    API.USER.GET_AVATAR_URL,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return data;
};

/**
 * Signs out the current user by invalidating their refresh token and deleting authentication cookies.
 *
 * This function retrieves the `accessToken` and `refreshToken` from the cookie store,
 * sends a sign-out request to the authentication API, and upon successful response,
 * deletes the authentication cookies from the store.
 *
 * @returns {Promise<IApiResponse>} The response from the sign-out API.
 */
export const signOutAction = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value || ' ';
  const refreshToken = cookieStore.get('refreshToken')?.value || ' ';

  const searchParams = new URLSearchParams();
  searchParams.append('refreshToken', refreshToken);

  const data = await api.get<IApiResponse>(
    `${API.AUTH.SIGN_OUT}?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (data.success) {
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
  }

  return data;
};
