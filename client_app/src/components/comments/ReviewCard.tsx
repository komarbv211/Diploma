// src/components/ReviewCard.tsx
import React from "react";
import { Review } from "../../types/review";
import Avatar from "../Avatar";

interface ReviewCardProps {
  review: Review;
  onShowFull?: (text: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onShowFull }) => (
  <div className="flex flex-col gap-4 bg-[#FFF7F3] rounded-[15px] p-6 min-w-[300px] max-w-[300px] h-[300px]">
    <div className="flex items-center gap-3">
      <Avatar
        firstName={review.user?.firstName}
        lastName={review.user?.lastName}
        image={review.user?.image}
        size={50}
      />
      <span className="text-lg font-medium text-[#1A3D83]">
        {review.user?.firstName} {review.user?.lastName}
      </span>
    </div>
    <p className="text-[16px] font-medium leading-[22px] text-[#1A3D83]">
      {review.text?.length > 150 ? (
        <>
          {review.text.slice(0, 150)}…
          <span className="flex justify-end">
            <button
              onClick={() => onShowFull?.(review.text)}
              className="text-pink font-semibold hover:text-pink2"
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
);

export default ReviewCard;
