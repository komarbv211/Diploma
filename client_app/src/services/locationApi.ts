import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Street } from "../types/order";

interface City {
  Ref: string;
  Description: string;
  DescriptionRu?: string;
}

interface NPResponse<T> {
  success: boolean;
  data: T[];
}

export const NP_API_KEY = "0c26522287ed71c4322ea8921e48a58c";

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.novaposhta.ua/v2.0/json/",
  }),
  endpoints: (builder) => ({
    getCities: builder.query<City[], void>({
      query: () => ({
        url: "",
        method: "POST",
        body: {
          modelName: "Address",
          calledMethod: "getCities",
          apiKey: NP_API_KEY,
        },
      }),
      transformResponse: (response: NPResponse<City>) => response.data,
    }),
    getStreets: builder.query<Street[], string>({
      query: (cityRef) => ({
        url: "",
        method: "POST",
        body: {
          modelName: "Address",
          calledMethod: "getStreet",
          methodProperties: { CityRef: cityRef },
          apiKey: NP_API_KEY,
        },
      }),
      transformResponse: (response: NPResponse<Street>) => response.data,
    }),
  }),
});

export const { useGetCitiesQuery, useGetStreetsQuery } = locationApi;
