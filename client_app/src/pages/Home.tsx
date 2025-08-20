import React from "react";
import ProductCard from "../components/ProductCard";
import { useGetAllProductsQuery } from "../services/productApi";
import { useGetCategoryTreeQuery } from "../services/categoryApi";
import { APP_ENV } from "../env";
import { useAppSelector } from "../store/store";
import { getUser } from "../store/slices/userSlice";

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
    <div className="flex justify-center mt-[100px] px-4">
      <div className="w-full max-w-[1680px] flex flex-wrap justify-center gap-[12px]">
        {isLoading && <p>Завантаження...</p>}
        {products?.map((product) => (
          // <Link key={product.id} to={`/product/details/${product.id}`}>
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
          // </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
