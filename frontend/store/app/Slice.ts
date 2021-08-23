import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import AppStoreState from "./State"

const initialState: AppStoreState = {
    currentTopic: "dashboard"
}

export const storeSlice = createSlice({
    name: "casso",
    initialState: initialState,
    reducers: {
        setTopic: (state: AppStoreState, action: PayloadAction<string>) => {
            state.currentTopic = action.payload
        }
    },
})

export const AppActions = { ...storeSlice.actions }

export default storeSlice.reducer