import { debounce, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { setSearchTerm } from "./catalogSlice";
import { useEffect, useState } from "react";

export default function Search() {
    // Get the current search term from the Redux store
    const {searchTerm} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();
    // set local state to hold the input value
    const [term, setTerm] =useState(searchTerm);
    //If the global searchTerm changes externally (e.g. reset), update the local input
    useEffect(() => {
        setTerm(searchTerm)
    }, [searchTerm]);

     // Debounced function: wait 500ms after user stops typing before dispatching
    const debounceSearch = debounce(event => {
        dispatch(setSearchTerm(event.target.value))
    }, 500)

    return (
        <TextField
            label='Search Products'
            variant="outlined"
            fullWidth
            type="search"
            value={term}
            onChange={e=> {
                setTerm(e.target.value);
                debounceSearch(e);
            }}
        />
    )
}