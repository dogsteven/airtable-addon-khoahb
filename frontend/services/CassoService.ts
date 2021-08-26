import GlobalConfig from "@airtable/blocks/dist/types/src/global_config";
import { GlobalConfigObject, GlobalConfigValue } from "@airtable/blocks/dist/types/src/types/global_config";
import { notification } from "antd";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import appConfig from '../config';
import { toTwoDigits } from "../utilities/DateUtilities";
import URI from "../utilities/UriBuilder";

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

export function TransactionSorter(left: TransactionData<number>, right: TransactionData<number>): number {
    if (left.when < right.when) {
        return 1
    } else if (left.when == right.when) {
        return 0
    } else {
        return -1
    }
}


export default class CassoServices {
    host: string
    globalConfig: GlobalConfig

    private expiresIn(): number {
        return this.globalConfig.get("expiresIn") as number
    }

    constructor(globalConfig: GlobalConfig, mode: "dev" | "live" = "live") {
        this.globalConfig = globalConfig
        this.host = appConfig.api[mode]
    }

    public async getToken(apiKey: string, getProfile: boolean = false): Promise<void> {
        const config: AxiosRequestConfig = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        const data = {
            "code": apiKey
        }
        const response = (await axios.post<AccessTokenSuccess | CassoResponse<null>>(`${this.host}/v1/token`, data, config)).data
        if ('access_token' in response) {
            const [user, ] = await Promise.all([
                this.getUserInfo(response.access_token),
                this.globalConfig.setAsync("apiKey", apiKey),
                this.globalConfig.setAsync("accessToken", response.access_token),
                this.globalConfig.setAsync("refreshToken", response.refresh_token),
                this.globalConfig.setAsync("expiresIn", parseInt(response.expires_in) * 1000 + Date.now())
            ])
            await this.globalConfig.setAsync("user", user)
        }
    }
    
    public async getUserInfo(accessToken: string): Promise<UserInfoData> {
        const config: AxiosRequestConfig = {
            headers: {
                "Authorization": accessToken
            }
        }
        const response = await axios.get<CassoResponse<UserInfoData>>(`${this.host}/v1/userInfo`, config)
        return response.data.data
    }

    public async getTransactions(fromDate?: { day: number, month: number, year: number }, page?: number, pageSize?: number): Promise<TransactionsPageData<number>> {
        if (this.globalConfig.get("accessToken") == null) {
            return null
        }

        const apiKey = this.globalConfig.get("apiKey") as string

        if (Date.now() > this.expiresIn() + 60000) {
            await this.getToken(apiKey)
        }

        const accessToken = this.globalConfig.get("accessToken") as string

        const config: AxiosRequestConfig = {
            headers: {
                "Authorization": accessToken,
            }
        }

        const dateString = fromDate != null ? `${fromDate.year}-${toTwoDigits(fromDate.month)}-${toTwoDigits(fromDate.day)}` : null

        const uri = URI().withPath(`${this.host}/v1/transactions`).withQuery('fromDate', dateString).withQuery('page', page).withQuery('pageSize', pageSize).absolute

        const response = await axios.get<CassoResponse<TransactionsPageData<string>>>(uri, config)

        if (response.data.data != null) {
            const newRecords = response.data.data.records.map((record) => ({
                id: record.id,
                tid: record.tid,
                description: record.description,
                amount: record.amount,
                bankSubAccId: record.bankSubAccId,
                cusumBalance: record.cusumBalance,
                when: Date.parse(record.when)
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

    public async getAllTransactions(fromDate: { day: number, month: number, year: number } = null): Promise<TransactionData<number>[]> {
        const firstResponse = await this.getTransactions(fromDate);
        if (firstResponse != null) {
            const totalPages = firstResponse.totalPages;
            const restResponse = await Promise.all(Array.from({ length: totalPages - 1 }).map((_, index) => this.getTransactions(fromDate, index + 2)))
            return restResponse.map(({records}) => records).reduce((acc, e) => acc.concat(e), firstResponse.records)
        }
        return null
    }

    public async syncBankAccount(id: string): Promise<CassoResponse<null>> {
        if (this.globalConfig.get("accessToken") == null) {
            return null
        }

        const apiKey = this.globalConfig.get("apiKey") as string

        if (Date.now() > this.expiresIn() + 60000) {
            await this.getToken(apiKey)
        }

        const accessToken = this.globalConfig.get("accessToken") as string
        const data = {
            "bank_acc_id": id
        }
        const config: AxiosRequestConfig = {
            headers: {
                "Authorization": accessToken,
                "Cotennt-type": "application/json"
            }
        }
        try {
            const response = await axios.post<CassoResponse<null>>(`${this.host}/v1/sync`, data, config)
            console.log(response)
            return response.data
        } catch (error) {
            console.error(error)
            return {
                error: -1,
                message: error,
                data: null
            }
        }
    }
}