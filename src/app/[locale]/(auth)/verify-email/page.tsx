'use client';

import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Card, Divider, Flex, Spin, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { verifyEmailAction } from './action';

export default function VerifyEmailPage() {
  const t = useTranslations('VerifyEmailPage');
  const tResponseMessage = useTranslations('ResponseMessage');

  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setEmailVerified(false);
        setMessage('VERIFICATION_TOKEN_NOT_FOUND');
        return;
      }
      const response = await verifyEmailAction(token);
      setEmailVerified(response.success);
      setMessage(response.message);
    };
    verifyEmail();
  }, [token]);

  const renderContent = () => {
    if (emailVerified === null) {
      return (
        <Fragment>
          <Spin size="large" />
          <Typography>{t('loading')}</Typography>
        </Fragment>
      );
    }

    if (emailVerified === false) {
      return (
        <Fragment>
          <CloseCircleOutlined style={{ color: 'red', fontSize: '48px' }} />
          <Typography>
            <Typography.Text>{tResponseMessage(message)}</Typography.Text>
          </Typography>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <CheckCircleOutlined style={{ color: 'green', fontSize: '48px' }} />
        <Typography>
          <Typography.Text>{tResponseMessage(message)}</Typography.Text>
        </Typography>
      </Fragment>
    );
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
      <Flex gap="middle" align="center" justify="center">
        {renderContent()}
      </Flex>
    </Card>
  );
}
