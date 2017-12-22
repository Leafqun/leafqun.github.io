import React, { Component } from 'react'
import WrappedNormalLoginForm from './NormalLoginForm1'
import './login.css'
import { connect } from 'react-redux'

class Login extends Component {

    render () {
        const {height} = this.props
        return (
            <div className="all" style={{height: height}}>
                <div className="login">
                    <div className="login_logo"><h1>小鱼陪护后台管理</h1></div>
                    <div className="login_border">
                        <WrappedNormalLoginForm/>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps (state) {
    return {
        height: state.height
    }
}

export default connect(mapStateToProps, null)(Login)