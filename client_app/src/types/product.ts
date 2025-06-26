import { ICategoryName } from "./category";

export interface IProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  categoryId: number;
  category: ICategoryName;
  images?: IProductImageDto[];
}

export interface IProductPostRequest {
  name: string;
  price: number;
  description?: string;
  categoryId: number;
  image?: File[];
}

export interface IProductPutRequest extends IProductPostRequest {
  id: number;
}

export interface IProductImageDto {
  id: number;
  name: string;
  priority: number;
  productId: number;
}