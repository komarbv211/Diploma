export enum DeliveryType {
  NovaPost,
  UkrPost,
  Courier,
  Pickup,
}

export enum PaymentMethod {
  Cash,
  Card,
  ApplePay,
  GooglePay,
}

export enum OrderStatus {
  Pending,
  Paid,
  Shipped,
  Delivered,
  Cancelled,
}
