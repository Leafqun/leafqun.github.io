import React from 'react'
import {Card, Icon, Input, Button, message} from 'antd'
import url from '../../config/url'
import axios from 'axios'

class DevAdd extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            devid: '',
            loading: false,
            btIcon: ''
        }
    }
    handleInputChange = (e) => {
        this.setState({devid: e.target.value})
    }
    submitDevid = (e) => {
        e.preventDefault()
        let that = this
        this.setState({loading: true})
        axios.get(url + 'devs/addDev', {params: {devid: this.state.devid}}).then(response => {
            if (response.data.msg === 'success') {
                this.setState({loading: false, btIcon: 'check'})
                message.success('添加成功', 2);
            } else {
                this.setState({loading: false, btIcon: 'close'})
                message.error('添加失败', 2);
            }
            setTimeout(() => {
                that.setState({btIcon: ''})
            }, 1000)
        }).catch(error => {
            console.log(error)
            this.setState({loading: false, btIcon: 'close'})
            setTimeout(() => {
                that.setState({btIcon: ''})
            }, 2000)
        })
    }
    render () {
        const {loading, btIcon, devid} = this.state
        const title =  <div style={{ fontSize: 14, color: 'black' }}>
            <Icon type="user-add"/><span style={{marginLeft: 10}}>设备添加</span>
        </div>
        return (
            <div>
                <Card  title={title}>
                    <div className="devAdd">
                        <div className="addInput"><Input placeholder="请输入设备ID" style={{width: 250}} onChange={this.handleInputChange} value={devid}/></div>
                        <div className="addSubmit"><Button type="primary" onClick={this.submitDevid} loading={loading} icon={btIcon}>提交</Button></div>
                    </div>
                </Card>
            </div>
        )
    }
}

export default DevAdd