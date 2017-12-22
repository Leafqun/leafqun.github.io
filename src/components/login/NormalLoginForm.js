import React from 'react'
import { Link } from 'react-router-dom'
import {Form, Icon, Input, Button, Checkbox} from 'antd';
import {history} from '../../App'
import axios from 'axios'
const FormItem = Form.Item;
class NormalLoginForm extends React.Component {
    constructor(props){
        super(props)
        this.state = {userError: '', pwdError: ''}
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const values = this.props.form.getFieldsValue()
        const username = values.username
        const password = values.password
        //初始化
        this.setState({userError: ''})
        this.setState({pwdError: ''})

        if(username === '' || username === undefined){
            this.setState({userError: '请输入用户名'})
        }
        if(password === '' || password === undefined){
            this.setState({pwdError: '请输入密码'})
        }
        if(username !== '' && password !== '' && username !== undefined && password !== undefined) {
            axios.post("http://119.23.22.99/tp5/xiaoyupeihu/public/index.php/login", values).then(response => {
                console.log(response.data.msg);
                if (response.data.msg === 'success') {
                    history.push('/manage')
                }else if(response.data.msg === '用户不存在'){
                    this.setState({userError: '用户不存在'})
                }else{
                    this.setState({pwdError: '密码错误'})
                }
            }).catch(error => {
                console.log(error);
            });
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const userError = this.state.userError
        const pwdError = this.state.pwdError
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem validateStatus={userError === '' ? '' : 'error'} help={userError}>
                    {getFieldDecorator('username')(<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />)}
                </FormItem>
                <FormItem validateStatus={pwdError === '' ? '' : 'error'} help={pwdError}>
                    {getFieldDecorator('password')(<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />)}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox>Remember me</Checkbox>
                    )}
                    <a className="login-form-forgot" href="">Forgot password</a>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    Or <Link to='/register'>register now!</Link>
                </FormItem>
            </Form>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm