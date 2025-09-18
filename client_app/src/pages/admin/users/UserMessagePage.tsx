import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Space, Typography } from "antd";
import { useSendMessageToUserMutation } from "../../../services/admin/userAdminApi";
import { ApiError } from "../../../types/errors";
import { handleFormErrors } from "../../../utilities/handleApiErrors";
import SuccessIcon from "../../../components/icons/toasts/SuccessIcon";
import { showToast } from "../../../utilities/showToast";

const { TextArea } = Input;
const { Title } = Typography;

const UserMessagePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sendMessageToUser, { isLoading }] = useSendMessageToUserMutation();
  const [form] = Form.useForm();

  const handleSubmit = async (values: { subject: string; message: string }) => {
    if (!id) return;

    try {
      const result = await sendMessageToUser({
        id: Number(id),
        subject: values.subject,
        message: values.message,
      }).unwrap();

      showToast("success", result || "Повідомлення надіслано", <SuccessIcon />);

      navigate(-1);
    } catch (error: unknown) {
      handleFormErrors(error as ApiError, form);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Title level={3}>Надіслати повідомлення користувачу</Title>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Тема"
          name="subject"
          rules={[
            {
              required: true,
              message: "Будь ласка, введіть тему повідомлення",
            },
          ]}
        >
          <Input placeholder="Тема повідомлення" />
        </Form.Item>

        <Form.Item
          label="Повідомлення"
          name="message"
          rules={[
            {
              required: true,
              message: "Будь ласка, введіть текст повідомлення",
            },
          ]}
        >
          <TextArea rows={6} placeholder="Текст повідомлення" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Надіслати
            </Button>
            <Button onClick={() => navigate(-1)}>Скасувати</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserMessagePage;
