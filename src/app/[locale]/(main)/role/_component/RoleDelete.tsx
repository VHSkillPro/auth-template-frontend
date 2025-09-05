'use client';

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm, PopconfirmProps, Tooltip } from 'antd';
import { useTranslations } from 'next-intl';
import { deleteRoleAction } from '../action';
import { useNotification } from '@/context/NotificationProvider';

interface IroleDeleteProps {
  roleId: number;
}

export default function RoleDelete({ roleId }: IroleDeleteProps) {
  const tMain = useTranslations('Main');
  const tRolePage = useTranslations('Main.RolePage');
  const tResponseMessage = useTranslations('ResponseMessage');

  const { notifySuccess, notifyError } = useNotification();

  /**
   * Handles the confirmation action for deleting a role.
   *
   * This function is triggered when the user confirms the deletion in a pop-up confirmation dialog.
   * It calls the `deleteRoleAction` with the specified `roleId`, and displays a success or error notification
   * based on the result of the deletion operation.
   *
   * @remarks
   * Utilizes `notifySuccess` and `notifyError` to provide user feedback, and translates the response message
   * using `tResponseMessage`.
   *
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  const handleConfirm: PopconfirmProps['onConfirm'] = async () => {
    const data = await deleteRoleAction(roleId);

    if (data.success) {
      notifySuccess(tResponseMessage(data.message));
    } else {
      notifyError(tResponseMessage(data.message));
    }
  };

  return (
    <Popconfirm
      title={tRolePage('Delete.title')}
      description={tRolePage('Delete.description')}
      okText={tRolePage('Delete.confirm')}
      cancelText={tRolePage('Delete.cancel')}
      onConfirm={handleConfirm}
      okButtonProps={{ danger: true }}
    >
      <Tooltip title={tMain('Common.deleteTooltip')}>
        <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
      </Tooltip>
    </Popconfirm>
  );
}
