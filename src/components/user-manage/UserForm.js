import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd'
const { Option } = Select;
const UserForm = forwardRef((props, ref) => {
    const [isDisabled, setisDisabled] = useState(false)
    useEffect(() => {
        setisDisabled(props.isUpdtaDisabled)
    }, [props.isUpdtaDisabled])

    const roleObj = {
        "1": "superman",
        "2": "admin",
        "3": "editor"
    }
    const { roleId, region } = JSON.parse(localStorage.getItem("token"))
    // 对于 区域的添加 和更新 时 的判断 
    const checkRegionDisabled = (item) => {
        if (props.isUpdate) {
            // 更新  鉴定权限 
            if (roleObj[roleId] === "superman") {
                return false
            }
            else {
                return true
            }
        }
        else {
            //添加时的判断
            if (roleObj[roleId] === "superman") {
                return false
            }
            else {
                return item.value !== region
            }
        }

    }
    // 对于不同用户在创建角色的时候 对于角色的选择        角色的选择 
    const checkRoleDisabled = (item) => {
        if (props.isUpdate) { // 如果有这个属性的值 那么就是 要去更新用户的界面
            // 更新  鉴定权限 
            if (roleObj[roleId] === "superman") {
                // 所有的都不禁用
                return false
            }
            else {
                return true
            }
        }
        else {
            //  否则时添加时的判断
            if (roleObj[roleId] === "superman") {
                return false
            }
            else {
                return roleObj[item.id] !== "editor"
            }
        }
    }
    return (
        <div>
            <Form layout='vertical' ref={ref} >
                {/* 在下面的name 中  写好字段 将数据收集起来 和后台对应 */}
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="区域"
                    name="region"
                    rules={isDisabled ? [] : [{ required: true, message: 'Please input your username!' }]}
                >
                    <Select disabled={isDisabled}  >
                        {/* 地点 regions  */}
                        {
                            props.regionsList.map(item => <Option value={item.value} key={item.id}
                                disabled={checkRegionDisabled(item)}
                            >

                                {item.label}</Option>)
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    label="角色"
                    name="roleId"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Select onChange={(value) => {
                        if (value === 1) {
                            setisDisabled(true)
                            ref.current.setFieldsValue({
                                region: ""
                            })
                        }
                        else {
                            setisDisabled(false)
                        }
                    }}  >
                        {/* 地点 regions  */}
                        {
                            props.rolesList.map(item => <Option value={item.id} key={item.id}
                                disabled={checkRoleDisabled(item)}
                            >
                                {item.roleName}</Option>)
                        }
                    </Select>
                </Form.Item>
            </Form>
        </div>
    )
})
export default UserForm