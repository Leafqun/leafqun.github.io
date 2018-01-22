import React from 'react'
import './error_all.css'
import {history} from "../../App";

class Error404 extends React.Component {
    goLast = (e) => {
        e.preventDefault()
        history.go(-1)
    }
    goToHome = (e) => {
        e.preventDefault()
        history.push({pathname: '/home'})
    }
    render() {
        return (
            <div className="error-404">
                <div id="doc_main">
                    <section className="bd clearfix">
                        <div className="module-error">
                            <div className="error-main clearfix">
                                <div className="label"></div>
                                <div className="info">
                                    <h3 className="title">啊哦，你所访问的页面不存在了。</h3>
                                    <div className="reason">
                                        <p>可能的原因：</p>
                                        <p>1.在地址栏中输入了错误的地址。</p>
                                        <p>2.你点击的某个链接已过期。</p>
                                    </div>
                                    <div className="oper">
                                        <p><a onClick={this.goLast}>返回上一级页面&gt;</a></p>
                                        <p><a onClick={this.goToHome}>回到网站首页&gt;</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}

export default Error404