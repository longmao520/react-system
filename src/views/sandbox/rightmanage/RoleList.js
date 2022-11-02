import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
const { confirm } = Modal
export default function RoleList() {
    const [dataSource, setdataSource] = useState([])
    // 控制 显示 模态框 显示隐藏
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 显示 所有 所有的权限列表
    const [rightList, setrightList] = useState([])
    //  显示 在每一个 角色列表  对应的 权限列表中的是否被选中
    const [currentRights, setcurrentRights] = useState([])

    const [currentId, setcurrentId] = useState(0)
    useEffect(() => {
        // 显示  角色名称
        axios.get("http://localhost:5000/roles").then(res => {
            setdataSource(res.data)
        })
    }, [])
    useEffect(() => {

        axios.get("http://localhost:5000/rights?_embed=children").then(res => {
            console.log(res.data);

            setrightList(res.data)
        })
    }, [])
    const columns = [
        {
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
            render: (item) => <div>
                <Button danger shape='circle' icon={<DeleteOutlined />}
                    onClick={() => {
                        confirmMethed(item)
                    }}
                ></Button>
                <Button type="primary" shape='circle' icon={<EditOutlined />}
                    onClick={() => {
                        console.log(item)
                        showModal()  //点击显示
                        // 点击后设置 
                        setcurrentRights(item.rights)
                        // 当我们点击按钮的时候  我们就确定了点击的那个id  将id的值 赋值给我们的 currentId 的状态
                        setcurrentId(item.id)
                    }}></Button>
            </div>
        },

    ]
    const delteMethod = (item) => {
        setdataSource(dataSource.filter(data => data.id !== item.id))
        // 后台也要删除数据
        axios.delete(`http://localhost:5000/roles/${item.id}`)

    }
    const confirmMethed = (item) => {
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


    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        console.log(currentRights)
        setIsModalOpen(false);
        // 同步datasource  通过id 的值点击的是哪一个角色 (超级管理员 区域管理员 和 区域编辑)
        //   dataSource 的值 进行 map 映射 
        setdataSource(dataSource.map(item => {
            console.log(item);
            if (item.id === currentId) {
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item
        }))
        // patch 更新数据库中的值 
        axios.patch(`http://localhost:5000/roles/${currentId}`, {
            rights: currentRights
        })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const onCheck = (checkKeys) => {
        console.log(checkKeys);
        setcurrentRights(checkKeys.checked)
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{
                pageSize: 5
            }} rowKey={(item) => item.id} />
            {/*  弹出的模态框   */}
            <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    onCheck={onCheck}
                    treeData={rightList}
                    checkedKeys={currentRights}  //（受控）选中复选框的树节点
                    checkStrictly={true}  // 取消关联
                    fieldNames={{
                        title: "label"
                    }}
                />
            </Modal>
        </div>
    )
}
