import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, Button, Tag, notification } from "antd"
export default function AuditList(props) {
    const { username } = JSON.parse(localStorage.getItem("token"))
    const [dataSource, setdataSource] = useState([])
    useEffect(() => {
        axios.get(`http://localhost:5000/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`)
            .then(res => {
                setdataSource(res.data)
            })
    }, [username])
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
        title: '审核状态',
        dataIndex: 'auditState',
        render: (auditState) => {
            const colorLists = ["", "orange", "green", "red"]
            const auditList = ["未审核", "审核中", "已通过", "未通过"]
            return <Tag color={colorLists[auditState]}   >{auditList[auditState]}</Tag>
        }

    }, {
        title: '操作',
        render: (item) => {
            return <div>

                {item.auditState === 1 && <Button type='primary'
                    onClick={() => {
                        handleRevert(item)
                    }}    > 撤销</Button>}
                {item.auditState === 2 && <Button danger
                    onClick={() => {
                        handlePublish(item)
                    }}
                > 发布</Button>}
                {item.auditState === 3 && <Button type='primary'
                    onClick={() => {
                        handleUpdate(item)
                    }}
                > 更新</Button>}


            </div>
        }
    },
    ]

    const handleRevert = (item) => {
        setdataSource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`http://localhost:5000/news/${item.id}`, {
            auditState: 0
        }).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您可以到草稿箱中查看您的新闻`,
                placement: "bottomRight",
            });
        })
    }
    const handleUpdate = (item) => {
        props.history.push(`/news-manage/update/${item.id}`)
    }
    const handlePublish = (item) => {
        axios.patch(`http://localhost:5000/news/${item.id}`, {
            publishState: 2,
            publishTiem: Date.now()
        }).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您可以到【发布管理/已发布】中查看您的新闻`,
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
