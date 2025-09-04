import { Fragment } from 'react';
import { IRolePaginationParams } from '@/types';
import { getListRolesAction } from './action';
import RoleTable from './_component/RoleTable';
import RoleHeader from './_component/RoleHeader';
import RoleFilter from './_component/RoleFilter';
import { Flex } from 'antd';
import RoleCreate from './_component/RoleCreate';
import { getAllPermissionsAction } from '../permission/action';

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
  const allPermissionsData = await getAllPermissionsAction();

  return (
    <Fragment>
      <RoleHeader />
      <Flex style={{ margin: '8px 0' }} justify="space-between">
        <Flex gap={8}>
          <RoleCreate permissionsData={allPermissionsData} />
        </Flex>
        <Flex gap={8}>
          <RoleFilter />
        </Flex>
      </Flex>
      <RoleTable data={data} paginationParams={params} />
    </Fragment>
  );
}
