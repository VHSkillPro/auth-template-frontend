import { getAvatarURLAction } from '@/app/[locale]/(auth)/action';
import { IAvatarURL } from '@/types';
import useSWR from 'swr';
import { IDataApiResponse } from '../types/response';

export const useAvatar = () => {
  const { data, error, isLoading, mutate } = useSWR(
    'avatar-url',
    getAvatarURLAction,
    {
      refreshInterval: 10 * 60 * 1000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
    }
  );

  if (!data?.success) {
    return {
      avatarUrl: null,
      isLoading,
      error,
      mutate,
    };
  }

  return {
    avatarUrl: (data as IDataApiResponse<IAvatarURL>).data.avatarUrl,
    isLoading,
    error,
    mutate,
  };
};
