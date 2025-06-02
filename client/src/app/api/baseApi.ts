import { BaseQueryApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { startLoading, stopLoading } from "../layout/uiSlice";
import { toast } from "react-toastify";
import { router } from "../routes/Routes";

const customBaseQuery = fetchBaseQuery({
    // API base URL from environment variable
    baseUrl: import.meta.env.VITE_API_URL,
    // Include cookies with each request
    credentials: 'include'
});

// Using type guard to define possible error response shapes
type ErrorResponse = | string | { title: string } | { errors: string[] };

// simulate delay
const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));


export const baseQueryWithErrorHandling = async (args: string | FetchArgs, api: BaseQueryApi,
    extraOptions: object) => {
    api.dispatch(startLoading())
    //fake delay only in develop mode
    if (import.meta.env.DEV) await sleep();
    const result = await customBaseQuery(args, api, extraOptions);
    // console.log(result.error)
    api.dispatch(stopLoading());
    if (result.error) {

        // Extract real status code (some parsing errors contain originalStatus)
        const originalStatus = result.error.status === 'PARSING_ERROR' && result.error.originalStatus
            ? result.error.originalStatus
            : result.error.status
        const responseData = result.error.data as ErrorResponse;
         // Handle various HTTP error statuses
        switch (originalStatus) {
            case 400:
                if (typeof responseData === 'string') toast.error(responseData);
                else if ('errors' in responseData) {
                    throw Object.values(responseData.errors).flat().join(', ')
                }
                else toast.error(responseData.title);
                break;
            case 401:
                if (typeof responseData === 'object' && 'title' in responseData)
                    toast.error(responseData.title)
                break;
            case 403:
                if (typeof responseData === 'object')
                    toast.error('403 Forbidden')
                break;
            case 404:
                if (typeof responseData === 'object' && 'title' in responseData)
                    router.navigate('/not-found')
                break;
            case 500:
                if (typeof responseData === 'object')
                    router.navigate('/server-error', { state: { error: responseData } })
                break;

            default:
                break;
        }
    }
    return result;
}