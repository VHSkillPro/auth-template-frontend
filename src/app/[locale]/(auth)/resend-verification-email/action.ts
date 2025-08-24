'use server';

import API from '@/config/api';
import { api } from '@/lib/api-client';
import { IApiResponse, IResendVerificationEmailForm } from '@/types';

/**
 * Sends a verification email to the specified email address.
 *
 * @param email - The email address to send the verification email to.
 * @returns A promise that resolves to the API response.
 */
export const sendVerificationEmailAction = async (
  form: IResendVerificationEmailForm
) => {
  const data = await api.post<IApiResponse>(
    API.AUTH.SEND_VERIFICATION_EMAIL,
    form
  );
  return data;
};
