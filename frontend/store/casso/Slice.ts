import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import  CassoServices, { TransactionData, TransactionSorter } from "../../Services/CassoService"
import CassoStoreState from "./State";

const initialState: CassoStoreState = {
    lastDate: Date.now(),
    transactions: [],
}

export const getAllTransactions = createAsyncThunk(
    'casso/getAllTransactions',
    async ({ casso, fromDate }: { casso: CassoServices, fromDate?: { day: number, month: number, year: number } }, thunkAPI) => {
        return await casso.getAllTransactions(fromDate)
    }
)

export const storeSlice = createSlice({
    name: "casso",
    initialState: initialState,
    reducers: {
        clear: (state) => {
            state.lastDate = Date.now()
            state.transactions = []
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllTransactions.fulfilled, (state, action) => {
            const indices = state.transactions.map(({id}) => id)
            const transactions = action.payload.filter(({id}) => indices.includes(id) == false)
            state.lastDate = transactions.map(({when}) => when).reduce((acc, e) => acc > e ? e : acc, state.lastDate)
            state.transactions = state.transactions.concat(transactions).sort(TransactionSorter)
        })
    }
})

export const CassoActions = { ...storeSlice.actions, getAllTransactions }

export default storeSlice.reducer
