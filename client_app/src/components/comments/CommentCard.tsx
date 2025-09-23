import React from "react";
import { Review } from "../../types/review";
import Avatar from "../Avatar";
import { useGetRatingsByProductQuery } from "../../services/productRatingApi ";
import InteractiveRating from "../InteractiveRating";

const CommentCard: React.FC<{ comment: Review, productId:number}> = ({ comment , productId}) => {
  const userId = comment.user?.id;
  const { data: ratings, isLoading } = useGetRatingsByProductQuery(productId);
  const userRating = ratings?.find((r) => r.userId === Number(userId))?.rating ?? 0;
  return (
    <div className="border-b border-blue-300 pb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar
            firstName={comment.user?.firstName}
            lastName={comment.user?.lastName}
            image={comment.user?.image}
            size={50}
          />
          <p className="font-medium text-lg">{comment.user.firstName}</p>
        </div>
        {/* Дата відгуку */}
        <p className="text-gray-600 text-[16px] leading-[22px] font-normal">
          {new Date(comment.dateCreated).toLocaleDateString("uk-UA", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="ml-32">
            {productId && !isLoading && (
              <InteractiveRating
                productId={productId}
                userRating={userRating}
                size={16}
                readOnly={true}
              />
            )}
            <p className="mt-4 text-lg">{comment.text}</p>
      </div>
      {/* <div className="flex justify-between items-center mt-4">
        <button className="text-blue-600 font-medium">Відповісти</button>
        <div className="flex items-center gap-6 text-gray-600">
          <div className="flex items-center gap-2">
            <LikeOutlined />
            <span>{comment.likes}</span>
          </div>
          <div className="flex items-center gap-2">
            <DislikeOutlined />
            <span>{comment.dislikes}</span>
          </div>
        </div>
      </div> */}

      {/* {comment.brandReply && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <p className="font-medium">Відповідь бренда {comment.brandName}</p>
          <p className="text-gray-500 text-sm">{comment.replyDate}</p>
          <p className="mt-2">{comment.brandReply}</p>
        </div>
      )} */}
    </div>
  );
};

export default CommentCard;
