import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/json');
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: [
    'Users',
  ],
  endpoints: () => ({}),
});
