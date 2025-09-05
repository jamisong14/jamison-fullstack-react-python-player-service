import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Player } from '../types';

export const api = createApi({
  tagTypes: ['Players'],
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
  endpoints: (builder) => ({
    listPlayers: builder.query<{ players: Player[] }, void>({
      query: () => '/v1/players',
      providesTags: ['Players'],
    }),
    getPlayerById: builder.query<{ player: Player }, string>({
      query: (id) => `/v1/players/${id}`,
      providesTags: ['Players'],
    }),
  }),
});

export const {
  useListPlayersQuery,
  useLazyListPlayersQuery,
  useGetPlayerByIdQuery,
  useLazyGetPlayerByIdQuery,
} = api;