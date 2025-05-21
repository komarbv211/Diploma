import React from "react";
import { Pagination } from "antd";
import { PaginationComponentProps } from "../../types/user";

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
}) => {
  return (
    <div className="mt-6">
      <Pagination
        current={currentPage}
        total={totalItems}
        pageSize={pageSize}
        onChange={onPageChange}
        showSizeChanger={false}
        showQuickJumper
      />
    </div>
  );
};

export default PaginationComponent;
