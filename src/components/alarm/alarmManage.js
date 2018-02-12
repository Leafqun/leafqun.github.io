import React from 'react'
import {Card, Icon, Popconfirm, Table, Pagination, Input, DatePicker, Button} from 'antd'
import {history} from "../../App";
import tags from "../../config/tags";
import * as tagsActions from "../../actions/tagsActions"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import axios from 'axios'
import url from '../../config/url'
import {CSVLink} from 'react-csv';
const {RangePicker} = DatePicker;

class AlarmManage extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            alarmList: [],
            loading: true,
            currentPage: 1,
            total: 1,
            city: '',
            time: [],
            download: []
        }
    }
    componentWillMount () {
        this.getAlarmList({currentPage: 1})
        this.download()
    }
    getAlarmList = (val) => {
        this.setState({loading: true})
        axios.get(url + 'alarm/getAlarmList', {params: val}).then(response => {
            this.setState({alarmList: response.data.alarmList.data, total: response.data.alarmList.total, loading: false})
        }).catch(error => {
            console.log(error)
        })
    }
    handlePageChange = (page) => {
        let {city, time} = this.state
        let startTime = ''
        let endTime = ''
        if (time.length > 0) {
            startTime = time[0].format("YYYY-MM-DD HH:mm:ss")
            endTime = time[1].format("YYYY-MM-DD HH:mm:ss")
        }
        this.setState({currentPage: page})
        this.getAlarmList({currentPage: page, city, startTime, endTime})
    }
    handleDateChange = (date, dateString) => {
        this.setState({time: date})
    }
    handleCityChange = (e) => {
        this.setState({city: e.target.value.trim()})
    }
    clear = () => {
        this.setState({time: [], city: ''})
        this.getAlarmList({currentPage: 1})
    }
    search = () => {
        let {city, time} = this.state
        let startTime = ''
        let endTime = ''
        if (time.length > 0) {
            startTime = time[0].format("YYYY-MM-DD HH:mm:ss")
            endTime = time[1].format("YYYY-MM-DD HH:mm:ss")
        }
        this.getAlarmList({currentPage: 1, city, startTime, endTime})
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
    download = () => {
        axios.get(url + 'alarm/getMonthAlarmList').then(response => {
            this.setState({download: response.data.alarmList})
        }).catch(error => {
            console.log(error)
        })
    }
    transformData = (val) => {
        if (val && val.length <= 0) return null;
        val.map(value => {
            delete value.alarmid;
            delete value.type;
            delete value.detail;
            delete value.duration;
            return value
        })
        return val
    }
    render () {
        const {alarmList, total, loading, currentPage, time, city, download} = this.state
        let columns = [
            { title: '城市', dataIndex: 'city', className: 'fonts' },
            {
                title: '设备ID',
                dataIndex: '',
                className: 'fonts',
                render: record => (
                    <div><a href="" onClick={(e) => this.showDevInfo(e, record.devid)}>{record.devid}</a></div>
                )
            },
            {
                title: '经纬度',
                dataIndex: '',
                className: 'fonts',
                render: record => (
                    <div>{record.location.length > 0 ? `[${record.location}]`  : []}</div>
                )
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                className: 'fonts'
            },
            {
                title: '操作',
                dataIndex: '',
                width: 100,
                key: 'useridx', render: (record) => (
                    <div>
                        <Popconfirm title="确定要删除吗?" placement="top" okText="是" cancelText="否"
                                    onConfirm={() => this.onDelete(record.did)}>
                            <a href="" style={{marginLeft: 10}}><Icon type="delete" style={{fontSize: 18}}/></a>
                        </Popconfirm>
                    </div>
                )
            }]
        const title = <div>
            <Icon type="calendar"/><span style={{marginLeft: 10}}>警报日志管理</span>
            <span style={{marginLeft: 15}}><CSVLink data={download.length > 0 ? this.transformData(download) :  []}
                                                    filename={'报警日志统计.csv'}
                                                    className="btn btn-primary"
                                                    target="_blank">报表</CSVLink>
            </span>
        </div>
        return (
            <Card title={title}>
                <div style={{marginBottom: 20, display: 'flex', flexFlow: 'row wrap'}}>
                    <RangePicker locale={{lang: {placeholder: '请选择日期', rangePlaceholder: ['开始日期', '结束日期'], "ok": "确定",}}}
                                 onChange={(date, dateString) => this.handleDateChange(date, dateString)} style={{marginRight: 10}} showTime
                                 value={time}
                    />
                    <Input placeholder="请输入城市或设备号" style={{width: 200}} onChange={this.handleCityChange} value={city}/>
                    <div style={{marginLeft: 5}}>
                        <Button onClick={this.clear}>重置</Button>
                        <Button type="primary" onClick={this.search}>搜索</Button>
                    </div>
                </div>
                <Table dataSource={alarmList} columns={columns} pagination={false} ref="alarmTable"
                       size="middle" locale={{emptyText: '暂无数据'}}
                       rowKey={record => record.devid + record.create_time} loading={loading}
                />
                <div style={{textAlign: 'center', marginTop: 20}}>
                    <Pagination defaultCurrent={1} total={total} showQuickJumper
                                showTotal={(total, range) => `共${total}条`} size="small"
                                pageSize={10} current={currentPage} onChange={this.handlePageChange}/>
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
export default connect(mapStateToProps, mapDispatchToProps) (AlarmManage)