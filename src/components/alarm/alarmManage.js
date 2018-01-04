import React from 'react'
import {Card, Icon, Popconfirm, Table} from 'antd'
import testData from './data/input'
import {history} from "../../App";
import tags from "../../config/tags";
import * as tagsActions from "../../actions/tagsActions"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'


class AlarmManage extends React.Component {
    showDevInfo = (e, devid) => {
        e.preventDefault()
        this.createTag('devs')
        history.push({pathname: '/devs/' + devid})
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
        let columns = [
            { title: '城市', dataIndex: 'name', className: 'fonts' },
            {
                title: '设备ID',
                dataIndex: '',
                className: 'fonts',
                render: record => (
                    <div><a href="" onClick={(e) => this.showDevInfo(e, record.devid)}>{record.devid}</a></div>
                )
            },
            {
                title: '经纬度',
                dataIndex: '',
                className: 'fonts',
                render: record => (
                    <div>{record.location.length > 0 ? `[${record.location[0]}, ${record.location[1]}]`  : []}</div>
                )
            },
            {
                title: '创建时间',
                dataIndex: 'time',
                className: 'fonts'
            },
            {
                title: '操作',
                dataIndex: '',
                width: 100,
                key: 'useridx', render: (record) => (
                    <div>
                        <Popconfirm title="确定要删除吗?" placement="top" okText="是" cancelText="否"
                                    onConfirm={() => this.onDelete(record.did)}>
                            <a href="" style={{marginLeft: 10}}><Icon type="delete" style={{fontSize: 18}}/></a>
                        </Popconfirm>
                    </div>
                )
            }]
        const title = <div><Icon type="user-add"/><span style={{marginLeft: 10}}>警报日志管理</span></div>
        return (
            <Card title={title}>
                <Table dataSource={testData} columns={columns} size="middle" locale={{emptyText: '暂无数据'}} rowKey={record => record.devid + record.time}/>
            </Card>
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
export default connect(mapStateToProps, mapDispatchToProps) (AlarmManage)