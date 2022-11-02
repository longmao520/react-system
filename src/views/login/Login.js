import React from 'react'
import { Form, Input, Button, message, } from "antd"
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import Particles from 'react-tsparticles';
import "./Login.css"
import axios from 'axios';
export default function Login(props) {
    const onFinish = (values) => {
        // 收集数据的
        console.log('Received values of form: ', values);
        axios.get(`http://localhost:5000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`)
            .then(res => {
                console.log(res.data);
                if (res.data.length === 0) {
                    message.error("用户名或密码错误")
                }
                else {
                    localStorage.setItem("token", JSON.stringify(res.data[0]))
                    props.history.push("/")
                }
            })
    };
    return (
        <div style={{ background: "rgb(35,39,65)", height: "100vh" }} >
            <Particles height={document.documentElement.clientHeight} />
            <div className="formContainer">
                <div className='logintitle'> 全球新闻发布系统 </div>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >

                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    {/* <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <a className="login-form-forgot" href="">
                            Forgot password
                        </a>
                    </Form.Item> */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>

                    </Form.Item>
                </Form>


            </div>


        </div>
    )
}
