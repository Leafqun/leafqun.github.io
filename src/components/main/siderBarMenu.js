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
    render () {
        const { collapsed, height } = this.props
        return (
            <div>
                <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={collapsed}
                    style={{width: '100%', textAlign: collapsed ? 'left' : 'left', height: height - 100}}
                    onClick={this.handleMenuChange}
                >
                    <Menu.Item key="users">
                        <Icon type="pie-chart" />
                        <span>用户管理</span>
                    </Menu.Item>
                    <Menu.Item key="devs">
                        <Icon type="desktop" />
                        <span>设备管理</span>
                    </Menu.Item>
                    <Menu.Item key="dev/add">
                        <Icon type="inbox" />
                        <span>设备添加</span>
                    </Menu.Item>
                    <Menu.Item key="groups">
                        <Icon type="inbox" />
                        <span>群组管理</span>
                    </Menu.Item>
                    <Menu.Item key="alarm">
                        <Icon type="mail" />
                        <span>警报</span>
                    </Menu.Item>
                    <Menu.Item key="manageAlarmLog">
                        <Icon type="mail" />
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
        tagsOpenedList: state.tagsOpenedList
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Object.assign(siderBarActions, tagsActions), dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SiderBarMenu)