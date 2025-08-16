import { Dayjs } from "dayjs";

export interface IPromotion {
    id: number;
    name: string;
    description?: string | null;
    imageUrl?: string | null;
    startDate: string;       // ISO string
    endDate: string;         // ISO string
    isActive: boolean;
    categoryId?: number | null;
    categoryName?: string | null;
    discountTypeId: number;
    discountTypeName: string;
    discountAmount: number;
    productIds: number[];
}

export interface IPromotionPostRequest {
    name: string;
    description?: string | null;
    image: File;             // обов'язковий для створення (CreateDto)
    startDate: string;       // ISO string
    endDate: string;         // ISO string
    isActive?: boolean;      // в CreateDto дефолт true, можна зробити опціональним
    categoryId?: number | null;
    discountTypeId: number;
    amount: number;          // співпадає з Amount у CreateDto
    productIds?: number[];
}

export interface IPromotionPutRequest {
    id: number;
    name: string;
    description?: string | null;
    image?: File | null;     // опціональний, може бути null (UpdateDto)
    startDate: string;
    endDate: string;
    isActive: boolean;
    categoryId?: number | null;
    discountTypeId: number;
    amount: number;
    productIds?: number[];
}

export interface PromotionFormValues {
  name: string;
  description?: string;
  period: [Dayjs, Dayjs];
  isActive: boolean;
  categoryId?: number | null;
  discountTypeId: number;
  amount: number;
  productIds?: number[];
}
