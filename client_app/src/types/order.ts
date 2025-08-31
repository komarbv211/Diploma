import { DeliveryType, OrderStatus, PaymentMethod } from "./enums";
import { NovaPostWarehouseDto } from "./novaPost";

// order items
export interface OrderItemDto {
  id: number;
  orderId?: number;
  productId: number;
  productName?: string;
  quantity: number;
  price: number;
}

export interface OrderItemCreateDto {
  productId: number;
  productName?: string;
  quantity: number;
  price: number;
}

export interface OrderItemUpdateDto extends OrderItemCreateDto {
  id: number;
}

// order
export interface OrderDto {
  id: number;
  userId: number;
  warehouseId?: number;
  totalPrice: number;
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  customerNote?: string;
  trackingNumber?: string;
  updatedAt?: string;
  items: OrderItemDto[];
  warehouse?: NovaPostWarehouseDto;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  street?: string;
  house?: string;
  apartment?: string;
  deliveryAddress?: string;
}

export interface OrderCreateDto {
  userId: number;
  warehouseId?: number;
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
}

export interface OrderUpdateDto extends OrderCreateDto {
  id: number;
  status: OrderStatus;
  updatedAt?: string;
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
