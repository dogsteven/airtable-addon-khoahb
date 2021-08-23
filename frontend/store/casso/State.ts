import { TransactionData } from "../../Services/CassoService"

export default interface CassoStoreState {
    lastDate: number
    transactions: TransactionData<number>[]
}