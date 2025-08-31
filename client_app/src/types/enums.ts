export enum DeliveryType {
  NovaPoshta = "Нова Пошта (відділення)",
  Courier = "Доставка кур'єром",
}

export enum PaymentMethod {
  Cash = "Готівка",
  CreditCard = "Оплата картою"
}

export enum OrderStatus {
  Pending,
  Paid,
  Shipped,
  Completed,
  Cancelled,
}
