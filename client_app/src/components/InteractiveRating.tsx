import React, { useState, useEffect } from "react";
import { useAppSelector } from "../store/store"; // підкоригуй шлях під себе
import { getUser } from "../store/slices/userSlice";

type InteractiveRatingProps = {
  productId: number;
  userRating?: number;
  onRate?: (rating: number) => Promise<void>;
  size?: number;
};

const InteractiveRating: React.FC<InteractiveRatingProps> = ({
  userRating = 0,
  onRate,
  size = 24,
}) => {
  const user = useAppSelector(getUser);
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(userRating);
  const starsCount = 5;

  useEffect(() => {
    setCurrentRating(userRating);
  }, [userRating]);

  const handleClick = async (rating: number) => {
    if (!user) {
      alert("Ви повинні увійти, щоб оцінити продукт");
      return; // не змінюємо рейтинг
    }
    setCurrentRating(rating);
    if (onRate) {
      await onRate(rating);
    }
  };

  const getFillPercent = (starIndex: number) => {
    const diff = (hoverRating || currentRating) - starIndex + 1;
    if (diff >= 1) return 100;
    if (diff > 0) return diff * 100;
    return 0;
  };

  const StarPartial = ({
    size,
    fillPercent,
    starIndex,
  }: {
    size: number;
    fillPercent: number;
    starIndex: number;
  }) => {
    const gradientId = `star-gradient-${starIndex}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const adjusted = Math.min(Math.max(fillPercent, 0), 100);

    return (
      <svg width={size} height={size} viewBox="0 0 24 24" key={starIndex}>
        <defs>
          <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="gold" />
            <stop offset={`${adjusted}%`} stopColor="gold" />
            <stop offset={`${adjusted + 0.1}%`} stopColor="lightgray" />
            <stop offset="100%" stopColor="lightgray" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#${gradientId})`}
          d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.783
             1.4 8.172L12 18.897l-7.334 3.868
             1.4-8.172L.132 9.21l8.2-1.192z"
        />
      </svg>
    );
  };

  return (
    <div
      className="flex gap-1 select-none"
      onMouseLeave={() => setHoverRating(0)}
      style={{ cursor: user ? "pointer" : "default" }}
    >
      {[...Array(starsCount)].map((_, i) => {
        const starIndex = i + 1;
        const fillPercent = getFillPercent(starIndex);

        return (
          <div
            key={starIndex}
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => user && setHoverRating(starIndex)}
            role={user ? "button" : undefined}
            tabIndex={user ? 0 : -1}
            aria-label={`Rate ${starIndex} star`}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && user) {
                handleClick(starIndex);
              }
            }}
          >
            <StarPartial
              size={size}
              fillPercent={fillPercent}
              starIndex={starIndex}
            />
          </div>
        );
      })}
    </div>
  );
};

export default InteractiveRating;
