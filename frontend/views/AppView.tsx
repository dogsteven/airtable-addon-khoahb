import React from "react"
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

const RouterView: React.FC = () => {
    return (
        <Router>
            <ConfigProvider>
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
            </ConfigProvider>
        </Router>
    )
}

const AppView: React.FC = () => {
    return (
        <Provider store={store}>
            <RouterView />
        </Provider>
    )
}

export default AppView