import { Dayjs } from "dayjs";

export interface IPromotion {
    id: number;
    name: string;
    description?: string | null;
    imageUrl?: string | null;
    startDate: string;  // ISO string
    endDate: string;    // ISO string
    isActive: boolean;
    productIds: number[];
}

export interface IPromotionPostRequest {
    name: string;
    description?: string | null;
    image: File;          // обов'язковий для створення
    startDate: string;    // ISO string
    endDate: string;      // ISO string
    isActive?: boolean;   // дефолт true
    productIds?: number[];
}

export interface IPromotionPutRequest {
    id: number;
    name: string;
    description?: string | null;
    image?: File | null;  // опціональний
    startDate: string;    // ISO string
    endDate: string;      // ISO string
    isActive: boolean;
    productIds?: number[];
}

export interface PromotionFormValues {
    name: string;
    description?: string;
    period: [Dayjs, Dayjs];
    isActive: boolean;
    productIds?: number[];
}
