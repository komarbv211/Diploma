import { DeliveryType, OrderStatus, PaymentMethod } from "./enums";
import { NovaPostWarehouseDto } from "./novaPost";

// order items
export interface OrderItemDto {
  id: number;
  orderId: number;
  productId: number;
  productName?: string;
  quantity: number;
  price: number;
}

export interface OrderItemCreateDto {
  orderId: number;
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
  deliveryAddress?: string;
  customerNote?: string;
  trackingNumber?: string;
  updatedAt?: string;
  items: OrderItemDto[];
  warehouse?: NovaPostWarehouseDto;
}

export interface OrderCreateDto {
  userId: number;
  warehouseId?: number;
  totalPrice: number;
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
  deliveryAddress?: string;
  customerNote?: string;
  trackingNumber?: string;
  items: OrderItemCreateDto[];
}

export interface OrderUpdateDto extends OrderCreateDto {
  id: number;
  status: OrderStatus;
  updatedAt?: string;
}
