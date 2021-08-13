import React, { Dispatch, MouseEventHandler, SetStateAction, useEffect, useState } from "react"
import {
    Box, Button, Dialog, Heading, Icon, Input, loadCSSFromURLAsync, Loader, RecordCardList, SelectButtons, TablePicker, TablePickerSynced, Text, TextButton,
    useBase, useGlobalConfig, useRecords
} from "@airtable/blocks/ui"
import CassoService, { TransactionData, UserInfoData } from "../services/casso_service"
import { useMemo } from "react"
import { toTwoDigits, parseDateString} from "../utilities/date_utilities"
import TableWriter from "../utilities/table_writer"
import appConfig from '../config'
import { borderRadius, boxShadow } from "@airtable/blocks/dist/types/src/ui/system"
import { useRef } from "react"
import { RouteProperties } from "./app_view"
import { useCallback } from "react"

const MainView: React.FC<RouteProperties> = ({ setRoute }) => {
    const globalConfig = useGlobalConfig()
    const user = globalConfig.get('user') as UserInfoData

    const isMounted = useRef(true)

    useEffect(() => {
        return () => {
            isMounted.current = false
        }
    }, [])

    const signOut = useCallback(() => {
        globalConfig.setAsync('accessToken', null)
        globalConfig.setAsync('refreshToken', null)
        globalConfig.setAsync('expiresIn', null)
        globalConfig.setAsync('user', null)
        if (isMounted.current) {
            setRoute('/api-key-input-view')
        }
    }, [])

    const [transactions, setTransactions] = useState<TransactionData<number>[]>([])
    const [isShowGetTransationsDialog, setIsShowGetTransactionsDialog] = useState<boolean>(false)
    const [isShowWriteTransactionsDialog, setIsShowWriteTransactionsDialog] = useState<boolean>(false)

    return (
        <Box
            display="flex"
            flexDirection="column"
        >
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                padding="8px"
                boxShadow="0px 0px 1px #CCCCCC"
            >
                <Box
                     display="flex"
                     flexDirection="row"
                     alignItems="center"
                >
                    <Text
                        width="42px"
                        height="42px"
                        display="flex"
                        fontFamily="Nunito"
                        justifyContent="center"
                        alignItems="center"
                        textColor={appConfig.colors.first}
                        fontSize="28px"
                        fontWeight="600"
                        backgroundColor="white"
                        boxShadow="0px 0px 2px #CCCCCC"
                        borderRadius="4px"
                    >
                        {user.business.name[0]}
                    </Text>

                    <Text
                        marginLeft="8px"
                        fontFamily="Nunito"
                    >
                        {user.business.name}
                    </Text>
                </Box>

                <TextButton
                    paddingRight="8px"
                    onClick={signOut}
                    style={{
                        fontFamily: "Nunito Sans",
                        fontWeight: 400,
                        color: "red"
                    }}
                >
                    Thoát
                </TextButton>
            </Box>

            <Box
                display="flex"
                flexDirection="column"
                margin="8px"
            >
                <Button
                    onClick={() => {
                        setIsShowGetTransactionsDialog(true)
                    }}
                    style={{
                        backgroundColor: appConfig.colors.first,
                        fontFamily: "Nunito Sans",
                        fontSize: "15px",
                        color: "white",
                        fontWeight: 400
                    }}
                >
                    Lấy thông tin giao dịch
                </Button>

                <Button
                    marginTop="8px"
                    disabled={transactions.length == 0}
                    onClick={() => {
                        setIsShowWriteTransactionsDialog(true)
                    }}
                    style={{
                        backgroundColor: appConfig.colors.first,
                        fontFamily: "Nunito Sans",
                        fontSize: "15px",
                        color: "white",
                        fontWeight: 400
                    }}
                >
                    Đưa thông tin giao dịch ra bảng tính
                </Button>

                <Button
                    marginTop="8px"
                    onClick={() => {
                        
                    }}
                    style={{
                        backgroundColor: appConfig.colors.first,
                        fontFamily: "Nunito Sans",
                        fontSize: "15px",
                        color: "white",
                        fontWeight: 400
                    }}
                >
                    Đồng bộ giao dịch
                </Button>
            </Box>


            {isShowGetTransationsDialog && <Dialog onClose={() => {setIsShowGetTransactionsDialog(false)}}>
                <GetTransactionsDialogContent hideDialog={() => {setIsShowGetTransactionsDialog(false)}} setTransactions={setTransactions} />
            </Dialog>}

            {isShowWriteTransactionsDialog && <Dialog onClose={() => {setIsShowWriteTransactionsDialog(false)}}>
                <WriteTransactionDialog transactions={transactions} hideDialog={() => {setIsShowWriteTransactionsDialog(false)}} />
            </Dialog>}
        </Box>
    );
}

