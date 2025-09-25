// src/pages/ProductDetails.tsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductByIdQuery } from "../services/productApi";
import { useCart } from "../hooks/useCart";
import InteractiveRating from "../components/InteractiveRating";
import { CartFlowerIcon, CartIcon } from "../components/icons";
import ImagesViewer from "../components/images/images_viewer/ImagesViewer";
import { Typography } from "antd";
import AddReviewModal from "../components/comments/AddReviewModalProps";
import ReviewsScroller from "../components/comments/ReviewsScroller";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useAppSelector } from "../store/store";
import { useProducts } from "../hooks/useProducts";
import Product_3_Carousel from "../components/Product_3_Carousel";
import { ICartItem } from "../store/slices/localCartSlice";
const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: product,
    isLoading,
    refetch,
  } = useGetProductByIdQuery(Number(id));
  const { user } = useAppSelector((s) => s.auth);
  const { cart, addToCart } = useCart(!!user);
  const isInCart = cart.some(
    (item: ICartItem) => item.productId === Number(id)
  );
  const navigate = useNavigate();
  const { Paragraph } = Typography;
  const [isReviewOpen, setIsReviewOpen] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const { products: brandProducts } = useProducts({
    CategoryId: 1,
  }); // Категорія "Парфумерія"

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) return <p className="text-center mt-20">Завантаження...</p>;
  if (!product) return <p className="text-center mt-20">Продукт не знайдено</p>;

  const handleAddToCart = async () => {
    await addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      imageName: product.images?.[0]?.name || "",
      discountPercent: product?.discountPercent,
      finalPrice: product?.finalPrice,
    });
    window.dispatchEvent(new CustomEvent("open-cart"));
  };

  const hasDiscount =
    product.discountPercent != null && product.discountPercent > 0;
  const priceToShow = hasDiscount
    ? product.finalPrice ?? product.price
    : product.price;

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
              readOnly={true}
            />
            <span className="text-[16px] text-gray-700">
              {product.commentsCount}
              <button
                onClick={() => navigate(`/product/${id}/comments`)}
                className="ml-1 text-black underline text-lg hover:text-pink2 font-manrope"
              >
                відгуки
              </button>
            </span>
          </div>

          <div className="font-manrope text-2xl font-medium text-black flex items-center">
            Опис
          </div>

          <Paragraph className="font-manrope text-xl whitespace-pre-line ">
            {product.description}
          </Paragraph>

          <span className="font-manrope flex items-center gap-4">
            {hasDiscount ? (
              <>
                <span className="text-pink2 text-3xl font-semibold">
                  {priceToShow} ₴
                </span>
                <span className="text-gray line-through text-xl">
                  {product.price} ₴
                </span>
              </>
            ) : (
              <span className="text-gray-900 text-3xl font-semibold">
                {product.price} ₴
              </span>
            )}
          </span>

          <div className="flex items-center gap-6">
            <span className="text-xl font-manrope">Кількість:</span>
            <div className="flex items-center gap-5 border rounded-[15px] px-4 py-2 w-[106px] h-[45px]">
              <button
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                className="text-black hover:text-pink2"
              >
                <MinusOutlined />
              </button>
              <span className="text-black text-[20px] font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="text-black hover:text-pink2"
              >
                <PlusOutlined />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 px-6 py-3 bg-pink text-white text-[24px] font-semibold rounded-lg hover:bg-pink2 transition w-[300px] justify-center"
            >
              Купити
            </button>
            <div className="h-16">
              {isInCart ? (
                <div className="relative w-full h-full">
                  <CartIcon className="text-black w-full h-full" />
                  <CartFlowerIcon className="absolute top-[6px] right-0 text-pink2 w-1/2 h-1/2" />
                </div>
              ) : (
                <CartIcon className="text-black w-full h-full" /> // 🛒 порожня іконка
              )}
            </div>
            <button
              onClick={() => navigate(-1)}
              className="text-gray hover:text-pink2 underline"
            >
              Повернутися назад
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-12 max-w-full md:max-w-[1350px] mx-auto py-12">
        <Product_3_Carousel
          title={"Товари цієї ж серії"}
          products={brandProducts ?? []}
          maxWidth="100%"
        />
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
            onClose={async () => {
              setIsReviewOpen(false);
              await refetch();
            }}
          />
        </div>
        {/* Відображаємо відгуки тільки якщо вони є */}
        {product.commentsCount > 0 && (
          <div className="flex justify-center w-full">
            <ReviewsScroller productId={Number(id)} />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
