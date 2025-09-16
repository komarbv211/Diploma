import { IProductPutRequest } from "../types/product";

// utilities/serialize.ts
export function serializeProduct(data: IProductPutRequest): FormData {
    const formData = new FormData();

    formData.append('id', data.id.toString());
    formData.append('name', data.name);
    formData.append('price', data.price.toString());
    formData.append('categoryId', data.categoryId.toString());
    formData.append('quantity', data.quantity.toString());
    if (data.brandId) {
    formData.append('brandId', data.brandId.toString());
    }

    if (data.description) {
        formData.append('description', data.description);
    }

    if (data.image) {
        data.image.forEach((file) => {
            if (file instanceof File) {
                formData.append('image', file);
            }
        });
    }

    return formData;
}

import { IPromotionPutRequest } from "../types/promotion";

// utilities/serialize.ts
export function serializePromotion(data: IPromotionPutRequest): FormData {
    const formData = new FormData();

    formData.append('id', data.id.toString());
    formData.append('name', data.name);
    formData.append('startDate', data.startDate);
    formData.append('endDate', data.endDate);
    formData.append('isActive', data.isActive.toString());

    if (data.description) {
        formData.append('description', data.description);
    }

    if (data.productIds && data.productIds.length > 0) {
        data.productIds.forEach((id) => {
            formData.append('productIds', id.toString());
        });
    }

    if (data.image) {
        formData.append('image', data.image);
    }

    return formData;
}
