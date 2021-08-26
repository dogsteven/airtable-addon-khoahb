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
import Layout, { Content } from "antd/lib/layout/layout"
import { Card, Button, Typography, Input, notification, message } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import { useAppDispatch } from "../store/Hook"
import { AppActions } from "../store/app/Slice"


const SignInView: React.FC = () => {
    const isMounted = useRef(true)
    

    useEffect(() => {
        return () => {
            isMounted.current = false
        }
    }, [])

    const history = useHistory()
    const globalConfig = useGlobalConfig()
    const dispatch = useAppDispatch()
    const casso = new CassoServices(globalConfig, "live")

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
                    await casso.getToken(apiKey, true)
                    if (isMounted.current) {
                        setIsSending(false)
                        dispatch(AppActions.setTopic("dashboard"))
                        history.replace("/main/dashboard")
                        return
                    }
                } catch (error) {
                    if ('message' in error) {
                        if (isMounted.current) {
                            message.error("Sai APi Key")
                        }
                    } else {
                        if (isMounted.current) {
                            message.error("Lỗi đã xảy ra")
                        }
                    }
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
        <Content
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
                    Nhập API Key liên kết với tài khoản <TextMask>Casso</TextMask>
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
        </Content>
    )
}

export default SignInView