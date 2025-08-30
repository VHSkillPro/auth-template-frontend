'use server';

import API from '@/config/api';
import { api } from '@/lib/api-client';
import { IApiResponse } from '@/types';

/**
 * Verifies a user's email address using the provided token.
 *
 * Constructs a verification URL with the token as a query parameter,
 * sends a GET request to the API, and returns the response data.
 *
 * @param token - The email verification token to be validated.
 * @returns A promise that resolves to the API response containing verification status and related data.
 */
export const verifyEmailAction = async (token: string) => {
  const searchParam = new URLSearchParams({ token });
  const apiUrl = `${API.AUTH.VERIFY_EMAIL}?${searchParam.toString()}`;
  const data = await api.get<IApiResponse>(apiUrl);
  return data;
};
