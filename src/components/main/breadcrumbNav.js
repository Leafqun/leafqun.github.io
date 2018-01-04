import React from 'react'
import { Breadcrumb } from 'antd'
import {history} from "../../App";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as tagsActions from "../../actions/tagsActions";

class BreadcrumbNav extends React.Component {
    goNav = (e, name) => {
        e.preventDefault()
        history.push({pathname: '/' + name})
        this.props.setActiveTag(history.location.pathname)
    }
    render () {
        const {activeTag} = this.props
        return (
            <div>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item ><a href="" onClick={(e) => this.goNav(e, 'home')}>首页</a></Breadcrumb.Item>
                    {activeTag.indexOf('/users') >= 0 ?
                        <Breadcrumb.Item ><a href="" onClick={(e) => this.goNav(e, 'users')}>用户管理</a></Breadcrumb.Item> : ''
                    }
                    {activeTag.indexOf('/users/') >= 0 ?
                        <Breadcrumb.Item >用户详情</Breadcrumb.Item> : ''
                    }
                    {activeTag.indexOf('devs') >= 0 || activeTag.indexOf('dev') >= 0?
                        <Breadcrumb.Item ><a href="" onClick={(e) => this.goNav(e, 'devs')}>设备管理</a></Breadcrumb.Item> : ''
                    }
                    {activeTag.indexOf('/devs/') >= 0 ?
                        <Breadcrumb.Item >设备详情</Breadcrumb.Item> : ''
                    }
                    {activeTag.indexOf('/dev/add') >= 0 ?
                        <Breadcrumb.Item >设备添加</Breadcrumb.Item> : ''
                    }
                    {activeTag.indexOf('/groups') >= 0 ?
                        <Breadcrumb.Item >群组管理</Breadcrumb.Item> : ''
                    }
                    {activeTag.indexOf('/groups/') >= 0 ?
                        <Breadcrumb.Item >群组详情</Breadcrumb.Item> : ''
                    }
                    {activeTag.indexOf('/posts') >= 0 ?
                        <Breadcrumb.Item >帖子列表</Breadcrumb.Item> : ''
                    }
                    {activeTag.indexOf('/personal') >= 0 ?
                        <Breadcrumb.Item >个人中心</Breadcrumb.Item> : ''
                    }
                    {activeTag.indexOf('/manageAlarmLog') >= 0 ?
                        <Breadcrumb.Item >警报日志管理</Breadcrumb.Item> : activeTag.indexOf('/alarm') >= 0 ? <Breadcrumb.Item >警报</Breadcrumb.Item> : ''
                    }
                </Breadcrumb>
            </div>
        )
    }
}
function mapStateToProps (state) {
    return {
        activeTag : state.activeTag
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(tagsActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps) (BreadcrumbNav)