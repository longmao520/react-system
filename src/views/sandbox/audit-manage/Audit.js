
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Button, notification } from "antd"
export default function Audit() {
    const [dataSource, setdataSource] = useState([])
    const { roleId, username, region } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        const roleObj = {
            "1": "superman",
            "2": "admin",
            "3": "editor"
        }
        axios.get(`http://localhost:5000/news?auditState=1&_expand=category`).then(res => {

            const list = res.data
            setdataSource(roleObj[roleId] === "superman" ? list : [
                ...list.filter(item => item.author === username),
                ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor")
            ])
        })
    }, [region, roleId, username])
    const columns = [{
        title: '新闻标题',
        dataIndex: 'label',
        render: (label, item) => {
            return <a href={`#/news-manage/preview/${item.id}`}>{label}</a>
        }
    }, {
        title: '作者',
        dataIndex: 'author',
    }, {
        title: '新闻分类',
        dataIndex: 'category',
        render: (category) => {
            return category.label
        }
    },
    {
        title: '操作',
        render: (item) => {
            return <div>
                <Button type='primary' shape='circle' onClick={() => {
                    handleCheck(item, 2, 1)

                }}  >√</Button>
                <Button danger shape='circle' onClick={() => {
                    handleCheck(item, 3, 0)
                }}   >×</Button>
            </div>
        }
    },
    ]
    const handleCheck = (item, auditState, publishState) => {
        // auditState  0   未审核
        //             1   正在审核
        //             2   已通过
        //             3   未通过

        //publishState 0   未发布
        //             1   待发布
        //             2   已发布
        //             3   已下线
        axios.patch(`http://localhost:5000/news/${item.id}`, {
            auditState,
            publishState
        }).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您可以到【审核管理/审核列表】中查看您的新闻状态`,
                placement: "bottomRight",
            });
        })

    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{
                pageSize: 5
            }}
                rowKey={item => item.id}
            />

        </div>
    )
}
