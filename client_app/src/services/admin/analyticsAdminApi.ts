import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "../../utilities/createBaseQuery";
import {
  RevenuePoint,
  TopProduct,
  OrdersSummary,
  CategorySales,
  NewCustomers,
  RepeatPurchase,
  UserAnalytics,
} from "../../types/analytics";

export const analyticsAdminApi = createApi({
  reducerPath: "analyticsAdminApi",
  baseQuery: createBaseQueryWithReauth("admin/analytic"),
  tagTypes: ["Analytics"],
  endpoints: (builder) => ({
    getRevenue: builder.query<RevenuePoint[], { startUtc: string; endUtc: string }>({
      query: ({ startUtc, endUtc }) => `revenue?startUtc=${startUtc}&endUtc=${endUtc}`,
      providesTags: ["Analytics"],
    }),

    getTopProducts: builder.query<TopProduct[], { top?: number; startUtc?: string; endUtc?: string }>({
      query: ({ top = 10, startUtc, endUtc }) => {
        const params = new URLSearchParams();
        params.append("top", top.toString());
        if (startUtc) params.append("startUtc", startUtc);
        if (endUtc) params.append("endUtc", endUtc);
        return `top-products?${params.toString()}`;
      },
      providesTags: ["Analytics"],
    }),

    getOrdersSummary: builder.query<OrdersSummary, { startUtc: string; endUtc: string }>({
      query: ({ startUtc, endUtc }) => `orders-summary?startUtc=${startUtc}&endUtc=${endUtc}`,
      providesTags: ["Analytics"],
    }),

    getSalesByCategory: builder.query<CategorySales[], { startUtc: string; endUtc: string }>({
      query: ({ startUtc, endUtc }) => `sales-by-category?startUtc=${startUtc}&endUtc=${endUtc}`,
      providesTags: ["Analytics"],
    }),

    getNewCustomers: builder.query<NewCustomers, { startUtc: string; endUtc: string }>({
      query: ({ startUtc, endUtc }) => `new-customers?startUtc=${startUtc}&endUtc=${endUtc}`,
      providesTags: ["Analytics"],
    }),

    getRepeatPurchases: builder.query<RepeatPurchase, { startUtc: string; endUtc: string }>({
      query: ({ startUtc, endUtc }) => `repeat-purchases?startUtc=${startUtc}&endUtc=${endUtc}`,
      providesTags: ["Analytics"],
    }),

    getUserAnalytics: builder.query<UserAnalytics, { startUtc: string; endUtc: string }>({
      query: ({ startUtc, endUtc }) => `users?startUtc=${startUtc}&endUtc=${endUtc}`,
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetRevenueQuery,
  useGetTopProductsQuery,
  useGetOrdersSummaryQuery,
  useGetSalesByCategoryQuery,
  useGetNewCustomersQuery,
  useGetRepeatPurchasesQuery,
  useGetUserAnalyticsQuery,
} = analyticsAdminApi;
