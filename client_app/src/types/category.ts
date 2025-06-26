export interface ICategory {
  id: number;
  name: string;
  urlSlug: string;
  priority: number;
  description: string;
  image: string | null;
  parentId: number | null;
  children?: ICategory[];
}

export interface ICategoryPostRequest {
  name: string;
  urlSlug: string;
  priority: number;
  description: string;
  image: File | null;
  parentId: number | null;
}

export interface ICategoryPutRequest extends Partial<ICategoryPostRequest> {
  id: number;
}

export interface ICategoryName {
  id: number;
  name: string | null;
}