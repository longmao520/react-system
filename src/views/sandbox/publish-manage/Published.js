import React from 'react'
import { Button } from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'
export default function Published() {
    const { dataSource, handleSunset } = usePublish(2)
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button type='primary'
                onClick={() => handleSunset(id)}
            >下线</Button>}></NewsPublish>
        </div>
    )
}
