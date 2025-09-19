import { useNavigate } from "react-router-dom";
import { Button, Card, Typography, Popconfirm } from "antd";
import { useAppSelector } from "../../store/store";
import { getUser } from "../../store/slices/userSlice";
import { useDeleteUserMutation } from "../../services/userApi";
import { useLogoutMutation } from "../../services/authApi";
import { showToast } from "../../utilities/showToast";
import SuccessIcon from "../../components/icons/toasts/SuccessIcon";
import ErrorIcon from "../../components/icons/toasts/ErrorIcon";

const { Title, Paragraph } = Typography;

const DeleteAccountPage = () => {
  const navigate = useNavigate();
  const user = useAppSelector(getUser); // тут твій користувач з redux
  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const [logout] = useLogoutMutation();

  const handleDelete = async () => {
    try {
      if (!user?.id) {
         showToast('info',"Не вдалося знайти користувача",);
        return;
      }

      await deleteUser(user.id).unwrap();
      await logout();
      showToast('success', "Ваш акаунт успішно видалено", <SuccessIcon/>);
      navigate("/login");
    } catch {
      showToast('error', "Сталася помилка при видаленні акаунта", <ErrorIcon/>);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <Card className="max-w-lg w-full p-6 text-center shadow-md rounded-xl">
        <Title level={3} className="text-red-500">Видалити мій акаунт</Title>
        <Paragraph>
          Ця дія є незворотною. Після видалення акаунта ви втратите доступ до
          всіх даних і замовлень, пов’язаних з вашим профілем.
        </Paragraph>
        <Popconfirm
          title="Ви впевнені, що хочете видалити акаунт?"
          onConfirm={handleDelete}
          okText="Так, видалити"
          cancelText="Скасувати"
        >
          <Button
            danger
            type="primary"
            loading={isLoading}
            className="mt-4"
          >
            Видалити акаунт
          </Button>
        </Popconfirm>
      </Card>
    </div>
  );
};

export default DeleteAccountPage;
