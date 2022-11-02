import React, { useEffect, useState } from 'react'
import { Descriptions, PageHeader } from 'antd';
import axios from 'axios';
import moment from "moment"
import { HeartTwoTone } from '@ant-design/icons'
export default function Detail(props) {
    const [newsInfo, setNewsInfo] = useState(null)
    useEffect(() => {
        console.log(props.match.params.id);
        let myid = props.match.params.id
        axios.get(`http://localhost:5000/news/${myid}?_expand=category&_expand=role`).then(res => {
            console.log(res.data);
            setNewsInfo({
                ...res.data,
                view: res.data.view + 1
            })
            return res.data
        }).then(res => {
            axios.patch(`/news/${myid}`, {
                view: res.view + 1
            })
        })
    }, [props.match.params.id])
    const handleStar = () => {
        setNewsInfo({
            ...newsInfo,
            star: newsInfo.star + 1
        })
        axios.patch(`/news/${props.match.params.id}`, {
            star: newsInfo.star + 1
        })
    }
    return (
        <div>
            {newsInfo && <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={newsInfo.label}
                subTitle={<div>
                    {newsInfo.category.label}
                    <HeartTwoTone twoToneColor="#eb2f96" onClick={() => handleStar()} />
                </div>}
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>

                    <Descriptions.Item label="发布时间">
                        {newsInfo.publishTime ? moment(newsInfo.publishTime).format('YYYY/MM/DD-HH:mm:ss') : "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>

                    <Descriptions.Item label="访问数量">
                        {newsInfo.view}
                    </Descriptions.Item>
                    <Descriptions.Item label="点赞数量">
                        {newsInfo.star}
                    </Descriptions.Item>
                    <Descriptions.Item label="评论数量">
                        0
                    </Descriptions.Item>
                </Descriptions>
                <div dangerouslySetInnerHTML={{
                    __html: newsInfo.content
                }} style={{ border: "1px solid #eee" }}   >

                </div>
            </PageHeader>}
        </div>
    )
}
