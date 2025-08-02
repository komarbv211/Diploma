// menuBuilder.ts
import { CategoryDto, MenuItem } from "../types/category";

export const buildParentCategoryMenu = (categories: CategoryDto[]): MenuItem[] => {
  return categories
    .filter(cat => cat.parentId === null) // тільки батьківські
    .map(cat => ({
      key: cat.urlSlug,
      label: cat.name,
      isLeaf: false, // ми ще не знаємо дочірні
    }));
};
