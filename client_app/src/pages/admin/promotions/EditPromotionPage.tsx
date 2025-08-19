import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  DatePicker,
  message,
  Upload,
  Modal,
  Divider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/uk_UA";
import { UploadFile, RcFile } from "antd/es/upload";

import ImageCropper from "../../../components/images/ImageCropper";

import {
  useGetPromotionByIdQuery,
  useUpdatePromotionMutation,
} from "../../../services/admin/promotionAdminApi";

import { base64ToFile } from "../../../utilities/base64ToFile";
import { validateImageBeforeUpload } from "../../../utilities/validateImageUpload";

import {
  DndContext,
  PointerSensor,
  useSensor,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";
import { PromotionFormValues } from "../../../types/promotion";

const { Item } = Form;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const disabledDate = (current: dayjs.Dayjs | null) => {
  if (!current) return false;
  return current < dayjs().startOf("minute");
};

const EditPromotionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: promotion, isLoading } = useGetPromotionByIdQuery(Number(id));
  const [updatePromotion, { isLoading: isUpdating }] =
      useUpdatePromotionMutation();

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [cropIndex, setCroppingIndex] = useState<number | null>(null);
  const [isCropModalVisible, setCropModalVisible] = useState(false);

  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });

  useEffect(() => {
    if (promotion) {
      form.setFieldsValue({
        name: promotion.name,
        description: promotion.description ?? "",
        period: [dayjs(promotion.startDate), dayjs(promotion.endDate)],
        isActive: promotion.isActive,
        productIds: promotion.productIds ?? [],
      });

      if (promotion.imageUrl) {
        setFileList([
          {
            uid: "-1",
            name: "image.jpg",
            url: promotion.imageUrl,
            status: "done",
          },
        ]);
      }
    }
  }, [promotion, form]);

  const handleCrop = (croppedBase64: string) => {
    if (cropIndex === null) return;

    const newFile = base64ToFile(
        croppedBase64,
        `cropped-${Date.now()}.jpg`
    ) as RcFile;
    const newUrl = URL.createObjectURL(newFile);

    setFileList((prev) =>
        prev.map((file, idx) => {
          if (idx === cropIndex) {
            newFile.uid = file.uid;
            return {
              ...newFile,
              url: newUrl,
              thumbUrl: newUrl,
              originFileObj: newFile,
            };
          }
          return file;
        })
    );

    setCropModalVisible(false);
    setCroppingIndex(null);
  };

  const handlePreview = (file: UploadFile) => {
    const index = fileList.findIndex((f) => f.uid === file.uid);
    if (index !== -1) {
      setCroppingIndex(index);
      setCropModalVisible(true);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    const updatedFileList = newFileList.map((file) => {
      if (!file.url && !file.thumbUrl && file.originFileObj) {
        return {
          ...file,
          url: URL.createObjectURL(file.originFileObj),
        };
      }
      return file;
    });
    setFileList(updatedFileList);
  };

  const handleRemove = (file: UploadFile) => {
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    return true;
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setFileList((prev) => {
      const oldIndex = prev.findIndex((f) => f.uid === active.id);
      const newIndex = prev.findIndex((f) => f.uid === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const onFinish = async (values: PromotionFormValues) => {
    if (fileList.length === 0) {
      message.error("Будь ласка, завантажте зображення.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", id!);
      formData.append("name", values.name.trim());
      if (values.description)
        formData.append("description", values.description.trim());

      const file = fileList[0].originFileObj as File | undefined;
      if (file) {
        formData.append("image", file);
      }

      formData.append("startDate", values.period[0].toISOString());
      formData.append("endDate", values.period[1].toISOString());
      formData.append("isActive", values.isActive.toString());

      if (values.productIds?.length) {
        values.productIds.forEach((pid) =>
            formData.append("productIds", pid.toString())
        );
      }

      await updatePromotion({ id: Number(id), formData }).unwrap();
      message.success("Акцію успішно оновлено!");
      navigate("/admin/promotions");
    } catch {
      message.error("Помилка при оновленні акції.");
    }
  };

  if (isLoading) return <div>Завантаження...</div>;

  return (
      <div className="max-w-2xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
        <Button type="default" className="mb-6" onClick={() => navigate(-1)}>
          Назад
        </Button>

        <h1 className="text-center text-3xl font-extrabold text-blue-600 mb-8">
          Редагування акції
        </h1>

        <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            initialValues={{
              isActive: true,
              period: [null, null],
            }}
            scrollToFirstError
        >
          <Item
              name="name"
              label="Назва акції"
              rules={[
                { required: true, message: "Введіть назву акції!" },
                {
                  validator: (_, value) =>
                      value && value.trim()
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("Назва не може бути лише з пробілів")
                          ),
                },
              ]}
          >
            <Input placeholder="Назва акції" />
          </Item>

          <Item name="description" label="Опис акції">
            <TextArea rows={4} placeholder="Опис (необов’язково)" />
          </Item>

          <Divider>Період дії</Divider>
          <Item
              name="period"
              label="Виберіть початок та кінець акції"
              rules={[
                { required: true, message: "Будь ласка, виберіть період дії!" },
              ]}
          >
            <RangePicker
                locale={locale}
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                disabledDate={disabledDate}
                allowClear
                placeholder={["Початок", "Кінець"]}
                style={{ width: "100%" }}
            />
          </Item>

          <Item name="isActive" valuePropName="checked">
            <Checkbox>Активна</Checkbox>
          </Item>

          <Divider>Зображення акції</Divider>
          <Item>
            <DndContext
                sensors={[sensor]}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
            >
              <SortableContext
                  items={fileList.map((file) => file.uid)}
                  strategy={verticalListSortingStrategy}
              >
                <Upload
                    multiple={false}
                    beforeUpload={validateImageBeforeUpload}
                    fileList={fileList}
                    onChange={handleUploadChange}
                    onPreview={handlePreview}
                    onRemove={handleRemove}
                    listType="picture"
                >
                  {fileList.length < 1 && (
                      <Button icon={<UploadOutlined />}>
                        Завантажити зображення
                      </Button>
                  )}
                </Upload>
              </SortableContext>
            </DndContext>
          </Item>

          <Item className="mt-6">
            <Button type="primary" htmlType="submit" loading={isUpdating} block>
              Оновити акцію
            </Button>
          </Item>
        </Form>

        <Modal
            open={isCropModalVisible}
            footer={null}
            onCancel={() => {
              setCropModalVisible(false);
              setCroppingIndex(null);
            }}
            destroyOnClose
        >
          {cropIndex !== null && fileList[cropIndex]?.url ? (
              <ImageCropper
                  image={fileList[cropIndex]!.url!}
                  onCrop={handleCrop}
                  aspectRatio={16 / 9}
              />
          ) : null}
        </Modal>
      </div>
  );
};

export default EditPromotionPage;
