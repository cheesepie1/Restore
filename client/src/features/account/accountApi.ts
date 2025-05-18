import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { Address, user } from "../../app/models/user";
import { LoginSchema } from "../../lib/schemas/loginSchema";
import { router } from "../../app/routes/Routes";
import { toast } from "react-toastify";

export const accountApi = createApi({
    reducerPath: 'accountApi',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['UserInfo'],
    endpoints: (builder) => ({

        // login mutation
        login: builder.mutation<void, LoginSchema>({
            query: (creds) => {
                return {
                    url: 'login?useCookies=true',
                    method: 'POST',
                    body: creds
                }
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    // Invalidate cached user info so it can be refetched
                    dispatch(accountApi.util.invalidateTags(['UserInfo']))
                } catch (error) {
                    console.log(error);
                }
            },
        }),

         // register mutation
        register: builder.mutation<void, object>({
            query: (creds) => {
                return {
                    url: 'account/register',
                    method: 'POST',
                    body: creds
                }
            },
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success("Registeration successful - you can sign in now!");
                    // once register a user, leading to login 
                    router.navigate('/login');
                } catch (error) {
                    console.log(error);
                    throw error;
                }
            },
        }),
        // user-info query
        userInfo: builder.query<user, void>({
            query: () => 'account/user-info',
            // set a tag for invalidation use
            providesTags: ['UserInfo']

        }),
        // logout mutation
        logout: builder.mutation({
            query: () => ({
                url: 'account/logout',
                method: 'POST'
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                await queryFulfilled;
                // once logout, clear userinfo and redirect to home page
                dispatch(accountApi.util.invalidateTags(['UserInfo']));
                router.navigate('/');

            },
        }),
        // fetch address query
        fetchAddress: builder.query<Address, void>({
            query: () => ({
                url: 'account/address'
            })
        }),
        // update address mutation
        updateUserAddress: builder.mutation<Address, Address>({
            query: (address) => ({
                url: 'account/address',
                method: 'POST',
                body: address
            }),
            onQueryStarted: async (address, { dispatch, queryFulfilled }) => {
                // save updated address to cache 
                const patchResult = dispatch(
                    accountApi.util.updateQueryData('fetchAddress', undefined, (draft) => {
                        Object.assign(draft, { ...address })
                    })
                );
                try {
                    // wait for the server response
                    await queryFulfilled;

                } catch (error) {
                    // if unsuccessful, then rollback the updated address in cache
                    patchResult.undo();
                    console.log(error);

                }
            }

        })
    })

});
export const { useLoginMutation, useLogoutMutation,
    useRegisterMutation, useUserInfoQuery,
    useLazyUserInfoQuery, useFetchAddressQuery,
    useUpdateUserAddressMutation } = accountApi;