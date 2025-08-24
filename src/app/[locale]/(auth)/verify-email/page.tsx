'use client';

import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Card, Divider, Flex, Spin, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { verifyEmailAction } from './action';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const t = useTranslations('VerifyEmailPage');
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setEmailVerified(false);
        return;
      }
      const response = await verifyEmailAction(token);
      setEmailVerified(response.success);
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
          <Typography>{t('emailNotVerified')}</Typography>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <CheckCircleOutlined style={{ color: 'green', fontSize: '48px' }} />
        <Typography>{t('emailVerified')}</Typography>
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
        <Title level={2}>{t('title')}</Title>
        <Divider />
      </Typography>
      <Flex gap="middle" align="center" justify="center">
        {renderContent()}
      </Flex>
    </Card>
  );
}
