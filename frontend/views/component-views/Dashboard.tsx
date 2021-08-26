import React, {} from "react"
import {  useBase, useGlobalConfig } from "@airtable/blocks/ui"
import { useHistory, useRouteMatch } from "react-router-dom"
import { useRef } from "react"
import { useEffect } from "react"
import CassoServices, { BankAccount, UserInfoData } from "../../Services/CassoService"
import { useAppDispatch, useAppSelector } from "../../store/Hook"
import { CassoActions } from "../../store/casso/Slice"
import useWindowSize from "../../utilities/WindowHook"
import appConfig from "../../config"
import { AppActions } from "../../Store/app/Slice"
import Layout from "antd/lib/layout/layout"
import { Card, DatePicker, Space, Select, Typography, Button, Input , Modal, Row, Col, Collapse, message } from "antd"
import moment from "moment"
import { useState } from "react"
import { useCallback } from "react"
import TableWriter from "../../utilities/TableWriter"
import { uniq } from "lodash"

const Dashboard: React.FC = () => {
    const isMounted = useRef(true)

    useEffect(() => {
        return () => {
            isMounted.current = false
        }
    }, [])


    const base = useBase()
    const tables = base.tables
    const writer = new TableWriter(base)
    const globalConfig = useGlobalConfig()
    const history = useHistory()
    const casso = new CassoServices(globalConfig, "live")
    const dispatch = useAppDispatch()
    const transactions = useAppSelector(state => state.casso.transactions)

    const minimumDate = useAppSelector(state => new Date(state.casso.lastDate))
    const maximumDate = moment().endOf('day').toDate()

    const apiKey = globalConfig.get("apiKey") as string
    const accessToken = globalConfig.get("accessToken") as string
    const expiresIn = globalConfig.get("expiresIn") as number
    const user = globalConfig.get("user") as UserInfoData


    useEffect(() => {
        dispatch(CassoActions.getAllTransactions({
            casso: casso,
        }))
    }, [])

    const [selectedDate, setSelectedDate] = useState(moment().subtract(7, 'days'))

    const [isGettingTransactions, setIsGettingTransactions] = useState(false)

    const getTransactions = useCallback(async () => {
        if (isGettingTransactions) {
            return
        }
        const fromDate = {
            day: selectedDate.date(),
            month: selectedDate.month() + 1,
            year: selectedDate.year()
        }
        if (isMounted.current) {
            setIsGettingTransactions(true)
        }
        try {
            await dispatch(CassoActions.getAllTransactions({
                casso: casso,
                fromDate: fromDate
            })).unwrap()
            if (isMounted.current) {
                setIsGettingTransactions(false)
                message.success("Lấy thông tin giao dịch thành công")
            }
        } catch (error) {
            if (isMounted.current) {
                setIsGettingTransactions(false)
                message.error("Lỗi đã xảy ra")
            }
        }
    }, [isGettingTransactions, selectedDate.day(), selectedDate.month(), selectedDate.year(), minimumDate, maximumDate])

    const [writingMethod, setWritingMethod] = useState<"newTable" | "existingTable">("newTable")

    const [selectedTableId, setSelectedTableId] = useState("none")

    const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment]>([moment().subtract(7, 'days'), moment()])
    const [startDate, endDate] = dateRange

    const [newTableName, setNewTableName] = useState("")

    const [isWriting, setIsWriting] = useState(false)

    const writeToTable = useCallback(async () => {
        if (isWriting) {
            return
        }
        if (isMounted.current) {
            setIsWriting(true)
        }

        const selectedTransactions = transactions.filter(({when}) => {
            const date = new Date(when)
            
            return date > startDate.clone().subtract(1, 'days').toDate() && date < endDate.clone().add(1, 'days').toDate()
        })

        try {
            if (writingMethod == "newTable") {
                await writer.writeTransactionsToANewTable(newTableName, selectedTransactions)
            } else {
                await writer.writeTransactionsToAnExistingTable(base.getTableById(selectedTableId), selectedTransactions)

            }
            message.success("Ghi thông tin giao dịch vào bảng thành công")
        } catch (error) {
            message.success("Ghi thông tin giao dịch vào bảng không thành công")
        }

        if (isMounted.current) {
            setIsWriting(false)
        }
    }, [isWriting, selectedTableId, newTableName, transactions, minimumDate, maximumDate])

    const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
    const [isSyncing, setIsSyncing] = useState(false)

    const syncBankAccount = useCallback(async () => {
        if (isSyncing) {
            return
        }
        if (isMounted.current) {
            setIsSyncing(true)
        }
        try { 
            await casso.syncBankAccount(selectedAccount)
            message.success("Đồng bộ thành công")
        } catch (error) {
            message.error("Đồng bộ thất bại")
        }
        if (isMounted.current) {
            setIsSyncing(false)
        }
    }, [selectedAccount])

    return (
        <Space
            wrap
            style={{
                padding: "8px",
                fontFamily: appConfig.fonts.nunito.sans
            }}
            align="start"
        >
            <Card
                title="Lấy thông tin giao dịch"
                
                style={{
                    width: "340px",
                    fontFamily: appConfig.fonts.nunito.sans
                }}

                extra={(
                    <Select
                        defaultValue="7days"
                        onChange={(value) => {
                            if (value == "7days") {
                                setSelectedDate(moment().subtract(7, 'days'))
                            } else if (value == "1month") {
                                setSelectedDate(moment().subtract(1, 'months'))
                            } else if (value =="1year") {
                                setSelectedDate(moment().subtract(1, 'years'))
                            }
                        }}
                        style={{
                            fontFamily: appConfig.fonts.nunito.sans
                        }}
                    >
                        <Select.Option value="7days" style={{fontFamily: appConfig.fonts.nunito.sans}}>
                            7 ngày
                        </Select.Option>
                        <Select.Option value="1month" style={{fontFamily: appConfig.fonts.nunito.sans}}>
                            Một tháng
                        </Select.Option>
                        <Select.Option value="1year" style={{fontFamily: appConfig.fonts.nunito.sans}}>
                            Một năm
                        </Select.Option>
                    </Select>
                )}
            >
                <Typography.Text>Chọn ngày bắt đầu lấy giao dịch:</Typography.Text>
                <DatePicker value={selectedDate}
                    style={{
                        width: "100%",
                        marginBottom: "8px"
                    }}
                    format="DD-MM-YYYY"
                />
                <Button
                    disabled={isGettingTransactions}
                    loading={isGettingTransactions}
                    onClick={getTransactions}
                    style={{
                        fontFamily: appConfig.fonts.nunito.sans,
                        width: "100%"
                    }}
                    type="primary"
                >
                    { isGettingTransactions ? `Đang lấy thông tin giao dịch` : `Lấy thông tin giao dịch`}
                </Button>
            </Card>

            <Card
                title="Đưa thông tin giao dịch ra bảng tính"
                
                style={{
                    width: "340px",
                    fontFamily: appConfig.fonts.nunito.sans
                }}

                tabList={[
                    {
                        key: "newTable",
                        tab: <Typography.Text style={{fontFamily: appConfig.fonts.nunito.sans}}>Bảng tính mới</Typography.Text>
                    },
                    {
                        key: "existingTable",
                        tab: <Typography.Text style={{fontFamily: appConfig.fonts.nunito.sans}}>Bảng tính có sẵn</Typography.Text>
                    }
                ]}

                onTabChange={(value: "newTable" | "existingTable") => {
                    setWritingMethod(value)
                }}
            >
                {writingMethod == "existingTable" &&
                    (
                        <Select
                            defaultValue="none"
                            value={selectedTableId}
                            onChange={(value) => {
                                setSelectedTableId(value)
                            }}
                            style={{
                                width: "100%",
                                fontFamily: appConfig.fonts.nunito.sans
                            }}
                        >
                            <Select.Option value="none" disabled style={{fontFamily: appConfig.fonts.nunito.sans}}>
                                Chọn một bảng tính...
                            </Select.Option>
                            {tables.map((table) => {
                                return (
                                    <Select.Option value={table.id} key={table.id} style={{fontFamily: appConfig.fonts.nunito.sans}}>
                                        {table.name}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    )
                }

                {writingMethod == "newTable" &&
                    (
                        <Input 
                            value={newTableName} 
                            onChange={({ target: { value } }) => {
                                setNewTableName(value)
                            }}
                            placeholder="Nhập tên bảng tính"
                        />
                    )
                }

                <DatePicker.RangePicker
                    style={{
                        fontFamily: appConfig.fonts.nunito.sans,
                        width: "100%",
                        marginTop: "8px"
                    }}

                    value={dateRange}

                    onChange={(range) => {
                        setDateRange(range)
                    }}

                    allowClear={false}

                    format="DD-MM-YYYY"

                    disabledDate={(currentDate) => {
                        const date = currentDate.toDate()
                        return date < minimumDate || date > maximumDate
                    }}
                />

                <Button
                    disabled={(writingMethod == "existingTable" && selectedTableId == "none" || writingMethod == "newTable" && newTableName == "") || isWriting}
                    loading={isWriting}
                    onClick={writeToTable}
                    style={{
                        fontFamily: appConfig.fonts.nunito.sans,
                        width: "100%",
                        marginTop: "8px"
                    }}
                    type="primary"
                >
                    { isWriting ? `Đang ghi vào bảng tính` : `Ghi vào bảng tính` }
                </Button>

                
            </Card>

            <Card
                title="Đồng bộ tài khoản ngân hàng"
                style={{
                    width: "340px",
                    fontFamily: appConfig.fonts.nunito.sans
                }}
            >
                <Select 
                    style={{
                        fontFamily: appConfig.fonts.nunito.sans,
                        width: "100%",
                    }}
                    placeholder="Chọn một tài khoản"
                    onChange={(value: string) => {
                        setSelectedAccount(value)
                    }}
                >
                    {uniq(user?.bankAccs.map((bankAcc) => bankAcc.bankSubAccId) ?? []).map((subAccId) => {
                        return (
                            <Select.Option value={subAccId} key={subAccId} style={{fontFamily: appConfig.fonts.nunito.sans}}>
                                Tài khoản {subAccId}
                            </Select.Option>
                        )
                    })}
                </Select>
                
                <Button
                    style={{
                        fontFamily: appConfig.fonts.nunito.sans,
                        width: "100%",
                        marginTop: "8px"
                    }}
                    type="primary"
                    onClick={syncBankAccount}
                    loading={isSyncing}
                    disabled={isSyncing || selectedAccount == null}
                >
                    Đồng bộ tài khoản ngân hàng
                </Button>
            </Card>

        </Space>
    )
}

export default Dashboard