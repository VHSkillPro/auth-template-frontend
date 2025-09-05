'use client';

import { useNotification } from '@/context/NotificationProvider';
import {
  IApiResponse,
  IPagedApiResponse,
  IRole,
  IRolePaginationParams,
} from '@/types';
import {
  EditOutlined,
  EyeOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Button, Flex, Table, TableProps, Tooltip } from 'antd';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Key } from 'react';
import RoleDelete from './RoleDelete';

interface IRoleDataType extends IRole {
  key: Key;
  action: React.ReactNode;
}

interface IRoleTableProps {
  data: IPagedApiResponse<IRole> | IApiResponse;
  paginationParams: IRolePaginationParams;
}

function ColumnsTitle({
  icon,
  content,
}: {
  icon: React.ReactNode;
  content: string;
}) {
  return (
    <Flex gap={8}>
      {icon}
      {content}
    </Flex>
  );
}

export default function RoleTable({ data, paginationParams }: IRoleTableProps) {
  const tMain = useTranslations('Main');
  const tDataTable = useTranslations('Main.RolePage.DataTable');
  const tResponseMessage = useTranslations('ResponseMessage');

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { notifyError } = useNotification();

  const columns: TableProps<IRoleDataType>['columns'] = [
    {
      key: 'action',
      title: (
        <ColumnsTitle
          icon={<EditOutlined />}
          content={tDataTable('Columns.action')}
        />
      ),
      dataIndex: 'action',
      width: '160px',
    },
    {
      key: 'name',
      title: (
        <ColumnsTitle
          icon={<InfoCircleOutlined />}
          content={tDataTable('Columns.name')}
        />
      ),
      sorter: true,
      showSorterTooltip: false,
      dataIndex: 'name',
    },
    {
      key: 'title',
      title: (
        <ColumnsTitle
          icon={<InfoCircleOutlined />}
          content={tDataTable('Columns.title')}
        />
      ),
      sorter: true,
      showSorterTooltip: false,
      dataIndex: 'title',
    },
    {
      key: 'description',
      title: (
        <ColumnsTitle
          icon={<InfoCircleOutlined />}
          content={tDataTable('Columns.description')}
        />
      ),
      sorter: true,
      showSorterTooltip: false,
      dataIndex: 'description',
    },
  ];

  let dataSource: TableProps<IRoleDataType>['dataSource'] = undefined;
  let pagination: TableProps<IRoleDataType>['pagination'] = undefined;

  if (!data.success) {
    notifyError(tResponseMessage(data.message));
  } else {
    const _data = data as IPagedApiResponse<IRole>;

    dataSource = _data.data.map<IRoleDataType>((role) => ({
      ...role,
      key: role.id,
      action: (
        <Flex gap={8}>
          <Tooltip title={tMain('Common.viewTooltip')}>
            <Button type="primary" size="small" icon={<EyeOutlined />} />
          </Tooltip>
          <RoleDelete roleId={role.id} />
        </Flex>
      ),
    }));

    pagination = {
      current: paginationParams.page,
      pageSize: paginationParams.size,
      total: _data.meta.total,
      showSizeChanger: true,
      showTotal: (total, range) =>
        tMain('Common.total', { from: range[0], to: range[1], total }),
    };
  }

  /**
   * Handles table pagination and sorting changes by updating the URL search parameters
   * and navigating to the updated route. It sets the current page, page size, and sort order
   * based on the table's state.
   *
   * @param pagination - The pagination object containing current page and page size.
   * @param _ - Unused parameter for filters.
   * @param sorter - The sorter object or array containing sorting field and order.
   */
  const handleTableChange: TableProps<IRoleDataType>['onChange'] = async (
    pagination,
    _,
    sorter
  ) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    newSearchParams.set('page', pagination.current?.toString() || '1');
    newSearchParams.set('size', pagination.pageSize?.toString() || '10');

    if (!Array.isArray(sorter) && sorter.field && sorter.order) {
      newSearchParams.set(
        'sort',
        `${sorter.field},${sorter.order === 'ascend' ? 'asc' : 'desc'}`
      );
    }

    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <Table<IRoleDataType>
      size="middle"
      dataSource={dataSource}
      pagination={pagination}
      columns={columns}
      onChange={handleTableChange}
    />
  );
}
