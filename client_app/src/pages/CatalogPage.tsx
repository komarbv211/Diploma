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
import { useGetAllProductsQuery } from "../services/admin/productAdminApi";

const CatalogPage: React.FC = () => {
  const { data: products } = useGetAllProductsQuery();
  const { id } = useParams<{ id: string }>();
  const [filters, setFilters] = useState<ProductFilterData>({});

  const user = useAppSelector(getUser);
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
      CategoryId: Number(id),
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

  const getCategoryName = (categoryId: number) =>
    categories?.find((cat) => cat.id === categoryId)?.name ||
    "Категорія не вказана";

  return (
    <div className="flex flex-col lg:flex-row mt-[100px] px-4 max-w-[1680px] mx-auto gap-4">
      {/* Ліва колонка: фільтри */}
      <div className="w-full lg:w-[23.5%]">
        <ProductFilter onChange={setFilters} isAdmin={isAdmin} />
      </div>

      {/* Права колонка: фото категорії + товари */}
      <div className="w-full lg:w-[76.5%] flex flex-col gap-6 m-0 p-0">
        {/* <img
          src="parfum_banner.jpg"
          alt="головний банер"
          className="w-full max-h-[698px] object-cover object-center"
        /> */}
     
        {/* Фото категорії */}
        {/* {category?.image && (
          
          <img
            src={APP_ENV.IMAGES_1200_URL + category.image}
            alt={category.name}
            className="w-full max-h-[700px] object-cover rounded-lg"
          />
        )} */}

 <div
        className="w-[1420px] h-[765px] flex-shrink-0 aspect-[284/153] bg-[url('/parfum_banner.png')] bg-lightgray bg-center bg-cover bg-no-repeat rounded-lg"
        aria-label="Парфуми банер"
      >
         <img
        src="/parfum_banner.png"
        alt="Парфуми банер"
        className="w-full max-h-[700px] object-cover rounded-lg"
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

<div className="w-[1420px] h-[8114px] bg-white mx-auto mt-28 flex flex-col gap-12">
        <ProductCarousel
          title={"Пропозиції брендів"}
          products={products ?? []}
          maxWidth="1420px"
        />
        <ProductCarousel
  title="Найпопулярніші"
  products={[...(products ?? [])].sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))}
  maxWidth="1420px"
/>
      </div>


<div
  className="absolute left-[642px] top-[2337px] w-[1021px] h-[484px] flex-shrink-0 
             bg-[url('/your-image.png')] bg-lightgray bg-center bg-cover bg-no-repeat rounded-lg"
>
  {/* Зображення в правому нижньому куті */}
  <img
    src="/red_girl.png"
    alt="Опис зображення"
    className="absolute bottom-0 right-0 w-[auto] h-auto object-contain"
  />
</div>



        {/* Картки товарів */}
        <div className="flex flex-wrap justify-center gap-4">
          {isLoading && <p>Завантаження...</p>}

          {!isLoading && searchResult?.items.length === 0 && (
            <p>Немає товарів у цій категорії.</p>
          )}

          {searchResult?.items.map((product) => (
            <ProductCard
              key={product.id}
              title={product.name}
              category={product.category?.name || getCategoryName(Number(id))}
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
  );
};

export default CatalogPage;
