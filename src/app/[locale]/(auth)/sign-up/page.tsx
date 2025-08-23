'use client';
import { ISignUpForm } from '@/types';
import {
  IdcardOutlined,
  LockOutlined,
  LoginOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, Row, Typography } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import Input from 'antd/es/input/Input';
import Password from 'antd/es/input/Password';
import Title from 'antd/es/typography/Title';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { sendVerificationEmailAction, signUpAction } from './action';
import { useNotification } from '@/context/NotificationProvider';

export default function SignUpPage() {
  const router = useRouter();
  const t = useTranslations('SignUpPage');
  const [form] = Form.useForm<ISignUpForm>();
  const { notifySuccess, notifyError } = useNotification();
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Handles the user sign-up process.
   *
   * @param signUpForm - The form data containing user sign-up information.
   */
  const handleSignUp = async (signUpForm: ISignUpForm) => {
    setLoading(true);

    // Sign up
    const data = await signUpAction(signUpForm);
    if (data.success) {
      notifySuccess(t('signUpSuccess'));

      // Send verification email
      const data2 = await sendVerificationEmailAction(signUpForm.email);
      if (data2.success) {
        notifySuccess(t('sendVerificationEmailSuccess'));
      } else {
        notifyError(t('sendVerificationEmailSuccessError'));
      }

      router.push('/sign-in');
    } else if (data.statusCode === 400) {
      form.setFields([
        {
          name: 'email',
          errors: ['- ' + t('emailExisted')],
        },
      ]);
    } else {
      notifyError(t('Common.serverError'));
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
        name="form_sign_up"
        form={form}
        layout="vertical"
        onFinish={handleSignUp}
      >
        {/* Email */}
        <FormItem
          name="email"
          rules={[
            { required: true, message: '- ' + t('emailRequired') },
            { type: 'email', message: '- ' + t('emailInvalid') },
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

        {/* firstName and lastName */}
        <Row gutter={16}>
          <Col span={12}>
            {/* firstName */}
            <FormItem
              name="firstName"
              rules={[
                { required: true, message: '- ' + t('firstNameRequired') },
              ]}
            >
              <Input
                style={{ margin: '6px 0' }}
                prefix={<IdcardOutlined style={{ margin: '0 6px' }} />}
                placeholder={t('firstNamePlaceholder')}
                size="large"
                disabled={loading}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            {/* lastName */}
            <FormItem
              name="lastName"
              rules={[
                { required: true, message: '- ' + t('lastNameRequired') },
              ]}
            >
              <Input
                size="large"
                style={{ margin: '6px 0' }}
                prefix={<IdcardOutlined style={{ margin: '0 6px' }} />}
                placeholder={t('lastNamePlaceholder')}
                disabled={loading}
              />
            </FormItem>
          </Col>
        </Row>

        {/* Password */}
        <FormItem
          name="password"
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
            style={{ margin: '6px 0' }}
            prefix={<LockOutlined style={{ margin: '0 6px' }} />}
            placeholder={t('passwordPlaceholder')}
            size="large"
            disabled={loading}
          />
        </FormItem>

        {/* Re-enter Password */}
        <FormItem
          name="repassword"
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
            style={{ margin: '6px 0' }}
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
          icon={<UserAddOutlined />}
          loading={loading}
          style={{ marginTop: '12px' }}
        >
          {t('signUpButton')}
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
