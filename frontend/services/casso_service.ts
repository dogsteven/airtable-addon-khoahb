import { GlobalConfigObject, GlobalConfigValue } from "@airtable/blocks/dist/types/src/types/global_config";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import appConfig from '../config';
import URI from "../utilities/uri_builder";

export interface CassoResponse<T extends GlobalConfigObject> {
    error: number,
    message: string,
    data: T | null
}

export interface AccessTokenSuccess extends GlobalConfigObject {
    access_token: string
    refresh_token: string
    expires_in: string
}

export interface BankAccount extends GlobalConfigObject {
    id: number,
    bank: {
        bin: number,
        codeName: string
    },
    bankAccountName?: string,
    bankSubAccId: string,
    balance: number
    memo: string,
    connectStatus: number,
    planStatus: number
}

export interface UserInfoData extends GlobalConfigObject {
    user: {
        id: number,
        email: string
    },
    business: {
        id: number,
        name: string
    },
    bankAccs: BankAccount[]
}

export interface TransactionData<T extends GlobalConfigValue> extends GlobalConfigObject {
    id: number,
    tid: string,
    description: string,
    amount: number,
    bankSubAccId: string,
    cusumBalance: number,
    when: T
}

export interface TransactionsPageData<Time extends GlobalConfigValue> extends GlobalConfigObject {
    page: number,
    pageSize: number,
    nextPage: number,
    prevPage: number,
    totalPages: number,
    totalRecords: number
    records: TransactionData<Time>[]
}



export default class CassoServices {
    public async getToken(apiKey: string): Promise<AccessTokenSuccess> {
        const config: AxiosRequestConfig = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        const data = {
            "code": apiKey
        }
        const response = await axios.post<AccessTokenSuccess | CassoResponse<null>>(`${appConfig.api.live}/v1/token`, data, config)
        if ('access_token' in response.data) {
            return response.data
        } {
            return null
        }
    }
    
    public async getUserInfo(accessToken: string): Promise<UserInfoData> {
        const config: AxiosRequestConfig = {
            headers: {
                "Authorization": accessToken
            }
        }
        const response = await axios.get<CassoResponse<UserInfoData>>(`${appConfig.api.live}/v1/userInfo`, config)
        return response.data.data
    }

    public async getTransactions(accessToken: string, fromDate?: { day: number, month: number, year: number }, page?: number, pageSize?: number): Promise<TransactionsPageData<number>> {
        const config: AxiosRequestConfig = {
            headers: {
                "Authorization": accessToken
            }
        }
        const toTwoDigits = (value: number) => {
            if (value < 10) {
                return `0${value}`
            } else {
                return `${value}`
            }
        }

        const parseDateString = (value: string) => {
            const dateObject = {
                year: parseInt(value.slice(0, 4)),
                month: parseInt(value.slice(5, 7)),
                day: parseInt(value.slice(8, 11))
            }
            return Date.UTC(dateObject.year, dateObject.month, dateObject.day)
        }

        const dateString = fromDate != null ? `${fromDate.year}-${toTwoDigits(fromDate.month)}-${toTwoDigits(fromDate.day)}` : null

        const uri = URI().withPath(`${appConfig.api.live}/v1/transactions`).withQuery('fromDate', dateString).withQuery('page', page).withQuery('pageSize', pageSize).absolute

        const response = await axios.get<CassoResponse<TransactionsPageData<string>>>(uri, config)

        if (response.data.data != null) {
            const newRecords = response.data.data.records.map((record) => ({
                id: record.id,
                tid: record.tid,
                description: record.description,
                amount: record.amount,
                bankSubAccId: record.bankSubAccId,
                cusumBalance: record.cusumBalance,
                when: parseDateString(record.when)
            }) as TransactionData<number>)

            return {
                page: response.data.data.page,
                pageSize: response.data.data.pageSize,
                nextPage: response.data.data.nextPage,
                prevPage: response.data.data.prevPage,
                totalPages: response.data.data.totalPages,
                totalRecords: response.data.data.totolRecords,
                records: newRecords
            } as TransactionsPageData<number>
        } else {
            return null
        }
    }

    public async getAllTransactions(accessToken: string, fromDate: { day: number, month: number, year: number } = null): Promise<TransactionData<number>[]> {
        const firstResponse = await this.getTransactions(accessToken, fromDate);
        if (firstResponse != null) {
            const totalPages = firstResponse.totalPages;
            const restResponse = await Promise.all(Array.from({ length: totalPages - 1 }).map((_, index) => this.getTransactions(accessToken, fromDate, index + 2)))
            return restResponse.map(({records}) => records).reduce((acc, e) => acc.concat(e), firstResponse.records)
        }
        return null
    }
}