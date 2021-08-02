import React, { useState } from "react";
import {
    Box, Button, Input, Text,
    useGlobalConfig
} from "@airtable/blocks/ui";
import { RouteProperties } from "./app_view";
import CassoService from "../services/casso_service";

const ApiKeyInputView: React.FC<RouteProperties> = ({ setRoute, setNotificationContent, toggleNotification }) => {
    const casso = new CassoService();
    const globalConfig = useGlobalConfig();

    const [apiKey, setApiKey] = useState((globalConfig.get('apiKey')  ?? "") as string);

    return (
        <React.Fragment>
            <Box
                marginBottom="8px"
            >
                <Text
                    fontWeight="bold"
                    fontSize="larger"
                >
                    Welcome to Casso Addon!
                </Text>
            </Box>
            <Input
                value={apiKey}
                onChange={(event) => {
                    const value = event.target.value;
                    setApiKey(value);
                }}
                marginBottom="8px"
                placeholder="Enter api key here"
            />
            <Button
                disabled={apiKey == ''}
                onClick={async () => {
                    const response = await casso.getToken(apiKey);
                    if (response != null) {
                        globalConfig.setAsync('accessToken', response.access_token);
                        globalConfig.setAsync('refreshToken', response.refresh_token);
                        globalConfig.setAsync('expiresIn', Date.now() + parseInt(response.expires_in) * 1000);
                        globalConfig.setAsync('apiKey', apiKey);
                        const userInfo = await casso.getUserInfo(response.access_token);
                        if (userInfo.data != null) {
                            globalConfig.setAsync('user', userInfo.data);
                        }
                        setRoute('/main-view');
                    } else {
                        setNotificationContent(
                            <Box>
                                Wrong api key! Please try again!
                            </Box>
                        );
                        toggleNotification();
                    }
                }}
                style={{
                    backgroundColor: "green",
                    color: "white"
                }}
            >
                Get access token
            </Button>
        </React.Fragment>
    );
}

export default ApiKeyInputView