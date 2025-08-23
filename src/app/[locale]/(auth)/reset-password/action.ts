'use server';

import API from '@/config/api';
import { api } from '@/lib/api-client';
import { IApiResponse, IResetPasswordForm } from '@/types';

export const resetPasswordAction = async (formData: IResetPasswordForm) => {
  const data = api.post<IApiResponse>(API.AUTH.RESET_PASSWORD, formData);
  return data;
};
