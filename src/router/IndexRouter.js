import React from 'react'
import { Route, HashRouter, Switch, Redirect } from "react-router-dom"
import Login from '../views/login/Login'
import Detail from '../views/news/Detail'
import News from '../views/news/News'
import NewsSandbox from '../views/sandbox/NewsSandbox'
export default function IndexRouter() {
    return (
        <div>
            <HashRouter >
                <Switch>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/news" component={News}></Route>
                    <Route path="/detail/:id" component={Detail}></Route>
                    <Route path={"/"} render={() =>
                        localStorage.getItem("token") ? <NewsSandbox></NewsSandbox> :
                            <Redirect to="/login" />
                    }></Route>
                </Switch>
            </HashRouter>

        </div>
    )
}
