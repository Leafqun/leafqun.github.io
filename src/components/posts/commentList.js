import React from 'react'
import {Divider, Avatar} from 'antd'
import {picUrl} from "../../config/url";

class CommentList extends React.Component {
    render () {
        const {commentList} = this.props
        return (
            <div>
                {commentList && commentList.length > 0 ? commentList.map((comment, index, arr) =>
                    <div key={comment.commentid}>
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: 15}}>
                            <Avatar src={comment.avatar ? picUrl + comment.id + '/' + comment.avatar : ''}/>
                            <div style={{marginLeft: 10}}>
                                <span style={{fontSize: 18}}>{comment.nickname}</span><span
                                style={{fontSize: 10}}>#{comment.userid}</span>
                            </div>
                        </div>
                        <div className="content">
                            <div style={{marginBottom: 10}}>{comment.content}</div>
                        </div>
                        {index === commentList.length - 1 ? null : <Divider/>}
                    </div>) : <div style={{textAlign: 'center', marginBottom: 15}}>暂无数据</div>
                }
            </div>
        )
    }
}

export default CommentList