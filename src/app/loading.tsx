import { Flex, Spin } from 'antd';

export default function Loading() {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Flex align="center" gap="middle">
        <Spin size="large" />
      </Flex>
    </div>
  );
}
