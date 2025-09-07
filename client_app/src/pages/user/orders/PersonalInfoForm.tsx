import { Form, FormInstance, Input } from "antd";
import AccountBoxIcon from "../../../components/icons/AccountBoxIcon";
import MailIcon from "../../../components/icons/MailIcon";
import PhoneInput from "../../../components/PhoneInput";
import { UserData } from "../../../types/user";
import { useEffect } from "react";

interface PersonalInfoFormProps {
  setActiveTab: (tab: "personal" | "delivery") => void;
  form: FormInstance;
  user?: UserData | null;
  isAuth: boolean;
}

export const PersonalInfoForm = ({
  setActiveTab,
  form,
  user,
  isAuth,
}: PersonalInfoFormProps) => {
  const disableField = isAuth;

  useEffect(() => {
    if (isAuth && user) {
      const values = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      };
      form.setFieldsValue(values);
      localStorage.setItem("personalInfo", JSON.stringify(values));
    } else {
      const savedPersonalInfo = localStorage.getItem("personalInfo");
      if (savedPersonalInfo) {
        const parsedData = JSON.parse(savedPersonalInfo);
        form.setFieldsValue(parsedData);
        localStorage.setItem("personalInfo", JSON.stringify(parsedData));
        console.log(localStorage.getItem("personalInfo"));
      }
    }
  }, [isAuth, user, form]);

  const handleNext = async () => {
    try {
      if (!isAuth) await form.validateFields();
      // const values = form.getFieldsValue();
      // localStorage.setItem("personalInfo", JSON.stringify(values));
      setActiveTab("delivery");
    } catch {
      // antd handling
    }
  };

  return (
    <>
      <div className="flex-1">
        <Form.Item
          name="firstName"
          label={<span className="form-label">Ім’я</span>}
          rules={
            !isAuth
              ? [
                  {
                    required: true,
                    message: "Будь ласка, введіть Ваше ім’я!",
                  },
                ]
              : []
          }
        >
          <Input
            placeholder="Ім'я користувача"
            className={`form-input ${isAuth ? "input-disabled" : ""}`}
            suffix={<AccountBoxIcon />}
            disabled={disableField}
          />
        </Form.Item>
      </div>

      <div className="flex-1">
        <Form.Item
          name="lastName"
          label={<span className="form-label">Прізвище</span>}
          rules={
            !isAuth
              ? [
                  {
                    required: true,
                    message: "Будь ласка, введіть Ваше прізвище!",
                  },
                ]
              : []
          }
        >
          <Input
            placeholder="Прізвище"
            className={`form-input ${isAuth ? "input-disabled" : ""}`}
            suffix={<AccountBoxIcon />}
            disabled={disableField}
          />
        </Form.Item>
      </div>

      <Form.Item
        name="email"
        label={<span className="form-label">Email</span>}
        rules={
          !isAuth
            ? [
                {
                  required: true,
                  type: "email",
                  message: "Будь ласка, введіть дійсну електронну адресу!",
                },
              ]
            : []
        }
      >
        <Input
          placeholder="Email"
          className={`form-input ${isAuth ? "input-disabled" : ""}`}
          suffix={<MailIcon />}
          disabled={disableField}
        />
      </Form.Item>

      <Form.Item
        name="phone"
        label={<span className="form-label">Номер телефону</span>}
        rules={
          !isAuth
            ? [
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
              ]
            : []
        }
        getValueFromEvent={(e) => e.target.value}
      >
        <PhoneInput
          className={`form-input ${isAuth ? "input-disabled" : ""}`}
          disabled={disableField}
        />
      </Form.Item>

      <Form.Item className="m-auto w-[160px] mt-8">
        <button
          type="button"
          onClick={handleNext}
          className="flex justify-center items-center btn-pink"
        >
          <span>Далі</span>
        </button>
      </Form.Item>
    </>
  );
};
