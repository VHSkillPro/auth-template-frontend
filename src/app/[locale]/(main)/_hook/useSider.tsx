import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { ItemType, MenuItemType } from 'antd/es/menu/interface';
import { useAuth } from '@/context/AuthProvider';

export const useSider = () => {
  const t = useTranslations('Main.Sider');
  const router = useRouter();
  const { profile } = useAuth();

  const menuItems: ItemType<MenuItemType>[] = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
      onClick: () => {
        router.push('/');
      },
    },
  ];

  if (
    profile?.permissions?.includes('all:all') ||
    profile?.permissions?.includes('role:read')
  ) {
    menuItems.push({
      key: 'role',
      icon: <SettingOutlined />,
      label: t('role'),
      onClick: () => {
        router.push('/role');
      },
    });
  }

  return menuItems;
};
