import React, { useEffect, useRef, useState } from 'react'
import { Button, Table, Modal, Switch } from 'antd'
import axios from "axios"
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import UserForm from '../../../components/user-manage/UserForm';

const { confirm } = Modal;

export default function UserList() {
    // 显示整体页面的状态
    const [dataSource, setdataSource] = useState([])
    const [regionsList, setregionsList] = useState([])
    const addForm = useRef(null)
    const updataForm = useRef(null)
    // 更新 
    const [isUpdtaDisabled, setisUpdtaDisabled] = useState(false)

    const [current, setcurrent] = useState(null)
    //  对对象的解构 
    const { roleId, username, region } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        const roleObj = {
            "1": "superman",
            "2": "admin",
            "3": "editor"
        }
        axios.get("http://localhost:5000/users?_expand=role").then(res => {
            const list = res.data
            //判断你是否是 超级管理员 然后 用户列表的显示不同
            // 如果是超级管理员的话 显示所有的list  如果不是超级管理员 
            //要显示自己 并且显示 和我同region(地方的)并且 需要是 区域编辑 
            //   list.filter(item=>{
            //     return item.usename===username
            //   })
            setdataSource(roleObj[roleId] === "superman" ? list : [
                ...list.filter(item => item.username === username),
                ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor")
            ])


        })
    }, [region, roleId, username])
    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                ...regionsList.map(item => ({
                    text: item.label,
                    value: item.value
                })), {
                    text: "全球",
                    value: "全球"
                }
            ],
            onFilter: (value, item) => {
                if (value === "全球") {
                    return item.region === ""
                }
                return item.region === value
            },
            render: (region) => {
                return <b>{region === "" ? "全球" : region}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => {
                return role?.roleName
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',

        }, {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => {
                return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)}   ></Switch>
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
                        // 根据
                        disabled={item.default}
                    ></Button>
                    <Button type="primary" shape='circle' icon={<EditOutlined />}
                        disabled={item.default} onClick={() => handelUpdate(item)}
                    ></Button>

                </div>
            }
        },
    ]
    // 用户状态 改变
    const handleChange = (item) => {
        item.roleState = !item.roleState
        setdataSource([...dataSource])
        axios.patch(`http://localhost:5000/users/${item.id}`, {
            roleState: item.roleState
        })
    }
    /* 更新界面的模态框 */
    const [isUpdate, setisUpdate] = useState(false)
    const handelUpdate = (item) => {
        console.log(item);
        // 点击弹出 模态框
        setisUpdate(true)
        // 要让其同步  变成同步触发
        setTimeout(() => {
            // 放到异步中
            // 要显示老的 内容
            //要判断是不是 超级管理员 即 item.roleId
            updataForm.current.setFieldsValue(item)
            if (item.roleId === 1) {
                setisUpdtaDisabled(true)
            }
            else {
                setisUpdtaDisabled(false)
            }

        }, 0);
        // 你获得的点击的这个 item  也就是你惦记的这个 详细的值
        setcurrent(item)
    }
    const updataFormOk = () => {
        // 更新按钮
        // updataForm.current.validateFields()  form 表单的 方法 返回的是一个 promise 对象
        updataForm.current.validateFields().then(value => {
            console.log(value);
            setisUpdate(false)
            // 设置 显示 
            setdataSource(dataSource.map(item => {
                if (item.id === current.id) {
                    return {
                        ...item,
                        ...value,
                        role: rolesList.filter(data => data.id === value.roleId)[0]
                    }
                }
                return item
            }))
            setisUpdtaDisabled(!isUpdtaDisabled)
            axios.patch(`http://localhost:5000/users/${current.id}`, value)
        })
    }
    const updatehandleCancel = () => {
        setisUpdate(false)
        setisUpdtaDisabled(!isUpdtaDisabled)

    }
    /*   更新界面的模态框 */


    const confirmMethod = (item) => {
        confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                // 删除功能
                deleteMethod(item)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    const deleteMethod = (item) => {
        // 过滤掉 item.id===data.id相同的时候 的 元素
        setdataSource(dataSource.filter(data => {
            return data.id !== item.id
        }))
        // 然后是数据库
        axios.delete(`http://localhost:5000/users/${item.id}`)
    }

    //  关于select 下拉菜单中的 区域的 数据获取

    useEffect(() => {
        axios.get("http://localhost:5000/regions").then(res => {
            setregionsList(res.data)
        })
    }, [])

    // 关于select 下拉菜单中的 角色 的 数据获取
    const [rolesList, setrolesList] = useState([])
    useEffect(() => {
        axios.get("http://localhost:5000/roles").then(res => {
            setrolesList(res.data)
        })
    }, [])

    // 关于 模态框里的函数
    //  弹出框的显示与隐藏
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        // 点击的时候 获取 form 表单 对应的值
        // 
        addFormOk()

    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const addFormOk = () => {
        addForm.current.validateFields().then(value => {
            setIsModalOpen(false);
            // 清空
            addForm.current.resetFields()
            // post 到后端的数据   生成id 再去设置 datasource 为的是方便我们进行 删除和更新
            axios.post(`http://localhost:5000/users`, {
                ...value,
                "roleState": true,
                "default": false,
            }).then(res => {
                setdataSource([...dataSource, {
                    ...res.data,
                    role: rolesList.filter(item => item.id === value.roleId)[0]
                }])
            })

        }).catch(err => {
            console.log(err);
        })
    }
    return (
        <div>
            <Button type='primary' onClick={() => {
                showModal()
            }}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns} pagination={{
                pageSize: 5
            }} />
            {/*  显示的 模态框 然后里面内嵌另一个 form 表单 */}
            <Modal title="添加用户" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} >
                <UserForm regionsList={regionsList} rolesList={rolesList} ref={addForm} ></UserForm>
            </Modal>


            <Modal title="更新用户" okText={"update"} open={isUpdate} onOk={updataFormOk} onCancel={updatehandleCancel} >
                <UserForm regionsList={regionsList} rolesList={rolesList} ref={updataForm}
                    isUpdtaDisabled={isUpdtaDisabled} isUpdate={true}
                ></UserForm>
            </Modal>
        </div>
    )
}
