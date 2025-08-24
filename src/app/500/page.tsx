import { Result, Row } from 'antd';
import { useTranslations } from 'next-intl';

export default function InternalServerErrorPage() {
  const t = useTranslations('InternalServerErrorPage');

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Result status="500" title={t('title')} subTitle={t('subTitle')} />
    </Row>
  );
}
