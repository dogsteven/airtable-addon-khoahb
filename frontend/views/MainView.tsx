import { useGlobalConfig } from "@airtable/blocks/ui"
import React, {
    useState
} from "react"
import { useEffect } from "react"
import { useRef } from "react"
import { useCallback } from "react"
import { Link, useHistory, useRouteMatch, Switch as RouterSwitch, Route, Router, useParams, RouteComponentProps } from "react-router-dom"
import useWindowSize from "../utilities/WindowHook"

import appConfig from '../config'
import Dashboard from "./component-views/Dashboard"
import ChartView from "./component-views/Chart"
import { useAppDispatch, useAppSelector } from "../store/Hook"
import { AppActions } from "../Store/app/Slice"
import { AreaChartOutlined, LayoutFilled, LoadingOutlined, LogoutOutlined, PieChartFilled, ProfileFilled, ProfileOutlined, UnorderedListOutlined, UserOutlined } from "@ant-design/icons"
import Layout, { Content, Header } from "antd/lib/layout/layout"
import Sider from "antd/lib/layout/Sider"
import { Affix, Button, Modal, Col, Divider, Menu, Row, Tooltip, Typography, Drawer } from "antd"
import { blue, red } from "@ant-design/colors"
import TextMask from "../utilities/TextMask"
import { CassoActions } from "../store/casso/Slice"
import { UserInfoData } from "../Services/CassoService"

const MainView: React.FC = () => {
    const isMounted = useRef(true)

    useEffect(() => {
        return () => {
            isMounted.current = false
        }
    }, [])

    const history = useHistory()
    const globalConfig = useGlobalConfig()

    const [isSigningOut, setIsSigningOut] = useState(false)

    const signOut = useCallback(async () => {
        if (isSigningOut) {
            return
        }
        if (isMounted.current) {
            setIsSigningOut(true)
        }
        await Promise.all([
            globalConfig.setAsync("accessToken", null),
            globalConfig.setAsync("refreshToken", null),
            globalConfig.setAsync("expiresIn", null),
            globalConfig.setAsync("user", null)
        ])
        if (isMounted.current) {
            setIsSigningOut(false)
            dispatch(CassoActions.clear())
            history.replace('/')
        }
    }, [isSigningOut])

    const user = globalConfig.get("user") as UserInfoData

    const currentTopic = useAppSelector((state) => state.app.currentTopic)
    const dispatch = useAppDispatch()
    
    const [showSignOutModal, setShowSignOutModal] = useState(false)

    const [showProfileModal, setShowProfileModal] = useState(false)

    return (
        <>
            <Sider
                theme="light"
            >
                <Menu 
                    theme="light"
                    mode="vertical"
                    selectedKeys={[currentTopic]}
                >
                    <Menu.Item 
                        key="dashboard"
                        icon={<LayoutFilled />} 
                        onClick={() => {
                            dispatch(AppActions.setTopic("dashboard"))
                            history.replace("/main/dashboard")
                        }}
                    >
                        Dashboard
                    </Menu.Item>

                    <Menu.Item 
                        key="chart"
                        
                        icon={<AreaChartOutlined />} 
                        onClick={() => {
                            dispatch(AppActions.setTopic("chart"))
                            history.replace("/main/chart")
                        }}
                    >
                        Biểu đồ
                    </Menu.Item>

                    <Menu.SubMenu
                        key="user"

                        title="Người dùng"

                        icon={<UserOutlined />}
                    >
                        <Menu.Item 
                            key="profile"

                            icon={<ProfileOutlined />} 

                            onClick={() => {
                                setShowProfileModal(true)
                            }}
                        >
                            Thông tin
                        </Menu.Item>

                        <Menu.Item 
                            key="logout"

                            icon={<LogoutOutlined />} 

                            style={{
                                color: red.primary
                            }}

                            disabled={isSigningOut}

                            onClick={() => {
                                setShowSignOutModal(true)
                            }}
                        >
                            Thoát
                        </Menu.Item>
                    </Menu.SubMenu>
                </Menu>
            </Sider>

            <Content
                style={{
                    overflowY: "scroll"
                }}
            >
                <Route path="/main/dashboard" component={Dashboard} />
                <Route path="/main/chart" component={ChartView} />

                <Modal
                    style={{
                        fontFamily: appConfig.fonts.nunito.sans
                    }}
                    title={"Cảnh báo"}
                    visible={showSignOutModal}
                    onCancel={() => {
                        setShowSignOutModal(false)
                    }}
                    footer={[
                        <Button
                            key="no"
                            type="default"
                            onClick={() => {
                                setShowSignOutModal(false)
                            }}
                        >
                            Không
                        </Button>,
                        <Button
                            key="yes"
                            type="primary"
                            danger
                            onClick={signOut}
                            disabled={isSigningOut}
                            loading={isSigningOut}
                        >
                            Có
                        </Button>
                    ]}
                >
                    Bạn có chắc chắn muốn đăng xuất?
                </Modal>

                <Modal
                    style={{
                        fontFamily: appConfig.fonts.nunito.sans
                    }}

                    title={"Thông tin người dùng"}

                    visible={showProfileModal}

                    onCancel={() => {
                        setShowProfileModal(false)
                    }}

                    footer={[
                        <Button
                            key="yes"
                            type="primary"
                            danger
                            onClick={() => {
                                setShowProfileModal(false)
                            }}
                        >
                            Đóng
                        </Button>
                    ]}
                >
                    <Row>
                        <Col span={8}>
                            Email:
                        </Col>
                        <Col span={16}>
                            {user?.user.email ?? ""}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            Business:
                        </Col>
                        <Col span={16}>
                            {user?.business.name ?? ""}
                        </Col>
                    </Row>
                </Modal>
            </Content>
        </>
    )
}

export default MainView