'use client';
import {
  IBadRequestErrors,
  IDataApiResponse,
  IResendVerificationEmailForm,
  ISignUpForm,
} from '@/types';
import {
  IdcardOutlined,
  LockOutlined,
  LoginOutlined,
  MailOutlined,
  SafetyOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, Row, Typography } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import Input from 'antd/es/input/Input';
import Password from 'antd/es/input/Password';
import Title from 'antd/es/typography/Title';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signUpAction } from './action';
import { useNotification } from '@/context/NotificationProvider';
import { sendVerificationEmailAction } from '../send-verification-email/action';

export default function SignUpPage() {
  const router = useRouter();
  const t = useTranslations('SignUpPage');
  const tResponseMessage = useTranslations('ResponseMessage');
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
      notifySuccess(tResponseMessage(data.message));

      // Send verification email
      const data2 = await sendVerificationEmailAction({
        email: signUpForm.email,
      } as IResendVerificationEmailForm);
      if (data2.success) {
        notifySuccess(tResponseMessage(data2.message));
      } else {
        notifyError(tResponseMessage(data2.message));
      }

      router.push('/sign-in');
    } else if (data.statusCode === 400) {
      const errors = (data as IDataApiResponse<IBadRequestErrors>).data.errors;
      for (const error in errors) {
        form.setFields([
          {
            name: error as keyof ISignUpForm,
            errors: errors[error]
              .split(';')
              .map((msgCode) => '- ' + tResponseMessage(msgCode)),
          },
        ]);
      }
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
        name="form_sign_up"
        form={form}
        layout="vertical"
        onFinish={handleSignUp}
      >
        {/* Email */}
        <FormItem
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
        </FormItem>

        {/* firstName and lastName */}
        <Row gutter={16}>
          <Col span={12}>
            {/* firstName */}
            <FormItem
              name="firstName"
              label={t('firstNameLabel')}
              rules={[
                { required: true, message: '- ' + t('firstNameRequired') },
              ]}
            >
              <Input
                style={{ marginBottom: '6px' }}
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
              label={t('lastNameLabel')}
              rules={[
                { required: true, message: '- ' + t('lastNameRequired') },
              ]}
            >
              <Input
                size="large"
                style={{ marginBottom: '6px' }}
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
          icon={<UserAddOutlined />}
          loading={loading}
          style={{ marginTop: '12px' }}
        >
          {t('signUpButton')}
        </Button>

        <Button
          block
          size="large"
          icon={<SafetyOutlined />}
          disabled={loading}
          onClick={() => router.push('/send-verification-email')}
          style={{ marginTop: '12px' }}
        >
          {t('sendVerificationEmailButton')}
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
