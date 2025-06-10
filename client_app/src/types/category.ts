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
