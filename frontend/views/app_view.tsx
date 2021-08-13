import { fontFamily } from "@airtable/blocks/dist/types/src/ui/system";
import { Box, Dialog, loadCSSFromURLAsync, useGlobalConfig } from "@airtable/blocks/ui";
import React, { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import ApiKeyInputView from './api_key_input_view';
import MainView from "./main_view";
import WelcomeView from "./welcome_view";
import { useCallback } from "react";

const AppView: React.FC = () => {
    const [route, setRoute] = useState('/welcome-view');

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                fontFamily: "Nunito Sans"
            }}
        >
            {route == '/welcome-view' && <WelcomeView route={route} setRoute={setRoute}/>}
            {route == '/api-key-input-view' && <ApiKeyInputView route={route} setRoute={setRoute}/>}
            {route == '/main-view' && <MainView route={route} setRoute={setRoute}/>}
        </div>
    );
}

export interface RouteProperties {
    route?: string
    setRoute?: Dispatch<SetStateAction<string>>
}

export default AppView