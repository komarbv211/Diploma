import { Form, Input } from "antd";
import AccountBoxIcon from "../../../components/icons/AccountBoxIcon";
import MailIcon from "../../../components/icons/MailIcon";
import PhoneInput from "../../../components/PhoneInput";

interface PersonalInfoFormProps {
  setActiveTab: (tab: "personal" | "delivery") => void;
}

export const PersonalInfoForm = ({ setActiveTab }: PersonalInfoFormProps) => {
  return (
    <>
      <div className="flex-1">
        <Form.Item
          name="firstName"
          label={<span className="form-label">Ім’я</span>}
          rules={[
            {
              required: true,
              message: "Будь ласка, введіть Ваше ім’я!",
            },
          ]}
        >
          <Input
            placeholder="Ім'я користувача"
            className="form-input"
            suffix={<AccountBoxIcon />}
          />
        </Form.Item>
      </div>

      <div className="flex-1">
        <Form.Item
          name="lastName"
          label={<span className="form-label">Прізвище</span>}
          rules={[
            {
              required: true,
              message: "Будь ласка, введіть Ваше прізвище!",
            },
          ]}
        >
          <Input
            placeholder="Прізвище"
            className="form-input"
            suffix={<AccountBoxIcon />}
          />
        </Form.Item>
      </div>

      <Form.Item
        name="email"
        label={<span className="form-label">Email</span>}
        rules={[
          {
            required: true,
            type: "email",
            message: "Будь ласка, введіть дійсну електронну адресу!",
          },
        ]}
      >
        <Input
          placeholder="Email"
          className="form-input"
          suffix={<MailIcon />}
        />
      </Form.Item>

      <Form.Item
        name="phone"
        label={<span className="form-label">Номер телефону</span>}
        rules={[
          { required: true, message: "Введіть номер телефону" },
          {
            validator: (_, value) => {
              const regex_phone = /^\+38\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
              if (!value || regex_phone.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("Неправильний формат номера телефону")
              );
            },
          },
        ]}
        getValueFromEvent={(e) => e.target.value}
      >
        <PhoneInput />
      </Form.Item>

      <Form.Item className="m-auto w-[160px] mt-8">
        <button
          type="button"
          onClick={() => setActiveTab("delivery")}
          className="flex justify-center items-center btn-pink"
        >
          <span>Далі</span>
        </button>
      </Form.Item>
    </>
  );
};
