import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { CreateOrder, Order } from "../../app/models/order";

export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
         // Query to fetch all orders
        fetchOrders: builder.query<Order[], void>({
            query: () => 'orders',
            providesTags: ['Orders']
        }),
        // Query to fetch the details of a single order by ID
        fetchOrderDetailed: builder.query<Order, number>({
            query: (id) => ({
                url: `orders/${id}`
            })
        }),
        // Mutation to create a new order
        createOrder: builder.mutation<Order, CreateOrder>({
            query: (order) => ({
                url: 'orders',
                method: 'POST',
                body: order
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                await queryFulfilled;
                dispatch(orderApi.util.invalidateTags(['Orders']))
            }
        })
    })
})
export const { useFetchOrdersQuery, useCreateOrderMutation, useFetchOrderDetailedQuery } = orderApi;