export interface RevenuePoint {
  date: string;       // ISO string з беку
  revenue: number;
  ordersCount: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  quantitySold: number;
  revenue: number;
}

export interface OrdersSummary {
  ordersCount: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface CategorySales {
  categoryId: number;
  categoryName: string;
  quantitySold: number;
  revenue: number;
}

export interface NewCustomers {
  newCustomers: number;
}

export interface RepeatPurchase {
  customersWithRepeatPurchase: number;
  customersTotal: number;
}

export interface UserAnalytics {
  newUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  averageOrdersPerUser: number;
  totalUsers: number;
}
