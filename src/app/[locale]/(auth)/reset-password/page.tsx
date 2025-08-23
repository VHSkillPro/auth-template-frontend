'use client';

import { IResetPasswordForm } from '@/types';
import { EditOutlined, LockOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Typography } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import Password from 'antd/es/input/Password';
import Title from 'antd/es/typography/Title';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { resetPasswordAction } from './action';
import { useNotification } from '@/context/NotificationProvider';

export default function ResetPasswordPage() {
  const t = useTranslations('ResetPasswordPage');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [form] = Form.useForm<IResetPasswordForm>();
  const [loading, setLoading] = useState<boolean>(false);
  const { notifySuccess, notifyError } = useNotification();
  const router = useRouter();

  useEffect(() => {}, [token]);

  /**
   * Handles the password reset process by submitting the reset password form data.
   * Sets the loading state, calls the reset password action, and provides user feedback
   * based on the result. On success, notifies the user and redirects to the sign-in page;
   * on failure, displays an error notification.
   *
   * @param resetPasswordForm - The form data required to reset the password.
   */
  const handleResetPassword = async (resetPasswordForm: IResetPasswordForm) => {
    setLoading(true);

    if (token != null) {
      resetPasswordForm.token = token;
    }

    const data = await resetPasswordAction(resetPasswordForm);
    if (data.success) {
      notifySuccess(t('resetPasswordSuccess'));
      router.push('/sign-in');
    } else {
      notifyError(t('resetPasswordError'));
    }

    setLoading(false);
  };

  return (
    <Card
      style={{
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
      }}
    >
      <Typography style={{ textAlign: 'center' }}>
        <Title level={2}>{t('title')}</Title>
        <Divider />
      </Typography>

      <Form
        name="form_reset_password"
        form={form}
        layout="vertical"
        onFinish={handleResetPassword}
      >
        {/* Password */}
        <FormItem
          name="password"
          label={t('passwordLabel')}
          rules={[
            { required: true, message: '- ' + t('passwordRequired') },
            {
              pattern:
                /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
              message: '- ' + t('passwordInvalid'),
            },
          ]}
        >
          <Password
            style={{ marginBottom: '6px' }}
            prefix={<LockOutlined style={{ margin: '0 6px' }} />}
            placeholder={t('passwordPlaceholder')}
            size="large"
            disabled={loading}
          />
        </FormItem>

        {/* Re-enter Password */}
        <FormItem
          name="repassword"
          label={t('repasswordLabel')}
          rules={[
            { required: true, message: '- ' + t('repasswordRequired') },
            {
              pattern:
                /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
              message: '- ' + t('passwordInvalid'),
            },
            {
              validator(_, value) {
                if (value && value !== form.getFieldValue('password')) {
                  return Promise.reject('- ' + t('repasswordInvalid'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Password
            style={{ marginBottom: '6px' }}
            prefix={<LockOutlined style={{ margin: '0 6px' }} />}
            placeholder={t('repasswordPlaceholder')}
            size="large"
            disabled={loading}
          />
        </FormItem>

        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          icon={<EditOutlined />}
          loading={loading}
          style={{ marginTop: '12px' }}
        >
          {t('resetPasswordButton')}
        </Button>
      </Form>
    </Card>
  );
}
