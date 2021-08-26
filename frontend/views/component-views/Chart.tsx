import React, { useContext } from "react"
import { Line as LineChart, Bar as BarChart, Column } from "@ant-design/charts"
import { useAppSelector } from "../../store/Hook"
import { uniq, groupBy } from "lodash"
import moment from "moment"
import { Card, DatePicker, Space, Typography, Button } from "antd"
import { Content } from "antd/lib/layout/layout"
import appConfig from "../../config"
import WindowSizeContext from "../../utilities/WindowHook"
import { useState } from "react"
import AreaChart from "@ant-design/charts/es/plots/area"

const ChartView: React.FC = () => {
    const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment]>([moment().subtract(7, 'days'), moment()])
    const [startDate, endDate] = dateRange

    const inRange = (when: number) => {
        const date = new Date(when)
        return date > startDate.clone().subtract(1, 'days').toDate() && date < endDate.clone().add(1, 'days').toDate()
    }

    const [isAccumulated, setIsAccumulated] = useState(true)

    const transactions = useAppSelector((state) => state.casso.transactions.filter(({when}) => inRange(when)))

    const minimumDate = useAppSelector(state => new Date(state.casso.lastDate))
    const maximumDate = moment().endOf('day').toDate()

    const dates = uniq(transactions.map(({when}) => when)).sort()
    const amounts = (() => {
        const grouped = groupBy(transactions, ({when}) => when)
        return dates.map((date) => ({
            date: ((date: number) => {
                return moment.utc(date).format("DD-MM-YYYY")
            })(date),
            amount: Math.round(grouped[date].reduce((acc, {amount}) => acc + amount / 1000000, 0))
        }))
    })()

    const accAmounts = (() => {
        if (amounts.length == 0 || amounts == undefined) {
            return amounts
        }
        var result = [amounts[0]]
        var i = 0
        for (const e of amounts.slice(1)) {
            result.push({
                date: e.date,
                amount: result[i].amount + e.amount
            })

            ++i
        }
        return result
    })()

    const { width, height } = useContext(WindowSizeContext)

    return (
        <Content
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "16px"
            }}
        >
            <Card
                style={{
                    width: "100%",
                    fontFamily: appConfig.fonts.nunito.sans
                }}

                title={(
                    <>
                        Biểu đồ thu - chi
                    </>
                )}

                extra={
                    height > 800
                    &&
                    <Space direction="horizontal">
                        <Button
                            onClick={() => {
                                setIsAccumulated(!isAccumulated)
                            }}
                        >
                            {isAccumulated ? "Hiển thị thu - chi" : "Hiển thị thu - chi tích lũy"}
                        </Button>
                        <DatePicker.RangePicker
                            value={dateRange}

                            onChange={(range) => {
                                setDateRange(range)
                            }}

                            format="DD-MM-YYYY"

                            defaultValue={[moment().subtract(7, 'days'), moment()]}

                            allowClear={false}

                            disabledDate={(currentDate) => {
                                const date = currentDate.toDate()
                                return date < minimumDate || date > maximumDate
                            }}
                        />
                    </Space>
                }
            >
                {height > 800 && 
                <AreaChart
                    height={600}
                    data={isAccumulated ? accAmounts : amounts}
                    xField="date"
                    yField="amount"
                    color={appConfig.colors.first}
                />}

                {height < 800 && <Typography.Text>Vui lòng phóng to ứng dụng!</Typography.Text>}
            </Card>
        </Content>
    )
}

export default ChartView