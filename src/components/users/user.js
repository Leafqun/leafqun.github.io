import React from 'react'
import {Card, Icon, Tag, Tooltip, Spin, List, Divider, Pagination, Popconfirm, Avatar} from 'antd'
import {history} from "../../App";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as tagsActions from "../../actions/tagsActions"
import url from '../../config/url'
import axios from  'axios'
import { picUrl } from '../../config/url'
import './user.css'
import tags from "../../config/tags";
import QueueAnim from 'rc-queue-anim';

class User extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            user: {
                id: '',
                userid: '',
                name: '',
                password: '',
                tel_num: '',
                avatar: '',
                is_login: '',
                devList: []
            },
            userLoading: true,
            groupList: [],
            groupLoading: true,
            postList: [],
            total: 1,
            currentPage: 1,
            postLoading: true,
            commentList: {},
            commentLoading: {},
            showComments: {}
        }
    }
    componentWillMount () {
        this.getUserInfo()
        this.getGroupListFromUser()
        this.getPostListFromUser(1)
    }
    getUserInfo = () => {
        const userid = history.location.pathname.split('/')
        this.setState({userLoading: true})
        axios.get(url + 'users/getUserInfo', {params: {userid: userid[2]}}).then(response => {
            this.setState({userLoading: false, user: response.data.user})
        }).catch(error => {
            console.log(error)
        })
    }
    getGroupListFromUser = () => {
        const id = history.location.pathname.split('/')
        this.setState({groupLoading: true})
        axios.get(url + 'users/getAllGroupFromUser', {params: {id: id[3]}}).then(response => {
            this.setState({groupList: response.data.groupList, groupLoading: false})
        }).catch(error => {
            console.log(error)
        })
    }
    getPostListFromUser = (page) => {
        const id = history.location.pathname.split('/')
        this.setState({postLoading: true})
        axios.get(url + 'posts/getPostListFromUser', {params: {id: id[3], currentPage: page}}).then(response => {
            this.setState({postLoading: false, postList: response.data.postList.data, total: response.data.postList.total})
        }).catch(error => {
            console.log(error)
        })
    }
    getCommentListfromPost = (postid) => {
        let {commentList, commentLoading} = this.state
        commentLoading[postid] = true
        this.setState({commentLoading})
        axios.get(url + 'comments/getCommentList', {params: {postid: postid}}).then(response => {
            commentList[postid] = response.data.commentList
            commentLoading[postid] = false
            this.setState({commentList, commentLoading})
        }).catch(error => {
            console.log(error)
        })
    }
    showComments = (e, postid) => {
        e.preventDefault()
        let {showComments} = this.state
        if(showComments[postid]) showComments[postid] = !showComments[postid]
        else showComments[postid] = true
        this.setState({showComments})
        if (showComments[postid]) this.getCommentListfromPost(postid)
    }
    back = (e) => {
        e.preventDefault()
        history.push({pathname: '/users'})
        this.props.setActiveTag(history.location.pathname)
    }
    handlePageChange = (page) => {
        this.setState({currentPage: page, postList: []})
        this.getPostListFromUser(page)
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
    showGroupInfo = (e, groupid) => {
        e.preventDefault()
        this.createTag('groups')
        history.push({pathname: '/groups/' + groupid})
        this.props.setActiveTag(history.location.pathname)
    }
    showDevInfo = (e, devid) => {
        e.preventDefault()
        this.createTag('devs')
        history.push({pathname: '/devs/' + devid})
        this.props.setActiveTag(history.location.pathname)
    }
    delete = (e, postid) => {
        e.preventDefault()
        axios.get(url + 'posts/deletePost', {params: {postid: postid}}).then(response => {
            if (response.data.msg === 'success') {
                this.getPostListFromUser(this.state.currentPage)
            }
        }).catch(error => {
            console.log(error)
        })
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
    render () {
        const {user, userLoading, groupList, groupLoading, postList, postLoading, total, currentPage, commentList, commentLoading, showComments} = this.state
        const id = history.location.pathname.split('/')[3]
        const title =  <div style={{ fontSize: 14, color: 'black' }}>
                            <Icon type="user-add"/><span style={{marginLeft: 10}}>用户详情</span>
                        </div>
        const IconText = ({ type, text }) => (
             <span>
                <Icon type={type} style={{ marginRight: 8 }} />
                {text}
             </span>
        );
        return (
            <div>
                <Card title={title} extra={<a href="" onClick={(e) => this.back(e)}><Icon type="arrow-left" style={{fontSize: 16}}/></a>}>
                    <QueueAnim>
                    <div className="namePic" key={1}>
                        <Spin spinning={userLoading}>
                            <div className="pic">
                                <img src={user.avatar ? picUrl + id + '/' + user.avatar : picUrl + '1.jpg'} width="100" height="100" alt="用户头像"/>
                            </div>
                            <div className="name">
                                <div>
                                    <div><span className="username">{user.name}</span>#{user.userid}</div>
                                </div>
                                <div className="tag">
                                    <div>
                                        <Tooltip
                                            title="性别"><span>{user.gender ? user.gender === 2 ? '男' : '女' : '未知'}</span></Tooltip>
                                        <Tag color={user.is_login ? '#87d068' : '#f50'}
                                             style={{marginLeft: 20}}>{user.is_login ? '在线' : '离线'}</Tag>
                                        <span
                                            style={{marginLeft: 20}}>{user.is_login ? `登录地点：${user.city ? user.city : ''}` : `上次登录地点：${user.city ? user.city : ''}`}</span>
                                    </div>
                                </div>
                            </div>
                        </Spin>
                    </div>
                    <div className="otherInfo" key={2}>
                        手机：{user.tel_num ? user.tel_num : '无' }
                    </div>
                    <div style={{display: 'flex', flexFlow: 'row wrap'}} className="otherInfo" key={3}>
                        <div>群组：</div>
                        {groupList.length > 0 ? groupList.map((group) =>
                            <div key={group.groupid}
                                 style={{marginRight: 15}}><a href="" onClick={(e) => this.showGroupInfo(e, group.groupid)}>{group.group_name}<span style={{fontSize: 10, fontWeight: 400}}>#{group.groupid}</span></a></div>
                        ) : '无'}
                        <Spin spinning={groupLoading}/>
                    </div>
                        <div style={{display: 'flex', flexFlow: 'row wrap'}} className="otherInfo" key={6}>
                            <div>设备：</div>
                            {user.devList.length > 0 ? user.devList.map((dev) =>
                                <div key={dev.devid}
                                     style={{marginRight: 15}}><a href=""
                                                                  onClick={(e) => this.showDevInfo(e, dev.devid)}>{dev.devid}<span
                                    style={{fontSize: 10, fontWeight: 400}}>({dev.type === 1 ? '平板' : '腰环'})</span></a></div>
                            ) : '未绑定设备'}
                            <Spin spinning={groupLoading}/>
                        </div>
                    <Divider key={4}>帖子</Divider>
                    <Spin spinning={postLoading} key={5}>
                        <div className="List">
                            <QueueAnim
                                type={['right', 'left']}
                                ease={['easeOutQuart', 'easeInOutQuart']}>
                            {postList.length > 0 ? postList.map((post, index, arr) =>
                                <div key={post.postid}>
                                    <div className="postItem" style={index >= arr.length - 1 ? {border: 0} : {}}>
                                        <div className="content">
                                            <div style={{marginBottom: 10}}>{post.content}</div>
                                            <div>{post.post_pic.length > 0 ? post.post_pic.map(pic =>
                                                <img height={150} alt="logo"
                                                     src={picUrl + user.id + '/' + pic.pic_name} key={pic.ppid}
                                                     style={{marginRight: 5, marginBottom: 5}}/>
                                            ) : ''}</div>
                                        </div>
                                        <ul className="footer">
                                            <li className="footerItem"><IconText type="like-o"
                                                                                 text={post.like_num}/><Divider
                                                type="vertical" className="rightBorder"/></li>
                                            <li className="footerItem"><a href=""
                                                                          onClick={(e) => this.showComments(e, post.postid)}><IconText
                                                type="message" text={post.comment_num}/></a><Divider type="vertical"
                                                                                                     className="rightBorder"/>
                                            </li>
                                            <li className="footerItem"><span>{this.datetimeFormat(post.create_time)}</span><Divider
                                                type="vertical" className="rightBorder"/></li>
                                            <li className="footerItem"><Popconfirm title="确定要删除吗？" onConfirm={(e) => this.delete(e, post.postid)}><a href=""><IconText
                                                type="delete" text=""/></a></Popconfirm></li>
                                        </ul>
                                    </div>
                                    <QueueAnim animConfig={[
                                        { opacity: [1, 0], translateY: [0, 50] },
                                        { opacity: [1, 0], translateY: [0, -15] }
                                    ]}>
                                    {showComments[post.postid] ? <div  key="a">
                                        <div style={{fontSize: 16, fontWeight: 800, margin: '10px 0 10px 0'}}>总计{post.comment_num}条评论：</div>
                                        <Spin spinning={commentLoading[post.postid]}>
                                        {<List
                                            itemLayout="vertical"
                                            dataSource={commentList[post.postid]}
                                            renderItem={comment => (
                                                <List.Item
                                                    key={comment.commentid}
                                                >
                                                    <List.Item.Meta
                                                        title={<div style={{display: 'flex', alignItems: 'center'}}><Avatar src={comment.avatar ? picUrl + comment.id + '/' + comment.avatar : ''} /><div style={{marginLeft: 10}}>{comment.name}</div></div>}
                                                        description={comment.content}
                                                    />
                                                    <div>{this.datetimeFormat(comment.create_time)}</div>
                                                </List.Item>
                                            )}
                                        />}
                                        </Spin>
                                        <Divider>end</Divider>
                                    </div> : null}
                                    </QueueAnim>
                                </div>
                            ) : null}
                            </QueueAnim>
                       </div>
                        <Pagination size="small" total={total} style={{textAlign: 'center', marginTop: 10}}
                                    showQuickJumper pageSize={5} current={currentPage}
                                    onChange={this.handlePageChange}
                                    showTotal={(total, range) => `共${total}条`}/>
                    </Spin>
                    </QueueAnim>
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
export default connect(mapStateToProps, mapDispatchToProps) (User)