'use client';
import { useAuth } from '@/context/AuthProvider';
import { useAvatar } from '@/hooks/useAvatar';
import {
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, MenuProps, Space, Spin, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'use-intl';
import { signOutAction } from '../../(auth)/action';
import { useNotification } from '@/context/NotificationProvider';

export default function ProfileDropdown() {
  const router = useRouter();
  const { profile, signOut, setLoading } = useAuth();
  const { avatarUrl, isLoading } = useAvatar();
  const t = useTranslations('ProfileDropdown');
  const tCommon = useTranslations('Common');
  const { notifySuccess, notifyError } = useNotification();

  /**
   * Handles the user sign-out process.
   * Calls the `signOut` function to log out the user and then navigates to the sign-in page.
   */
  const handleSignOut = async () => {
    setLoading(true);
    const data = await signOutAction();

    if (data.success) {
      router.push('/sign-in');
      signOut();
      notifySuccess(tCommon('signOutSuccess'));
    } else {
      notifyError(tCommon('signOutError'));
    }

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: t('myAccount'),
      icon: <ProfileOutlined />,
    },
    {
      key: '2',
      type: 'divider',
    },
    {
      key: '3',
      label: t('signOut'),
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleSignOut, // Đăng xuất và chuyển hướng về trang chủ
    },
  ];

  /**
   * Renders the user's avatar component based on the loading state and avatar URL.
   *
   * @returns {JSX.Element} The rendered avatar component.
   */
  const renderAvatar = () => {
    if (isLoading) {
      return (
        <Spin size="small">
          <Avatar />
        </Spin>
      );
    }

    if (avatarUrl === null) {
      return <Avatar icon={<UserOutlined />} />;
    }

    return <Avatar src={avatarUrl} />;
  };

  return (
    <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
      <a onClick={(e) => e.preventDefault()}>
        <Space size="small" style={{ cursor: 'pointer' }}>
          {renderAvatar()}
          <Typography
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography.Text strong style={{ fontSize: '16px' }}>
              {profile?.lastName
                ? `${profile.firstName} ${profile.lastName}`
                : profile?.firstName}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
              {profile?.email}
            </Typography.Text>
          </Typography>
        </Space>
      </a>
    </Dropdown>
  );
}
