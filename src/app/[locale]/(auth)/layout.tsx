import { Col, Row } from 'antd';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
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
        {children}
      </Col>
    </Row>
  );
}
