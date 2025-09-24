// src/components/navigation/MobileSearchModal.tsx
import React, { useState } from "react";
import { Modal, Input, Spin, AutoComplete } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { useSearchProductsQuery } from "../../services/productApi";
import { APP_ENV } from "../../env";

interface MobileSearchModalProps {
  visible: boolean;
  onClose: () => void;
}

const MobileSearchModal: React.FC<MobileSearchModalProps> = ({ visible, onClose }) => {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch] = useDebounce(searchText, 500);
  const navigate = useNavigate();

  const { data: searchResults, isFetching } = useSearchProductsQuery(
    { Query: debouncedSearch, Page: 1, ItemPerPage: 5 },
    { skip: !debouncedSearch }
  );

  const options =
    searchResults?.items.map((product) => ({
      value: product.name,
      label: (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            navigate(`/product/details/${product.id}`);
            onClose();
            setSearchText("");
          }}
        >
          <img
            src={`${APP_ENV.IMAGES_200_URL}${product.imageUrl}`}
            alt="Product"
            className="w-10 h-10 object-cover rounded"
            onError={(e) => {
              e.currentTarget.src = "/public/NoImage.png";
            }}
          />
          <div className="flex flex-col">
            <span className="font-medium">{product.name}</span>
            {product.categoryName && <span className="text-xs text-gray">{product.categoryName}</span>}
          </div>
        </div>
      ),
    })) || [];

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered={false}          // прибираємо центроване положення
      bodyStyle={{ padding: "16px" }}
      width={360}
      style={{ top: 80 }}       // зсунемо модалку під хедер (80px = h-20)
      className="mobile-search-modal"
    >
      <AutoComplete
        value={searchText}
        options={options}
        onSelect={(value) => {
          const product = searchResults?.items.find((p) => p.name === value);
          if (product) {
            navigate(`/product/details/${product.id}`);
            onClose();
            setSearchText("");
          }
        }}
        onSearch={(value) => setSearchText(value)}
        notFoundContent={isFetching ? <Spin size="small" /> : "Нічого не знайдено"}
        style={{ width: "100%" }}
      >
        <Input
          placeholder="Я шукаю..."
          size="large"
          suffix={<SearchOutlined />}
        />
      </AutoComplete>
    </Modal>

  );
};

export default MobileSearchModal;
