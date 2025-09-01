'use client';
import { Breadcrumb, Layout, theme } from 'antd';
import { ReactNode, useState } from 'react';
import CSider from './_component/CSider';
import CHeader from './_component/CHeader';
import { Content } from 'antd/es/layout/layout';

export default function MainLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <CSider collapsed={collapsed} />
      <Layout>
        <CHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb
            style={{ margin: '16px 0' }}
            items={[{ title: 'User' }, { title: 'Bill' }]}
          />
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
