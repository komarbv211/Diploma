import React, { useState, useMemo, useCallback, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import ProductFilter, {
  ProductFilterData,
} from "../components/filter/ProductFilter";
import { useGetCategoryTreeQuery } from "../services/categoryApi";
import { useSearchProductsQuery } from "../services/productApi";
import { APP_ENV } from "../env";
import { useAppSelector } from "../store/store";
import { getUser } from "../store/slices/userSlice";
import { useParams } from "react-router-dom";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { ICategory } from "../types/category";

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [filters, setFilters] = useState<ProductFilterData>({});

  const user = useAppSelector(getUser);
  const isAdmin = user?.roles?.includes("Admin") ?? false;

  const { data: categories } = useGetCategoryTreeQuery();

  const category = useMemo(
    () => categories?.find((cat) => cat.id === Number(id)),
    [id, categories]
  );

  const getAllCategoryIds = useCallback(
    (catId: number, tree: ICategory[]): number[] => {
      const result: number[] = [catId];
      const children = tree?.filter((c) => c.parentId === catId) || [];
      for (const child of children) {
        result.push(...getAllCategoryIds(child.id, tree));
      }
      return result;
    },
    []
  );

  const categoryIds = useMemo(() => {
    if (!id || !categories) return [];
    return getAllCategoryIds(Number(id), categories);
  }, [id, categories, getAllCategoryIds]);

  const searchParams = useMemo(() => {
    return {
      CategoryIds: categoryIds,
      Page: 1,
      ItemPerPage: 50,
      PriceMin: filters.PriceMin,
      PriceMax: filters.PriceMax,
      BrandIds: filters.BrandIds,
      MinRating: filters.MinRating,
      InStock: filters.InStock,
      SortBy: filters.SortBy,
      SortDesc: filters.SortDesc,
    };
  }, [categoryIds, filters]);

  const {
    data: products,
    isLoading,
    refetch,
  } = useSearchProductsQuery(searchParams, {
    skip: categoryIds.length === 0,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    refetch();
  }, [searchParams, refetch]);

  return (
    <div className="flex flex-col lg:flex-row mt-[100px] px-4 max-w-[1680px] mx-auto gap-4">
      <div className="w-full lg:w-[23.5%]">
        <ProductFilter onChange={setFilters} isAdmin={isAdmin} />
      </div>

      <div className="w-full lg:w-[76.5%] flex flex-col gap-6 m-0 p-0">
        {category?.image && (
          <img
            src={APP_ENV.IMAGES_1200_URL + category.image}
            alt={category.name}
            className="w-full max-h-[700px] object-cover rounded-lg"
          />
        )}

        <div className="flex flex-wrap justify-center gap-4">
          {isLoading && <p>Завантаження...</p>}
          {!isLoading && products?.items.length === 0 && (
            <p>Немає товарів у цій категорії.</p>
          )}

          {products?.items.map((product) => (
            <ProductCard
              key={product.id}
              title={product.name}
              category={product.categoryName || ""}
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
        <ScrollToTopButton />
      </div>
    </div>
  );
};

export default CategoryPage;
