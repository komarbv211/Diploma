import { createApi } from "@reduxjs/toolkit/query/react";
import { OrderCreateDto, OrderDto, OrderHistoryDto } from "../types/order";
import { createBaseQuery } from "../utilities/createBaseQuery";
import { NovaPostWarehouseDto } from "../types/novaPost";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: createBaseQuery("order"),
  tagTypes: ["Orders", "Warehouses"],
  endpoints: (builder) => ({
    getMyOrders: builder.query<OrderHistoryDto[], void>({
      query: () => `/my`,
    }),

    getOrderById: builder.query<OrderDto, number>({
      query: (id: number) => `order/${id}`,
      providesTags: ["Orders"],
    }),

    createOrder: builder.mutation<OrderDto, OrderCreateDto>({
      query: (newProd: OrderCreateDto) => {
        console.log("-----Server data--------", newProd);
        return {
          url: "",
          method: "POST",
          body: newProd,
        }
      },
      invalidatesTags: ["Orders"],
    }),

    deleteOrder: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),

    warehousesByCity: builder.query<NovaPostWarehouseDto[], string>({
      query: (cityRef) => `warehouses/${cityRef}`,
      providesTags: ["Warehouses"],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useDeleteOrderMutation,
  useWarehousesByCityQuery,
} = orderApi;
