//自定义的hooks
import { useEffect, useState } from "react"
import axios from "axios"
import { notification } from "antd"
function usePublish(type) {
    const [dataSource, setdataSource] = useState([])
    let { username } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get(`http://localhost:5000/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
            setdataSource(res.data)
        })
    }, [username, type]);

    const handlePublish = (id) => {
        setdataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`http://localhost:5000/news/${id}`, {
            publishState: 2,
            publishTiem: Date.now()
        }).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您可以到【发布管理/已发布】中查看您的新闻`,
                placement: "bottomRight",
            });
        })
    }
    const handleSunset = (id) => {
        setdataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`http://localhost:5000/news/${id}`, {
            publishState: 3,
        }).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您可以到【发布管理/已下线】中查看您的新闻`,
                placement: "bottomRight",
            });
        })

    }
    const handleDelte = (id) => {
        setdataSource(dataSource.filter(item => item.id !== id))
        axios.delete(`http://localhost:5000/news/${id}`).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您已经删除了您的新闻`,
                placement: "bottomRight",
            });
        })

    }

    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelte
    }
}



export default usePublish