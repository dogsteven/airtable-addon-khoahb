import {
    initializeBlock
} from '@airtable/blocks/ui';
import React from 'react';
import LoadGoogleFont, { GoogleFont } from './utilities/google_font';
import AppView from './views/app_view';

function run() {
    Promise.all([
        (new GoogleFont("Nunito Sans")).withWeight(200).withWeight(300).withWeight(400).withWeight(600).withWeight(700),
        (new GoogleFont("Nunito")).withWeight(200).withWeight(300).withWeight(400).withWeight(600).withWeight(700)
    ].map(LoadGoogleFont)).then(() => {
        initializeBlock(() => <AppView />)
    })
}

run()