// src/components/ReviewsScroller.tsx
import React, { useRef, useState, useEffect } from "react";
import { useGetCommentsByProductIdQuery } from "../services/productCommentsApi";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import ReviewCard from "./ReviewCard";
import { Review } from "../types/review";

interface ReviewsScrollerProps {
  productId: number;
}

const ReviewsScroller: React.FC<ReviewsScrollerProps> = ({ productId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeReview, setActiveReview] = useState<string>("");
  const [reviews, setReviews] = useState<Review[]>([]);

  const {
    data: reviewsFromApi,
    isLoading,
    isError,
  } = useGetCommentsByProductIdQuery(productId);

  useEffect(() => {
    if (reviewsFromApi && reviewsFromApi.length > 0) {
      setReviews(reviewsFromApi);
    }
  }, [reviewsFromApi]);

  // Прокрутка на ширину видимого контейнера
  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollAmount = container.offsetWidth; // ширина видимого контейнера

    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const showModal = (text: string) => {
    setActiveReview(text);
    setIsModalOpen(true);
  };

  if (isLoading) return <p>Завантаження відгуків...</p>;
  if (isError || !reviewsFromApi) return <p>Не вдалося завантажити відгуки.</p>;

  return (
    <div className="relative w-full max-w-[1410px] mx-auto mt-20">
      <h2 className="text-3xl font-manrope font-semibold text-black mb-8">
        Відгуки
      </h2>

      <div className="flex items-center mx-auto xs:max-w-[425px] md:max-w-[746px] center-lg:max-w-[1080px] center-xl:max-w-[1410px]">
        {/* Кнопка скролу вліво */}
        <button
          onClick={() => scroll("left")}
          className="p-3 bg-gray-200 hover:bg-gray-300 rounded-full"
        >
          <LeftOutlined className="w-6 h-12 text-gray text-[50px] hover:text-pink2" />
        </button>

        {/* Контейнер для карток */}
        <div
          ref={containerRef}
          className="flex gap-8 w-full overflow-x-hidden scroll-smooth scrollbar-hide "
        >
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onShowFull={showModal}
            />
          ))}
        </div>

        {/* Кнопка скролу вправо */}
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
