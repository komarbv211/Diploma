export interface NovaPostWarehouseDto {
  id: number;
  name?: string;
  city?: string;
  address?: string;
  warehouseCode?: string;
  latitude?: number;
  longitude?: number;
  workingHours?: string;
  maxWeightKg?: number;
}

export interface NovaPostWarehouseResponse {
  success: boolean;
  data: NovaPostWarehouseData[];
}

export interface NovaPostWarehouseData {
  description: string;
  cityDescription: string;
  number: string;
  latitude?: number;
  longitude?: number;
  totalMaxWeightAllowed: string;
  schedule: Record<string, string>;
}
