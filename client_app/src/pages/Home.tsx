//Home.tsx
import React from "react";
import { useGetAllProductsQuery } from "../services/productApi";
import ProductCarousel from "../components/ProductCarousel";
import ProductCard from "../components/ProductCard";
import { APP_ENV } from "../env";
import { useAppSelector } from "../store/store";
import { getUser } from "../store/slices/userSlice";
import { useGetCategoryTreeQuery } from "../services/categoryApi";

const Home: React.FC = () => {
  const { data: products, isLoading, refetch } = useGetAllProductsQuery();
  const { data: categories } = useGetCategoryTreeQuery();
  const user = useAppSelector(getUser);

  const getCategoryName = (id: number) => {
    return (
      categories?.find((cat) => cat.id === id)?.name || "Категорія не вказана"
    );
  };
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
            <div className="rounded-t-2xl overflow-hidden">
              <img
                src="l_v_brand.jpg"
                alt="Brand banner left"
                className="w-full h-[300px] object-cover"
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
            <div className="rounded-t-2xl overflow-hidden">
              <img
                src="r_v_brand.jpg"
                alt="Brand banner right"
                className="w-full h-[300px] object-cover"
              />
            </div>
          </div>

          {/* Нижній ряд зображень-карток */}
          <div className="grid grid-cols-2 md:grid-cols-4 w-full">
            <img
              src="1_n_brand.jpg"
              alt="Brand img 1"
              className="w-full h-[300px] object-cover rounded-bl-2xl"
            />
            <img
              src="2_n_brand.jpg"
              alt="Brand img 2"
              className="w-full h-[300px] object-cover"
            />
            <img
              src="3_n_brand.jpg"
              alt="Brand img 3"
              className="w-full h-[300px] object-cover"
            />
            <img
              src="4_n_brand.jpg"
              alt="Brand img 4"
              className="w-full h-[300px] object-cover rounded-br-2xl"
            />
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

      <div className="flex justify-center mt-[100px] px-4">
        <div className="w-full max-w-[1680px] flex flex-wrap justify-center gap-[12px]">
          {isLoading && <p>Завантаження...</p>}
          {products?.map((product) => (
            <ProductCard
              title={product.name}
              category={getCategoryName(product.categoryId)}
              price={product.price}
              userRating={product.averageRating}
              productId={product.id}
              userId={Number(user?.id)}
              image={
                product.images?.[0]?.name
                  ? APP_ENV.IMAGES_1200_URL + product.images[0].name
                  : ""
              }
              onRated={() => refetch()}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
