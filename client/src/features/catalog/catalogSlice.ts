import { createSlice } from "@reduxjs/toolkit";
import { ProductParams } from "../../app/models/productParams";

// set the initial state for catalog filtering and pagination
const initialState: ProductParams = {
    pageNumber: 1,
    pageSize: 8,
    types: [],
    brands: [],
    searchTerm: '',
    orderBy: 'name'

}
// Create the catalog slice for managing product query/filter parameters
export const catalogSlice = createSlice({
    name: 'catalogSlice',
    initialState,
    reducers: {
        // Set the current page number for pagination use
        setPageNumber(state, action) {
            state.pageNumber = action.payload
        },
        setPageSize(state, action) {
            state.pageSize = action.payload
        },
        // when doing filtering, return to first page
        setOrderBy(state, action) {
            state.orderBy = action.payload
            state.pageNumber = 1;
        },
        setTypes(state, action) {
            state.types = action.payload
            state.pageNumber = 1;
        },
        setBrands(state, action) {
            state.brands = action.payload
            state.pageNumber = 1;
        },
        setSearchTerm(state, action) {
            state.searchTerm = action.payload
            state.pageNumber = 1;
        },
        resetParams() {
            return initialState;
        }

    }
});
export const { setBrands, setOrderBy, setPageNumber, setPageSize, setSearchTerm, setTypes, resetParams } = catalogSlice.actions