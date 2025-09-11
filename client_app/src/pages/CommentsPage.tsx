// src/pages/CommentsPage.tsx
import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Pagination } from "antd";
import { useGetCommentsByProductIdQuery } from "../services/productCommentsApi";
import CommentCard from "../components/comments/CommentCard";

const CommentsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { data: comments, isLoading } = useGetCommentsByProductIdQuery(
    Number(id)
  );

  // обчислюємо які коментарі показати на поточній сторінці
  const paginatedComments = useMemo(() => {
    if (!comments) return [];
    const start = (page - 1) * pageSize;
    return comments.slice(start, start + pageSize);
  }, [comments, page]);

  return (
    <div className="max-w-[1680px] mx-auto px-6 py-10">
      <div className="flex justify-between items-center mt-6">
        <span className="text-2xl">Коментарі</span>
      </div>

      <div className="mt-10 space-y-10">
        {isLoading ? (
          <p>Завантаження...</p>
        ) : comments && comments.length > 0 ? (
          paginatedComments.map((c) => <CommentCard key={c.id} comment={c} productId={c.id}/>)
        ) : (
          <p>Коментарів поки немає</p>
        )}
      </div>

      {comments && comments.length > pageSize && (
        <div className="flex justify-center mt-16">
          <Pagination
            current={page}
            onChange={(p) => setPage(p)}
            total={comments.length}
            pageSize={pageSize}
          />
        </div>
      )}
    </div>
  );
};

export default CommentsPage;
