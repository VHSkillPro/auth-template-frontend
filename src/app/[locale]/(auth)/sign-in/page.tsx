'use client';
import { Button, Card, Col, Divider, Form, Row, Typography } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import Paragraph from 'antd/es/typography/Paragraph';
import Title from 'antd/es/typography/Title';
import Input from 'antd/es/input/Input';
import {
  LockOutlined,
  LoginOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import Password from 'antd/es/input/Password';
import { ISignInForm } from '@/types';
import { signInAction } from './action';
import { useNotification } from '@/context/NotificationProvider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useNotification();
  const t = useTranslations('SignInPage');
  const tCommon = useTranslations('Common');
  const [form] = Form.useForm<ISignInForm>();
  const router = useRouter();

  /**
   * Handles the sign-in process by submitting the sign-in form data.
   *
   * @param signInForm - The form data containing user credentials for sign-in.
   */
  const handleSignIn = async (signInForm: ISignInForm) => {
    setLoading(true);
    const data = await signInAction(signInForm);

    if (data.success) {
      notifySuccess(t('signInSuccess'));
      router.push('/');
    } else if (data.statusCode === 401) {
      notifyError(t('emailOrPasswordInvalid'));
    } else {
      notifyError(tCommon('serverError'));
    }

    setLoading(false);
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Col xxl={6} xl={8} lg={10} md={12} sm={12}>
        <Card
          style={{
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
          }}
        >
          <Typography style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Title level={2}>{t('title')}</Title>
            <Paragraph type="secondary">{t('welcome')}</Paragraph>
            <Divider />
          </Typography>
          <Form
            name="form_sign_in"
            form={form}
            layout="vertical"
            onFinish={handleSignIn}
          >
            <FormItem
              name="email"
              rules={[
                { required: true, message: t('emailRequired') },
                { type: 'email', message: t('emailInvalid') },
              ]}
            >
              <Input
                style={{ marginBottom: '6px' }}
                prefix={<UserOutlined style={{ margin: '0 6px' }} />}
                placeholder={t('emailPlaceholder')}
                size="large"
                disabled={loading}
              />
            </FormItem>

            <FormItem
              name="password"
              rules={[{ required: true, message: t('passwordRequired') }]}
              style={{ marginBottom: '32px' }}
            >
              <Password
                style={{ margin: '6px 0' }}
                prefix={<LockOutlined style={{ margin: '0 6px' }} />}
                placeholder={t('passwordPlaceholder')}
                size="large"
                disabled={loading}
              />
            </FormItem>

            <Form.Item style={{ marginBottom: '12px' }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                icon={<LoginOutlined />}
                loading={loading}
              >
                {t('signInButton')}
              </Button>
            </Form.Item>

            <Form.Item style={{ marginBottom: '6px' }}>
              <Button
                block
                size="large"
                icon={<UserAddOutlined />}
                disabled={loading}
                onClick={() => router.push('/sign-up')}
              >
                {t('signUpButton')}
              </Button>
            </Form.Item>

            <Form.Item
              style={{
                marginBottom: '0',
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              <Button
                type="link"
                size="small"
                disabled={loading}
                onClick={() => router.push('/forgot-password')}
              >
                {t('forgotPassword')}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
