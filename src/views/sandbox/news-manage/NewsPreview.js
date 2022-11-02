import React, { useEffect, useState } from 'react'
import { Descriptions, PageHeader } from 'antd';
import axios from 'axios';
import moment from "moment"
export default function NewsPreview(props) {
    const [newsInfo, setNewsInfo] = useState(null)
    const auditList = ["未审核", "审核中", "已通过", "未通过"]
    const publishList = ["未发布", "待发布", "已上线", "已下线"]
    const colorList = ['black', 'orange', 'green', 'red']
    useEffect(() => {
        console.log(props.match.params.id);
        let myid = props.match.params.id
        axios.get(`http://localhost:5000/news/${myid}?_expand=category&_expand=role`).then(res => {
            console.log(res.data);
            setNewsInfo(res.data)
        })
    }, [props.match.params.id])
    return (
        <div>
            {newsInfo && <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={newsInfo.label}
                subTitle={newsInfo.category.value}
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">
                        {moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="发布时间">
                        {newsInfo.publishTime ? moment(newsInfo.publishTime).format('YYYY/MM/DD-HH:mm:ss') : "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                    <Descriptions.Item label="审核状态">
                        <span style={{ color: colorList[newsInfo.auditState] }}>{auditList[newsInfo.auditState]}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="发布状态">
                        <span style={{ color: colorList[newsInfo.publishState] }}>{publishList[newsInfo.publishState]}</span>

                    </Descriptions.Item>
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
