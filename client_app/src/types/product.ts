import { ICategoryName } from "./category";

export interface IProduct {
  id: number;
  name: string;
  price: number;
  description?: string;
  categoryId: number;
  brandId?: number;
  categoryName?: string;
  category?: ICategoryName;
  quantity: number;
  averageRating?: number;
  rating: number;
  ratingsCount: number;
  commentsCount: number;
  images?: IProductImageDto[];
  imageUrl?:string;
  promotionId?: number;
  discountPercent?: number;
  finalPrice?: number; // розрахована ціна зі знижкою
}

export interface IProductPostRequest {
  name: string;
  price: number;
  description?: string;
  categoryId: number;
  brandId?: number;
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
  brandId: number;
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
export interface IProductSearchResponse {
  items: IProduct[];
  pagination: IPagination;
}

export interface IProductSearchRequest {
  CategoryId?: number;
  BrandIds?: number | number[];
  PriceMin?: number;
  PriceMax?: number;
  MinRating?: number;
  InStock?: boolean;
  Query?: string;
  StartDate?: string;
  EndDate?: string;
  SortBy?: string;
  SortDesc?: boolean;
  Page?: number;
  ItemPerPage?: number;
}
export interface IPagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}