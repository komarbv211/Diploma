import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import ProductFilter, {
  ProductFilterData,
} from "../components/filter/ProductFilter";
import { useSearchProductsQuery } from "../services/productApi";
import { useGetCategoryTreeQuery } from "../services/categoryApi";
import { APP_ENV } from "../env";
import { useAppSelector } from "../store/store";
import { getUser } from "../store/slices/userSlice";
import { useParams } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";
import ScrollToTopButton from "../components/ScrollToTopButton";


const CatalogPage: React.FC = () => {
  
  const { id } = useParams<{ id: string }>();
  const [filters, setFilters] = useState<ProductFilterData>({});
  
  const user = useAppSelector(getUser);
  const [showFilter, setShowFilter] = useState(false);
  const isAdmin = user?.roles?.includes("Admin") ?? false;

  // Дані категорій
  const { data: categories } = useGetCategoryTreeQuery();

  // Поточна категорія (оновлюється при зміні id)
  const category = useMemo(() => {
    return categories?.find((cat) => cat.id === Number(id));
  }, [id, categories]);

  // Запит продуктів
  const {
    data: searchResult,
    isLoading,
    refetch,
  } = useSearchProductsQuery(
    {
      CategoryId: [Number(id)],
      Page: 1,

      ItemPerPage: 12,
      ...filters,
    },
    { skip: !id } // пропускаємо запит якщо id немає
  );

  console.log("Salo", filters);

  // Перезапуск запиту при зміні id
  useEffect(() => {
    if (id) refetch();
  }, [id, refetch]);

  return (
    <div className="flex flex-col lg:flex-row mt-[100px] px-4 max-w-[1680px] mx-auto gap-4">
      <div className="w-full lg:w-[23.5%]">

        {/* Кнопка показу фільтрів (тільки для мобільних) */}
{/* <div className="lg:hidden mb-4">
  <button
    onClick={() => setShowFilter(!showFilter)}
    className="px-4 py-2 bg-black text-white rounded"
  >
    {showFilter ? "Сховати фільтр" : "Показати фільтр"}
  </button>
</div> */}

 <div className="lg:hidden mb-4">
    <button
      onClick={() => setShowFilter(!showFilter)}
      className="
        w-full
        bg-transparent
        text-black
        border border-gray-300
        rounded
        px-4 py-2
        hover:bg-gray-100
        transition-colors duration-200
      "
    >
      {showFilter ? "Сховати фільтр" : "Показати фільтр"}
    </button>
  </div>


{/* Сам фільтр */}
  <div className={`${showFilter ? "block" : "hidden"} lg:block`}>
    <ProductFilter onChange={setFilters} isAdmin={isAdmin} />
  </div>
        {/* <ProductFilter onChange={setFilters} isAdmin={isAdmin} /> */}
      </div>

      <div className="w-full lg:w-[76.5%] flex flex-col gap-6 m-0 p-0">

        <div className="w-full aspect-[284/153] bg-[url('/parfum_banner.png')] bg-lightgray bg-center bg-cover bg-no-repeat rounded-lg overflow-hidden">
          <img
            src="/parfum_banner.png"
            alt="Парфуми банер"
            className="w-full h-full object-cover"
          />
        </div>

        {/* {category && (
  <>
    {category.name === "Парфумерія" ? (
      <img
        src="/r_v_brand.jpg"
        alt="Парфуми банер"
        className="w-full max-h-[700px] object-cover rounded-lg"
      />
    ) : category.image ? (
      <img
        src={APP_ENV.IMAGES_1200_URL + category.image}
        alt={category.name}
        className="w-full max-h-[700px] object-cover rounded-lg"
      />
    ) : (
      <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">Фото категорії відсутнє</p>
      </div>
    )}
  </>
)} */}

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


        <div className="relative w-full max-w-[1024px] aspect-[1021/484] bg-[url('/your-image.png')] bg-lightgray bg-center bg-cover bg-no-repeat rounded-lg overflow-hidden mx-auto">
          <img
            src="/red_girl.png"
            alt="Дівчина"
            className="absolute bottom-0 right-0 h-full object-contain"
          />
        </div>


        <div className="flex flex-wrap justify-center gap-4">
          {category?.image && (
            <img
              src={APP_ENV.IMAGES_1200_URL + category.image}
              alt={category.name}
              className="w-full max-h-[700px] object-cover rounded-lg"
            />
          )}

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
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default CatalogPage;
