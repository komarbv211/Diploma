
import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import { useSearchProductsQuery } from "../services/productApi";
import { useGetCategoryTreeQuery } from "../services/categoryApi";
import { APP_ENV } from "../env";
import { useAppSelector } from "../store/store";
import { getUser } from "../store/slices/userSlice";
import { useParams } from "react-router-dom";
import ProductFilter, { ProductFilterData } from "../components/filter/ProductFilter";

const CatalogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [filters, setFilters] = useState<ProductFilterData>({});

  const { data: searchResult, isLoading, refetch } = useSearchProductsQuery({
    CategoryId: Number(id),
    Page: 1,
    ItemPerPage: 12,
    ...filters,
  });

  const { data: categories } = useGetCategoryTreeQuery();
  const user = useAppSelector(getUser);
  const category = categories?.find((cat) => cat.id === Number(id));

  // Визначаємо, чи є користувач адміністратором
  const isAdmin = user?.roles?.includes("Admin") ?? false;

  const getCategoryName = (id: number) => {
    return categories?.find((cat) => cat.id === id)?.name || "Категорія не вказана";
  };

  return (
    <div className="flex flex-col lg:flex-row mt-[100px] px-4 max-w-[1680px] mx-auto gap-4">
      {/* 🔍 Ліва колонка: фільтри */}
      <div className="w-full lg:w-[23.5%]">
        {/* Передаємо isAdmin у ProductFilter */}
        <ProductFilter onChange={(data) => setFilters(data)} isAdmin={isAdmin} />
      </div>

      {/* 🛒 Права колонка: зображення категорії + товари */}
      <div className="w-full lg:w-[76.5%] flex flex-col gap-6 m-o p-0">
        {/* Фото категорії зверху */}
        {category?.image && (
          <img
            src={APP_ENV.IMAGES_1200_URL + category.image}
            alt={category.name}
            className="w-full max-h-[700px] object-cover rounded-lg"
          />
        )}

        {/* Картки товарів */}
        <div className="flex flex-wrap justify-center gap-4">
          {isLoading && <p>Завантаження...</p>}

          {searchResult?.items.length === 0 && !isLoading && (
            <p>Немає товарів у цій категорії.</p>
          )}

          {searchResult?.items.map((product) => (
            <ProductCard
              key={product.id}
              title={product.name}
              category={product.category?.name || getCategoryName(Number(id))}
              price={product.price}
              userRating={product.ratingsCount ?? 0}
              productId={product.id}
              userId={Number(user?.id)}
              image={product.imageUrl ? APP_ENV.IMAGES_1200_URL + product.imageUrl : ""}
              onRated={() => refetch()}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
