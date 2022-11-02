import React from 'react';
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import { withRouter } from "react-router-dom"
import {
    UserOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
const { Header } = Layout;
const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))
function TopHeader(props) {
    console.log(props);

    const changeCollapsed = () => {
        props.changeCollapsed()
    }
    const menu = (
        <Menu onClick={(e) => {

            if (e.key === "2") {
                localStorage.removeItem("token")
                props.history.replace("/login")
            }
        }}
            items={[
                {
                    key: '1',
                    label: roleName,
                },
                {
                    key: '2',
                    danger: true,
                    label: '退出',
                },
            ]}
        />
    );

    return (
        <Header className="site-layout-background"
            style={{
                padding: '0 16px',
            }}
        >
            {React.createElement(props.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                    className: 'trigger',
                    onClick: () => changeCollapsed(),
                })}
            <div style={{ float: "right" }}>
                <span>欢迎{username}回来</span>
                {/* 下拉菜单的组件 */}
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>

            </div>
        </Header>
    )
}
const mapStateToProps = ({ collapseReducer: { isCollapsed } }) => {
    // console.log(state.collapseReducer.isCollapsed);
    return {
        isCollapsed
    }
}
const mapDispatchToprops = {
    changeCollapsed() {
        return {
            type: "change-collapsed"
        }
    }
}
export default connect(mapStateToProps, mapDispatchToprops)(withRouter(TopHeader)) 
