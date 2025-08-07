import React from "react";
import ProductCard from "../components/ProductCard";
import { useGetAllProductsQuery } from "../services/productApi";
import { useGetCategoryTreeQuery } from "../services/categoryApi";
import { APP_ENV } from "../env";

const Home: React.FC = () => {
  const { data: products, isLoading } = useGetAllProductsQuery();
  const { data: categories } = useGetCategoryTreeQuery();

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
          <div className="cart-container" key={product.id}>
            <ProductCard
              title={product.name}
              category={getCategoryName(product.categoryId)}
              price={product.price}
              image={
                product.images?.[0]?.name
                  ? APP_ENV.IMAGES_1200_URL + product.images[0].name
                  : ""
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
