export function tagsOpenedList (tagsOpenedList = window.sessionStorage.getItem('tagsOpenedList') ? JSON.parse(window.sessionStorage.getItem('tagsOpenedList')) : [{name: 'home', title: '首页'}], actions) {
    switch (actions.type) {
        case 'createTag': {
            tagsOpenedList.splice(tagsOpenedList.length, 0 ,actions.data)
            window.sessionStorage.setItem('tagsOpenedList', JSON.stringify(tagsOpenedList))
            return tagsOpenedList
        }
        case 'removeTag': {
            tagsOpenedList.forEach((item, index) => {
                if (item.name === actions.data) {
                    tagsOpenedList.splice(index, 1)
                }
            })
            window.sessionStorage.setItem('tagsOpenedList', JSON.stringify(tagsOpenedList))
            return tagsOpenedList
        }
        case 'moveToSecond': {
            let openedTag = tagsOpenedList[actions.data]
            tagsOpenedList.splice(actions.data, 1)
            tagsOpenedList.splice(1, 0, openedTag)
            window.sessionStorage.setItem('tagsOpenedList', JSON.stringify(tagsOpenedList))
            return tagsOpenedList
        }
        default:
            return tagsOpenedList
    }
}
export function activeTag (activeTag = window.sessionStorage.getItem('activeTag') ? window.sessionStorage.getItem('activeTag') : 'home', actions) {
    switch (actions.type) {
        case 'setActiveTag': {
            window.sessionStorage.setItem('activeTag', actions.data)
            return actions.data
        }
        default: return activeTag
    }
}