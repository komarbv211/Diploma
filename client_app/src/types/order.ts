import { DeliveryType, OrderStatus, PaymentMethod } from "./enums";
import { NovaPostWarehouseDto } from "./novaPost";

// order items
export interface OrderItemDto {
  id: number;
  orderId?: number;
  productId: number;
  quantity: number;
  price: number;
}

export interface OrderItemCreateDto {
  productId: number;
  quantity: number;
  price: number;
}

export interface OrderItemUpdateDto extends OrderItemCreateDto {
  id: number;
}

// order
export interface OrderBaseDto {
  userId?: number;
  warehouseId?: number | null;
  totalPrice: number;
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
  customerNote?: string;
  trackingNumber?: string;
  items: OrderItemCreateDto[];
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  street?: string;
  house?: string;
  apartment?: string;
  deliveryAddress?: string;
  dateCreated: Date;
}

export interface OrderCreateDto {
  warehouseId?: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  cityRef: string;
  street?: string;
  house?: string;
  apartment?: string;
  deliveryAddress?: string;
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
  customerNote?: string;
  items: OrderItemCreateDto[];
}

export interface OrderUpdateDto extends OrderBaseDto {
  id: number;
  status: OrderStatus;
  updatedAt?: string;
}

export interface OrderStatusUpdateDto {
  id: number;
  status: OrderStatus;
}

export interface OrderDto extends OrderBaseDto {
  id: number;
  status: OrderStatus;
  updatedAt?: string;
  items: OrderItemDto[];
  warehouse?: NovaPostWarehouseDto;
  // date?: string; //додали для білда
  total?: number; //додали для білда
}

// location
export interface City {
  Ref: string;
  Description: string;
}

export interface Street {
  Ref: string;
  Description: string;
}

export interface NPResponse<T> {
  success: boolean;
  data: T[];
}

