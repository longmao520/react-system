import React, { useEffect, useState } from 'react'
import { Button, Table, Tag, Modal, Popover, Switch } from 'antd'
import axios from "axios"
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
const { confirm } = Modal;
export default function RightList() {

    const [dataSource, setdataSource] = useState([])
    useEffect(() => {
        axios.get("http://localhost:5000/rights?_embed=children").then(res => {
            const list = res.data
            list.forEach(element => {
                if (element.children.length === 0) {
                    element.children = ""
                }
            });
            setdataSource(list)
        })
    }, [])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '权限名称',
            dataIndex: 'label',
            key: 'label',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            key: 'key',
            render: (key) => {
                return <Tag color="orange">{key}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape='circle' icon={<DeleteOutlined />}
                        onClick={() => {
                            console.log(item)
                            confirmMethod(item)
                        }}
                    ></Button>
                    <Popover content={<div style={{ textAlign: "center" }}>
                        <Switch checked={item.pagepermisson} onChange={() => {
                            switchMthed(item)
                        }} ></Switch>
                    </div>} title="页面配置项" trigger={item.pagepermisson === undefined ? "" : "click"}>
                        <Button type="primary" shape='circle' icon={<EditOutlined />}
                            disabled={item.pagepermisson === undefined}
                        ></Button>
                    </Popover>
                </div>
            }
        },

    ]
    const switchMthed = (item) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
        setdataSource([...dataSource])
        if (item.grade === 1) {
            axios.patch(`http://localhost:5000/rights/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        }
        else {
            axios.patch(`http://localhost:5000/children/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        }
    }
    const confirmMethod = (item) => {
        confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                //  通过这里进行判断的删除功能
                //先去判断 是否是一级的 情况 
                if (item.grade === 1) {
                    setdataSource(dataSource.filter(data => {
                        // 当id 不相同的时候  为true
                        return data.id !== item.id
                    })
                    )
                    axios.delete(`http://localhost:5000/rights/${item.id}`)
                }
                else {
                    // 先去寻找 点击的 按钮的父级
                    let list = dataSource.filter(data => data.id === item.rightId)
                    // 在去儿子中 判断 对应的id 
                    list[0].children = list[0].children.filter(data => data.id !== item.id)

                    setdataSource([...dataSource])
                    axios.delete(`http://localhost:5000/chilren/${item.id}`)
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{
                pageSize: 5
            }} />

        </div>
    )
}
