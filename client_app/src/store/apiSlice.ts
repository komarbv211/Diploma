import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APP_ENV } from "../env";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: APP_ENV.REMOTE_BASE_URL }),
  endpoints: (builder) => ({
    getExample: builder.query<{ message: string }, void>({
      query: () => "/example",
    }),
  }),
});

export const { useGetExampleQuery } = apiSlice;
