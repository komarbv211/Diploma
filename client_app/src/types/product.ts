import { ICategoryName } from "./category";

export interface IProduct {
  id: number;
  name: string;
  price: number;
  description?: string;
  categoryId: number;
  category?: ICategoryName;
  quantity: number;
  averageRating?: number;
  ratingsCount: number;
  commentsCount: number;
  images?: IProductImageDto[];
  promotionId?: number;
  discountPercent?: number;
  finalPrice?: number; // розрахована ціна зі знижкою
}

export interface IProductPostRequest {
  name: string;
  price: number;
  description?: string;
  categoryId: number;
  quantity: number;
  image: File[];
}

export interface IProductPutRequest
{
  id: number;
  name: string;
  price: number;
  description?: string;
  categoryId: number;
  quantity: number;
  image?: File[];
}

export interface IProductSetPromotionRequest {
  productId: number;
  promotionId: number | null;
  discountPercent: number;
}


export interface IProductImageDto {
  id: number;
  name: string;
  priority: number;
  productId: number;
}

export 
interface IRateProductRequest {
  productId: number;
  rating: number;
  userId: number;
}