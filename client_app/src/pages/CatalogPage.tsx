import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import ProductFilter, { ProductFilterData } from "../components/filter/ProductFilter";
import { useSearchProductsQuery } from "../services/productApi";
import { useGetCategoryTreeQuery } from "../services/categoryApi";
import { APP_ENV } from "../env";
import { useAppSelector } from "../store/store";
import { getUser } from "../store/slices/userSlice";
import { useParams } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { Pagination } from "antd"; // використовуємо Ant Design Pagination

const CatalogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [filters, setFilters] = useState<ProductFilterData>({});
  const [currentPage, setCurrentPage] = useState(1); // 👉 додаємо стан сторінки

  const user = useAppSelector(getUser);
  const isAdmin = user?.roles?.includes("Admin") ?? false;

  const [showFilter, setShowFilter] = useState(false);
  const { data: categories } = useGetCategoryTreeQuery();

  const category = useMemo(() => {
    return categories?.find((cat) => cat.id === Number(id));
  }, [id, categories]);

  // API-запит з пагінацією
  const {
    data: searchResult,
    isLoading,
    refetch,
  } = useSearchProductsQuery(
    {
      CategoryId: [Number(id)],
      Page: currentPage,
      ItemPerPage: 12,
      ...filters,
    },
    { skip: !id }
  );

  useEffect(() => {
    setCurrentPage(1); // скидуємо сторінку при зміні категорії
    if (id) refetch();
  }, [id, refetch]);

  // Зміна сторінки
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
console.log("searchResult", searchResult);
  return (
    <div className="flex flex-col lg:flex-row mt-[100px] pr-4 max-w-[1680px] mx-auto gap-4">
      <div className="w-full lg:w-[23.5%]">
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="w-full bg-transparent text-black border border-gray-300 rounded px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
          >
            {showFilter ? "Сховати фільтр" : "Показати фільтр"}
          </button>
        </div>

        <div className={`${showFilter ? "block" : "hidden"} lg:block`}>
          <ProductFilter onChange={setFilters} isAdmin={isAdmin} />
        </div>
      </div>

      <div className="w-full lg:w-[76.5%] flex flex-col gap-6 m-0 p-0">
        <div className="w-full aspect-[284/153] bg-[url('/parfum_banner.png')] bg-lightgray bg-center bg-cover bg-no-repeat rounded-lg overflow-hidden">
          {category?.image && (
            <img
              src={APP_ENV.IMAGES_1200_URL + category.image}
              alt={category.name}
              className="w-full max-h-[700px] object-cover rounded-lg"
            />
          )}
        </div>

        {/* Каруселі */}
        <div className="w-[1310px] bg-white mx-auto mt-16 flex flex-col gap-12">
          <ProductCarousel
            title={"Пропозиції брендів"}
            products={searchResult?.items ?? []}
            maxWidth="1310px"
          />
          <ProductCarousel
            title="Найпопулярніші"
            products={[...(searchResult?.items ?? [])].sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))}
            maxWidth="1310px"
          />
        </div>

        {/* Банер */}
        <div className="relative w-full max-w-[1024px] aspect-[1021/484] bg-[url('/your-image.png')] bg-lightgray bg-center bg-cover bg-no-repeat rounded-lg overflow-hidden mx-auto">
          <img
            src="/red_girl.png"
            alt="Дівчина"
            className="absolute bottom-0 right-0 h-full object-contain"
          />
        </div>

        {/* Список товарів */}
        <div className="flex flex-wrap justify-center gap-4">
          <ProductCarousel
            title={"Пропозиції брендів"}
            products={searchResult?.items ?? []}
            maxWidth="1301px"
          />
          <ProductCarousel
            title={"Легкі весняні аромати"}
            products={searchResult?.items ?? []}
            maxWidth="1301px"
          />

          <div className="flex flex-wrap justify-center gap-4">
            {isLoading && <p>Завантаження...</p>}
            {!isLoading && searchResult?.items.length === 0 && (
              <p>Немає товарів у цій категорії.</p>
            )}
            {searchResult?.items.map((product) => (
              <ProductCard
                key={product.id}
                title={product.name}
                category={product.category?.name || ""}
                price={product.price}
                userRating={product.rating}
                productId={product.id}
                userId={Number(user?.id)}
                image={
                  product.imageUrl
                    ? APP_ENV.IMAGES_1200_URL + product.imageUrl
                    : ""
                }
                onRated={() => refetch()}
              />
            ))}
          </div>

          {/* 👇 Пагінація */}
          {searchResult?.pagination && (
            <div className="flex justify-center w-full mt-8">
              <Pagination
                current={currentPage}
                total={searchResult.pagination.totalCount}
                pageSize={12}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default CatalogPage;
