'use client';
import { IResendVerificationEmailForm } from '@/types';
import { LoginOutlined, MailOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Typography } from 'antd';
import Input from 'antd/es/input/Input';
import Title from 'antd/es/typography/Title';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { sendVerificationEmailAction } from './action';
import { useNotification } from '@/context/NotificationProvider';

export default function SendVerificationEmailPage() {
  const t = useTranslations('SendVerificationEmailPage');
  const tResponseMessage = useTranslations('ResponseMessage');

  const router = useRouter();
  const { notifySuccess, notifyError } = useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm<IResendVerificationEmailForm>();

  /**
   * Handles sending a verification email by invoking the sendVerificationEmailAction with the provided form data.
   * Displays a success notification if the email is sent successfully, otherwise shows an error notification.
   * Manages the loading state during the process.
   *
   * @param form - The form data required to resend the verification email.
   */
  const handleSendEmail = async (form: IResendVerificationEmailForm) => {
    setLoading(true);

    const data = await sendVerificationEmailAction(form);
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
        name="form_resend_verification_email"
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
