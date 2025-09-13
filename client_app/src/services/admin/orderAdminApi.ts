import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "../../utilities/createBaseQuery";
import {
  OrderCreateDto,
  OrderDto,
  OrderStatusUpdateDto,
  OrderUpdateDto,
} from "../../types/order";

export const orderAdminApi = createApi({
  reducerPath: "orderAdminApi",
  baseQuery: createBaseQueryWithReauth("admin"),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getAllOrders: builder.query<OrderDto[], void>({
      query: () => "order",
      providesTags: ["Orders"],
    }),

    getOrdersByUserId: builder.query<OrderDto[], void>({
      query: () => "order",
      providesTags: ["Orders"],
    }),

    getOrderById: builder.query<OrderDto, number>({
      query: (id) => `order/${id}`,
      providesTags: ["Orders"],
    }),

    createOrder: builder.mutation<OrderDto, OrderCreateDto>({
      query: (newProd) => ({
        url: "order",
        method: "POST",
        body: newProd,
      }),
      invalidatesTags: ["Orders"],
    }),

    updateOrder: builder.mutation<OrderDto, OrderUpdateDto>({
      query: (upd) => ({
        url: `order`,
        method: "PUT",
        body: upd,
      }),
      invalidatesTags: ["Orders"],
    }),

    updateOrderStatus: builder.mutation<void, OrderStatusUpdateDto>({
      query: (updateData) => ({
        url: `order/${updateData.id}/status`,
        method: "PATCH",
        body: updateData,
      }),
      invalidatesTags: ["Orders"],
    }),

    deleteOrder: builder.mutation<void, number>({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderAdminApi;
