import React from 'react'
import {Card, Icon, Spin, Tooltip, Tag} from 'antd'
import axios from 'axios'
import url, {picUrl} from '../../config/url'
import {history} from "../../App";
import '../users/user.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as tagsActions from "../../actions/tagsActions";
import tags from "../../config/tags";

class Group extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            group: {
                groupid: '',
                group_name: '',
                devid: '',
                total: '',
                create_time: ''
            },
            loading: true,
            userList: [],
            userLoading: true
        }
    }
    componentWillMount () {
        this.getGroupInfo()
        this.getGroupMemberList()
    }
    getGroupInfo = () => {
        this.setState({loading: true})
        axios.get(url + 'groups/getGroup', {params: this.props.match.params}).then(response => {
            this.setState({group: response.data.group, loading: false})
        }).catch(error => {
            console.log(error)
        })
    }
    getGroupMemberList = () => {
        this.setState({userLoading: true})
        axios.get(url + 'groups/getAllUserFromGroup', {params: this.props.match.params}).then(response => {
            this.setState({userLoading: false, userList: response.data.userList})
        }).catch(error => {
            console.log(error)
        })
    }
    back = (e) => {
        e.preventDefault()
        history.push({pathname: '/groups'})
        this.props.setActiveTag(history.location.pathname)
    }
    showDevInfo = (e, devid) => {
        e.preventDefault()
        this.createTag('devs')
        history.push({pathname: '/devs/' + devid})
        this.props.setActiveTag(history.location.pathname)
    }
    showUserInfo = (e, userid, id) => {
        e.preventDefault()
        this.createTag('users')
        history.push({pathname: '/users/' + userid + '/' + id})
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
    render () {
        const {group, loading, userLoading, userList} = this.state
        const title =  <div style={{ fontSize: 14, color: 'black' }}>
            <Icon type="user-add"/><span style={{marginLeft: 10}}>群组详情</span>
        </div>
        return (
            <div>
                <Card title={title} extra={<a href="" onClick={(e) => this.back(e)}><Icon type="arrow-left" style={{fontSize: 16}}/></a>}>
                    <div className="namePic">
                        <div className="pic">
                            <img src={group.avatar ? picUrl + '/' + group.avatar : picUrl + '1.jpg'} width="100"
                                 height="100" alt="群组头像"/>
                        </div>
                        <div className="name">
                            <div>
                                <div><span className="username">{group.group_name}</span>#{group.groupid}<Spin
                                    spinning={loading}/></div>
                            </div>
                            <div className="tag">
                                <div>
                                    <Tooltip
                                        title="群组人数"><Tag color="#87d068">{group.total}<Spin spinning={loading}/></Tag></Tooltip>
                                    <span
                                        style={{marginLeft: 20}}>创建于：{group.create_time}<Spin
                                        spinning={loading}/></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="otherInfo">
                        设备：<a href="" onClick={(e) => this.showDevInfo(e, group.devid)}>{group.devid}</a><Spin spinning={loading}/>
                    </div>
                    <div style={{display: 'flex', flexFlow: 'row wrap'}} className="otherInfo">
                        <div>群组成员：</div>
                        {userList.length > 0 ? userList.map((user) =>
                            <div key={user.id}
                                 style={{marginRight: 20}}><a href="" onClick={(e) => this.showUserInfo(e, user.userid, user.id)}>{user.nickname}<span style={{fontSize: 10}}>#{user.userid}</span> {user.auth === 2 ? '(群主)' : null}</a></div>
                        ) : null}
                        <Spin spinning={userLoading}/>
                    </div>
                </Card>
            </div>
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
export default connect(mapStateToProps, mapDispatchToProps) (Group)