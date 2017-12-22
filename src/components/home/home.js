import React from 'react'
import axios from 'axios'
import url from '../../config/url'
import InforCard from './components/infoCard'
import TableCard from './components/tableCard'
import MapCard from './components/mapCard'
import PostStatisticsCard from './components/postStatisticsCard'
import VisitCard from './components/visitCard'
import './home.css'

class Home extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            userTotalNum: 0,
            devTotalNum: 0,
            monthPostTotalNum: 0,
            todayPostNum: 0,
            activeUserTotalNum: 0,
            cityData: [],
            postNum: [],
            flow: {}
        }
    }
    componentWillMount () {
        this.getUserTotalNum()
        this.getDevTotalNum()
        this.getMonthPostTotalNum()
        this.getTodayPostNum()
        this.getActiveUserTotalNum()
        this.getActiveUserCityStatistics()
        this.get7DaysWebsiteFlow()
    }
    getUserTotalNum = () => {
        axios.get(url + 'users/getUserTotalNum').then(response => {
            this.setState({userTotalNum: response.data.total})
        }).catch(error => {
            console.log(error)
        })
    }
    getDevTotalNum = () => {
        axios.get(url + 'devs/getDevTotalNum').then(response => {
            this.setState({devTotalNum: response.data.total})
        }).catch(error => {
            console.log(error)
        })
    }
    getMonthPostTotalNum = () => {
        axios.get(url + 'posts/getMonthPostTotalNum').then(response => {
            this.setState({monthPostTotalNum: response.data.total})
        }).catch(error => {
            console.log(error)
        })
    }
    getTodayPostNum = () => {
        axios.get(url + 'posts/getTodayPostNum').then(response => {
            this.setState({todayPostNum: response.data.postNum})
        }).catch(error => {
            console.log(error)
        })
    }
    getActiveUserTotalNum = () => {
        axios.get(url + 'users/getActiveUserTotalNum').then(response => {
            this.setState({activeUserTotalNum: response.data.total})
        }).catch(error => {
            console.log(error)
        })
    }
    getActiveUserCityStatistics = () => {
        axios.get(url + 'users/getActiveUserCityStatistics').then(response => {
            this.setState({cityData: response.data.cityList})
        }).catch(error => {
            console.log(error)
        })
    }
    get7DaysWebsiteFlow = () => {
        axios.get(url + 'posts/get7DaysWebsiteFlow').then(response => {
            this.setState({flow: response.data.flow})
        }).catch(error => {
            console.log(error)
        })
    }
    render () {
        const {userTotalNum, devTotalNum, activeUserTotalNum, monthPostTotalNum, cityData, flow, todayPostNum} = this.state
        return (
            <div className="all">
                <div className="infoCard">
                    <InforCard endVal={userTotalNum} title="用户总数" iconType="user-add"
                               color="rgb(45, 140, 240)"/>
                    <InforCard endVal={devTotalNum} title="设备总数" iconType="laptop" color="rgb(100, 213, 114)"/>
                    <InforCard endVal={monthPostTotalNum} title="本月帖子数" iconType="mail"
                               color="rgb(255, 213, 114)"/>
                    <InforCard endVal={todayPostNum} title="今天帖子数" iconType="mail"
                               color="rgb(133, 67, 224)"/>
                    <InforCard endVal={activeUserTotalNum} title="活跃用户" iconType="heart"
                               color="rgb(242, 94, 67)"/>
                </div>
                <div className="mapTable">
                    <div style={{paddingRight: 12, width: '50%'}}>
                        <TableCard cityData={cityData}/>
                    </div>
                    <div style={{width: '50%', paddingBottom: 12}}>
                        <MapCard cityData={cityData}/>
                    </div>
                </div>
                <div style={{marginBottom: 12}}>
                    <PostStatisticsCard/>
                </div>
                <div style={{marginBottom: 12}}>
                    <VisitCard flow={flow}/>
                </div>
            </div>
        )
    }
}

export default Home