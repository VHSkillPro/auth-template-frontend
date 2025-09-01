'use client';
import { Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { usePathname } from 'next/navigation';
import { CSSProperties, useEffect } from 'react';
import { useSider } from '../_hook/useSider';

const siderStyle: CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

export default function CSider({ collapsed }: { collapsed: boolean }) {
  const path = usePathname();

  useEffect(() => {}, [path]);

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} style={siderStyle}>
      <Menu
        key={path}
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[path.split('/')[2] || 'home']}
        items={useSider()}
      />
    </Sider>
  );
}
