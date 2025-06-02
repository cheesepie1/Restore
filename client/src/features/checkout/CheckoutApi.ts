import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { Basket } from "../../app/models/basket";
import { basketApi } from "../basket/basketApi";

export const checkoutApi = createApi({
    reducerPath: 'checkoutApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        // Define a mutation to create a payment intent
        createPaymentIntent: builder.mutation<Basket, void> ({
            query: () => {
                return {
                    url: 'payments',
                    method: 'POST'
                }
            },
             // Hook to perform side effects when mutation starts
            onQueryStarted: async (__dirname, {dispatch,queryFulfilled}) => {
                try {
                    const {data} =await queryFulfilled;
                    // Update the cached basket with the new clientSecret
                    dispatch(
                        basketApi.util.updateQueryData('fetchBasket', undefined, (draft) => {
                            draft.clientSecret = data.clientSecret
                        })
                    )
                    
                } catch (error) {
                    console.log('Payment intent creation failed: ', error)
                    
                }
            }
        })
    
    })
});
export const {useCreatePaymentIntentMutation} = checkoutApi