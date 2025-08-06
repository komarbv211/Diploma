export interface IPromotion {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
    startDate: string; // ISO string (Date)
    endDate: string;   // ISO string (Date)
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
    description?: string;
    image?: File | null;
    startDate: string; // ISO string
    endDate: string;   // ISO string
    isActive: boolean;
    categoryId?: number | null;
    discountTypeId: number;
    productIds?: number[];
}

export interface IPromotionPutRequest extends IPromotionPostRequest {
    id: number;
}
