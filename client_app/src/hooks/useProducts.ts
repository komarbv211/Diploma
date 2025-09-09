// src/hooks/useProducts.ts
import { useSearchProductsQuery } from "../services/productApi";
import { IProductSearchRequest } from "../types/product";

export const useProducts = (params: IProductSearchRequest) => {
  const { data, isLoading, isError, refetch } = useSearchProductsQuery(params);
  return { products: data?.items ?? [], isLoading, isError, refetch };
};
