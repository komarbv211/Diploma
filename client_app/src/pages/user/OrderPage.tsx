import { Link, useNavigate } from "react-router-dom";
import { Input, Form } from "antd";
import PhoneInput from "../../components/PhoneInput";
import MailIcon from "../../components/icons/MailIcon";
import AccountBox from "../../components/icons/AccountBoxIcon";
import QuantityCounter from "../../components/counter/QuantityCounter";
import { useState } from "react";

interface Item {
  id: string;
  name: string;
  description: string;
  code: string;
  price: number;
}

const OrderPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [collapsedItems, setCollapsedItems] = useState<Record<string, boolean>>(
    {}
  );

  const [items, setItems] = useState<Item[]>([
    {
      id: "1",
      name: "Товар 1",
      description: "Опис 1",
      code: "001",
      price: 100,
    },
  ]);

  const toggleItem = (id: string) => {
    setCollapsedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const onFinish = async () => {};

  return (
    <>
      <div className="w-[93%] mx-auto font-manrope">
        <hr className="h-px mt-8 mb-2 border-1" />

        <div className="flex justify-between">
          <Link
            to="/"
            onClick={() => navigate(-1)}
            className="font-manrope text-base text-gray duration-300 hover:text-pink2"
          >
            Продовжити покупки
          </Link>
          <div className="flex flex-col items-center justify-center font-manrope duration-300 hover:text-pink2">
            <p className="text-base">0(800)50 77 40 </p>
            <p className="text-sm text-gray">Щоденно з 7:55 до 20:05</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex flex-1 justify-between mt-5">
            <div className="flex flex-col">
              <h1 className="form-title">Оформлення замовлення</h1>
              <div className="flex justify-between my-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("personal")}
                  className={`text-[18px] cursor-pointer px-4 py-2 rounded ${
                    activeTab === "personal"
                      ? "bg-gray-200 text-blue2 font-semibold"
                      : "text-gray hover:text-blue2"
                  }`}
                >
                  1 Особисті дані
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("delivery")}
                  className={`text-[18px] cursor-pointer px-4 py-2 rounded ${
                    activeTab === "delivery"
                      ? "bg-gray-200 text-blue2 font-semibold"
                      : "text-gray hover:text-blue2"
                  }`}
                >
                  2 Інформація про доставку
                </button>
              </div>
              {activeTab === "personal" && (
                <Form layout="vertical" className="" onFinish={onFinish}>
                  <div className="flex gap-4">
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
                          suffix={<AccountBox />}
                        />
                      </Form.Item>
                    </div>

                    <div className="flex-1">
                      <Form.Item
                        name="lastName"
                        label={<span className="form-label">Прізвище</span>}
                      >
                        <Input
                          placeholder="Прізвище"
                          className="form-input"
                          suffix={<AccountBox />}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <Form.Item
                    name="email"
                    label={<span className="form-label">Email</span>}
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message:
                          "Будь ласка, введіть дійсну електронну адресу!",
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
                          const regex_phone =
                            /^\+38\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
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

                  <Form.Item
                    name="deliveryAddress"
                    label={<span className="form-label">Адреса доставки</span>}
                    rules={[
                      {
                        required: true,
                        message: "Будь ласка, введіть адресу доставки!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Адреса"
                      className="form-input"
                      suffix={<MailIcon />}
                    />
                  </Form.Item>

                  <Form.Item className="m-auto w-[160px] mt-8">
                    <button className="flex justify-center items-center btn-pink">
                      <span>Далі</span>
                    </button>
                  </Form.Item>
                </Form>
              )}
            </div>
          </div>

          <div className="w-[600px] gradient-border py-[20px] px-[30px] mt-7">
            <div className="flex justify-between text-center text-[24px] mb-5">
              <p>Ваше замовлення</p>
              <p>13900 ₴</p>
            </div>

            {items.map((item, index) => (
              <div key={item.id}>
                <div className="flex justify-between mt-4">
                  {!collapsedItems[item.id] && (
                    <div className="">
                      <img
                        src="flowers-bg.png"
                        width={110}
                        height={120}
                        alt="image"
                        className="rounded"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-[16px] bg-gradient-to-b from-blue2 to-blueLight bg-clip-text text-transparent mb-3">
                      Kiko Milano Unlimited Double Touch
                    </h3>
                    {!collapsedItems[item.id] && (
                      <>
                        <p className="text-sm text-gray">{item.name}</p>
                        <p className="text-sm text-gray my-2">
                          {item.description}
                        </p>
                        <p className="text-left text-[24px]">{item.price} ₴</p>
                        <QuantityCounter className="mt-6" />
                      </>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="flex justify-between w-full text-left items-center"
                    >
                      <svg
                        className={`w-4 h-4 transform transition-transform ${
                          collapsedItems[item.id] ? "" : "rotate-180"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {items.length >= 1 && index < items.length && (
                  <hr className="my-10 border border-g rounded" />
                )}
              </div>
            ))}

            <div className="flex justify-between text-base mt-5">
              <p>Підсумок</p>
              <p>13900 ₴</p>
            </div>

            <div className="flex justify-between text-sm mt-1">
              <p>Доставка</p>
              <p>0 ₴</p>
            </div>

            <div className="flex justify-between mt-4 text-base font-semibold">
              <p>Разом</p>
              <p>13900 ₴</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
