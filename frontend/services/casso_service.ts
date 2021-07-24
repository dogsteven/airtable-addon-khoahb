import axios, { AxiosRequestConfig } from "axios";
import apiConfig from '../config';

interface AccessTokenSuccessResponse {
    refresh_token: string
    access_token: string
    expires_in: string
}

interface Response<T> {
    error: number
    message: string
    data: T
}

interface ResponseNothing {}

interface UserInfoResponse {
    user: {
        id: number
        email: string
    },
    business: {
        id: number
        name: string 
    },
    bankAccs: Array<
        {
            id: number
            bank: {
                bin: number
                codeName: string
            }
            bankAccountName: any
            bankSubAccId: string
            connectStatus: number
            planStatus: number
        }
    >
}

type AccessTokenResponse = AccessTokenSuccessResponse | Response<ResponseNothing>;

export class CassoService {
    public async getAccessToken(apiKey: string): Promise<AccessTokenResponse> {
        let data = {
            'code': apiKey
        };
        let config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        try {
            let response = await axios.post<AccessTokenResponse>(`${apiConfig.api.dev}/v1/token`, data, config);
            return response.data;
        } catch (error) {
            console.error(error);
            return {
                error: 401,
                message: `${error}`,
                data: null
            };
        }
    }

    public async getUserInfo(accessToken: string): Promise<Response<UserInfoResponse | ResponseNothing>> {
        return null;
    }
}