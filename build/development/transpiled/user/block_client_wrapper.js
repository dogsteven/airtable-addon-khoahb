
var ReactDOM = require('react-dom');
var React = require('react');
var ReactDOMServer = require('react-dom/server');

window['_airtableReact'] = React;
window['_airtableReactDOM'] = ReactDOM;
window['_airtableReactDOMServer'] = ReactDOMServer;
window['_airtableBlockCodeVersion'] = 'cd31ca9aa1d1b64b6f07b2da057532d8316f4d4b';
var didRun = false;
window['_airtableRunBlock'] = function runBlock() {
    if (didRun) {
        console.log('Refusing to re-run block');
        return;
    }
    didRun = true;
    
        var blockUrl = process.env.BLOCK_BASE_URL;

        // Make requests to local backend.
        var baseTag = document.createElement('base');
        baseTag.setAttribute('href', blockUrl);
        document.head.appendChild(baseTag);
        
    // Requiring the entry point file runs user code. Be sure to do any setup
    // above this line.
    var EntryComponent = require("/Users/khoahuynhbach/Airtable/airtable-addon-khoahb/build/development/transpiled/user/frontend/index.js").default;

    var isEntryReactComponent = EntryComponent && (
        EntryComponent.prototype instanceof React.Component ||
        EntryComponent instanceof Function
    );
    if (isEntryReactComponent) {
    console.log(`
************************************************
** DEPRECATION WARNING: USING OLD ENTRY POINT **
************************************************
`)
        var container = document.createElement('div');
        var BlockWrapperComponent = window['_airtableBlockSdk'].__BlockWrapperComponent;
        document.body.appendChild(container);
        ReactDOM.render(React.createElement(BlockWrapperComponent, {
            EntryComponent: EntryComponent,
        }), container);
    }
};
