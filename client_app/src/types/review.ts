import { IProductImageDto } from "./product";

export interface ReviewProductRequest {
  productId: number;
  userId: number;
  text: string;
}

export interface ReviewItemProduct {
  id: number;
  productId: number;
  userId: number;
  text: string;
  dateCreated: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    image: string;
  };
    product: {
    name: string;
    images?: IProductImageDto[];
  };
}
export interface Review {
  id: number;
  text: string;
  user: {
    firstName: string;
    lastName: string;
    image?: string;
  };
  product: {
    name: string;
    images?: IProductImageDto[];
  };
}
