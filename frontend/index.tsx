import {
    initializeBlock, loadCSSFromURLAsync
} from '@airtable/blocks/ui';
import React from 'react';
import LoadGoogleFont, { GoogleFont } from './utilities/GoogleFont'
import AppView from './views/AppView'

import "antd/dist/antd.less"

function run() {
    const fontsLoad = ["Nunito Sans", "Nunito"]
        .map((fontName) => (new GoogleFont(fontName)).withWeight(200).withWeight(300).withWeight(400).withWeight(600).withWeight(700))
        .map(LoadGoogleFont)
    Promise.all(fontsLoad).then(() => {
        initializeBlock(() => <AppView />)
    })
}

run()