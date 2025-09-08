import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useAppSelector } from "../../store/store";
import { getUser } from "../../store/slices/userSlice";
import InteractiveRating from "../InteractiveRating";
import { useReviewProductMutation } from "../../services/productCommentsApi";
import { handleFormErrors } from "../../utilities/handleApiErrors";
import { ApiError } from "../../types/errors";
import { Form, message } from "antd";
import { useRateProductMutation } from "../../services/productRatingApi ";
import { MailIcon } from "../icons";
import AcoountBoxIcon from "../icons/AccountBoxIcon";
import { showToast } from "../../utilities/showToast";
import WarnIcon from "../icons/toasts/WarnIcon";

type AddReviewModalProps = {
  productId: number;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
};

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  productId,
  productName,
  isOpen,
  onClose,
}) => {
  const user = useAppSelector(getUser);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [rateProduct] = useRateProductMutation();
  const [reviewProduct] = useReviewProductMutation();

  // 🔹 Створюємо FormInstance тільки для handleFormErrors
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    if (!user) {
      showToast("warn", "Ви повинні бути авторизовані, щоб залишати відгуки", <WarnIcon />);
      return;
    }
    if (!rating && !text) {
      showToast("warn", "Будь ласка, додайте оцінку або текст відгуку", <WarnIcon />);
      return;
    }

    try {
      if (text) {
        await reviewProduct({ productId, userId: user.id, text }).unwrap();
        message.success("Ваш відгук додано!");
      }
      if (rating) {
        await rateProduct({
          productId,
          rating,
          userId: user.id,
        }).unwrap();
        message.success("Вашу оцінку додано!");
      }

      setRating(0);
      setText("");
      onClose();
    } catch (error: unknown) {
      handleFormErrors(error as ApiError, form);
    }
  };

  const handleRate = async (newRating: number) => {
    if (!user?.id) {
      showToast("warn", "Ви повинні увійти, щоб оцінити продукт", <WarnIcon />);
      return;
    }
    try {
      setRating(newRating);
    } catch (error) {
      console.error("Помилка при рейтингу товару", error);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center font-manrope">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[800px] rounded-2xl shadow-xl flex flex-col overflow-hidden z-50 py-8 px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-[24px] font-medium bg-gradient-to-r from-blue2 to-blueLight bg-clip-text text-transparent">
            {productName}
          </span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-[28px]"
          >
            ✕
          </button>
        </div>

        {/* Rating */}
        <div className="flex flex-col items-center justify-center mb-4">
          <p className="text-[20px] font-medium mb-2">Ваша оцінка</p>
          <InteractiveRating
            productId={productId}
            userRating={rating}
            size={32}
            onRate={handleRate}
          />
        </div>

        {/* User info */}
        {user && (
          <div className="flex gap-6 mt-6">
            <div className="flex flex-col gap-2 w-1/4">
              <span className="text-[20px] font-medium">Ім’я</span>
              <div className="flex justify-between items-center border border-gray-500 rounded-xl px-4 py-2">
                <span>{user.firstName}</span>
                <AcoountBoxIcon />
              </div>
            </div>

            <div className="flex flex-col gap-2 w-1/4"></div>

            <div className="flex flex-col gap-2 w-2/4">
              <span className="text-[20px] font-medium">Email</span>
              <div className="flex justify-between items-center border border-gray-500 rounded-xl px-4 py-2">
                <span>{user.email}</span>
                <MailIcon />
              </div>
            </div>
          </div>
        )}

        {/* Textarea */}
        <div className="mt-6">
          <p className="text-[20px] font-medium mb-2">
            Ви можете залишити відгук або поставити питання
          </p>
          <textarea
            placeholder="Текст повідомлення"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-[150px] border border-gray-500 rounded-xl p-4 text-[16px]"
          />
        </div>

        {/* Submit button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-pink text-white px-8 py-3 rounded-xl text-[20px] font-medium hover:bg-pink2"
          >
            Додати повідомлення
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddReviewModal;
