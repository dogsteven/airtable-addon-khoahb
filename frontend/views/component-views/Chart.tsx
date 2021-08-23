import React from "react"
import { Box } from "@airtable/blocks/ui"
import Chart from "react-apexcharts"
import { ApexOptions } from "apexcharts"
import { useAppSelector } from "../../store/Hook"
import { groupBy, reduce, size, uniq, uniqueId } from "lodash"
import useWindowSize from "../../utilities/WindowHook"
import appConfig from "../../config"
import { blue } from "@ant-design/colors"

const ChartView: React.FC = () => {
    const transactions = useAppSelector((state) => state.casso.transactions)
    const whens = uniq(transactions.map(({when}) => when))
    const groupedTransactions = groupBy(transactions, ({when}) => when)
    const amountByWhens = whens.map((when) => groupedTransactions[when].reduce((acc, {amount}) => acc + amount / 1000000, 0))
    
    const spaceWidth = useWindowSize().width - 40

    const options: ApexOptions = {
        chart: {
            id: "Thu chi",
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            },
        },
        xaxis: {
            type: "datetime"
        },
        tooltip: {
            followCursor: true,
        },
        stroke: {
            width: 2,
            show: true
        },
        colors: [blue.primary],
        markers: {
            size: [4]
        }
    }
    const series = [
        {
            name: "Thu chi",
            data: whens.map((when, index) => ({
                x: new Date(when),
                y: Math.round(amountByWhens[index] * 10) / 10
            }))
        }
    ]

    const chart = transactions.length == 0 ? null : (
        <Chart
            options={options}
            series={series}
            type="line"
            width="100%"
        />
    )
    return (
        <Box>
            {chart}
        </Box>
    )
}

export default ChartView