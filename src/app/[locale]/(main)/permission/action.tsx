'use server';

import API from '@/config/api';
import { api } from '@/lib/api-client';
import { cookies } from 'next/headers';
import { IPagedApiResponse, IPermission } from '@/types';

export const getAllPermissionsAction = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value || '';

  const data = await api.get<IPagedApiResponse<IPermission>>(
    API.PERMISSION.INDEX,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        tags: ['permissions'],
      },
    }
  );

  return data;
};
