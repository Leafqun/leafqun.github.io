import React from 'react'
import { Card, Table, Tooltip, Popconfirm, Icon, Pagination, Input, Button, message } from 'antd'
import axios from 'axios'
import url from '../../config/url'
import {history} from "../../App";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as tagsActions from "../../actions/tagsActions"

class GroupManage extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            groupList: [],
            loading: true,
            total: 1,
            currentPage: 1,
            group_name: '',
            devid: '',
            groupNameFilterDropdownVisible: false,
            filtered1: false,
            filtered2: false,
            devidfilterDropdownVisible: false
        }
    }
    componentWillMount () {
        this.getGroupList({currentPage: 1})
    }
    getGroupList = (val) => {
        this.setState({loading: true})
        axios.get(url + 'groups/getGroupList', {params: val}).then(response => {
            this.setState({loading: false, groupList: response.data.groupList.data, total: response.data.groupList.total})
        }).catch(error => {
            console.log(error)
        })
    }
    handleGroupNameChange = (e) => {
        this.setState({group_name: e.target.value})
    }
    clearGroupName = () => {
        this.setState({group_name: ''})
        this.getGroupList({currentPage: 1})
    }
    searchGroupName = () => {
        this.setState({groupNameFilterDropdownVisible: false})
        this.getGroupList({currentPage: 1, group_name: this.state.group_name.trim()})
    }
    handleDevidChange = (e) => {
        this.setState({devid: e.target.value})
    }
    clearDevid = () => {
        this.setState({devid: ''})
        this.getGroupList({currentPage: 1})
    }
    searchDevid = () => {
        this.setState({devidfilterDropdownVisible: false})
        this.getGroupList({currentPage: 1, devid: this.state.devid.trim()})
    }
    showGroupInfo = (e, groupid, devid) => {
        e.preventDefault()
        history.push({pathname: '/groups/' + groupid})
        this.props.setActiveTag(history.location.pathname)
    }
    onDelete = (groupid) => {
        message.info('删除对应设备即可删除群组')
    }
    handlePageChange = (page) => {
        const {group_name, devid} = this.state
        this.getGroupList({currentPage: page, group_name, devid})
    }
    render () {
        const {groupList, loading, total, currentPage, devid, group_name, groupNameFilterDropdownVisible, devidfilterDropdownVisible} = this.state
        const title =  <div style={{ fontSize: 14, color: 'black' }}>
            <Icon type="user-add"/><span style={{marginLeft: 10}}>群组管理</span>
        </div>
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
                title: '群组名',
                dataIndex: 'group_name',
                className: 'fonts' ,
                filterDropdown: (
                    <div style={{width: 300, padding: '8px', borderRadius: 6, backgroundColor: '#fff', boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'}}>
                        <Input size="small" placeholder="搜索设备ID" style={{width: 200, marginRight: 8}}
                               onChange={(e) => this.handleGroupNameChange(e)} value={group_name}
                               suffix={group_name ? <Icon type="close" onClick={() => this.clearGroupName()}/> : ''}/>
                        <Button type="primary" onClick={() => this.searchGroupName()}>search</Button>
                    </div>
                ),
                filterDropdownVisible: groupNameFilterDropdownVisible,
                filterIcon: <Icon type="search" style={{ color: this.state.group_name ? '#108ee9' : '#aaa' }}/>,
                onFilterDropdownVisibleChange: (visible) => {
                    this.setState({groupNameFilterDropdownVisible: visible})
                }
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
            { title: '总人数', dataIndex: 'total', className: 'fonts' },
            { title: '创建时间', dataIndex: 'create_time', className: 'fonts' },
            {
                title: '操作',
                dataIndex: '',
                width: 100,
                key: 'useridx', render: (record) => (
                    <div>
                        <a href="" onClick={(e) => this.showGroupInfo(e, record.groupid, record.devid)}>
                            <Tooltip title="群组查看" mouseEnterDelay={1} placement={'left'}>
                                <Icon type="search" style={{fontSize: 18}}/>
                            </Tooltip>
                        </a>
                        <Popconfirm title="确定要删除吗?" placement="top" okText="是" cancelText="否"
                                    onConfirm={() => this.onDelete(record.groupid)}>
                            <a href="" style={{marginLeft: 10}}><Icon type="delete" style={{fontSize: 18}}/></a>
                        </Popconfirm>
                    </div>
                )
            }]
        return (
            <div>
                <Card  title={title}>
                    <div>
                        <Table pagination={false} columns={columns} dataSource={groupList} locale={{emptyText: '暂无数据'}}
                               size={'middle'} loading={loading} rowKey={record => record.groupid}/>
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
export default connect(null, mapDispatchToProps) (GroupManage)