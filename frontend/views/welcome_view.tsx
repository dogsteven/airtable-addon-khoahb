import React from "react"
import { Text, Box, Button, Heading, useGlobalConfig } from "@airtable/blocks/ui"
import appConfig from "../config"
import TextMask from "../utilities/text_mask"
import { fontFamily } from "@airtable/blocks/dist/types/src/ui/system"
import { RouteProperties } from "./app_view"

const WelcomeView: React.FC<RouteProperties> = ({ setRoute }) => {
    const globalConfig = useGlobalConfig();
    const initialRoute = Date.now() < ((globalConfig.get('expiresIn') ?? 0) as number) ? '/main-view' : '/api-key-input-view'

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyItems="center"
            alignItems="center"
            justifySelf="center"
            alignSelf="center"
            paddingTop="40px"
        >
            <Heading
                fontFamily="Nunito Sans"
                fontWeight="400"
                size="xlarge"
                textAlign="center"
                marginBottom="56px"
                width="320px"
            >
                Chào mừng bạn đến với ứng dụng <TextMask>
                    <span
                        style={{
                            fontWeight: 600
                        }}
                    >
                        BankSheet
                    </span>
                </TextMask>
            </Heading>

            <Text
                textAlign="center"
                fontFamily="Nunito Sans"
                fontWeight="400"
                size="large"
                marginBottom="28px"
                width="240px"
            >
                Ứng dụng <Wrapper /> giúp bạn kết nối dữ liệu ngân hàng với sheet của bạn.
            </Text>

            <Button
                onClick={() => {
                    setRoute(initialRoute)
                }}
                style={{
                    backgroundColor: appConfig.colors.first,
                    fontFamily: "Nunito Sans",
                    fontSize: "16px",
                    color: "white",
                }}
                width="260px"
            >
                Bắt đầu
            </Button>
        </Box>
    )
}

const Wrapper: React.FC = () => <TextMask>BankSheet</TextMask>

export default WelcomeView