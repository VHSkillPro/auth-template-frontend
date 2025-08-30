'use client';
import { useNotification } from '@/context/NotificationProvider';
import { ISendResetPasswordEmailForm } from '@/types';
import { LoginOutlined, MailOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Input, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { sendResetPasswordEmailAction } from './action';

export default function SendResetPasswordEmailPage() {
  const t = useTranslations('SendResetPasswordEmailPage');
  const tResponseMessage = useTranslations('ResponseMessage');

  const router = useRouter();
  const { notifySuccess, notifyError } = useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm<ISendResetPasswordEmailForm>();

  /**
   * Handles the process of sending a reset password email.
   *
   * Sets the loading state, calls the action to send the reset password email,
   * and provides user feedback based on the result. On success, notifies the user
   * and redirects to the sign-in page; on failure, shows an error notification.
   *
   * @param form - The form data containing the user's email for password reset.
   */
  const handleSendEmail = async (form: ISendResetPasswordEmailForm) => {
    setLoading(true);

    const data = await sendResetPasswordEmailAction(form);
    if (data.success) {
      notifySuccess(tResponseMessage(data.message));
      router.push('/sign-in');
    } else {
      notifyError(tResponseMessage(data.message));
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
        <Title>{t('title')}</Title>
        <Divider />
      </Typography>

      <Form
        name="form_send_reset_password_email"
        form={form}
        layout="vertical"
        onFinish={handleSendEmail}
      >
        <Form.Item
          name="email"
          label={t('emailLabel')}
          rules={[
            { required: true, message: '- ' + t('emailRequired') },
            { type: 'email', message: '- ' + t('emailInvalid') },
          ]}
        >
          <Input
            style={{ marginBottom: '6px' }}
            prefix={<MailOutlined style={{ margin: '0 6px' }} />}
            placeholder={t('emailPlaceholder')}
            size="large"
            disabled={loading}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          icon={<SendOutlined />}
          loading={loading}
          style={{ marginTop: '12px' }}
        >
          {t('sendEmailButton')}
        </Button>

        <Button
          block
          size="large"
          icon={<LoginOutlined />}
          disabled={loading}
          onClick={() => router.push('/sign-in')}
          style={{ marginTop: '12px' }}
        >
          {t('signInButton')}
        </Button>
      </Form>
    </Card>
  );
}
