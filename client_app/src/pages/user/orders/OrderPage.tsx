import { Link, useNavigate } from "react-router-dom";
import { Input, Form, Select } from "antd";
import { useEffect, useState } from "react";
import { OrderCreateDto } from "../../../types/order";
import { clearCart } from "../../../store/slices/localCartSlice";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { DeliveryType, PaymentMethod } from "../../../types/enums";
import { useCart } from "../../../hooks/useCart";
import {
  useGetCitiesQuery,
  useGetStreetsQuery,
} from "../../../services/locationApi";
import {
  useCreateOrderMutation,
  useWarehousesByCityQuery,
} from "../../../services/orderApi";
import { PersonalInfoForm } from "./PersonalInfoForm";
import CartSummary from "./CartSummary";

const OrderPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { cart } = useCart(user != null);

  const [note, setNote] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const [selectedCityRef, setSelectedCityRef] = useState<string | null>(null);
  const { data: citiesData, isLoading: isCitiesLoading } = useGetCitiesQuery();
  const { data: streets, isLoading: isStreetsLoading } = useGetStreetsQuery(
    selectedCityRef ?? "",
    {
      skip: !selectedCityRef,
    }
  );
  const [createOrder] = useCreateOrderMutation();

  const { data: warehouses, isLoading: isWarehousesLoading } =
    useWarehousesByCityQuery(selectedCityRef!, {
      skip: !selectedCityRef,
    });

  useEffect(() => {
    console.log("Вибране місто:", selectedCityRef);
    console.log("Відділення:", warehouses);
  }, [selectedCityRef, warehouses]);

  const handleCityChange = (cityRef: string) => {
    setSelectedCityRef(cityRef);
    form.setFieldsValue({ street: undefined, warehouseId: undefined });
  };

  const deliveryType = Form.useWatch("deliveryType", form);

  const validatePersonalInfo = (values: OrderCreateDto) => {
    if (
      !values.firstName ||
      !values.lastName ||
      !values.email ||
      !values.phone
    ) {
      setActiveTab("personal");
      return false;
    }
    return true;
  };

  const validateDeliveryInfo = (values: OrderCreateDto) => {
    if (
      !values.city ||
      (values.deliveryType === DeliveryType.Courier &&
        (!values.street || !values.house))
    ) {
      setActiveTab("delivery");
      return false;
    }
    return true;
  };

  const buildDeliveryAddress = (values: OrderCreateDto) => {
    if (values.deliveryType !== DeliveryType.Courier) return "";
    const cityName =
      citiesData?.find((c) => c.Ref === values.city)?.Description ?? "";
    const streetName =
      streets?.find((s) => s.Description === values.street)?.Description ??
      values.street;
    return `${cityName}, ${streetName}, буд. ${values.house}${
      values.apartment ? `, кв. ${values.apartment}` : ""
    }`;
  };

  const buildOrderObject = (
    values: OrderCreateDto,
    deliveryAddress: string
  ): OrderCreateDto => {
    const totalPrice = cart.reduce(
      (sum, item) => sum + item.price! * item.quantity!,
      0
    );
    return {
      userId: user?.id ?? 0,
      warehouseId:
        values.deliveryType === DeliveryType.NovaPoshta && values.warehouseId
          ? Number(values.warehouseId)
          : undefined,
      totalPrice,
      deliveryType: values.deliveryType,
      paymentMethod: values.paymentMethod,
      customerNote: values.customerNote,
      trackingNumber: values.trackingNumber,
      items: cart.map((item) => ({
        productId: item.productId!,
        productName: item.name,
        quantity: item.quantity!,
        price: item.price!,
      })),
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      city: citiesData?.find((c) => c.Ref === values.city)?.Description ?? "",
      street: values.street,
      house: values.house,
      apartment: values.apartment,
      deliveryAddress,
    };
  };

  const onFinish = async (values: OrderCreateDto) => {
    console.log("Форма відправлена:", values);

    if (!validatePersonalInfo(values)) return;
    if (!validateDeliveryInfo(values)) return;

    const deliveryAddress = buildDeliveryAddress(values);
    const newOrder = buildOrderObject(values, deliveryAddress);

    console.log("Об'єкт для API createOrder:", newOrder);

    try {
      const response = await createOrder(newOrder).unwrap();
      console.log("Відповідь від сервера:", response);
      dispatch(clearCart());
      navigate("/");
    } catch (err) {
      console.error("Помилка створення замовлення:", err);
    }
  };

  return (
    <>
      <div className="w-[93%] mx-auto font-manrope">
        <hr className="h-px mt-8 mb-2 border-1" />

        <div className="flex flex-col md:flex-row justify-between">
          <Link
            to="/"
            onClick={() => navigate(-1)}
            className="font-manrope text-base text-gray duration-300 hover:text-pink2"
          >
            Продовжити покупки
          </Link>
          <div className="flex flex-col items-center justify-center font-manrope duration-300 hover:text-pink2 md:mb-0">
            <p className="text-base">0(800)50 77 40 </p>
            <p className="text-sm text-gray">Щоденно з 7:55 до 20:05</p>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row items-start gap-8">
          <div className="flex flex-1 justify-between mr-5 mt-5">
            <div className="flex flex-col w-[47%]">
              <h1 className="form-title !text-left">Оформлення замовлення</h1>
              <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                onFinishFailed={({ errorFields }) => {
                  const firstError = String(errorFields[0].name[0]);
                  if (
                    ["firstName", "lastName", "email", "phone"].includes(
                      firstError
                    )
                  ) {
                    setActiveTab("personal");
                  } else {
                    setActiveTab("delivery");
                  }
                }}
              >
                <div className="flex justify-between my-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab("personal")}
                    className={`text-[18px] cursor-pointer px-4 py-2 rounded ${
                      activeTab === "personal"
                        ? "bg-gray-200 text-blue2 font-semibold"
                        : "text-gray hover:text-blue2"
                    } pl-0`}
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
                  <PersonalInfoForm setActiveTab={setActiveTab} />
                )}

                {activeTab === "delivery" && (
                  <>
                    <div className="flex-1">
                      <Form.Item
                        name="city"
                        label={
                          <span className="form-label">Населений пункт</span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Будь ласка, оберіть населений пункт!",
                          },
                        ]}
                        className="flex-1"
                      >
                        <Select
                          placeholder="Оберіть місто"
                          loading={isCitiesLoading}
                          onChange={handleCityChange}
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children)
                              ?.toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          className="form-input h-[42px] [&.ant-select-in-form-item]:!w-full"
                        >
                          {citiesData?.map((c) => (
                            <Select.Option key={c.Ref} value={c.Ref}>
                              {c.Description}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      {deliveryType == DeliveryType.Courier && (
                        <>
                          <Form.Item
                            name="street"
                            label={<span className="form-label">Вулиця</span>}
                            rules={[
                              { required: true, message: "Введіть вулицю!" },
                            ]}
                            className="flex-1"
                          >
                            <Select
                              placeholder="Оберіть вулицю"
                              loading={isStreetsLoading}
                              className="form-input h-[42px] [&.ant-select-in-form-item]:!w-full"
                            >
                              {streets?.map((s) => (
                                <Select.Option
                                  key={s.Ref}
                                  value={s.Description}
                                >
                                  {s.Description}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>

                          <div className="flex gap-4">
                            <Form.Item
                              name="house"
                              label={
                                <span className="form-label">Будинок</span>
                              }
                              rules={[
                                { required: true, message: "Введіть будинок!" },
                              ]}
                              className="w-full"
                            >
                              <Input
                                className="form-input"
                                placeholder="------"
                              />
                            </Form.Item>

                            <Form.Item
                              name="apartment"
                              label={
                                <span className="form-label">Квартира</span>
                              }
                              className="w-full"
                            >
                              <Input
                                className="form-input"
                                placeholder="------"
                              />
                            </Form.Item>
                          </div>
                        </>
                      )}
                      {deliveryType == DeliveryType.NovaPoshta && (
                        <>
                          <Form.Item
                            name="warehouseId"
                            label={
                              <span className="form-label">
                                Оберіть відділення Нової Пошти
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Будь ласка, оберіть відділення!",
                              },
                            ]}
                            className="w-full"
                          >
                            <Select
                              placeholder="Відділення"
                              loading={isWarehousesLoading}
                              className="form-input w-[47%] h-[42px] [&.ant-select-in-form-item]:!w-full"
                              notFoundContent={
                                !isWarehousesLoading && selectedCityRef
                                  ? "Відділення в цьому регіоні відсутні :("
                                  : null
                              }
                            >
                              {warehouses?.map((w) => (
                                <Select.Option key={w.id} value={w.id}>
                                  {w.name} – {w.address}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </>
                      )}
                      <div className="flex-1">
                        <div className="flex gap-4">
                          <Form.Item
                            name="deliveryType"
                            label={
                              <span className="form-label">
                                Спосіб доставки
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Будь ласка, оберіть спосіб доставки!",
                              },
                            ]}
                            className="flex-1"
                          >
                            <Select
                              placeholder="Оберіть спосіб доставки"
                              className="form-input h-[42px] [&.ant-select-in-form-item]:!w-full"
                            >
                              {Object.values(DeliveryType).map((type) => (
                                <Select.Option key={type} value={type}>
                                  {type}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            name="paymentMethod"
                            label={
                              <span className="form-label">Метод оплати</span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Будь ласка, оберіть метод оплати!",
                              },
                            ]}
                            className="flex-1"
                          >
                            <Select
                              placeholder="Оберіть метод оплати"
                              className="form-input h-[42px] [&.ant-select-in-form-item]:!w-full"
                            >
                              {Object.values(PaymentMethod).map((type) => (
                                <Select.Option key={type} value={type}>
                                  {type}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>
                        {!note && (
                          <div
                            className="cursor-pointer"
                            onClick={() => setNote(true)}
                          >
                            <span className="form-label">
                              <b className="text-xl ">+</b> Додати коментар
                            </span>
                          </div>
                        )}

                        {note && (
                          <Form.Item
                            name="customerNote"
                            label={<span className="form-label">Коментар</span>}
                          >
                            <Input.TextArea
                              placeholder="Коментар до замовлення"
                              className="form-input"
                            />
                          </Form.Item>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {activeTab != "personal" && (
                  <Form.Item className="m-auto w-[60%] mt-8">
                    <button
                      type="submit"
                      className="flex justify-center items-center btn-pink"
                    >
                      <span>Оформити замовлення</span>
                    </button>
                  </Form.Item>
                )}
              </Form>
            </div>
          </div>

          <div className="w-[35%] border border-blue2 rounded-xl py-[20px] px-[30px] mt-7">
            <CartSummary />
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
