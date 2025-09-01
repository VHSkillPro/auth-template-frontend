'use client';
import { Button, theme } from 'antd';
import { Header } from 'antd/es/layout/layout';
import ProfileDropdown from './ProfileDropdown';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

export default function CHeader({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Header
      style={{
        paddingRight: 16,
        paddingLeft: 0,
        background: colorBgContainer,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <ProfileDropdown />
    </Header>
  );
}
