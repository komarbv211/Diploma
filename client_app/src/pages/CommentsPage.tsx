// src/pages/CommentsPage.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Pagination } from "antd";
import { useGetCommentsByProductIdQuery } from "../services/productCommentsApi";
import CommentCard from "../components/comments/CommentCard";

const CommentsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);

  const { data: comments, isLoading } = useGetCommentsByProductIdQuery(
    Number(id)
  );

  return (
    <div className="max-w-[1680px] mx-auto px-6 py-10">
      {/* Таби + сортування */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-2xl">Коментарі</span>
        {/* <div className="flex items-center gap-3">
          <span className="text-lg text-gray-600">Сортувати:</span>
          <Select
            value={sort}
            onChange={setSort}
            options={[
              { value: "new", label: "нові" },
              { value: "old", label: "старі" },
              { value: "popular", label: "популярні" },
            ]}
          />
        </div> */}
      </div>

      {/* Список коментарів */}
      <div className="mt-10 space-y-10">
        {isLoading ? (
          <p>Завантаження...</p>
        ) : comments && comments.length > 0 ? (
          comments.map((c) => <CommentCard key={c.id} comment={c} />)
        ) : (
          <p>Коментарів поки немає</p>
        )}
      </div>

      {/* Пагінація */}
      <div className="flex justify-center mt-16">
        <Pagination
          current={page}
          onChange={(p) => setPage(p)}
          total={comments?.length || 0}
          pageSize={5}
        />
      </div>
    </div>
  );
};

export default CommentsPage;
