// src/types/brand.ts
export interface IBrand {
  id: number;      
  name: string;
}

export interface IBrandPostRequest {
  name: string;
}

export interface IBrandPutRequest {
  id: number;
  name: string;
}
