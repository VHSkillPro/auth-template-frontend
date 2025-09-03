'use client';

import { Fragment, useState } from 'react';
import { Button, Drawer, Flex, Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import {
  CheckOutlined,
  CloseOutlined,
  FilterOutlined,
  RestOutlined,
} from '@ant-design/icons';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useNotification } from '@/context/NotificationProvider';

interface IRoleFilterForm {
  keyword?: string;
}

export default function RoleFilter() {
  const tRolePage = useTranslations('Main.RolePage');

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState<boolean>(false);
  const { notifySuccess } = useNotification();
  const [form] = Form.useForm<IRoleFilterForm>();

  /**
   * Opens the drawer by setting the `open` state to `true`.
   * Typically used to display additional options or filters in the UI.
   */
  const showDrawer = () => {
    setOpen(true);
  };

  /**
   * Handles the closing of the filter dialog by setting its open state to false.
   */
  const onClose = () => {
    setOpen(false);
  };

  /**
   * Handles the confirmation action for the role filter.
   * Closes the filter dialog when invoked.
   */
  const handleConfirm = async () => {
    const formData = form.getFieldsValue();
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (formData.keyword && formData.keyword.trim().length > 0) {
      newSearchParams.set('keyword', formData.keyword.trim());
    } else {
      newSearchParams.delete('keyword');
    }
    newSearchParams.set('page', '1');
    notifySuccess(tRolePage('Filter.filterSuccess'));
    router.push(`${pathname}?${newSearchParams.toString()}`);
    onClose();
  };

  /**
   * Handles the reset action for the role filter component.
   * Closes the filter dialog or panel by invoking the `onClose` callback.
   * This function is asynchronous to allow for future enhancements.
   */
  const handleReset = async () => {
    notifySuccess(tRolePage('Filter.resetSuccess'));
    router.push(`${pathname}`);
    onClose();
  };

  return (
    <Fragment>
      <Button type="primary" icon={<FilterOutlined />} onClick={showDrawer}>
        {tRolePage('filterButton')}
      </Button>
      <Drawer
        title={tRolePage('Filter.title')}
        onClose={onClose}
        open={open}
        closable={false}
        footer={
          <Flex justify="space-between">
            <Flex gap={8}>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleConfirm}
              >
                {tRolePage('Filter.confirm')}
              </Button>
              <Button icon={<CloseOutlined />} onClick={onClose}>
                {tRolePage('Filter.cancel')}
              </Button>
            </Flex>
            <Flex>
              <Button
                type="primary"
                danger
                icon={<RestOutlined />}
                onClick={handleReset}
              >
                {tRolePage('Filter.reset')}
              </Button>
            </Flex>
          </Flex>
        }
      >
        <Form key="role-filter-form" form={form} layout="vertical">
          <Form.Item
            name="keyword"
            label={tRolePage('Filter.keywordLabel')}
            tooltip={tRolePage('Filter.keywordTooltip')}
          >
            <Input placeholder={tRolePage('Filter.keywordPlaceholder')} />
          </Form.Item>
        </Form>
      </Drawer>
    </Fragment>
  );
}
