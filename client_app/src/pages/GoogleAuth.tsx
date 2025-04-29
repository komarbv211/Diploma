// GoogleAuth.tsx
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Avatar, Typography, message } from 'antd';
import { useGoogleLoginUserMutation } from '../services/authApi';
import { useGoogleUserInfo } from '../hooks/useGoogleUserInfo';
import { IGoogleAuthProps } from '../types/account';


const { Title, Text } = Typography;

const GoogleAuth: FC<IGoogleAuthProps> = ({ open, onClose, token }) => {
  const navigate = useNavigate();
  const { userInfo, loading, error } = useGoogleUserInfo(token);
  const [googleLoginUser, { isLoading }] = useGoogleLoginUserMutation();

  const handleConfirm = async () => {
    if (!userInfo || loading) return;

    try {
      const loginRequest = {
        googleAccessToken: token,
      };
      await googleLoginUser(loginRequest).unwrap();
      message.success('Успішний вхід через Google');
      onClose();
      navigate('/');
    } catch {
      message.error('Не вдалося увійти через Google');
      onClose();
      navigate('/login');
    }
  };

  const handleCancel = () => {
    onClose();
    navigate('/login');
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>Скасувати</Button>,
        <Button key="confirm" type="primary" onClick={handleConfirm} loading={isLoading || loading}>
          Підтвердити
        </Button>,
      ]}
      centered
      title="Підтвердження акаунту Google"
    >
      {error && <Text type="danger">{error}</Text>}
      {userInfo && (
        <div className="text-center">
          <Avatar src={userInfo.picture} size={100} style={{ marginBottom: 20 }} />
          <div>
            <Title level={4}>{userInfo.given_name} {userInfo.family_name}</Title>
            <Text type="secondary">{userInfo.email}</Text>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default GoogleAuth;
