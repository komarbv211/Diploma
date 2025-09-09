//Home.tsx
import React from "react";
import { useGetAllProductsQuery } from "../services/productApi";
import ProductCarousel from "../components/ProductCarousel";
import { APP_ENV } from "../env";
import { useGetPromotionByIdQuery } from "../services/promotionApi";
import PromotionCard from "../components/PromotionCard";
import ScrollToTopButton from "../components/ScrollToTopButton";
import ReviewProductCard from "../components/comments/ReviewProductCard";
import { useGetRandomCommentsQuery } from "../services/productCommentsApi";

const Home: React.FC = () => {
  const { data: products } = useGetAllProductsQuery();
  const { data: promotions } = useGetPromotionByIdQuery(1);
  const { data: reviewsFromApi } = useGetRandomCommentsQuery(2);

  return (
    <>
      {/* 🔹 Банер на початку */}
      <div className="w-full max-w-[1980px] grid grid-cols-2 max-h-[698px] mx-auto">
        <img
          src="l_home_banner.jpg"
          alt="Лівий банер"
          className="w-full max-h-[698px] object-cover object-center"
        />
        <img
          src="r_home_banner.jpg"
          alt="Правий банер"
          className="w-full max-h-[698px] object-cover object-center"
        />
      </div>
      {/* 🔹 Бренди */}
      <section className="w-full max-w-[1680px] mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-0">
          {/* Верхній ряд: картки + текст */}
          <div className="grid grid-cols-1 md:grid-cols-[25%_50%_25%] gap-0 w-full">
            {/* Ліва картка */}
            <div className="relative rounded-tl-2xl overflow-hidden">
              <img
                src="l_v_brand.jpg"
                alt="Brand banner left"
                className="w-full h-[300px] object-cover"
              />
              <img
                src="L_V_Brand_logo.png"
                alt="Brand logo 1"
                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-auto h-[53px] object-contain"
              />
            </div>

            {/* Текст */}
            <div className="flex flex-col items-center justify-center text-center px-6">
              <h2 className="lg:text-3xl text-[#402945] leading-snug font-manrope font-bold">
                Улюбленці мільйонів — тепер ближче.
              </h2>
              <p className="mt-4 lg:text-xl text-[#402945] leading-relaxed font-manrope">
                Світові лідери індустрії, чиї рішення змінюють звичне уявлення
                про зручність, функціональність і стиль, зібрані на одній
                платформі. Обирай перевірену якість, сучасні технології та
                надійність, яким довіряють у всьому світі. Твій вибір — серед
                найкращих.
              </p>
            </div>

            {/* Права картка */}
            <div className="relative rounded-tr-2xl overflow-hidden">
              <img
                src="r_v_brand.jpg"
                alt="Brand banner right"
                className="w-full h-[300px] object-cover"
              />
              <img
                src="R_V_Brand_logo.png"
                alt="Brand logo 4"
                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-auto h-[53px] object-contain"
              />
            </div>
          </div>
          {/* Нижній ряд зображень-карток */}
          <div className="grid grid-cols-2 md:grid-cols-4 w-full">
            <div className="relative rounded-bl-2xl overflow-hidden">
              <img
                src="1_n_brand.jpg"
                alt="Brand img 1"
                className="w-full h-[300px] object-cover rounded-bl-2xl"
              />
              <img
                src="1_N_Brand_logo.png"
                alt="Brand logo 3"
                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-auto h-[53px] object-contain"
              />
            </div>
            <div className="relative overflow-hidden">
              <img
                src="2_n_brand.jpg"
                alt="Brand img 2"
                className="w-full h-[300px] object-cover"
              />
              <img
                src="2_N_Brand_logo.png"
                alt="Brand logo 3"
                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-auto h-[53px] object-contain"
              />
            </div>
            <div className="relative overflow-hidden">
              <img
                src="3_n_brand.jpg"
                alt="Brand img 3"
                className="w-full h-[300px] object-cover"
              />
              <img
                src="3_N_Brand_logo.png"
                alt="Brand logo 3"
                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-auto h-[53px] object-contain"
              />
            </div>
            <div className="relative rounded-br-2xl overflow-hidden">
              <img
                src="4_n_brand.jpg"
                alt="Brand img 4"
                className="w-full h-[300px] object-cover rounded-br-2xl"
              />
              <img
                src="4_N_Brand_logo.png"
                alt="Brand logo 3"
                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-auto h-[53px] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto  mt-28 flex flex-col gap-12 max-w-[1680px]">
        <ProductCarousel
          title={"Пропозиції брендів"}
          products={products ?? []}
          maxWidth="100%"
        />
        <ProductCarousel
          title={"Новинки"}
          products={products ?? []}
          maxWidth="100%"
        />
      </div>
      {/* 🔹 Відгуки покупців */}
      <section className="flex flex-wrap justify-between gap-[19px] max-w-[1680px] mx-auto mt-[120px]">
        {reviewsFromApi && reviewsFromApi.length > 0 ? (
          reviewsFromApi.map((review) => (
            <ReviewProductCard
              key={review.id}
              productName={review.product?.name || "Товар без назви"}
              productImage={
                review.product?.images && review.product.images.length > 0
                  ? APP_ENV.IMAGES_1200_URL + review.product.images[0].name
                  : "/NoImage.png"
              }
              reviewTitle="Відгук на товар"
              userName={review.user?.firstName || "Анонім"}
              reviewText={review.text}
              onGoToProduct={() =>
                review.productId
                  ? (window.location.href = `/product/details/${review.productId}`)
                  : undefined
              }
            />
          ))
        ) : (
          <p>Немає доступних коментарів</p>
        )}
      </section>
      <div className="container mx-auto  mt-28 flex flex-col gap-12 max-w-[1680px]">
        <ProductCarousel
          title={"Парфумерія"}
          products={products ?? []}
          maxWidth="100%"
        />
      </div>

      <PromotionCard
        image={
          promotions?.imageUrl
            ? APP_ENV.IMAGES_1200_URL + promotions.imageUrl
            : ""
        }
        title={promotions?.name || ""}
        description={promotions?.description || ""}
        buttonText={"Перейти до товару"}
        buttonLink={`/product/details/${promotions?.productIds}`}
      />

      <div className="container mx-auto  mt-28 flex flex-col gap-12 max-w-[1680px]">
        <ProductCarousel
          title={"Волосся"}
          products={products ?? []}
          maxWidth="100%"
        />
        <ProductCarousel
          title={"Обличчя"}
          products={products ?? []}
          maxWidth="100%"
        />
      </div>

      {/* 🔹 Відгуки покупців */}
      <section className="flex flex-wrap justify-between gap-[19px] max-w-[1680px] mx-auto mt-[120px]">
        {reviewsFromApi && reviewsFromApi.length > 0 ? (
          reviewsFromApi.map((review) => (
            <ReviewProductCard
              key={review.id}
              productName={review.product?.name || "Товар без назви"}
              productImage={
                review.product?.images && review.product.images.length > 0
                  ? APP_ENV.IMAGES_1200_URL + review.product.images[0].name
                  : "/NoImage.png"
              }
              reviewTitle="Відгук на товар"
              userName={review.user?.firstName || "Анонім"}
              reviewText={review.text}
              onGoToProduct={() =>
                review.productId
                  ? (window.location.href = `/product/details/${review.productId}`)
                  : undefined
              }
            />
          ))
        ) : (
          <p>Немає доступних коментарів</p>
        )}
      </section>
      <ScrollToTopButton />
    </>
  );
};

export default Home;
