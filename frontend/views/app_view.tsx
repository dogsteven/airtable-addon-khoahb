import { Box, Dialog, useGlobalConfig } from "@airtable/blocks/ui";
import React, { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import ApiKeyInputView from './api_key_input_view';
import MainView from "./main_view";


export interface RouteProperties {
    route?: string, 
    setRoute?: Dispatch<SetStateAction<string>>,
    setNotificationContent?: Dispatch<SetStateAction<JSX.Element>>
    toggleNotification?: () => void
}

const Router: React.FC<{ router: (route: string) => JSX.Element, route: string }> = ({ router, route, children }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            margin="8px"
        >
            { router(route) }
        </Box>
    );
}

const AppView: React.FC = () => {
    const globalConfig = useGlobalConfig();
    const initialRoute = Date.now() < ((globalConfig.get('expiresIn') ?? 0) as number) ? '/main-view' : '/api-key-input-view'
    const [route, setRoute] = useState(initialRoute);
    const [notificationContent, setNotificationContent] = useState(<div></div>);
    const [isShowNotification, setIsShowNotification] = useState(false);

    const toggleNotification = () => {
        setIsShowNotification(!isShowNotification);
    }

    return (
        <Box>
            <Router
                route={route}
                router={(route: string) => {
                    if (route == '/api-key-input-view') {
                        return <ApiKeyInputView route={route} setRoute={setRoute} setNotificationContent={setNotificationContent} toggleNotification={toggleNotification} />
                    } else if (route == '/main-view') {
                        return <MainView route={route} setRoute={setRoute} setNotificationContent={setNotificationContent} toggleNotification={toggleNotification} />
                    }
                }}
            />
            {isShowNotification && <Dialog
                onClose={ () => setIsShowNotification(false) }
            >
                { notificationContent }
            </Dialog>}
        </Box>
    );
}

export default AppView