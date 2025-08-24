'use server';

import API from '@/config/api';
import { api } from '@/lib/api-client';
import {
  IApiResponse,
  IBadRequestErrors,
  IDataApiResponse,
  ISignUpForm,
} from '@/types';

/**
 * Sends a sign-up request to the authentication API using the provided form data.
 *
 * @param signUpForm - The form data containing user sign-up information.
 * @returns A promise that resolves to the API response, which may include either a generic response or a response containing bad request errors.
 */
export const signUpAction = async (signUpForm: ISignUpForm) => {
  const data = await api.post<
    IApiResponse | IDataApiResponse<IBadRequestErrors>
  >(API.AUTH.SIGNUP, signUpForm);
  return data;
};
