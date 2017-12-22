import React from 'react'
import {Card, Icon, Input, Button, message, Modal} from 'antd'
import axios from 'axios'
import url from '../../config/url'
import { connect } from 'react-redux'

class Personal extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            login: {},
            isEditName: false,
            name: '',
            nameLoading: false,
            nameIcon: '',
            visible: false,
            oldPwd: '',
            newPwd1: '',
            newPwd2: '',
            pwdLoading: false,
            pwdIcon: '',
            oldPwdError: '',
            newPwdError: ''
        }
    }
    componentWillMount () {
        this.getUserInfo()
    }
    getUserInfo = () => {
        axios.get(url + 'getLoginInfo', {params: {loginId: this.props.loginId}}).then(response => {
            this.setState({login: response.data.login})
        }).catch(error => {
            console.log(error)
        })
    }
    editName = (e) => {
        e.preventDefault()
        this.setState({isEditName: true})
    }
    handleNameChange = (e) => {
        this.setState({name: e.target.value})
    }
    submitName = (e) => {
        e.preventDefault()
        if (this.state.name === this.state.login.manager_name) {
            message.error('与原用户名相同！！')
            return false
        }
        this.setState({nameLoading: true})
        axios.get(url + 'updateName', {params: {name: this.state.name, loginId: this.props.loginId}}).then(response => {
            this.setState({nameLoading: false})
            if (response.data.msg === 'success') {
                this.setState({nameIcon: 'check'})
                message.success('修改成功')
            } else {
                this.setState({nameIcon: 'close'})
                message.error('修改失败')
            }
            setTimeout(() => {
                this.setState({nameIcon: '', isEditName: false})
                this.getUserInfo()
            }, 1000)
        }).catch(error => {
            console.log(error)
            message.error('修改失败')
            this.setState({nameLoading: false, nameIcon: 'close'})
        })
    }
    showModal = (e) => {
        e.preventDefault()
        this.setState({visible: true})
    }
    handleOldPwdChange = (e) => {
        this.setState({oldPwd: e.target.value, oldPwdError: ''})
    }
    handleNewPwd1Change = (e) => {
        this.setState({newPwd1: e.target.value, newPwdError: ''})
    }
    handleNewPwd2Change = (e) => {
        this.setState({newPwd2: e.target.value, newPwdError: ''})
    }
    handleCancel = () => {
        this.setState({visible: false, oldPwd: '', newPwd2: '', newPwd1: '', oldPwdError: '', newPwdError: ''})
    }
    handleOk = () => {
        const {oldPwd, newPwd1, newPwd2} = this.state
        if (newPwd1 !== newPwd2) {
            this.setState({newPwdError: '两次输入密码不一致'})
            return false
        }
        if (oldPwd === newPwd1) {
            this.setState({newPwdError: '新密码与原密码相同'})
            return false
        }
        this.setState({pwdLoading: true})
        axios.post(url + 'updatePwd', {loginId: this.props.loginId, oldPwd, newPwd: newPwd1}).then(response => {
            this.setState({pwdLoading: false})
            if (response.data.msg === 'success') {
                this.setState({pwdIcon: 'check'})
                message.success("修改密码成功")
                setTimeout(() => {
                    this.setState({visible: false, pwdIcon: '', oldPwd: '', newPwd2: '', newPwd1: '', oldPwdError: '', newPwdError: ''})
                }, 1000)
            } else if (response.data.msg === '原密码错误'){
                this.setState({oldPwdError: '原密码错误', pwdIcon: 'close'})
            }
        }).catch(error => {
            console.log(error)
        })
    }
    render () {
        const {login, isEditName, name, nameIcon, nameLoading, visible, newPwd1, newPwd2, oldPwd, pwdIcon, pwdLoading, newPwdError, oldPwdError} = this.state
        const title =  <div style={{ fontSize: 14, color: 'black' }}>
            <Icon type="user-add"/><span style={{marginLeft: 10}}>个人中心</span>
        </div>
        return (
            <Card title={title}>
                {isEditName === false ? <div>用户名：{login.manager_name}<a href="" onClick={this.editName}><Icon type="edit" /></a></div>
                    : <div>
                        <Input placeholder="请输入用户名" onChange={this.handleNameChange} value={name} style={{width: 250}}/>
                        <Button onClick={this.submitName} type="primary" loading={nameLoading} icon={nameIcon}>提交</Button>
                    </div>}
                <div style={{marginTop: 15}}>修改密码：<a href="" onClick={this.showModal}><Icon type="edit"/></a></div>
                <Modal visible={visible} title="修改密码" closeable onCancel={this.handleCancel} width={600}
                       footer={[
                           <Button key="back" onClick={this.handleCancel}>取消</Button>,
                           <Button key="submit" type="primary" loading={pwdLoading} icon={pwdIcon} onClick={this.handleOk}>
                               提交
                           </Button>,
                       ]}>
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <div style={{marginBottom: 12, display: 'flex', flexDirection: 'column'}}>
                            <div
                                style={{width: 300, textAlign: 'right', display: 'flex', flexDirection: 'row-reverse'}}>
                                <Input style={{width: 200, marginLeft: 20, marginBottom: 12}} value={oldPwd}
                                       onChange={this.handleOldPwdChange}/><label><span style={{color: 'red'}}>*</span>旧密码:</label>
                            </div>
                            {oldPwdError ?
                                <span style={{color: 'red', textAlign: 'center'}}>{oldPwdError}</span> : null}
                        </div>
                        <div style={{
                            width: 300,
                            marginBottom: 12,
                            textAlign: 'right',
                            display: 'flex',
                            flexDirection: 'row-reverse'
                        }}><Input style={{width: 200, marginLeft: 20, marginBottom: 12}} value={newPwd1}
                                  onChange={this.handleNewPwd1Change}/><label><span style={{color: 'red'}}>*</span>新密码:</label>
                        </div>
                        <div style={{marginBottom: 12, display: 'flex', flexDirection: 'column'}}>
                            <div style={{
                                width: 300,
                                marginBottom: 12,
                                textAlign: 'right',
                                display: 'flex',
                                flexDirection: 'row-reverse'
                            }}><Input style={{width: 200, marginLeft: 20, marginBottom: 12}} value={newPwd2}
                                      onChange={this.handleNewPwd2Change}/><label><span style={{color: 'red'}}>*</span>确认密码:</label>
                            </div>
                            {newPwdError ?
                                <span style={{color: 'red', textAlign: 'center'}}>{newPwdError}</span> : null}
                        </div>
                    </div>
                </Modal>
            </Card>
        )
    }
}
function mapStateToProps (state) {
    return {
        loginId: state.loginId
    }
}
export default connect(mapStateToProps, null)(Personal)