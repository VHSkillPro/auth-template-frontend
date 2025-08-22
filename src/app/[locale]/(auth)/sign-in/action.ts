'use server';

import { api } from '@/lib/api-client';
import { saveToken } from '@/lib/cookie';
import { IDataApiResponse, ISignInForm, IToken } from '@/types';
import { cookies } from 'next/headers';

/**
 * Handles the sign-in process by sending the sign-in form data to the authentication API.
 * If the sign-in is successful, stores the received token in cookies.
 *
 * @param signInForm - The form data containing user credentials for sign-in.
 * @returns A promise that resolves to the API response containing the success status and token data.
 */
export const signInAction = async (signInForm: ISignInForm) => {
  const data = await api.post<IDataApiResponse<IToken>>(
    '/api/v1/auth/sign-in',
    signInForm
  );

  // If sign-in is successful, store the token
  if (data.success) {
    const token = (data as IDataApiResponse<IToken>).data;
    saveToken(await cookies(), token);
  }

  return data;
};
