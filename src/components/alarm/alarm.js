import React from 'react'
import {Card, Table, Button, Input, Icon} from 'antd'
import ReactEcharts from 'echarts-for-react'
import geoData from '../home/components/get-geography-value1.js'
import testData from './data/input'
import {history} from "../../App";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import tags from "../../config/tags";
import * as tagsActions from "../../actions/tagsActions";

require('echarts/map/js/china.js');

class Alarm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {info: {}, data: testData, filterData: testData, city: '', inputColor: ''}
    }

    convertData = (data) => {
        let res = []
        let len = data.length
        for (let i = 0; i < len; i++) {
            let geoCoord = geoData[data[i].name]
            if (geoCoord) {
                res.push({
                    name: data[i].name,
                    value: geoCoord.concat(data[i].devid, this.datetimeFormat(data[i].time), data[i].location)
                })
            }
        }
        return res
    }
    onChartClick = (val) => {
        if (!val.data || !val.data.name) return false
        this.setState({
            filterData: this.state.data.filter(record => {
                return record.name === val.data.name
            }),
            city: val.data.name
        })

    }
    handleCityChange = (e) => {
        this.setState({city: e.target.value, inputColor: ''})
    }
    search = () => {
        const {city, data} = this.state
        if (!city) {
            this.setState({inputColor: 'red'})
            return false;
        }
        let reg = new RegExp('^[0-9]*$')
        const match = reg.test(city)
        this.setState({
            filterData: data.filter(val => {
                if (match) return val.devid + '' === city.trim()
                else return val.name === city.trim()
            })
        })
    }
    clear = () => {
        this.setState({filterData: this.state.data, city: ''})
    }
    showDevInfo = (e, devid) => {
        e.preventDefault()
        this.createTag('devs')
        history.push({pathname: '/devs/' + devid})
        this.props.setActiveTag(history.location.pathname)
    }
    createTag = (val) => {
        let {tagsOpenedList} = this.props
        let isOpened = false
        tagsOpenedList.forEach((tag,index) => {
            if (tag.name === val) {
                isOpened = true
                // this.props.moveToSecond(index)
                return
            }
        })
        if (!isOpened) {
            this.props.createTag({name: val, title: tags[val]})
        }
    }
    datetimeFormat = (date) => {
        let dateTime = new Date(date);
        let timespan = Date.parse(dateTime)
        let year = dateTime.getFullYear();
        let month = dateTime.getMonth() + 1;
        let day = dateTime.getDate();
        let hour = dateTime.getHours();
        let minute = dateTime.getMinutes();
        // let second = dateTime.getSeconds();
        let now = new Date();
        let now_new = Date.parse(now.toDateString());  //typescript转换写法

        let milliseconds = 0;
        let timeSpanStr;

        milliseconds = now_new - timespan;

        if (milliseconds <= 1000 * 60 * 1) {
            timeSpanStr = '刚刚';
        }
        else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
            timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
        }
        else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
            timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
        }
        else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
            timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
        }
        else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year === now.getFullYear()) {
            timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
        } else {
            timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
        }
        return timeSpanStr;
    }

    render() {
        const {data, filterData, city, inputColor} = this.state
        let onEvents = {
            'click': this.onChartClick
        }
        let option = {
            geo: {
                map: 'china',
                label: {
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: '#EFEFEF',
                        borderColor: '#CCC'
                    },
                    emphasis: {
                        areaColor: '#E5E5E5'
                    }
                }
            },
            tooltip: {
                formatter: (params) => {
                    return params.name
                }
            },
            grid: {
                top: 0,
                left: '2%',
                right: '2%',
                bottom: '0',
                containLabel: true
            },
            series: [{
                type: 'scatter',
                coordinateSystem: 'geo',
                data: this.convertData(data),
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#0099CC'
                    }
                }
            }]
        }
        const columns = [{
            title: '城市',
            dataIndex: '',
            key: 'name',
            render: (record) => (
                <div>{record.name}</div>
            )
        }, {
            title: '经纬度',
            dateIndex: '',
            key: 'location',
            render: (record) => (
                <div>[{record.value[4]}, {record.value[5]}]</div>
            )
        }, {
            title: '设备id',
            dateIndex: '',
            key: 'devid',
            render: (record) => (
                <div><a onClick={(e) => this.showDevInfo(e, record.value[2])}>{record.value[2]}</a></div>
            )
        }, {
            title: '发生时间',
            dateIndex: '',
            key: 'time',
            render: (record) => (
                <div>{record.value[3]}</div>
            )
        }];
        const title = <div><Icon type="notification"/><span style={{marginLeft: 10}}>警报</span></div>
        return (
            <Card title={title} style={{display: 'overflow'}}>
                <div style={{width: '60%', float: 'left'}}>
                    <ReactEcharts style={{height: 750}}
                                  option={option || {}}
                                  notMerge={true}
                                  lazyUpdate={true} onEvents={onEvents}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 80, float: 'left'}}>
                    <div>
                        <div style={{marginBottom: 5}}>
                            <Input style={{width: 200, marginRight: 10, borderColor: inputColor}} placeholder="请输入城市或设备id"
                                   onChange={this.handleCityChange} value={city}/>
                            <Button onClick={this.search} type="primary">搜索</Button>
                            <Button onClick={this.clear}>重置</Button>
                        </div>
                        <Table dataSource={this.convertData(filterData)} columns={columns}
                               bordered={true} style={{width: 500}} size="middle"
                               rowKey={record => record.name + record.value[2]}
                               locale={{emptyText: '该城市没有警报信息'}}
                        />
                    </div>
                </div>
            </Card>
        )
    }
}
function mapStateToProps (state) {
    return {
        activeTag : state.activeTag,
        tagsOpenedList: state.tagsOpenedList
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(tagsActions, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps) (Alarm)