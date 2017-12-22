import React from 'react'
import {Card, Icon, Spin, Input, Button} from 'antd'
import axios from 'axios'
import url from '../../config/url'
import {history} from "../../App"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as tagsActions from "../../actions/tagsActions";
import './dev.css'

class Dev extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            dev: {
                did: '',
                devid: '',
                groupid: '',
                dev_name: '',
                create_time: '',
                max: ''
            },
            loading: true,
            isEditDevid: false,
            isEditMax: false,
            devid: '',
            max: '',
            idLoading: false,
            maxLoading: false,
            idIcon: '',
            maxIcon: ''
        }
    }
    componentWillMount () {
        this.getDevInfo()
    }
    getDevInfo = () => {
        this.setState({loading: true})
        axios.get(url + 'devs/getDevInfo', {params: {devid: history.location.pathname.split('/')[2]}}).then(response => {
            this.setState({dev: response.data.dev, loading: false})
        }).catch(error => {
            console.log(error)
        })
    }
    back = (e) => {
        e.preventDefault()
        history.push({pathname: '/devs'})
        this.props.setActiveTag(history.location.pathname)
    }
    isEditDevid = (e) => {
        e.preventDefault()
        this.setState({isEditDevid: true})
    }
    isEditMax = (e) => {
        e.preventDefault()
        this.setState({isEditMax: true})
    }
    handleDevidChange = (e) => {
        this.setState({devid: e.target.value})
    }
    handleMaxChange = (e) => {
        this.setState({max: e.target.value})
    }
    submitDevid = () => {
        const {devid, dev} = this.state
        this.setState({idLoading: true})
        axios.get(url + 'devs/updateDevInfo', {params: {did: dev.did, devid}}).then(response => {
            if (response.data.msg === 'success') {
                dev['devid'] = devid
                this.setState({idLoading: false, dev, idIcon: 'check'})
                history.push({pathname: '/devs/' + devid})
            } else {
                this.setState({idLoading: false, dev, idIcon: 'close'})
            }
            let that = this
            setTimeout(() => {
                that.setState({idIcon: '', isEditDevid: false})
            }, 1000)
        }).catch(error => {
            console.log(error)
            this.setState({idLoading: false, dev, idIcon: 'close'})
            let that = this
            setTimeout(() => {
                that.setState({idIcon: '', isEditDevid: false})
            }, 1000)
        })
    }
    clearDevid = () => {
        this.setState({devid: '', isEditDevid: false})
    }
    submitMax = () => {
        const {max, dev} = this.state
        this.setState({maxLoading: true})
        axios.get(url + 'devs/updateDevInfo', {params: {did: dev.did, max}}).then(response => {
            if (response.data.msg === 'success') {
                dev['max'] = max
                this.setState({maxLoading: false, dev, maxIcon: 'check'})
            } else {
                this.setState({maxLoading: false, dev, maxIcon: 'close'})
            }
            let that = this
            setTimeout(() => {
                that.setState({maxIcon: '', isEditMax: false})
            }, 1000)
        }).catch(error => {
            console.log(error)
            this.setState({maxLoading: false, dev, maxIcon: 'close'})
            let that = this
            setTimeout(() => {
                that.setState({maxIcon: '', isEditMax: false})
            }, 1000)
        })
    }
    clearMax = () => {
        this.setState({max: '', isEditMax: false})
    }
    render () {
        const {loading, dev, isEditDevid, isEditMax, idLoading, maxLoading, idIcon, maxIcon} = this.state
        const title =  <div style={{ fontSize: 14, color: 'black' }}>
            <Icon type="user-add"/><span style={{marginLeft: 10}}>设备详情</span>
        </div>
        return (
            <div>
                <Card title={title} extra={<a href="" onClick={(e) => this.back(e)}><Icon type="arrow-left" style={{fontSize: 16}}/></a>}>
                    {isEditDevid ? <div className="editDev"><div><Input style={{width: 250}} placeholder="请输入设备id" onChange={this.handleDevidChange}/></div><div className="btn"><Button onClick={this.clearDevid} style={{marginRight: 5}}>取消</Button><Button type="primary" onClick={this.submitDevid} loading={idLoading} icon={idIcon}>提交</Button></div></div>
                        : <div className="devInfo"><div className="title">设备ID：</div><div className="content"><Spin spinning={loading}/>{dev.devid}</div><div style={{marginLeft: 5, fontWeight: 900}}><a href="" onClick={this.isEditDevid}><Icon type="edit" /></a></div></div>}
                    <div className="devInfo"><div className="title">创建时间：</div><div className="content"><Spin spinning={loading}/>{dev.create_time}</div></div>
                    {isEditMax ? <div className="editDev"><div><Input style={{width: 250}} placeholder="请输入最大人数" onChange={this.handleMaxChange}/></div><div className="btn"><Button onClick={this.clearMax} style={{marginRight: 5}}>取消</Button><Button type="primary" onClick={this.submitMax} loading={maxLoading} icon={maxIcon}>提交</Button></div></div>
                        : <div className="devInfo"><div className="title">最大人数：</div><div className="content"><Spin spinning={loading}/>{dev.max}</div><div style={{marginLeft: 5, fontWeight: 900}}><a href="" onClick={this.isEditMax}><Icon type="edit"/></a></div></div>}
                    <div className="devInfo"><div className="title">群组ID：</div><div className="content"><Spin spinning={loading}/>{dev.groupid}</div></div>
                    <div className="devInfo"><div className="title">群组名：</div><div className="content"><Spin spinning={loading}/>{dev.group_name}</div></div>
                </Card>
            </div>
        )
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(tagsActions, dispatch)
}
export default connect(null, mapDispatchToProps) (Dev)