import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from "react-router-dom"
import { Spin } from 'antd';
import Home from '../../views/sandbox/home/Home'
import RightList from '../../views/sandbox/rightmanage/RightList'
import RoleList from '../../views/sandbox/rightmanage/RoleList'
import Nopermission from '../../views/sandbox/nopermission/Nopermission'
import UserList from '../../views/sandbox/userlist/UserList'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import axios from 'axios'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'
import { connect } from 'react-redux';
function NewsRouter(props) {
    console.log(props)
    const localRouter = {
        "/home": Home,
        "/user-manage/list": UserList,
        "/right-manage/role/list": RoleList,
        "/right-manage/right/list": RightList,
        "/news-manage/add": NewsAdd,
        "/news-manage/draft": NewsDraft,
        "/news-manage/category": NewsCategory,
        "/news-manage/preview/:id": NewsPreview,
        "/news-manage/update/:id": NewsUpdate,
        "/audit-manage/audit": Audit,
        "/audit-manage/list": AuditList,
        "/publish-manage/unpublished": Unpublished,
        "/publish-manage/published": Published,
        "/publish-manage/sunset": Sunset
    }
    const [backRouterList, setbackRouterList] = useState([])
    useEffect(() => {
        Promise.all([axios.get("http://localhost:5000/rights"),
        axios.get("http://localhost:5000/children")]).then(res => {
            setbackRouterList([...res[0].data, ...res[1].data])
        })

    }, [])
    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
    const checkRoute = (item) => {
        return localRouter[item.key] && (item.pagepermisson || item.routepermisson)
    }
    const checkUserPermission = (item) => {
        return rights.includes(item.key)
    }
    return (

        <Spin spinning={props.isLoading} >
            <Switch>
                {
                    backRouterList.map(item => {

                        if (checkRoute(item) && checkUserPermission(item)) {
                            return <Route path={item.key} key={item.key} component={localRouter[item.key]} exact />
                        }
                        return null
                    }
                    )
                }
                <Route path={"/"} render={() =>
                    <Redirect to={"/home"} />
                } exact />
                {/* 其他授权组件 */}
                {backRouterList.length > 0 ? <Route path={"*"} component={Nopermission} /> : ""}
            </Switch>
        </Spin>

    )
}
const mapStateToProps = ({ loadingReducer: { isLoading } }) => {
    return {
        isLoading
    }
}

export default connect(mapStateToProps)(NewsRouter)

//   {/*  首页 */}
//   <Route path={"/home"} component={Home} />
//   {/*  用户列表组件 */}
//   <Route path={"/user-manage/list"} component={UserList} />
//   {/* 角色列表组件 */}
//   <Route path={"/right-manage/role/list"} component={RoleList} />
//   {/* 权限列表组件 */}
//   <Route path={"/right-manage/right/list"} component={RightList} />
//   {/*  精准定位 */}