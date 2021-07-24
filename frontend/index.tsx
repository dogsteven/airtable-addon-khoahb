import {
    initializeBlock, useGlobalConfig,
    useBase, useRecords,
    TablePickerSynced
} from '@airtable/blocks/ui';

import React, {
    useState,
    ChangeEventHandler
} from 'react';

import { CassoService } from './services/casso_service';

const App: React.FC = () => {
    const base = useBase();
    const globalConfig = useGlobalConfig();

    const selectedTableId = (globalConfig.get('selectedTableId') ?? '') as string;
    const table = base.getTableByIdIfExists(selectedTableId);

    const record = useRecords(table);

    const [apiKey, setApiKey] = useState("");
    const setStateApiKey: ChangeEventHandler<HTMLInputElement> = (event) => {
        setApiKey(event.target.value);
    }

    const [status, setStatus] = useState("");

    const getAccessTokenHanlder = async () => {
        let data = await (new CassoService()).getAccessToken(apiKey);
        if ('error' in data) {
            setStatus(data.message);
        } else {
            setStatus(data.access_token);
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <TablePickerSynced
                globalConfigKey='selectedTableId'
            />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row'
                }}
            >
                <input value={apiKey} onChange={setStateApiKey} />
                <button
                    onClick={getAccessTokenHanlder}
                >
                    Get Access Token
                </button>
            </div>
            Status: {status}
        </div>
    );
}

initializeBlock(() => <App />);
