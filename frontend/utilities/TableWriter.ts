import { Field, FieldType, Table, Base } from "@airtable/blocks/models";
import { TransactionData } from "../Services/CassoService";

export default class TableWriter {
    static TransactionFields: { name: string, type: FieldType, options?: { [key: string]: unknown } }[] = [
        {
            name: 'Id',
            type: FieldType.NUMBER,
            options: { precision: 0 }
        },
        {
            name: 'Tid',
            type: FieldType.SINGLE_LINE_TEXT
        },
        {
            name: 'Description',
            type: FieldType.SINGLE_LINE_TEXT
        },
        {
            name: 'Amount',
            type: FieldType.NUMBER,
            options: { precision: 0 }
        },
        {
            name: 'Subaccount id',
            type: FieldType.SINGLE_LINE_TEXT
        },
        {
            name: 'Cusum balance',
            type: FieldType.NUMBER,
            options: { precision: 0 }
        },
        {
            name: 'When',
            type: FieldType.DATE,
            options: {
                dateFormat: {
                    name: 'european',
                    format: 'D/M/YYYY'
                }
            }
        }
    ]

    readonly base: Base

    constructor(base: Base) {
        this.base = base
    }

    public async writeTransactionsToAnExistingTable(table: Table, transactions: TransactionData<number>[]): Promise<void> {
        if (table.checkPermissionsForCreateField().hasPermission) {
            const [
                idField,
                tidField,
                descriptionField,
                amountField,
                bankSubAccIdField,
                cusumBalanceField,
                whenField,
            ] = await Promise.all(TableWriter.TransactionFields.map(({ name, type, options }) => {
                return table.getFieldByNameIfExists(name) ?? table.createFieldAsync(name, type, options)
            }))

            const query = await table.selectRecordsAsync()
            await query.loadDataAsync()
            const recordIds = query.records.map((record) => record.getCellValue(idField.name) as number)

            if (table.checkPermissionsForCreateRecords().hasPermission) {
                if (transactions.length > 50) {
                    await table.createRecordsAsync(transactions.slice(0, 50).filter(({ id }) => recordIds.includes(id) == false).map(({ id, tid, description, amount, bankSubAccId, cusumBalance, when }) => {
                        return {
                            fields: {
                                [idField.id]: id,
                                [tidField.id]: tid,
                                [descriptionField.id]: description,
                                [amountField.id]: amount,
                                [bankSubAccIdField.id]: bankSubAccId,
                                [cusumBalanceField.id]: cusumBalance,
                                [whenField.id]: new Date(when)
                            }
                        }
                    }))
                    await this.writeTransactionsToAnExistingTable(table, transactions.slice(50))
                } else {
                    await table.createRecordsAsync(transactions.filter(({ id }) => recordIds.includes(id) == false).map(({ id, tid, description, amount, bankSubAccId, cusumBalance, when }) => {
                        return {
                            fields: {
                                [idField.id]: id,
                                [tidField.id]: tid,
                                [descriptionField.id]: description,
                                [amountField.id]: amount,
                                [bankSubAccIdField.id]: bankSubAccId,
                                [cusumBalanceField.id]: cusumBalance,
                                [whenField.id]: new Date(when)
                            }
                        }
                    }))
                }
            }
        }
    }

    public async writeTransactionsToANewTable(name: string, transactions: TransactionData<number>[]): Promise<void> {
        const table = await this.base.createTableAsync(name, TableWriter.TransactionFields);
        await this.writeTransactionsToAnExistingTable(table, transactions)
    }
}