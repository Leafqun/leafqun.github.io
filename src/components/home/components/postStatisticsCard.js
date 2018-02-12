import React from 'react'
import {Card, Icon, Radio, Spin} from 'antd'
import ReactEcharts from 'echarts-for-react'
import url from "../../../config/url"
import axios from 'axios'
import {CSVLink} from 'react-csv';
const RadioGroup = Radio.Group;

class PostStatisticsCard extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            postNum: [],
            which: 1
        }
    }
    componentWillMount () {
        this.getPostNumByDay()
    }
    getPostNumByDay = () => {
        axios.get(url + 'posts/getLastWeekPosts').then(response => {
            this.setState({postNum: response.data.postNum})
        }).catch(error => {
            console.log(error)
        })
    }
    getPostNumByMonth = () => {
        axios.get(url + 'posts/getPostNumByMonth').then(response => {
            this.setState({postNum: response.data.postNum})
        }).catch(error => {
            console.log(error)
        })
    }
    transform1 = (val) => {
        val.forEach(function (value, index, array) {
            value['itemStyle'] = {normal: {color: '#2d8cf0'}}
        })
        return val
    }
    transform2 = (val) => {
        let data = []
        val.forEach(function (value, index, array) {
            data.push(value['name'])
        })
        return data
    }
    onChange = (e) => {
        this.setState({which: e.target.value})
        if (e.target.value === 1) this.getPostNumByDay()
        else this.getPostNumByMonth()
    }
    transformData = (data) => {
        if (data.length <= 0) return null;
        data.map(value => {
            delete value.itemStyle
            return value
        })
        return data
    }
    render () {
        const {postNum, which} = this.state
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                top: 0,
                left: '2%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            xAxis: {
                type: 'category',
                data: this.transform2(postNum),
                nameTextStyle: {
                    color: '#c3c3c3'
                }
            },
            series: [
                {
                    name: '帖子数',
                    type: 'bar',
                    data: this.transform1(postNum)
                }
            ]
        }
        const header = [
            {label: '时间', key: 'name'},
            {label: '帖子数', key: 'value'}
        ]
        const title = <div>
            <Icon type="mail" style={{color: 'black'}}/>
            {which === 1 ? '前30天帖子数量统计' : '前12个月帖子数量统计'}
            <span style={{marginLeft: 15}}><CSVLink data={postNum.length > 0 ? this.transformData(postNum) :  []} headers={header}
                                                    filename={which === 1 ? "前30天帖子数量统计.csv" : "前10个月帖子数量统计.csv"}
                                                    className="btn btn-primary"
                                                    target="_blank">报表</CSVLink>
            </span>
            </div>
        const extra = <div><RadioGroup name="radiogroup" defaultValue={1} onChange={this.onChange}>
            <Radio value={1}>天</Radio>
            <Radio value={2}>月</Radio>
        </RadioGroup></div>
        return (
            <Card title={title} extra={extra}>
                <Spin spinning={postNum.length <= 0} size="large">
                    <ReactEcharts ref='echarts_react'
                                  option={option || {}}
                                  style={{height: 200, width: '100%'}}/>
                </Spin>
            </Card>
        )
    }
}

export default PostStatisticsCard