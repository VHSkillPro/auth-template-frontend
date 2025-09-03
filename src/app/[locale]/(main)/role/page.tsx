import { Fragment } from 'react';
import { IRolePaginationParams } from '@/types';
import { getListRolesAction } from './action';
import RoleTable from './_component/RoleTable';
import RoleHeader from './_component/RoleHeader';
import RoleFilter from './_component/RoleFilter';
import { Button, Flex } from 'antd';

interface IRolePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RolePage({ searchParams }: IRolePageProps) {
  const { keyword, page, size, sort } = await searchParams;

  const params: IRolePaginationParams = {
    keyword: keyword as string,
    page: page ? parseInt(page as string) : 1,
    size: size ? parseInt(size as string) : 10,
    sort: sort as string,
  };

  const data = await getListRolesAction(params);

  return (
    <Fragment>
      <RoleHeader />
      <Flex style={{ margin: '8px 0' }} justify="space-between">
        <Flex gap={8}>
          <Button>adwadwa</Button>
          <Button>adwadwad</Button>
        </Flex>
        <Flex gap={8}>
          <RoleFilter />
        </Flex>
      </Flex>
      <RoleTable data={data} paginationParams={params} />
    </Fragment>
  );
}
