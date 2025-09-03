'use server';

import API from '@/config/api';
import { api } from '@/lib/api-client';
import { IPagedApiResponse, IRole, IRolePaginationParams } from '@/types';
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
