import React from 'react'
import { Card, Table, Tag, Tooltip, Popconfirm, Icon, Pagination, Input, Select, Button, message } from 'antd'
import axios from 'axios'
import url from '../../config/url'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as tagsActions from '../../actions/tagsActions'
import {history} from "../../App";
const Option = Select.Option;

class UserManage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userList: null,
            total: 1,
            current: 1,
            loading: true,
            bl: false,
            userName: '',
            which: 'name'
        }
    }
    componentWillMount () {
        this.getUserList({currentPage: 1})
    }
    getUserList = (val) => {
        axios.get(url + 'users/getAllUsers', {params: val}).then(response => {
            let data = response.data.userList
            this.setState({userList: data.data, total: data.total, loading: false})
        }).catch(error => {
            console.log(error)
        })
    }
    handlePageChange = (page) => {
        this.setState({loading: true, current: page})
        this.search(page)
    }
    handleUserNameChange = (e) => {
       this.setState({userName: e.target.value})
    }
    search = (val) => {
        let condition = {}
        if (this.state.which === 'name') condition = {name: this.state.userName.trim()}
        else condition = {tel_num: this.state.userName.trim()}
        this.getUserList(Object.assign({currentPage: val}, condition))
    }
    userFilterSearch = () => {
        this.setState({current: 1})
        this.search(1)
    }
    selected = (value) => {
        this.setState({which: value, userName: ''})
    }
    clear = () => {
        this.setState({ userName: '', current: 1})
        this.getUserList({currentPage: 1})
    }
    showUserInfo = (e, id, userid) => {
        e.preventDefault()
        history.push({pathname: '/users/' + userid + '/' + id})
        this.props.setActiveTag(history.location.pathname)
    }
    onDelete = (did) => {
        message.info('暂无删除功能！！')
    }
    render () {
        const { userList, current, total, loading, userName } = this.state
        let columns = [
            {
                title: '#',
                dataIndex: '',
                width: 60,
                key: 'index',
                render: (text, record, index) => (
                    <div>{(index + 1) + (current - 1) * 15}</div>
                )
            },
            { title: '用户名', dataIndex: 'nickname', className: 'fonts' },
            { title: 'userid', dataIndex: 'userid', className: 'fonts' },
            { title: '密码', dataIndex: 'password', className: 'fonts' },
            { title: '手机号', dataIndex: 'name', className: 'fonts' },
            {
                title: '登录状态',
                dataIndex: 'is_login',
                render: (text, record, index) => (
                    <Tag color={record.is_login ? 'green' : 'red'}>{record.is_login ? '登录' : '下线'}</Tag>
                )
            }, {
                title: '操作',
                dataIndex: '',
                width: 100,
                key: 'useridx', render: (record) => (
                    <div>
                        <a href="" onClick={(e) => this.showUserInfo(e, record.id, record.userid)}>
                            <Tooltip title="用户查看" mouseEnterDelay={1} placement={'left'}>
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
        const selectAfter = (
            <Select defaultValue="name" style={{ width: 80,fontSize: 10 }} size="small" onChange={(value) => this.selected(value)}>
                <Option value="name">用户名</Option>
                <Option value="phone">手机号</Option>
            </Select>
        )
        const title = <div style={{ fontSize: 14, color: 'black' }}>
            <Icon type="user"/><span style={{marginLeft: 10}}>用户管理</span>
        </div>
        return (
            <div>
                <Card title={title}>
                    <div style={{marginBottom: 20}}>
                        <Input style={{marginLeft: 10, width: 300, marginRight: 5, fontSize: 10}}
                               placeholder="请输入用户名或手机号"  value={userName} suffix={userName ? <Icon type="close" onClick={() => this.clear()}/> : ''}
                               onChange={(e) => this.handleUserNameChange(e)} addonAfter={selectAfter}/>
                        <Button type="primary" icon="search" onClick={() => this.userFilterSearch()}/>
                    </div>
                    <div>
                        <Table pagination={false} columns={columns} dataSource={userList} locale={{emptyText: '暂无数据'}}
                               size={'middle'} loading={loading} rowKey={record => record.id}/>
                    </div>
                    <div style={{textAlign: 'center', marginTop: 20}}>
                        <Pagination defaultCurrent={1} total={total} showQuickJumper
                                    showTotal={(total, range) => `共${total}条`} size="small"
                                    pageSize={15} current={current} onChange={this.handlePageChange}/>
                    </div>
                </Card>
            </div>
        )
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(tagsActions, dispatch)
}
export default connect(null, mapDispatchToProps) (UserManage)