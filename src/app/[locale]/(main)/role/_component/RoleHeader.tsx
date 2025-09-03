'use client';

import { Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import { useTranslations } from 'next-intl';

export default function RoleHeader() {
  const tRolePage = useTranslations('Main.RolePage');

  return (
    <Typography>
      <Title level={2}>{tRolePage('title')}</Title>
    </Typography>
  );
}
