import { useGlobalConfig } from "@airtable/blocks/ui"
import { blue } from "@ant-design/colors"
import { Button, Card, Input, Typography } from "antd"
import Layout, { Content } from "antd/lib/layout/layout"
import { EllipsisConfig } from "antd/lib/typography/Base"
import React, {
    useState
} from "react"
import { useRef } from "react"
import { useEffect } from "react"
import { useCallback } from "react"
import { useHistory } from "react-router-dom"
import appConfig from '../config'
import TextMask from "../utilities/TextMask"

const SplashView: React.FC = () => {
    const isMounted = useRef(true)

    useEffect(() => {
        return () => {
            isMounted.current = false
        }
    }, [])

    const history = useHistory()
    const globalConfig = useGlobalConfig()
    const expiresIn = (globalConfig.get("expiresIn") ?? 0) as number

    const navigate = () => {
        if (expiresIn < Date.now()) {
            history.replace('/sign-in')
        } else {
            history.replace('/main/dashboard')
        }
    }

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
                style={{
                    width: "424px",
                    overflowWrap: "break-word",
                    whiteSpace: "pre-line",
                    padding: "16px 32px 16px 32px"
                }}
            >
                <Typography.Title
                    level={3}
                    style={{
                        textAlign: "center",
                        marginBottom: "52px"
                    }}
                >
                    Chào mừng các bạn đến với ứng dụng <TextMask>BankSheet</TextMask>
                </Typography.Title>
                
                <Typography.Paragraph
                    style={{
                        textAlign: "center",
                        fontSize: 14,
                        marginBottom: "28px"
                    }}
                >
                    Ứng dụng <TextMask>BankSheet</TextMask> giúp kết nối dữ liệu ngân hàng với sheet của bạn.
                </Typography.Paragraph>

                <Button
                    type="primary"
                    style={{
                        fontSize: 16,
                        width: "100%"
                    }}
                    onClick={navigate}
                >
                    Bắt đầu
                </Button>
            </Card>
        </Content>
    )
}

export default SplashView