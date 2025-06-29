import { IProductPutRequest } from "../types/product";

// utilities/serialize.ts
export function serializeProduct(data: IProductPutRequest): FormData {
    const formData = new FormData();

    formData.append('id', data.id.toString());
    formData.append('name', data.name);
    if (data.description) {
        formData.append('description', data.description);
    }
    formData.append('price', data.price.toString());
    formData.append('categoryId', data.categoryId.toString());

    if (data.image) {
        data.image.forEach((file) => {
            if (file instanceof File) {
                formData.append('image', file);
            }
        });
    }

    return formData;
}
