import { ICategory } from "./category";

export interface IProduct {
  name: string;
  price: number;
  description: string;
  categoryId: number;
  category: ICategory;
  imagePaths: string[];
}
