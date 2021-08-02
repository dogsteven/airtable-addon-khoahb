import React, { useEffect, useState } from "react"
import {
    Box, Button, Text,
    useBase, useGlobalConfig
} from "@airtable/blocks/ui"
import { RouteProperties } from "./app_view"
import CassoService, { UserInfoData } from "../services/casso_service"
import { useTable, Column, TableOptions } from "react-table"

const MainView: React.FC<RouteProperties> = ({ setRoute }) => {
    const casso = new CassoService()
    const base = useBase()
    const globalConfig = useGlobalConfig()

    const accessToken = globalConfig.get('accessToken') as string
    const user = globalConfig.get('user') as UserInfoData

    return (
        <React.Fragment>

        </React.Fragment>
    );
}

export default MainView