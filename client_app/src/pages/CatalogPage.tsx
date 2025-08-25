import React ,{ useState }from "react";
// import React,  from "react";
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

  // Виклик пошуку з CategoryId
  const {
    data: searchResult,
    isLoading,
    refetch,
  } = useSearchProductsQuery({
    CategoryId: Number(id),
    Page: 1,
    ItemPerPage: 12,
    ...filters,
  });

  const { data: categories } = useGetCategoryTreeQuery();
  const user = useAppSelector(getUser);

  const getCategoryName = (id: number) => {
    return (
      categories?.find((cat) => cat.id === id)?.name || "Категорія не вказана"
    );
  };

  return (
    <div className="flex justify-center mt-[100px] px-4">

      {/* 🔍 Компонент фільтра */}
    <ProductFilter onChange={(data) => setFilters(data)} />
      <div className="w-full max-w-[1680px] flex flex-wrap justify-center gap-[12px]">
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
            image={
              product.imageUrl ? APP_ENV.IMAGES_1200_URL + product.imageUrl : ""
            }
            onRated={() => refetch()}
          />
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;
