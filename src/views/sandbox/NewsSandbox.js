import React, { useEffect } from 'react'

import SideMeau from '../../components/sandbox/SideMeau'
import TopHeader from "../../components/sandbox/TopHeader"

import { Layout } from 'antd';
import Nprogress from "nprogress"
import "nprogress/nprogress.css"
import "./newssandbox.css"
import NewsRouter from '../../components/sandbox/NewsRouter';
const { Content } = Layout;

export default function NewsSandbox() {
    // 进度条
    Nprogress.start()
    useEffect(() => {
        Nprogress.done()
    })
    return (
        <Layout>
            <SideMeau></SideMeau>
            <Layout className="site-layout">
                <TopHeader></TopHeader>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow: "scroll"
                    }}
                >
                    <NewsRouter></NewsRouter>
                </Content>
            </Layout>
        </Layout>
    )
}
