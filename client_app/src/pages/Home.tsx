//Home.tsx
import React from "react";
import { useGetAllProductsQuery } from "../services/productApi";
import ProductCarousel from "../components/ProductCarousel";

const Home: React.FC = () => {
  const { data: products } = useGetAllProductsQuery();
  return (
    <div className="w-full max-w-[1680px] mx-auto mt-[100px]">
      <ProductCarousel products={products ?? []} maxWidth="100%" />
    </div>
  );
};

export default Home;
