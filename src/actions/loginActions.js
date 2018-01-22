export function login () {
    return {
        type: 'login'
    }
}

export function logout () {
    return {
        type: 'logout'
    }
}
export function setUserError(userError) {
    return {
        type: 'setUserError',
        data: userError
    }
}
export function setPwdError(pwdError) {
    return {
        type: 'setPwdError',
        data: pwdError
    }
}
export function setUserName(userName) {
    return {
        type: 'setUserName',
        data: userName
    }
}
export function setUserPwd(userPwd) {
    return {
        type: 'setUserPwd',
        data: userPwd
    }
}
export function setHeight(height) {
    return {
        type: 'setHeight',
        data: height
    }
}
export function setWidth(width) {
    return {
        type: 'setWidth',
        data: width
    }
}
export function setLoginId(id) {
    return {
        type: 'setLoginId',
        data: id
    }
}