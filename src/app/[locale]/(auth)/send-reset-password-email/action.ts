'use server';

import API from '@/config/api';
import { api } from '@/lib/api-client';
import { IApiResponse, ISendResetPasswordEmailForm } from '@/types';

export const sendResetPasswordEmailAction = async (
  form: ISendResetPasswordEmailForm
) => {
  const data = await api.post<IApiResponse>(
    API.AUTH.SEND_RESET_PASSWORD_EMAIL,
    form
  );
  return data;
};
