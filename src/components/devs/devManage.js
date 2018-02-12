import React from 'react'
import axios from 'axios'
import url from '../../config/url'
import { Card, Table, Tooltip, Popconfirm, Icon, Pagination, Input, Button, DatePicker, Tag, Radio } from 'antd'
import {history} from "../../App";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as tagsActions from "../../actions/tagsActions"
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;

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
            typefilterDropdownVisible: false,
            bindfilterDropdownVisible: false,
            date: [],
            orderByMax: '',
            orderByCreateTime: '',
            type: 0,
            isBind: 0
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
    handleTableChange = (pagination, filters, sorter) => {
        let params = {currentPage: 1}
        if (sorter.field === 'max') {
            this.setState({orderByMax: sorter.order})
            this.setState({orderByCreateTime: ''})
            params['orderByMax'] = sorter.order
            params['orderByCreateTime'] = 0
        }
        if (sorter.field === 'create_time') {
            this.setState({orderByCreateTime: sorter.order})
            this.setState({orderByMax: ''})
            params['orderByMax'] = 0
            params['orderByCreateTime'] = sorter.order
        }
        this.filterGetDevList(params)
    }
    filterGetDevList = (val) => {
        let params = this.getParams()
        for (let i in val) {
            params[i] = val[i]
        }
        this.getDevList(params)
    }
    getParams = () => {
        let {date, devid, orderByMax, orderByCreateTime, type, isBind, currentPage} = this.state
        let startTime = ''
        let endTime = ''
        if (date.length > 0) {
            startTime = date[0].format("YYYY-MM-DD HH:mm:ss")
            endTime = date[1].format("YYYY-MM-DD HH:mm:ss")
        }
        return {date, devid, orderByCreateTime, orderByMax, type, isBind, currentPage, startTime, endTime}
    }
    handlePageChange = (page) => {
        this.setState({currentPage: page})
        this.filterGetDevList({currentPage: page})
    }
    handleDevidChange = (e) => {
        this.setState({devid: e.target.value.trim()})
    }
    clearDevid = () => {
        this.setState({devid: '', currentPage: 1})
        this.filterGetDevList({currentPage: 1, devid: ''})
    }
    searchDevid = () => {
        this.setState({devidfilterDropdownVisible: false, currentPage: 1})
        this.filterGetDevList({currentPage: 1, devid: this.state.devid.trim()})
    }
    isShow = () => {
        this.setState((preProps) => ({timefilterDropdownVisible: !preProps.timefilterDropdownVisible}))
    }
    handleDateChange = (date, dateString) => {
        this.setState({date: date})
    }
    clearDate = () => {
        this.setState({date: [], timefilterDropdownVisible: false, currentPage: 1})
        this.filterGetDevList({currentPage: 1})
    }
    searchCreateTime = () => {
        this.setState({timefilterDropdownVisible: false, currentPage: 1})
        const startTime = this.state.date[0].format("YYYY-MM-DD HH:mm:ss")
        const endTime = this.state.date[1].format("YYYY-MM-DD HH:mm:ss")
        this.filterGetDevList({currentPage: 1, startTime, endTime})
    }
    handleTypeChange = (e) => {
        this.setState({type: e.target.value})
    }
    filterType = (e) => {
        e.preventDefault()
        this.setState({typefilterDropdownVisible: false, currentPage: 1})
        this.filterGetDevList({currentPage: 1})
    }
    clearType = (e) => {
        e.preventDefault()
        this.setState({typefilterDropdownVisible: false, type: 0, currentPage: 1})
        this.getDevList({currentPage: 1, type: 0})
    }
    handleBindChange = (e) => {
        this.setState({isBind: e.target.value})
    }
    filterBind = (e) => {
        e.preventDefault()
        this.setState({bindfilterDropdownVisible: false, currentPage: 1})
        this.filterGetDevList({currentPage: 1})
    }
    clearBind = (e) => {
        e.preventDefault()
        this.setState({bindfilterDropdownVisible: false, isBind: 0, currentPage: 1})
        this.getDevList({currentPage: 1, isBind: 0})
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
        const {devList, loading, total, currentPage, devid, devidfilterDropdownVisible, timefilterDropdownVisible, date, type, typefilterDropdownVisible, isBind, bindfilterDropdownVisible} = this.state
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
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
            { title: '允许最大人数', dataIndex: 'max', className: 'fonts', sorter: true },
            {
                title: '是否绑定',
                dataIndex: '',
                className: 'fonts',
                render: (record) => (
                    <div style={{paddingLeft: 15}}>
                        {record.user_id && record.groupid? <Icon type="check-square" style={{color: 'green', fontSize: 18}}/> : <Icon type="close-square" style={{color: 'red', fontSize: 18}}/>}
                    </div>
                ),
                filterDropdown: (
                    <div style={{width: 90, padding: '8px', borderRadius: 6, backgroundColor: '#fff', boxShadow: '0 1px 6px rgba(0, 0, 0, .2)', display: 'flex', flexFlow: 'column wrap'}}>
                        <RadioGroup onChange={this.handleBindChange} value={isBind}>
                            <Radio value={1} style={radioStyle}>已绑定</Radio>
                            <Radio value={2} style={radioStyle}>未绑定</Radio>
                        </RadioGroup>
                        <div style={{borderTop: 'solid 1px #e8e8e8', paddingTop: 8, display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between'}}>
                            <a href="" style={{textAlign: 'left'}} onClick={this.filterBind}>确认</a>
                            <a href="" style={{textAlign: 'right'}} onClick={this.clearBind}>重置</a>
                        </div>
                    </div>
                ),
                filterDropdownVisible: bindfilterDropdownVisible,
                filterIcon: <Icon type="filter" style={{ color: this.state.isBind ? '#108ee9' : '#aaa' }}/>,
                onFilterDropdownVisibleChange: (visible) => {
                    this.setState({bindfilterDropdownVisible: visible})
                }
            },
            {
                title: '类型',
                dataIndex: '',
                className: 'fonts',
                render: (record) => (
                    <div>
                        {record.type === 1 ?  <Tag color="orange">平板</Tag> : <Tag color="green">腰环</Tag>}
                    </div>
                ),
                filterDropdown: (
                    <div style={{width: 90, padding: '8px', borderRadius: 6, backgroundColor: '#fff', boxShadow: '0 1px 6px rgba(0, 0, 0, .2)', display: 'flex', flexFlow: 'column wrap'}}>
                        <RadioGroup onChange={this.handleTypeChange} value={type}>
                            <Radio value={1} style={radioStyle}>平板</Radio>
                            <Radio value={2} style={radioStyle}>腰环</Radio>
                        </RadioGroup>
                        <div style={{borderTop: 'solid 1px #e8e8e8', paddingTop: 8, display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between'}}>
                            <a href="" style={{textAlign: 'left'}} onClick={this.filterType}>确认</a>
                            <a href="" style={{textAlign: 'right'}} onClick={this.clearType}>重置</a>
                        </div>
                    </div>
                ),
                filterDropdownVisible: typefilterDropdownVisible,
                filterIcon: <Icon type="filter" style={{ color: this.state.type ? '#108ee9' : '#aaa' }}/>,
                onFilterDropdownVisibleChange: (visible) => {
                    this.setState({typefilterDropdownVisible: visible})
                }
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                className: 'fonts',
                sorter: true,
                filterDropdown: (
                    <div style={{width: 450, padding: '8px', borderRadius: 6, backgroundColor: '#fff', boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'}}>
                        <RangePicker onChange={(date, dateString) => this.handleDateChange(date, dateString)} style={{marginRight: 10}} showTime
                                     renderExtraFooter={() => 'extra footer'} onOk={() => this.searchCreateTime()} value={date} locale={{lang: {placeholder: '请选择日期', rangePlaceholder: ['开始日期', '结束日期'], "ok": "确定",}}}/>
                        <Button type="primary" onClick={() => this.clearDate()}>重置</Button>
                    </div>
                ),
                filterDropdownVisible: timefilterDropdownVisible,
                filterIcon: <Icon type="search" style={{ color: date.length > 0 ? '#108ee9' : '#aaa' }} onClick={() => this.isShow()}/>
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
                                    onConfirm={() => this.onDelete(record.id)}>
                            <a href="" style={{marginLeft: 10}}><Icon type="delete" style={{fontSize: 18}}/></a>
                        </Popconfirm>
                    </div>
                )
            }]
        return (
            <div>
                <Card title={<div style={{ fontSize: 14, color: 'black' }}><Icon type="desktop" /><span style={{marginLeft: 10}}>设备管理</span></div>}>
                    <div>
                        <Table pagination={false} columns={columns} dataSource={devList} locale={{emptyText: '暂无数据'}}
                               size={'middle'} loading={loading} rowKey={record => record.devid}
                               onChange={this.handleTableChange}
                        />
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