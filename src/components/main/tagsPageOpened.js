import React from 'react'
import { Tag } from 'antd'
import {history} from "../../App"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as tagsActions from '../../actions/tagsActions'
import './tags.css'

class TagsPageOpened extends React.Component {
    closeTag = (name, e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        const {tagsOpenedList, activeTag} = this.props
        if (activeTag.indexOf(name) > 0) {
            let lastTag = ''
            let lastTagIndex = 0
            tagsOpenedList.forEach((tag, index) => {
                if (tag.name === name) {
                    lastTagIndex = index - 1
                    lastTag = tagsOpenedList[lastTagIndex]
                }
            })
            history.push({pathname: '/' + lastTag.name})
            this.props.setActiveTag('/' + lastTag.name)
        } else {
            this.props.setActiveTag('home')// 通过更新activeTag（activeTag值必须前一个值不同，才能更新），来更新dom，从而更新map中的tag列表
            this.props.setActiveTag(history.location.pathname)// 通过更新activeTag（activeTag值必须前一个值不同，才能更新），来更新dom，从而更新map中的tag列表
        }
        this.props.removeTag(name)
    }
    chooseTag = (name) => {
        history.push({pathname: '/' + name})
        this.props.setActiveTag(history.location.pathname)
    }
    render () {
        let {tagsOpenedList, activeTag} = this.props
        // 通过更新activeTag（activeTag值必须前一个值不同，才能更新），来更新dom，从而更新map中的tag列表
        let tagList = tagsOpenedList.map((tag) =>
            <Tag key={tag.name} closable={tag.name !== 'home'}
                 style={{height: 26, margin: '5px 0px 5px 5px'}}
                 color={activeTag.indexOf(tag.name) > 0 ? '#108ee9' : ''} onClick={() => this.chooseTag(tag.name)}
                 onClose={(event) => this.closeTag(tag.name, event)}>
                {tag.title}</Tag>
        )
        return (
            <div>
                {tagList}
            </div>
        )
    }
}

function mapStateToProps (state) {
    return {
        tagsOpenedList: state.tagsOpenedList,
        activeTag : state.activeTag
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(tagsActions, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps) (TagsPageOpened)
