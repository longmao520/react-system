import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as echarts from "echarts"
import _ from 'lodash'
const { Meta } = Card;
export default function Home() {
    const [viewList, setViewList] = useState([])
    const [starList, setStarList] = useState([])
    const [open, setOpen] = useState(false);
    const [pieChart, setpieChart] = useState(null)
    const pieRef = useRef(null)
    const [allList, setallList] = useState([])
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get(`http://localhost:5000/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`)
            .then(res => {
                setViewList(res.data)
            })
    }, [])
    useEffect(() => {
        axios.get(`http://localhost:5000/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`)
            .then(res => {
                setStarList(res.data)
            })
    }, [])
    useEffect(() => {
        axios.get(`http://localhost:5000/news?publishState=2&_expand=category`).then(res => {
            console.log(_.groupBy(res.data, item => item.category.label))
            // 数据取完之后 要进行renderBar()
            renderBar(_.groupBy(res.data, item => item.category.label))
            // 将发布的书库获取到 总的
            setallList(res.data)
        })

        return () => {
            window.onresize = null
        }
    }, [])



    // 柱状图 可视化显示
    const renderBar = (obj) => {
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '新闻分类示图'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(obj),
                rotate: "45"
            },
            yAxis: {
                minInterval: 1
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: Object.values(obj).map(item => item.length)
                }
            ]
        };
        myChart.setOption(option);
        window.onresize = function () {
            myChart.resize()
        }
    }
    // 饼状图展示

    const renderPie = () => {
        // 数据处理工作
        /* */
        // 过滤 将 自己发布的过滤出来
        var currentList = allList.filter(item => item.author === username)
        // 
        var groupList = _.groupBy(currentList, item => item.category.label)
        console.log(groupList)
        var list = []
        for (var i in groupList) {
            list.push({
                name: i,
                value: groupList[i].length
            })
        }
        /*  数据处理工作  */
        var myChart
        if (!pieChart) {
            myChart = echarts.init(pieRef.current);
            setpieChart(myChart)
        }
        else {
            myChart = pieChart
        }
        var option;
        option = {
            title: {
                text: '当前用户发布新闻分类',

                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '发布数量',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        option && myChart.setOption(option);
    }

    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true}>
                        <List
                            size="small"
                            dataSource={viewList}
                            renderItem={(item) => <List.Item>
                                <a href={`#/news-manage/preview/${item.id}`}>{item.label}</a>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true}>
                        <List
                            size="small"
                            dataSource={starList}
                            renderItem={(item) => <List.Item>
                                <a href={`#/news-manage/preview/${item.id}`}>{item.label}</a>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={async () => {
                                await showDrawer()
                                await renderPie()
                            }} />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                            title={username}
                            description={
                                <div>
                                    <b>{region ? region : "全球"}</b>
                                    <span style={{ paddingLeft: "30px" }}>{roleName}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            <Drawer width={"500px"} title="个人新闻管理" placement="right" onClose={onClose} open={open}>
                <div ref={pieRef} style={{ height: "400px", width: "100%" }}>

                </div>
            </Drawer>

            <div id="main" style={{ height: "400px", }}>

            </div>
        </div>
    )
}
/*
 <div>
            <button onClick={() => {
                // get 查询数据
                // axios.get("http://localhost:8000/posts").then(res => {
                //     console.log(res.data)
                // })
                //post 增加数据
                // axios.post("http://localhost:8000/posts", {
                //     title: 3333,
                //     author: "long"
                // })
                // put 替换数据
                // patch 更新数据
                // axios.patch("http://localhost:8000/posts/3", {
                //     title: "修改的文件"
                // })
                // // delete 删除
                // axios.delete("http://localhost:8000/posts/4")

            }}>点击获取数据</button>

        </div>
*/