import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (headers, {getState}) => {
            const token = (getState() as RootState).auth.token;
            if(token){
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),

    tagTypes: ['Tables', 'User', 'Bookings'],

    endpoints: (builder) => ({
        getTables: builder.query({
            query: () => '/api/v1/tables',
            providesTags: ['Tables'],
        }),
        register: builder.mutation({
            query: (userData: Record<string, string>) => ({
                url: '/api/v1/auth/register',
                method: 'POST',
                body: userData
            }),
        }),
        login: builder.mutation({
            query: (userData: Record<string, string>) => ({
                url: '/api/v1/auth/login',
                method: 'POST',
                body: userData,
            }),
        }),
        getCurrentUser: builder.query({
            query: () => '/api/v1/auth/me',
        }),
        getTableTimeslots: builder.query({
            query: ({tableId, date}: {tableId: number; date: string}) => `/api/v1/tables/${tableId}/timeslots?date=${date}`
        }),
        createBooking: builder.mutation({
            query: (bookingData: Record<string, string | number>) => ({
                url: '/api/v1/bookings',
                method: 'POST',
                body: bookingData
            }),
            invalidatesTags: ['Bookings']
        }),
        getMyBookings: builder.query({
            query: () => '/api/v1/bookings/my',
            providesTags: ['Bookings']
        }),
        getAllBookings: builder.query({
            query: () => '/api/v1/bookings',
            providesTags: ['Bookings']
        }),
        updateBookingStatus: builder.mutation({
            query: ({id, status}: {id: number; status: string}) => ({
                url: `/api/v1/bookings/${id}/status`,
                method: 'PATCH',
                body: {status}
            }),
            invalidatesTags: ['Bookings']
        }),
        updateTablePosition: builder.mutation({
            query: ({id, x, y}: {id: number; x: number; y: number}) => ({
                url: `/api/v1/tables/${id}/position`,
                method: 'PATCH',
                body: {x, y}
            }),
            invalidatesTags: ['Tables']
        }),
        createTable: builder.mutation({
            query: (tableData: Record<string, string | number | boolean>) => ({
                url: `/api/v1/tables`,
                method: 'POST',
                body: tableData
            }),
            invalidatesTags: ['Tables']
        }),
        updateTable: builder.mutation({
            query: ({id, ...updates}:{id: number; [key: string]: string | number | boolean}) => ({
                url: `/api/v1/tables/${id}`,
                method: 'PATCH',
                body: updates
            }),
            invalidatesTags: ['Tables']
        }),
        deleteTable: builder.mutation({
            query: (id: number) => ({
                url: `/api/v1/tables/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Tables']
        }),
    }),
});

export const { 
    useGetTablesQuery,
    useRegisterMutation,
    useLoginMutation,
    useGetCurrentUserQuery,
    useCreateBookingMutation,
    useGetTableTimeslotsQuery,
    useGetMyBookingsQuery,
    useGetAllBookingsQuery,
    useUpdateBookingStatusMutation,
    useUpdateTablePositionMutation,
    useCreateTableMutation,
    useDeleteTableMutation,
    useUpdateTableMutation,
 } = api;