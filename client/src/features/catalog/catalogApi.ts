import { createApi, } from "@reduxjs/toolkit/query/react";
import { Product } from "../../app/models/product";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { ProductParams } from "../../app/models/productParams";
import { filterEmptyValues } from "../../lib/util";
import { Pagination } from "../../app/models/pagination";

// Define the RTK Query API slice for the product catalog
export const catalogApi = createApi({
    reducerPath: 'catalogApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        // Fetch a list of products with filtering and pagination
        fetchProducts: builder.query<{ items: Product[], pagination: Pagination }, ProductParams>({
            query: (productParams) => {
                return {
                    url: 'products',
                    // Remove empty or undefined values from query params
                    params: filterEmptyValues(productParams)
                }
            },
            // Transform the response to extract pagination info from the header
            transformResponse: (items: Product[], meta) => {
                const paginationHeader = meta?.response?.headers.get('Pagination');
                const pagination = paginationHeader ? JSON.parse(paginationHeader) : null;
                return { items, pagination }
            }
        }),
        // Fetch the details of a single product by ID
        fetchProductDetails: builder.query<Product, number>({
            query: (productId) => `products/${productId}`
        }),
        // Fetch available filter options such as brands and types
        fetchFilters: builder.query<{ brands: string[], types: string[] }, void>({
            query: () => 'products/filters'
        })
    })
})

export const { useFetchProductDetailsQuery, useFetchProductsQuery, useFetchFiltersQuery } = catalogApi