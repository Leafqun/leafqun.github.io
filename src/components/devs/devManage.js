import React from 'react'
import axios from 'axios'
import url from '../../config/url'
import { Card, Table, Tooltip, Popconfirm, Icon, Pagination, Input, Button, DatePicker } from 'antd'
import {history} from "../../App";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as tagsActions from "../../actions/tagsActions"
const {RangePicker} = DatePicker;


class DevManage extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            devList: [],
            loading: true,
            total: 1,
            currentPage: 1,
            devid: '',
            devidfilterDropdownVisible: false,
            timefilterDropdownVisible: false,
            date: ''
        }
    }
    componentWillMount () {
        this.getDevList({currentPage: 1})
    }
    getDevList = (val) => {
        this.setState({loading: true})
        axios.get(url + 'devs/getDevList', {params: val}).then(response => {
            this.setState({devList: response.data.devList.data, total: response.data.devList.total, loading: false})
        }).catch(error => {
            console.log(error)
        })
    }
    handlePageChange = (page) => {
        this.setState({currentPage: page})
        const startTime = this.state.date[0].format("YYYY-MM-DD HH:mm:ss")
        const endTime = this.state.date[1].format("YYYY-MM-DD HH:mm:ss")
        this.getDevList({currentPage: 1, startTime, endTime})
    }
    handleDevidChange = (e) => {
        this.setState({devid: e.target.value})
    }
    clearDevid = () => {
        this.setState({devid: ''})
        this.getDevList({currentPage: 1})
    }
    searchDevid = () => {
        this.setState({devidfilterDropdownVisible: false})
        this.getDevList({currentPage: 1, devid: this.state.devid.trim()})
    }
    isShow = () => {
        this.setState((preProps) => ({timefilterDropdownVisible: !preProps.timefilterDropdownVisible}))
    }
    handleDateChange = (date, dateString) => {
        this.setState({date: date})
    }
    clearDate = () => {
        this.setState({date: [], timefilterDropdownVisible: false})
        this.getDevList({currentPage: 1})
    }
    searchCreateTime = () => {
        this.setState({timefilterDropdownVisible: false})
        const startTime = this.state.date[0].format("YYYY-MM-DD HH:mm:ss")
        const endTime = this.state.date[1].format("YYYY-MM-DD HH:mm:ss")
        this.getDevList({currentPage: 1, startTime, endTime})
    }
    showDevInfo (e, devid) {
        e.preventDefault()
        history.push({pathname: '/devs/' + devid})
        this.props.setActiveTag(history.location.pathname)
    }
    onDelete = (did) => {
        axios.get(url + 'devs/deleteDev', {params: {did}}).then(response => {
            if (response.data.msg === 'success') {
                this.getDevList({currentPage: 1})
            }
        }).catch(error => {
            console.log(error)
        })
    }
    render () {
        const {devList, loading, total, currentPage, devid, devidfilterDropdownVisible, timefilterDropdownVisible, date} = this.state
        let columns = [
            {
                title: '#',
                dataIndex: '',
                width: 60,
                key: 'index',
                render: (text, record, index) => (
                    <div>{(index + 1) + (currentPage - 1) * 15}</div>
                )
            },
            {
                title: '设备ID',
                dataIndex: 'devid',
                className: 'fonts' ,
                filterDropdown: (
                    <div style={{width: 300, padding: '8px', borderRadius: 6, backgroundColor: '#fff', boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'}}>
                        <Input size="small" placeholder="搜索设备ID" style={{width: 200, marginRight: 8}}
                               onChange={(e) => this.handleDevidChange(e)} value={devid}
                               suffix={devid ? <Icon type="close" onClick={() => this.clearDevid()}/> : ''}/>
                        <Button type="primary" onClick={() => this.searchDevid()}>search</Button>
                    </div>
                ),
                filterDropdownVisible: devidfilterDropdownVisible,
                filterIcon: <Icon type="search" style={{ color: this.state.devid ? '#108ee9' : '#aaa' }}/>,
                onFilterDropdownVisibleChange: (visible) => {
                    this.setState({devidfilterDropdownVisible: visible})
                }
            },
            { title: '允许最大人数', dataIndex: 'max', className: 'fonts' },
            { title: '对应群组ID', dataIndex: 'groupid', className: 'fonts' },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                className: 'fonts',
                filterDropdown: (
                    <div style={{width: 450, padding: '8px', borderRadius: 6, backgroundColor: '#fff', boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'}}>
                        <RangePicker onChange={(date, dateString) => this.handleDateChange(date, dateString)} style={{marginRight: 10}} showTime
                                     renderExtraFooter={() => 'extra footer'} onOk={() => this.searchCreateTime()} value={date}/>
                        <Button type="primary" onClick={() => this.clearDate()}>关闭</Button>
                    </div>
                ),
                filterDropdownVisible: timefilterDropdownVisible,
                filterIcon: <Icon type="search" style={{ color: this.state.date ? '#108ee9' : '#aaa' }} onClick={() => this.isShow()}/>
            },
            {
                title: '操作',
                dataIndex: '',
                width: 100,
                key: 'useridx', render: (record) => (
                    <div>
                        <a href="" onClick={(e) => this.showDevInfo(e, record.devid)}>
                            <Tooltip title="通知编辑" mouseEnterDelay={1} placement={'left'}>
                                <Icon type="search" style={{fontSize: 18}}/>
                            </Tooltip>
                        </a>
                        <Popconfirm title="确定要删除吗?" placement="top" okText="是" cancelText="否"
                                    onConfirm={() => this.onDelete(record.did)}>
                            <a href="" style={{marginLeft: 10}}><Icon type="delete" style={{fontSize: 18}}/></a>
                        </Popconfirm>
                    </div>
                )
            }]
        return (
            <div>
                <Card title={<div style={{ fontSize: 14, color: 'black' }}><Icon type="mobile" /><span style={{marginLeft: 10}}>设备管理</span></div>}>
                    <div>
                        <Table pagination={false} columns={columns} dataSource={devList} locale={{emptyText: '暂无数据'}}
                               size={'middle'} loading={loading} rowKey={record => record.devid}/>
                    </div>
                    <div style={{textAlign: 'center', marginTop: 20}}>
                        <Pagination defaultCurrent={1} total={total} showQuickJumper
                                    showTotal={(total, range) => `共${total}条`} size="small"
                                    pageSize={15} current={currentPage} onChange={this.handlePageChange}/>
                    </div>
                </Card>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(tagsActions, dispatch)
}
export default connect(null, mapDispatchToProps) (DevManage)