const GetTransactionsDialogContent: React.FC<{hideDialog: () => void, setTransactions: Dispatch<SetStateAction<TransactionData<number>[]>>}> = ({ hideDialog, setTransactions }) => {
    const globalConfig = useGlobalConfig()
    const casso = new CassoService()

    const accessToken = globalConfig.get('accessToken') as string

    const prevWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const [date, setDate] = useState({
        day: prevWeek.getDate(),
        month: prevWeek.getMonth(),
        year: prevWeek.getFullYear()
    })

    const isMounted = useRef(true)

    useEffect(() => {
        return () => {
            isMounted.current = false
        }
    }, [])

    const getTransactions = useCallback(async () => {
        if (isMounted.current) {
            setIsLoading(true)
        }
        const response = await casso.getAllTransactions(accessToken, date)
        if (isMounted.current) {
            setTransactions(response)
            setIsLoading(false)
            hideDialog()
        }
    }, [date.day, date.month, date.year, accessToken])

    const [isLoading, setIsLoading] = useState<boolean>(false)

    return (
        <Box
            display="flex"
            flexDirection="column"
        >
            <Text
                fontFamily="Nunito Sans"
                fontSize="14px"
                marginBottom="8px"
            >
                Vui lòng chọn ngày cần lấy giao dịch
            </Text>

            <Input
                type="date" 
                value={`${date.year}-${toTwoDigits(date.month)}-${toTwoDigits(date.day)}`} 
                onChange={({target}) => {
                    const value = target.value
                    setDate({
                        year: parseInt(value.slice(0, 4)),
                        month: parseInt(value.slice(5, 7)),
                        day: parseInt(value.slice(8, 11))
                    })
                }}
                style={{
                    backgroundColor: appConfig.colors.first,
                    color: "white",
                }}
                marginBottom="8px"
            />

            <Button
                style={{
                    backgroundColor: appConfig.colors.first,
                    color: "white",
                    fontFamily: "Nunito Sans",
                    fontSize: "14px",
                    fontWeight: 400
                }}
                onClick={getTransactions}
            >
                {isLoading ?
                    <Loader fillColor="white" alignSelf="center" justifySelf="center" marginTop="6px" /> 
                    : `Lấy thông tin giao dịch từ ${date.day}/${date.month}/${date.year}`
                }
            </Button>
        </Box>
    )
}

const WriteTransactionDialog: React.FC<{hideDialog: () => void, transactions: TransactionData<number>[]}> = ({ hideDialog, transactions }) => {
    const base = useBase()
    const globalConfig = useGlobalConfig()
    const writer = new TableWriter(base)
    const isMounted = useRef(true)

    useEffect(() => {
        return () => {
            isMounted.current = false
        }
    }, [])

    const options = useMemo(() => {
        return [
            { value: true, label: "Bảng tính mới" },
            { value: false, label: "Chọn bảng tính" }
        ]
    }, [])

    const [isNew, setIsNew] = useState<boolean>(true)
    const [newTableName, setNewTableName] = useState("")
    const [isWritting, setIsWritting] = useState<boolean>(false)

    const selectedTableId = (globalConfig.get('selectedTableId') ?? "") as string
    const selectedTable = base.getTableByIdIfExists(selectedTableId)

    const createNewTable = useCallback(async () => {
        if (isWritting) return
        setIsWritting(true)
        await writer.writeTransactionsToANewTable(newTableName, transactions)
        if (isMounted.current) {
            hideDialog()
        }
    }, [newTableName, transactions, isWritting])

    const writeToExistingTable = useCallback(async () => {
        if (isWritting) return
        setIsWritting(true)
        await writer.writeTransactionsToAnExistingTable(selectedTable, transactions)
        if (isMounted.current) {
            hideDialog()
        }
    }, [selectedTableId, selectedTableId, isWritting, transactions])

    return (
        <Box
            display="flex"
            flexDirection="column"
        >
            <SelectButtons
                value={isNew}
                onChange={(newValue: boolean) => {
                    console.log(newValue)
                    setIsNew(newValue)
                }}
                options={options}
                style={{
                    backgroundColor: "white",
                    color: appConfig.colors.first,
                    fontFamily: "Nunito Sans",
                    fontWeight: 400
                }}
                marginBottom="8px"
            />

            {isNew && <React.Fragment>
                <Input
                    type="text"
                    placeholder="Nhập tên bảng tính"
                    value={newTableName}
                    onChange={({target}) => { setNewTableName(target.value) }}
                    marginBottom="8px"
                    style={{
                        fontFamily: "Nunito Sans"
                    }}
                />
                <Button
                    style={{
                        backgroundColor: appConfig.colors.first,
                        fontFamily: "Nunito Sans",
                        color: "white"
                    }}
                    onClick={createNewTable}
                >
                    {`Ghi vào bảng tính ${newTableName}`}
                </Button>
            </React.Fragment>}

            {(isNew == false) && <React.Fragment>
                <TablePickerSynced
                    globalConfigKey="selectedTableId"
                    marginBottom="8px"
                />

                <Button
                    style={{
                        backgroundColor: appConfig.colors.first,
                        fontFamily: "Nunito Sans",
                        color: "white"
                    }}
                    onClick={writeToExistingTable}
                    
                >
                    {`Ghi vào bảng tính ${newTableName}`}
                </Button>
            </React.Fragment>}
        </Box>
    )
}

export default MainView