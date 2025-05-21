import { Spin } from 'antd'

const Loader = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <Spin tip="Завантаження..." size="large" />
    </div>
  )
}

export default Loader
