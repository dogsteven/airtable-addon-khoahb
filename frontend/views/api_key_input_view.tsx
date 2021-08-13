import React, { useEffect, useState } from "react";
import {
    Box, Button, Dialog, FormField, Heading, Input, Loader, Text,
    TextButton,
    useGlobalConfig
} from "@airtable/blocks/ui";
import CassoService from "../services/casso_service";
import appConfig from "../config"
import TextMask from "../utilities/text_mask";
import { useCallback } from "react";
import { useRef } from "react";
import { RouteProperties } from "./app_view";

const ApiKeyInputView: React.FC<RouteProperties> = ({ setRoute }) => {
    const casso = new CassoService();
    const globalConfig = useGlobalConfig();
    const isMounted = useRef(true)

    const [apiKey, setApiKey] = useState((globalConfig.get('apiKey')  ?? "") as string)

    const [isShowDialog, setIsShowDialog] = useState<boolean>(false)
    const [isSigningIn, setIsSigningIn] = useState<boolean>(false)

    useEffect(() => {
        return () => {
          isMounted.current = false
        }
    }, [])

    const signIn = useCallback(async () => {
        if (isMounted.current) {
            setIsSigningIn(true)
        }
        try {
            const response = await casso.getToken(apiKey);
            globalConfig.setAsync('accessToken', response.access_token)
            globalConfig.setAsync('refreshToken', response.refresh_token)
            globalConfig.setAsync('expiresIn', Date.now() + parseInt(response.expires_in) * 1000)
            globalConfig.setAsync('apiKey', apiKey)
            const userInfo = await casso.getUserInfo(response.access_token)
            if (userInfo != null) {
                await globalConfig.setAsync('user', userInfo)
                if (isMounted.current) {
                    setIsSigningIn(false)
                    setRoute('/main-view')
                }
            } 
        } catch (error) {
            if (isMounted.current) {
                setIsShowDialog(true)
            }
        }
        if (isMounted.current) {
            setIsSigningIn(false)
        }
    }, [apiKey])

    return (
        <Box
            paddingLeft="24px"
            paddingRight="24px"
            paddingTop="36px"
            paddingBottom="36px"
            margin="8px"
            justifyItems="center"
            display="flex"
            flexDirection="column"
            alignSelf="center"
            justifySelf="center"
            width="320px"
        >
            <Heading
                size="xxlarge"
                fontWeight="600"
                letterSpacing="1px"
                fontFamily="Nunito Sans"
                alignSelf="center"
                marginBottom="52px"
            >
                <TextMask>
                    BankSheet
                </TextMask>
            </Heading>

            <Text
                fontFamily="Nunito Sans"
                fontSize="14px"
            >
                Vui lòng nhập <span
                    style={{
                        color: appConfig.colors.first
                    }}
                >
                    API Key
                </span> liên kết với <TextMask>
                    <span style={{fontWeight: 600}}>Casso</span>
                </TextMask>
            </Text>

            <Input
                marginTop="8px"
                type="password"
                value={apiKey}
                onChange={(event) => {
                    setApiKey(event.target.value)
                }}
                 
            />

            <Button
                marginTop="8px"
                disabled={apiKey == '' || isSigningIn}
                onClick={signIn}
                style={{
                    backgroundColor: appConfig.colors.first,
                    color: "white"
                }}
            >
                {isSigningIn ? 
                    (
                        <Loader fillColor="white" alignSelf="center" justifySelf="center" marginTop="6px" />
                    ) 
                    : 
                    <Text 
                        textColor="white"
                        fontFamily="Nunito Sans"
                        fontWeight="400"
                        fontSize="15px"
                    >
                        Thiết lập API Key
                    </Text>
                }
            </Button>

            <Text
                marginTop="40px"
                fontFamily="Nunito Sans"
                fontSize="14px"
                fontWeight="600"
                alignSelf="center"
            >
                <a
                    target="_blank"
                    href="https://developer.casso.vn/auth-code/tao-authorization-code-thu-cong"
                    style={{
                        textDecoration: "none",
                        color: appConfig.colors.first
                    }}
                >
                    Hướng dẫn lấy API Key
                </a>
            </Text>
            {isShowDialog && <Dialog
                onClose={() => { setIsShowDialog(false) }}
            >
                <Text
                    fontFamily="Nunito Sans"
                >
                    Sai API Key, vui lòng nhập lại!
                </Text>
            </Dialog>}
        </Box>
    );
}

export default ApiKeyInputView