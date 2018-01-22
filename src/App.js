import React, {Component} from 'react'
import {Route, Redirect, Switch} from 'react-router-dom'
import {Router} from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import createHistory from 'history/createBrowserHistory'
import Login from './components/login/login'
import * as loginAction from './actions/loginActions'
import Main from './components/Main'
import './App.css'

export const history = createHistory()

class App extends Component {
    onWindowResize = () => {
        this.props.setHeight(document.documentElement.clientHeight)
        this.props.setWidth(document.documentElement.clientWidth)
    }
    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize)
    }

    componentWillUnmount() {
        //视窗监听函数与this.onWindowResize
        window.removeEventListener('resize', this.onWindowResize)
    }
    render() {
        const { isLogin, height } = this.props
        return (
                <Router history={history}>
                    <div style={{height: height}}>
                        <Switch>
                            <Route exact path="/" render={() => <Redirect to="/login"/>}></Route>
                            <Route path="/login" component={Login}></Route>
                            {isLogin ?
                                <Switch>
                                    <Route path="/" component={Main}></Route>
                                </Switch>
                                : <Route path="*" render={() => <Redirect to="/login"/>}></Route>
                            }
                        </Switch>
                    </div>
                </Router>
        );
    }
}

function mapStateToProps(state) {
    return {
        isLogin: state.isLogin,
        height: state.height
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(loginAction, dispatch)
}
const AppX = connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

export default AppX
