import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import { withRouter } from "react-router-dom"
import { connect } from 'react-redux';
import axios from "axios"
import "./index.css"
import {

    UserOutlined,

} from '@ant-design/icons';
const { Sider } = Layout;
// 图标 对应的 组件
const iconList = {
    "/home": <UserOutlined />,
    "/user-manage": <UserOutlined />,
    "/user-manage/list": <UserOutlined />,
    "/right-manage": <UserOutlined />,
    "/right-manage/role/list": <UserOutlined />,
    "/right-manage/right/list": <UserOutlined />,
}
function SideMeau(props) {
    console.log(props)
    const [meauList, setMeauList] = useState([])
    useEffect(() => {
        // 请求数据
        axios.get("http://localhost:5000/rights?_embed=children").then(res => {
            console.log(res.data);
            setMeauList(res.data)
        })
    }, [])
    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
    const checkPagePermission = (item) => {

        // 要判断 在 rights中是否 包含 item.key 就是所包含的 权限 
        return item.pagepermisson === 1 && rights.includes(item.key)
    }
    const obj = (key, icon, label, children) => {
        return {
            key,
            icon,
            label,
            children,
        }
    }
    const renderMeau = (meauList) => {
        const arr = []
        meauList.map(item => {
            if (item.children?.length > 0 && checkPagePermission(item)) {
                return arr.push(
                    obj(item.key, iconList[item.key], item.label, renderMeau(item.children))
                )
            }
            else {
                return (
                    checkPagePermission(item) &&
                    arr.push(obj(item.key, iconList[item.key], item.label))
                )
            }
        })
        return arr
    }
    const selectedKey = [props.location.pathname]
    const openKeys = [`/${props.location.pathname.split("/")[1]}`]
    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed} >
            <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
                <div className="logo" >全球新闻发布系统</div>
                <div style={{ flex: 1, "overflow": "auto" }}>
                    <Menu
                        onClick={(e) => {
                            console.log(e.key)
                            props.history.push(e.key)
                        }}
                        theme="dark"
                        mode="inline"
                        selectedKeys={selectedKey}
                        defaultOpenKeys={openKeys}
                        items={renderMeau(meauList)}
                    />
                </div>
            </div>
        </Sider>

    )
}
const mapStateToProps = ({ collapseReducer: { isCollapsed } }) => {
    return {
        isCollapsed
    }
}
export default connect(mapStateToProps)(withRouter(SideMeau))




// [
//     {
//         key: '/home',
//         icon: <UserOutlined />,
//         label: '首页',
//     },
//     {
//         key: '/user-manage',
//         icon: <VideoCameraOutlined />,
//         label: '用户管理',
//         children: [
//             {
//                 key: '/user-manage/list',
//                 icon: <VideoCameraOutlined />,
//                 label: '用户列表',
//             }
//         ]
//     },
//     {
//         key: '/right-manage',
//         icon: <UploadOutlined />,
//         label: '权限管理',
//         children: [{
//             key: '/right-manage/role/list',
//             icon: <UploadOutlined />,
//             label: '角色列表',
//         },
//         {
//             key: '/right-manage/right/list',
//             icon: <UploadOutlined />,
//             label: '权限列表',
//         }
//         ]
//     },
// ]
