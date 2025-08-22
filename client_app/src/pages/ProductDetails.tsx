// src/pages/ProductDetails.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductByIdQuery } from "../services/productApi";
import { useCart } from "../hooks/useCart";
import InteractiveRating from "../components/InteractiveRating";
import { CartIcon } from "../components/icons";
import ImagesViewer from "../components/images/images_viewer/ImagesViewer";
import { Typography } from "antd";
import AddReviewModal from "../components/AddReviewModalProps";
import ReviewsScroller from "../components/ReviewsScroller";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useGetProductByIdQuery(Number(id));
  const { addToCart } = useCart(true);
  const navigate = useNavigate();
  const { Paragraph } = Typography;
  const [isReviewOpen, setIsReviewOpen] = React.useState(false);

  if (isLoading) return <p className="text-center mt-20">Завантаження...</p>;
  if (!product) return <p className="text-center mt-20">Продукт не знайдено</p>;

  const handleAddToCart = async () => {
    await addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageName: product.images?.[0]?.name || "",
    });
    window.dispatchEvent(new CustomEvent("open-cart"));
  };

  return (
    <>
      <div className="container mx-auto px-4 mt-16 flex flex-col lg:flex-row gap-12 max-w-[1680px]">
        {/* Ліва частина: ImagesViewer */}
        <div className="flex-1 h-full">
          <ImagesViewer advertImages={product.images || []} />
        </div>

        {/* Права частина: інформація про продукт */}
        <div className="flex flex-col gap-6 w-full lg:w-1/2">
          <span className="text-[16px] font-manrope font-medium text-black">
            Артикул: {product.name || "N/A"}
          </span>
          <h1 className="text-3xl font-semibold leading-snug bg-gradient-to-r from-blue-800 to-blue-300 bg-clip-text text-transparent">
            {product.name}
          </h1>

          <div className="flex items-center gap-4">
            <InteractiveRating
              productId={product.id}
              userRating={product.averageRating}
              size={20}
            />
            <span className="text-[16px] text-gray-700">
              {product.ratingsCount} відгуки
            </span>
          </div>

          <Paragraph className="font-manrope text-xl whitespace-pre-line ">
            {product.description}
          </Paragraph>

          <span className="text-3xl font-medium text-black">
            {product.price} ₴
          </span>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-xl font-manrope">Кількість:</span>
              <div className="flex items-center gap-3 p-2 bg-gray-100 rounded-lg">
                <span className="text-lg">1</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 px-6 py-3 bg-pink text-white text-[24px] font-semibold rounded-lg hover:bg-pink2 transition w-[300px] justify-center"
            >
              <CartIcon className="w-8 h-8" />
              Купити
            </button>
            <button
              onClick={() => navigate(-1)}
              className="text-gray hover:text-pink2 underline"
            >
              Повернутися назад
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-12 max-w-full md:max-w-[1380px] mx-auto py-12">
        {/* Заголовок відгуків */}
        <h2 className="w-full text-center text-2xl md:text-3xl leading-snug md:leading-[150%] font-sans font-normal text-black px-4">
          Відгуки про {product.name}
        </h2>

        {/* Кнопка залишити відгук */}
        <div className="flex justify-center">
          <button
            className="h-[52px] px-6 text-lg md:text-xl  text-white font-medium rounded-lg bg-pink hover:bg-pink2"
            onClick={() => setIsReviewOpen(true)}
          >
            Залишити відгук
          </button>
          <AddReviewModal
            productId={product.id}
            productName={product.name}
            isOpen={isReviewOpen}
            onClose={() => setIsReviewOpen(false)}
          />
        </div>
        <div className="flex justify-center">
          <ReviewsScroller productId={Number(id)} />
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
