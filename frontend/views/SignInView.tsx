import { useGlobalConfig } from "@airtable/blocks/ui"
import React, {
    useState
} from "react"
import { useHistory } from "react-router-dom"
import TextMask from "../utilities/TextMask"
import appConfig from "../config"
import { useRef } from "react"
import { useEffect } from "react"
import { useCallback } from "react"
import CassoServices from "../Services/CassoService"
import Layout from "antd/lib/layout/layout"
import { Card, Button, Typography, Input } from "antd"
import { LoadingOutlined } from "@ant-design/icons"


const SignInView: React.FC = () => {
    const isMounted = useRef(true)
    const casso = new CassoServices()

    useEffect(() => {
        return () => {
            isMounted.current = false
        }
    }, [])

    const history = useHistory()
    const globalConfig = useGlobalConfig()

    const [apiKey, setApiKey] = useState((globalConfig.get("apiKey") ?? "") as string)
    const [isSending, setIsSending] = useState(false)

    const signIn = useCallback(async () => {
        if (isSending) {
            return
        } else {
            if (isMounted.current) {
                setIsSending(true)
            }
            if (apiKey != "") {
                try {
                    const accessTokenResponse = await casso.getToken(apiKey)
                    const accessToken = accessTokenResponse.access_token
                    const refreshToken = accessTokenResponse.refresh_token
                    const expiresIn = parseInt(accessTokenResponse.expires_in)
                    const userInfo = await casso.getUserInfo(accessToken)
                    await Promise.all([
                        globalConfig.setAsync("accessToken", accessToken),
                        globalConfig.setAsync("refreshToken", refreshToken),
                        globalConfig.setAsync("expiresIn", Date.now() + expiresIn * 1000),
                        globalConfig.setAsync("user", userInfo)
                    ])
                    if (isMounted.current) {
                        setIsSending(false)
                        history.replace("/main/dashboard")
                        return
                    }
                } catch (error) {
                    console.error(error);
                    if (isMounted.current) {
                        setIsSending(false)
                    }
                }
            }
            if (isMounted.current) {
                setIsSending(false)
            }
        }
    }, [apiKey, isSending])

    return (
        <Layout
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: appConfig.fonts.nunito.sans,
            }}
        >
            <Card
                title={(
                    <Typography.Title
                        level={4}
                    >
                        Xác thực API Key
                    </Typography.Title>
                )}

                extra={(
                    <a
                        href="https://developer.casso.vn/auth-code/tao-authorization-code-thu-cong"

                        target="_blank"
                    >
                        Tìm hiểu thêm
                    </a>
                )}

                style={{
                    width: "380px",
                }}
            >
                <Typography.Text>
                    Nhập API Key liên kết với tài khoản Casso
                </Typography.Text>   
                <Input
                    type="password"

                    value={apiKey} 
                    
                    onChange={({ target: { value } }) => {
                        setApiKey(value)
                    }}

                    style={{
                        marginBottom: "12px"
                    }}
                />

                <Button
                    type="primary"
                    style={{
                        fontSize: 16,
                        width: "100%"
                    }}
                    loading={isSending}
                    disabled={isSending}
                    onClick={signIn}
                >
                    Thiết lập API Key
                </Button>
            </Card>
        </Layout>
    )
}

export default SignInView