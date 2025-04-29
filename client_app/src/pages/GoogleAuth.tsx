// GoogleAuth.tsx
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleProfile } from '../types/account';
import { Modal, Button, Avatar, Typography, message } from 'antd';
import { useGoogleLoginUserMutation } from '../services/authApi';

const { Title, Text } = Typography;

interface GoogleAuthProps {
  open: boolean;
  onClose: () => void;
  token: string;
}

const GoogleAuth: FC<GoogleAuthProps> = ({ open, onClose, token }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<GoogleProfile | null>(null);
  const [googleLoginUser, { isLoading }] = useGoogleLoginUserMutation();

  useEffect(() => {
    if (!open) return;

    const fetchUserInfo = async () => {
      try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Не вдалося отримати інформацію про користувача');
        }

        const userInfo: GoogleProfile = await response.json();
        setUserInfo(userInfo);
      } catch (error) {
        console.error('Помилка при отриманні даних користувача:', error);
        onClose();
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [open, token, onClose, navigate]);

  const handleConfirm = async () => {
    if (!userInfo) return;

    try {
      const loginRequest = {
        googleAccessToken: token,
        remember: true, // або false, залежно від логіки
      };

      await googleLoginUser(loginRequest).unwrap();
      message.success('Успішний вхід через Google');
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Помилка під час логіну через Google:', error);
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
        <Button key="confirm" type="primary" onClick={handleConfirm} loading={isLoading}>Підтвердити</Button>,
      ]}
      centered
      title="Підтвердження акаунту Google"
    >
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
