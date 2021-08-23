import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import  CassoServices, { TransactionData, TransactionSorter } from "../../Services/CassoService"
import CassoStoreState from "./State";

const initialState: CassoStoreState = {
    lastDate: 0,
    transactions: []
}

export const getAllTransactions = createAsyncThunk(
    'casso/getAllTransactions',
    async ({ accessToken, fromDate }: { accessToken: string, fromDate?: { day: number, month: number, year: number } }, thunkAPI) => {
        
        return await (new CassoServices()).getAllTransactions(accessToken, fromDate)
    }
)

export const storeSlice = createSlice({
    name: "casso",
    initialState: initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getAllTransactions.fulfilled, (state, action) => {
            const indices = state.transactions.map(({id}) => id)
            const transactions = action.payload.filter(({id}) => indices.includes(id) == false)
            state.lastDate = transactions.map(({when}) => when).reduce((acc, e) => e > acc ? e : acc, state.lastDate)
            state.transactions = state.transactions.concat(transactions).sort(TransactionSorter)
        })
    }
})

export const CassoActions = { ...storeSlice.actions, getAllTransactions }

export default storeSlice.reducer
