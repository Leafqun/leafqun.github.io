export function createTag (tagObj) {
    return {
        type: 'createTag',
        data: tagObj
    }
}

export function removeTag (name) {
    return {
        type: 'removeTag',
        data: name
    }
}

export function moveToSecond (index) {
    return {
        type: 'moveToSecond',
        data: index
    }
}
export function setActiveTag (tag) {
    return {
        type: 'setActiveTag',
        data: tag
    }
}
