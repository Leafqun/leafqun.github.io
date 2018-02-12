import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as siderBarActions from '../../actions/siderBarActions'
import * as tagsActions from '../../actions/tagsActions'
import { Menu, Icon } from 'antd';
import { history } from '../../App'
import tags from '../../config/tags'


class SiderBarMenu extends React.Component {
    handleMenuChange = ({ item, key, selectedKeys }) => {
        let {tagsOpenedList} = this.props
        let isOpened = false
        tagsOpenedList.forEach((tag,index) => {
            if (tag.name === key) {
                isOpened = true
                // this.props.moveToSecond(index)
                return
            }
        })
        if (!isOpened) {
            this.props.createTag({name: key, title: tags[key]})
        }
        history.push({ pathname: '/' + key })
        this.props.setActiveTag(history.location.pathname)
    }
    chooseActiveTag = (val) => {
        let splitTag = val.split('/');
        if (splitTag.length > 3) return splitTag[1]
        else if (splitTag.length === 3) return splitTag[1] + '/' + splitTag[2]
        else return splitTag[1]
    }
    render () {
        const { collapsed, height, activeTag } = this.props
        return (
            <div>
                <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="dark"
                    selectedKeys={[this.chooseActiveTag(activeTag)]}
                    inlineCollapsed={collapsed}
                    style={{width: '100%', textAlign: collapsed ? 'left' : 'left', height: height - 100}}
                    onClick={this.handleMenuChange}
                >
                    <Menu.Item key="users">
                        <Icon type="user" />
                        <span>用户管理</span>
                    </Menu.Item>
                    <Menu.Item key="devs">
                        <Icon type="desktop" />
                        <span>设备管理</span>
                    </Menu.Item>
                    <Menu.Item key="dev/add">
                        <Icon type="laptop" />
                        <span>设备添加</span>
                    </Menu.Item>
                    <Menu.Item key="groups">
                        <Icon type="usergroup-add" />
                        <span>群组管理</span>
                    </Menu.Item>
                    <Menu.Item key="alarm">
                        <Icon type="notification" />
                        <span>警报</span>
                    </Menu.Item>
                    <Menu.Item key="manageAlarmLog">
                        <Icon type="calendar" />
                        <span>警报日志管理</span>
                    </Menu.Item>
                    <Menu.Item key="posts">
                        <Icon type="mail" />
                        <span>帖子管理</span>
                    </Menu.Item>
                </Menu>
            </div>
        )
    }
}

function mapStateToProps (state) {
    return {
        collapsed: state.collapsed,
        height: state.height,
        width: state.width,
        tagsOpenedList: state.tagsOpenedList,
        activeTag: state.activeTag
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Object.assign(siderBarActions, tagsActions), dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SiderBarMenu)