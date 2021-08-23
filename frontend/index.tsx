import {
    initializeBlock, loadCSSFromURLAsync
} from '@airtable/blocks/ui';
import React from 'react';
import LoadGoogleFont, { GoogleFont } from './utilities/GoogleFont'
import AppView from './views/AppView'

function run() {
    const fontsLoad = ["Nunito Sans", "Nunito"]
        .map((fontName) => (new GoogleFont(fontName)).withWeight(200).withWeight(300).withWeight(400).withWeight(600).withWeight(700))
        .map(LoadGoogleFont)

    const antd = loadCSSFromURLAsync("https://cdnjs.cloudflare.com/ajax/libs/antd/4.16.12/antd.min.css").then(() => {})

    Promise.all(fontsLoad.concat(antd)).then(() => {
        initializeBlock(() => <AppView />)
    })
}

run()