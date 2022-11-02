import React, { useEffect, useRef, useState } from 'react'
import { Button, PageHeader, Steps, Form, Input, Select, message, notification } from 'antd'
import axios from 'axios';
import style from "./news.module.css"
import NewsEditor from '../../../components/news-manage/NewsEditor';
// import "./news.css"
const { Step } = Steps;
const { Option } = Select
export default function NewsAdd(props) {
    const [current, setcurrent] = useState(0)
    const [categorList, setcategorList] = useState([])
    const NewsForm = useRef(null);
    const [formInfo, setFormInfo] = useState("")
    const [content, setContent] = useState("")
    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                setFormInfo(res)
                setcurrent(current + 1)
            }).catch(error => {
                console.log(error);
            })
        }
        else {
            if (content.trim() === "<p></p>" || content === "") {
                message.error("新闻内容不能为空")
            }
            else {
                setcurrent(current + 1)
            }
        }
    }
    const handlePrev = () => {
        setcurrent(current - 1)
    }
    useEffect(() => {
        axios.get(`http://localhost:5000/categories`).then(res => {
            setcategorList(res.data)
        })
    }, [])

    const user = JSON.parse(localStorage.getItem("token"))
    const handleSave = (auditState) => {

        //保存到草稿箱
        axios.post(`http://localhost:5000/news`, {
            ...formInfo,
            content: content,
            "region": user.region === "" ? "全球" : user.region,
            "author": user.username,
            "roleId": user.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,

            //  "publishTime": 1615778496314
        }).then(res => {
            props.history.push(auditState === 0 ? "/news-manage/draft" : "/audit-manage/list")
            notification.info({
                message: `通知`,
                description:
                    `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
                placement: "bottomRight",
            });
        })



    }


    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="撰写新闻"
            />
            <Steps current={current}>
                <Step title="基本信息" description="新闻标题,新闻分类" />
                <Step title="新闻内容" description="新闻主题内容" />
                <Step title="新闻提交" description="保存草稿或提交审核" />
            </Steps>

            <div className={current === 0 ? "" : style.active}>
                <Form
                    ref={NewsForm}
                    name="basic"
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 20,
                    }}
                    initialValues={{
                        remember: true,
                    }}

                >
                    <Form.Item
                        label="新闻标题"
                        name="label"

                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="新闻分类"
                        name="categoryId"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Select>
                            {
                                categorList.map(item => <Option value={item.id} key={item.id}>{item.label}</Option>)
                            }
                        </Select>

                    </Form.Item>
                </Form>
            </div>
            <div className={current === 1 ? "" : style.active}>
                <NewsEditor getContent={(value) => {
                    setContent(value)
                }} ></NewsEditor>

            </div>

            <div className={current === 2 ? "" : style.active}></div>

            <div style={{ marginTop: "50px" }}>
                {
                    current === 2 && <span>
                        <Button type='primary' onClick={() => {
                            handleSave(0)
                        }} >保存到草稿箱</Button>
                        <Button danger onClick={() => {
                            handleSave(1)
                        }} >提交审核</Button>

                    </span>
                }

                {
                    current < 2 && <Button type='primary' onClick={handleNext}>下一步</Button>
                }
                {
                    current > 0 && <Button type='primary' onClick={handlePrev}>上一步</Button>
                }
            </div>
        </div>
    )
}
