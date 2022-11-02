import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, notification } from 'antd'
import axios from "axios"
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons"
const { confirm } = Modal;
export default function NewsDraft(props) {

    const [dataSource, setdataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get(`http://localhost:5000/news?author=${username}&auditState=0&_expand=category`).then(res => {
            const list = res.data
            setdataSource(list)
        })
    }, [username])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '新闻标题',
            dataIndex: 'label',
            render: (label, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{label}</a>
            }
        },
        {
            title: '作者',
            dataIndex: "author",

        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: (category) => {
                return category.value
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape='circle' icon={<DeleteOutlined />}
                        onClick={() => {
                            confirmMethod(item)
                        }}
                    ></Button>
                    <Button type="primary" shape='circle' icon={<EditOutlined />}
                        onClick={() => {
                            props.history.push(`/news-manage/update/${item.id}`)
                        }}
                    ></Button>
                    <Button type="primary" shape='circle' icon={<UploadOutlined />}
                        onClick={() => {
                            handleCheck(item.id)
                        }}
                    ></Button>
                </div>
            }
        },

    ]

    const confirmMethod = (item) => {
        confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                setdataSource(dataSource.filter(data => {
                    // 当id 不相同的时候  为true
                    return data.id !== item.id
                })
                )
                axios.delete(`http://localhost:5000/news/${item.id}`)

                // else {
                //     // 先去寻找 点击的 按钮的父级
                //     let list = dataSource.filter(data => data.id === item.rightId)
                //     // 在去儿子中 判断 对应的id 
                //     list[0].children = list[0].children.filter(data => data.id !== item.id)

                //     setdataSource([...dataSource])
                //     axios.delete(`http://localhost:5000/chilren/${item.id}`)
                // }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    const handleCheck = (id) => {
        axios.patch(`http://localhost:5000/news/${id}`, {
            auditState: 1
        }).then(res => {
            props.history.push("/audit-manage/list")
            notification.info({
                message: `通知`,
                description:
                    `您可以到审核列表中查看您的新闻`,
                placement: "bottomRight",
            });
        })
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{
                pageSize: 5
            }} rowKey={item => item.id} />

        </div>
    )
}
