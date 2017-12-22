import React from 'react'
import {Card, Icon, Spin, List, Divider, Pagination, Popconfirm, Avatar, Input, DatePicker, Button, Select} from 'antd'
import axios from 'axios'
import url, {picUrl} from '../../config/url'
import '../users/user.css'
import {history} from "../../App";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import tags from "../../config/tags";
import * as tagsActions from "../../actions/tagsActions";
import QueueAnim from 'rc-queue-anim';
const {RangePicker} = DatePicker;
const Option = Select.Option;

class PostManage extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            postList: [],
            loading: true,
            total: 1,
            currentPage: 1,
            commentList: {},
            commentLoading: {},
            showComments: {},
            which: 'userName',
            date: [],
            condition: ''
        }
    }
    componentWillMount () {
        this.getPostList({currentPage: 1})
    }
    getPostList = (val) => {
        this.setState({loading: true})
        axios.get(url + 'posts/getPostList', {params: val}).then(response => {
            this.setState({loading: false, postList: response.data.postList.data, total: response.data.postList.total})
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
        if (showComments[postid]) this.getCommentListFromPost(postid)
    }
    getCommentListFromPost = (postid) => {
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
    handlePageChange = (page) => {
        this.setState({currentPage: page, postList: []})
        let params = {}
        let {condition, which, date} = this.state
        params[which] = condition
        if (date.length > 1) {
            params['startTime'] = date[0].format("YYYY-MM-DD HH:mm:ss")
            params['endTime'] = date[1].format("YYYY-MM-DD HH:mm:ss")
        }
        params['currentPage'] = page
        this.getPostList(params)
    }
    handleUserNameChange = (e) => {
        this.setState({condition: e.target.value})
    }
    handleDateChange = (date, dateString) => {
        this.setState({date: date})
    }
    selected = (value) => {
        this.setState({which: value, userName: ''})
    }
    search = () => {
        let params = {}
        let {condition, which, date} = this.state
        params[which] = condition.trim()
        if (date.length > 1) {
            params['startTime'] = date[0].format("YYYY-MM-DD HH:mm:ss")
            params['endTime'] = date[1].format("YYYY-MM-DD HH:mm:ss")
        }
        params['currentPage'] = 1
        this.getPostList(params)
    }
    clear = () => {
        this.setState({date: [], condition: ''})
        this.getPostList({currentPage: 1})
    }
    delete = (e, postid) => {
        axios.get(url + 'posts/deletePost', {params: {postid: postid}}).then(response => {
            if (response.data.msg === 'success') {
                let params = {}
                let {condition, which, date, currentPage} = this.state
                params[which] = condition
                params['currentPage'] = currentPage
                if (date.length > 1) {
                    params['startTime'] = date[0].format("YYYY-MM-DD HH:mm:ss")
                    params['endTime'] = date[1].format("YYYY-MM-DD HH:mm:ss")
                }
                this.getPostList(params)
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
        const {postList, loading, total, currentPage, commentLoading, commentList, showComments, condition, date} = this.state
        const selectAfter = (
            <Select defaultValue="userName" style={{ width: 80,fontSize: 10 }} size="small" onChange={(value) => this.selected(value)}>
                <Option value="userName">用户名</Option>
                <Option value="tel_num">手机号</Option>
                <Option value="userid">用户id</Option>
            </Select>
        )
        const title =  <div style={{ fontSize: 14, color: 'black', display: 'flex'}}>
            <div><Icon type="user-add"/><span style={{marginLeft: 10}}>帖子列表</span></div>
            <div style={{marginLeft: 20}}><RangePicker onChange={(date, dateString) => this.handleDateChange(date, dateString)} style={{marginRight: 10}} showTime size="small"
                                                       renderExtraFooter={() => 'extra footer'} value={date} locale={{lang: {placeholder: '请选择日期', rangePlaceholder: ['开始日期', '结束日期']}}}/></div>
            <div style={{marginLeft: 5}}><Input size="small" style={{width: 200}} onChange={this.handleUserNameChange} value={condition} placeholder="请输入用户名或id"/>{selectAfter}</div>
            <div style={{marginLeft: 10}}><Button size="small" onClick={this.clear}>清空</Button><Button size="small" onClick={this.search} type="primary" style={{marginLeft: 5}}>提交</Button></div>
        </div>
        const IconText = ({ type, text }) => (
            <span>
                <Icon type={type} style={{ marginRight: 8 }} />
                {text}
             </span>
        );
        return (
            <div>
                <Card title={title}>
                    <Spin spinning={loading}>
                        {/*<List
                            itemLayout="vertical"
                            dataSource={postList}
                            renderItem={post => (
                                <List.Item
                                    key={post.postid}
                                    actions={[
                                        <IconText type="like-o" text={post.like_num} />,
                                        <a href="" onClick={(e) => this.showComments(e, post.postid)}><IconText type="message" text={post.comment_num}/></a>,
                                        <span>{post.create_time}</span>,
                                        <Popconfirm title="确定要删除吗？"><a href=""><IconText type="delete" text=""/></a></Popconfirm>
                                    ]}
                                >
                                    <div style={{marginBottom: 10}}>{post.content}</div>
                                    <div>{post.post_pic.length > 0 ? post.post_pic.map(pic =>
                                        <img width={100} height={100} alt="logo"  src={picUrl + user.id + '/' + pic.pic_name} key={pic.ppid} style={{marginRight: 5}}/>
                                    ) : ''}</div>
                                </List.Item>
                            )}
                        />*/}
                        <div className="List">
                            <QueueAnim
                                type={['right', 'left']}
                                ease={['easeOutQuart', 'easeInOutQuart']}>
                            {postList.map((post, index, arr) =>
                                <div key={post.postid}>
                                    <div className="postItem" style={index >= arr.length - 1 ? {border: 0} : {}}>
                                        <div style={{display: 'flex', alignItems: 'center', marginBottom: 15}}>
                                            <Avatar src={post.avatar ? picUrl + post.id + '/' + post.avatar : ''} />
                                            <div style={{marginLeft: 10}}>
                                                <a href="" onClick={(e) => this.showUserInfo(e, post.userid, post.id)}><span style={{fontSize: 18}}>{post.name}</span><span style={{fontSize: 10}}>#{post.userid}</span></a>
                                            </div>
                                        </div>
                                        <div className="content">
                                            <div style={{marginBottom: 10}}>{post.content}</div>
                                            <div>{post.post_pic.length > 0 ? post.post_pic.map(pic =>
                                                <img width={100} height={100} alt="logo"
                                                     src={picUrl + post.id + '/' + pic.pic_name} key={pic.ppid}
                                                     style={{marginRight: 5}}/>
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
                                    <QueueAnim
                                        animConfig={[
                                            { opacity: [1, 0], translateY: [0, 50] },
                                            { opacity: [1, 0], translateY: [0, -12] }
                                        ]}>
                                    {showComments[post.postid] ? <div key="a">
                                        <div style={{fontSize: 16, fontWeight: 800, margin: '10px 0 10px 0'}}>总计{post.comment_num}条评论：</div>
                                        <Spin spinning={commentLoading[post.postid]}>
                                            {<List
                                                locale={{emptyText: '暂无数据'}}
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
                            )}
                            </QueueAnim>
                        </div>
                        <Pagination size="small" total={total} style={{textAlign: 'center', marginTop: 10}}
                                    showQuickJumper pageSize={5} current={currentPage}
                                    onChange={this.handlePageChange}
                                    showTotal={(total, range) => `共${total}条`}/>
                    </Spin>
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
export default connect(mapStateToProps, mapDispatchToProps) (PostManage)