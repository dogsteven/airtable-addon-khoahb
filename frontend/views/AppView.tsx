import React, { useEffect, useState } from "react"
import {
    MemoryRouter as Router, Switch as RouterSwitch, Route
} from "react-router-dom"
import MainView from "./MainView"
import SignInView from "./SignInView"
import SplashView from "./SplashView"

import { Provider } from "react-redux"
import { store } from "../store/Store"
import Layout from "antd/lib/layout/layout"
import { ConfigProvider } from "antd"
import appConfig from "../config"
import WindowSizeContext from "../utilities/WindowHook"

const RouterView: React.FC = () => {
    return (
        <Router>
            <Layout
                style={{
                    width: "100vw",
                    height: "100vh",
                    overflow: "hidden"
                }}
                
            >
                <RouterSwitch>
                    <Route exact path='/' component={SplashView} />
                    <Route path='/sign-in' component={SignInView} />
                    <Route path='/main' component={MainView} />
                </RouterSwitch>
            </Layout>
        </Router>
    )
}

const AppView: React.FC = () => {
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })

    useEffect(() => {
        window.addEventListener('resize', (_) => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        })
    }, [])

    return (   
        <WindowSizeContext.Provider value={windowSize}>
            <Provider store={store}>
                <RouterView />
            </Provider>
        </WindowSizeContext.Provider>
    )
}

export default AppView