import { Spin } from 'antd';

const Loader = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <Spin size="large" />
    </div>
  );
};

export default Loader;
