import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Tree } from "antd"
import axios from 'axios'
import { DeleteOutlined, ExclamationCircleOutlined, EditOutlined } from "@ant-design/icons"
const { confirm } = Modal
export default function RoleList() {
    const [dataSource, setdataSource] = useState([])
    const [righList, setrighList] = useState([])
    const [currentRightList, setcurrentRightList] = useState([])


    const [currentId, setcurrentId] = useState(0)
    useEffect(() => {
        axios.get("http://localhost:5000/roles").then(res => {
            setdataSource(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get("http://localhost:5000/rights?_embed=children").then(res => {
            setrighList(res.data)
        })
    }, [])
    const columns = [{
        title: 'ID',
        dataIndex: 'id',
        render: (id) => {
            return <b>{id}</b>
        }
    },
    {
        title: '角色名称',
        dataIndex: 'roleName',
    },
    {
        title: '操作',
        render: (item) => {
            return <div>
                <Button shape='circle' danger icon={<DeleteOutlined />}
                    onClick={() => {
                        console.log(item)
                        confirmMethod(item)
                    }}
                ></Button>
                <Button type="primary" shape='circle' icon={<EditOutlined />}
                    onClick={() => {
                        //点击的时候出现那个模态框
                        showModal()
                        setcurrentRightList(item.rights)
                        setcurrentId(item.id)
                    }}  ></Button>
            </div>
        }
    },
    ]
    const delteMethod = (item) => {
        //点击删除
        setdataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`http://localhost:5000/roles/${item.id}`)
    }
    const confirmMethod = (item) => {
        // 弹出 确定取消的按钮
        confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                delteMethod(item)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };


    const handleOk = () => {
        setIsModalOpen(false);
        // 点击的时候 同步 更新页面
        setdataSource(dataSource.map(item => {
            if (item.id === currentId) {
                return {
                    ...item,
                    rights: currentRightList
                }
            }
            return item
        }))
        //  后台数据的更新
        axios.patch(`http://localhost:5000/roles/${currentId}`, {
            rights: currentRightList
        })

    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const onCheck = (keys) => {
        console.log(keys);
        setcurrentRightList(keys.checked)
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} />;

            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    treeData={righList}
                    checkStrictly={true}
                    onCheck={onCheck}
                    checkedKeys={currentRightList}
                    fieldNames={{
                        title: "label"
                    }}
                />
            </Modal>
        </div>
    )
}
