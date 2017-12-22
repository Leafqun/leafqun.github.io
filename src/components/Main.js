import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route } from 'react-router-dom'
import { Row, Col, Button, Icon, Dropdown, Menu, Avatar, Affix } from 'antd'
import * as siderBarAction from "../actions/siderBarActions"
import * as loginAction from '../actions/loginActions'
import * as tagsAction from '../actions/tagsActions'
import SiderBarMenu from './main/siderBarMenu'
import BreadcrumbNav from './main/breadcrumbNav'
import TagsPageOpened from './main/tagsPageOpened'
import UserManage from './users/userManage'
import User from './users/user'
import DevManage from './devs/devManage'
import DevAdd from './devs/devAdd'
import Dev from './devs/dev'
import GroupManage from './groups/groupManage'
import Group from './groups/group'
import PostManage from './posts/postManage'
import Personal from './personal/personal'
import Home from './home/home'
import './main.css'
import { history } from "../App";
import tags from "../config/tags"

class Main extends Component {
    toggleCollapsed = () => {
        this.props.setCollapsed()
        window.sessionStorage.setItem('collapsed', this.props.collapsed)
    }
    goToPersonal = (e) => {
        e.preventDefault()
        this.createTag('personal')
        history.push({pathname: '/personal'})
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
    logout = () => {
        this.props.logout()
        window.sessionStorage.setItem('isLogin', false)
        history.push({pathname: '/login'})
    }
    render () {
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <a href="" onClick={this.goToPersonal}>个人中心</a>
                </Menu.Item>
                <Menu.Item key="1">
                    <a  onClick={this.logout}>注销</a>
                </Menu.Item>
            </Menu>
        )
        const { collapsed, height } = this.props
        return (
            <div id="main" className="main">
                <Row>
                    <Col span={collapsed ? '1' : '3'} style={{backgroundColor: '#001529'}}>
                        <Affix>
                            <div className="logo-con">
                                {collapsed ?
                                    <img src={require('./logo-min.jpg')} alt="pic"
                                         style={{height: 60, width: '80%', marginLeft: 10}}/>
                                    : <img src={require('./logo.jpg')} alt="pic"/>
                                }
                            </div>
                            <SiderBarMenu></SiderBarMenu>
                        </Affix>
                    </Col>
                    <Col span={collapsed ? '23' : '21'} className="main_header-con" style={{ backgroundColor: '#f0f0f0', minHeight: height }}  id="ss">
                        <Affix>
                            <div className="main-header">
                                <div className="navicon-con">
                                    <Button type="default" onClick={this.toggleCollapsed}>
                                        <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'}/>
                                    </Button>
                                </div>
                                <div className="header-middle-con">
                                    <div className="main-breadcrumb">
                                        <BreadcrumbNav/>
                                    </div>
                                </div>
                                <div className="header-avator-con">
                                    <Row type="flex" justify="center" align="middle">
                                        <Dropdown overlay={menu} trigger={['click']}>
                                            <a href="">
                                                <span className="main-user-name">admin</span>
                                                <Icon type="down"/>
                                            </a>
                                        </Dropdown>
                                        <Avatar style={{backgroundColor: '#619fe7', marginLeft: 10}} src={require('./users/1.jpg')}></Avatar>
                                    </Row>
                                </div>
                            </div>
                            <div className="tags-con">
                               <TagsPageOpened/>
                            </div>
                        </Affix>
                        <div>
                            <div className="single-page-con">
                                <div className="single-page">
                                    <Route path="/home" component={Home}></Route>
                                    <Route exact path="/users" component={UserManage}></Route>
                                    <Route path="/users/:userid/:id" component={User}></Route>
                                    <Route exact path="/devs" component={DevManage}></Route>
                                    <Route path="/devs/:devid" component={Dev}></Route>
                                    <Route exact path="/dev/add" component={DevAdd}></Route>
                                    <Route exact path="/groups" component={GroupManage}></Route>
                                    <Route exact path="/posts" component={PostManage}></Route>
                                    <Route path="/groups/:groupid" component={Group}></Route>
                                    <Route exact path="/personal" component={Personal}></Route>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

function mapStateToProps (state) {
    return {
        collapsed: state.collapsed,
        height: state.height,
        tagsOpenedList: state.tagsOpenedList
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Object.assign(siderBarAction, loginAction, tagsAction), dispatch)
}

const Mains = connect(mapStateToProps, mapDispatchToProps)(Main)

export default Mains