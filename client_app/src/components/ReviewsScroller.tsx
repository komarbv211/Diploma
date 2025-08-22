// src/components/ReviewsScroller.tsx
import React, { useRef, useState } from "react";
import { useGetCommentsByProductIdQuery } from "../services/productCommentsApi";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { APP_ENV } from "../env";

interface ReviewsScrollerProps {
  productId: number;
}

const ReviewsScroller: React.FC<ReviewsScrollerProps> = ({ productId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeReview, setActiveReview] = useState<string>("");

  const {
    data: reviewsFromApi,
    isLoading,
    isError,
  } = useGetCommentsByProductIdQuery(productId);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 350;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const showModal = (text: string) => {
    setActiveReview(text);
    setIsModalOpen(true);
  };

  if (isLoading) return <p>Завантаження відгуків...</p>;
  if (isError || !reviewsFromApi) return <p>Не вдалося завантажити відгуки.</p>;

  return (
    <div className="relative w-full max-w-[1475px] mx-auto mt-20">
      <h2 className="text-3xl font-manrope font-semibold text-black mb-8">
        Відгуки
      </h2>

      <div className="flex items-center gap-6 max-w-[1445px]">
        <button
          onClick={() => scroll("left")}
          className="p-3 bg-gray-200 hover:bg-gray-300 rounded-full"
        >
          <LeftOutlined className="w-6 h-12 text-gray text-[50px] hover:text-pink2" />
        </button>

        <div ref={containerRef} className="flex gap-8 w-full overflow-hidden">
          {reviewsFromApi.map((review) => (
            <div
              key={review.id}
              className="flex flex-col gap-4 bg-[#FFF7F3] rounded-[15px] p-6 min-w-[300px] max-w-[300px] h-[300px]"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`${APP_ENV.IMAGES_200_URL}${
                    review.user.image || "NoImage.png"
                  }`}
                  alt={review.user.firstName}
                  className="w-[50px] h-[50px] rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/NoImage.png";
                  }}
                />{" "}
                <span className="text-lg font-medium text-[#1A3D83]">
                  {review.user.firstName} {review.user.lastName}
                </span>
              </div>

              <p className="text-[16px] font-medium leading-[22px] text-[#1A3D83]">
                {review.text.length > 150 ? (
                  <>
                    {review.text.slice(0, 150)}…
                    <span className="flex justify-end">
                      <button
                        onClick={() => showModal(review.text)}
                        className="text-pink2 font-semibold hover:underline"
                      >
                        Далі
                      </button>
                    </span>
                  </>
                ) : (
                  review.text
                )}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="p-3 bg-gray-200 hover:bg-gray-300 rounded-full"
        >
          <RightOutlined className="w-6 h-12 text-gray text-[50px] hover:text-pink2" />
        </button>
      </div>

      <Modal
        title="Повний відгук"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        <p className="text-lg leading-6 text-gray-800">{activeReview}</p>
      </Modal>
    </div>
  );
};

export default ReviewsScroller;
