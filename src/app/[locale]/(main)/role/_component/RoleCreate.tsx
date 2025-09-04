'use client';

import { Fragment, Key, useState } from 'react';
import { useTranslations } from 'next-intl';
import { PlusCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Tooltip,
  Transfer,
  TransferProps,
  Typography,
} from 'antd';
import Title from 'antd/es/typography/Title';
import {
  IApiResponse,
  IBadRequestErrors,
  IDataApiResponse,
  IPagedApiResponse,
  IPermission,
  IRoleCreateForm,
} from '@/types';
import { createRoleAction } from '../action';
import { useNotification } from '@/context/NotificationProvider';

interface IRoleCreateProps {
  permissionsData: IPagedApiResponse<IPermission> | IApiResponse;
}

interface ITransferItem extends IPermission {
  key: Key;
}

export default function RoleCreate({ permissionsData }: IRoleCreateProps) {
  const tMain = useTranslations('Main');
  const tRolePage = useTranslations('Main.RolePage');
  const tResponseMessage = useTranslations('ResponseMessage');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm<IRoleCreateForm>();
  const { notifySuccess, notifyError } = useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPermissions, setSelectedPermissions] = useState<
    TransferProps['targetKeys']
  >([]);

  const permissionsDataSource = (
    (permissionsData as IPagedApiResponse<IPermission>)?.data || []
  ).map<ITransferItem>((permission) => ({
    key: permission.id,
    ...permission,
  }));

  /**
   * Opens the modal by setting the `isModalOpen` state to `true`.
   */
  const showModal = () => {
    setIsModalOpen(true);
  };

  /**
   * Handles the confirmation action when creating a role.
   *
   * - Sets the loading state to true.
   * - Validates form fields and submits the data using `createRoleAction`.
   * - Displays a success notification and closes the modal if the action succeeds.
   * - Displays an error notification if the action fails.
   * - Resets the loading state after the process completes.
   *
   * @async
   */
  const handleOk = async () => {
    try {
      const formData = await form.validateFields();
      formData.description = formData.description || '';
      formData.permissionIds = formData.permissionIds ?? [];

      setLoading(true);
      const data = await createRoleAction(formData);

      if (data.success) {
        notifySuccess(tResponseMessage(data.message));
        setIsModalOpen(false);
        form.resetFields();
        setSelectedPermissions([]);
      } else {
        notifyError(tResponseMessage(data.message));
        const errors = (data as IDataApiResponse<IBadRequestErrors>).data
          .errors;
        for (const key in errors) {
          form.setFields([
            {
              name: key as keyof IRoleCreateForm,
              errors: errors[key]
                .split(';')
                .map((msgCode) => '- ' + tResponseMessage(msgCode)),
            },
          ]);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (errors) {
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the cancel action by closing the modal.
   * Sets the modal's open state to false.
   */
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  /**
   * Handles changes to the selected keys in the Transfer component.
   * Updates the state with the new set of selected permission keys.
   *
   * @param newTargetKeys - An array of keys representing the currently selected permissions.
   */
  const handleChangeTransfer: TransferProps['onChange'] = (newTargetKeys) => {
    setSelectedPermissions(newTargetKeys);
  };

  /**
   * Filters transfer options based on the input value.
   *
   * Returns `true` if the `inputValue` is found within the `name` or `title` properties of the given option.
   *
   * @param inputValue - The string to filter options by.
   * @param option - The transfer item to check against the input value.
   * @returns `true` if the option matches the input value; otherwise, `false`.
   */
  const filterOptionTransfer = (inputValue: string, option: ITransferItem) => {
    return (
      option.name.indexOf(inputValue) > -1 ||
      option.title.indexOf(inputValue) > -1
    );
  };

  return (
    <Fragment>
      <Button type="primary" icon={<PlusCircleOutlined />} onClick={showModal}>
        {tRolePage('createButton')}
      </Button>
      <Modal
        title={
          <Typography>
            <Title level={2}>{tRolePage('Create.title')}</Title>
          </Typography>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={tMain('Common.create')}
        cancelText={tMain('Common.cancel')}
        width={'800px'}
        okButtonProps={{ loading: loading }}
        cancelButtonProps={{ disabled: loading }}
        closeIcon={false}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label={tRolePage('Create.nameLabel')}
                rules={[
                  {
                    required: true,
                    message: '- ' + tRolePage('Create.nameRequired'),
                  },
                ]}
              >
                <Input
                  placeholder={tRolePage('Create.namePlaceholder')}
                  style={{ marginBottom: '6px' }}
                  disabled={loading}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="title"
                label={tRolePage('Create.titleLabel')}
                rules={[
                  {
                    required: true,
                    message: '- ' + tRolePage('Create.titleRequired'),
                  },
                ]}
              >
                <Input
                  placeholder={tRolePage('Create.titlePlaceholder')}
                  style={{ marginBottom: '6px' }}
                  disabled={loading}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label={tRolePage('Create.descriptionLabel')}
          >
            <Input
              placeholder={tRolePage('Create.descriptionPlaceholder')}
              style={{ marginBottom: '6px' }}
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            name="permissionIds"
            label={tRolePage('Create.permissionIdsLabel')}
          >
            <Transfer
              dataSource={permissionsDataSource}
              showSearch
              targetKeys={selectedPermissions}
              onChange={handleChangeTransfer}
              filterOption={filterOptionTransfer}
              render={(permission) => (
                <Tooltip title={permission.name}>{permission.title}</Tooltip>
              )}
              listStyle={{
                width: '100%',
                height: '320px',
              }}
              disabled={loading}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
}
