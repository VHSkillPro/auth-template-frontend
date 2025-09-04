'use server';

import API from '@/config/api';
import { api } from '@/lib/api-client';
import {
  IApiResponse,
  IBadRequestErrors,
  IDataApiResponse,
  IPagedApiResponse,
  IRole,
  IRoleCreateForm,
  IRolePaginationParams,
} from '@/types';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

/**
 * Fetches a paginated list of roles from the API with optional search, sorting, and pagination parameters.
 *
 * @param params - The parameters for pagination, search keyword, and sorting.
 * @param params.size - The number of items per page (default is 10).
 * @param params.page - The current page number (default is 1).
 * @param params.keyword - Optional keyword to filter roles.
 * @param params.sort - Optional sorting parameter.
 * @returns A promise that resolves to a paginated API response containing roles.
 */
export const getListRolesAction = async (params: IRolePaginationParams) => {
  const searchParams = new URLSearchParams({
    size: params.size?.toString() || '10',
    page: String((params.page ?? 1) - 1),
  });

  if (params.keyword) {
    searchParams.set('keyword', params.keyword);
  }

  if (params.sort) {
    searchParams.set('sort', params.sort);
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value || '';

  const data = await api.get<IPagedApiResponse<IRole>>(
    `${API.ROLE.INDEX}?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        tags: ['role'],
      },
    }
  );

  return data;
};

/**
 * Creates a new role by sending the provided form data to the API.
 * Retrieves the access token from cookies and includes it in the request headers for authentication.
 * If the role creation is successful, triggers revalidation for the 'role' tag.
 *
 * @param formData - The data required to create a new role.
 * @returns The API response containing the result of the role creation.
 */
export const createRoleAction = async (formData: IRoleCreateForm) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value || '';

  const data = await api.post<
    IApiResponse | IDataApiResponse<IBadRequestErrors>
  >(API.ROLE.CREATE, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (data.success) {
    revalidateTag('role');
  }

  return data;
};
