// Favorite item для відповіді API
export interface IFavoriteItem {
    productId: number;
    name: string;
    categoryId: number;
    categoryName: string;
    price: number;
    imageName?: string;
    imageUrl?: string;
    averageRating?: number;
    ratingsCount?: number;
    promotionId?: number;
    discountPercent?: number;
    finalPrice?: number;
}

// DTO для додавання одного товару у вподобані
export interface IFavoriteAddRequest {
    productId: number;
}

// DTO для додавання кількох товарів
export interface IFavoriteAddRangeRequest {
    productIds: number[];
}



