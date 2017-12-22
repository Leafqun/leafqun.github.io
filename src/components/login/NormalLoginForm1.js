import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {Form, Icon, Input, Button, Checkbox} from 'antd';
import {history} from '../../App'
import axios from 'axios'
import { bindActionCreators } from "redux"
import * as loginAction from "../../actions/loginActions";
import url from '../../config/url'
const FormItem = Form.Item;
class NormalLoginForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault()
        const username = this.props.userName
        const password = this.props.userPwd
        this.props.setUserError('')
        this.props.setPwdError('')
        if(username === '' || username === undefined){
            this.props.setUserError('请输入用户名')
        }
        if(password === '' || password === undefined){
            this.props.setPwdError('请输入密码')
        }
        if (username !== '' && password !== '' && username !== undefined && password !== undefined) {
            axios.post(url + "managerLogin", { userName: username, userPwd: password }).then(response => {
                console.log(response.data.msg);
                if (response.data.msg === 'success') {
                    this.props.login();
                    this.props.setLoginId(response.data.loginId)
                    window.sessionStorage.setItem('isLogin', true)
                    history.push({pathname: '/home'})
                } else if (response.data.msg === '用户不存在') {
                    this.props.setUserError('用户不存在')
                } else {
                    this.props.setPwdError('密码错误')
                }
            }).catch(error => {
                console.log(error);
            });
        }
    }
    handleUserNameChange = (event) => {
        this.props.setUserName(event.target.value)
    }
    handleUserPwdChange = (event) => {
        this.props.setUserPwd(event.target.value)
    }
    render() {
        const { userError, pwdError } = this.props
        return (
            <Form className="login-form">
                <FormItem validateStatus={userError === '' ? '' : 'error'} help={userError}>
                    <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="Username"
                           onChange={this.handleUserNameChange}/>
                </FormItem>
                <FormItem validateStatus={pwdError === '' ? '' : 'error'} help={pwdError}>
                    <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password"
                           placeholder="Password" onChange={this.handleUserPwdChange}/>
                </FormItem>
                <FormItem>
                    <Checkbox>Remember me</Checkbox>
                    <a className="login-form-forgot" href="">Forgot password</a>
                    <Button type="primary" htmlType="submit" className="login-form-button"
                            onClick={this.handleSubmit}>
                        Log in
                    </Button>
                    Or <Link to='/register'>register now!</Link>
                </FormItem>
            </Form>
        );
    }
}


function mapStateToProps(state) {
    return {
        isLogin: state.isLogin,
        userName: state.userName,
        userPwd: state.userPwd,
        userError: state.userError,
        pwdError: state.pwdError
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(loginAction, dispatch)
}

const LoginForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(NormalLoginForm)

export default LoginForm