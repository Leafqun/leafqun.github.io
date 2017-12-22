export function isLogin (isLogin = window.sessionStorage.getItem('isLogin'), actions) {
    switch (actions.type) {
        case 'login': {
            return true
        }
        case 'logout': {
            return false
        }
        default:
            return isLogin
    }
}
export function userError(userError = '', actions) {
    switch (actions.type) {
        case 'setUserError': {
            return actions.data
        }
        default:
            return userError
    }
}

export function pwdError(pwdError = '', actions) {
    switch (actions.type) {
        case 'setPwdError':
            return actions.data
        default:
            return pwdError
    }
}
export function userName(userName = '', actions) {
    switch (actions.type) {
        case 'setUserName':
            return actions.data
        default:
            return userName
    }
}

export function userPwd(userPwd = '', actions) {
    switch (actions.type) {
        case 'setUserPwd':
            return actions.data
        default:
            return userPwd
    }
}
export function height(height = document.documentElement.clientHeight, actions) {
    switch (actions.type) {
        case  'setHeight':
            return actions.data
        default:
            return height
    }
}
export function loginId(loginId = window.sessionStorage.getItem('loginId'), actions) {
    switch (actions.type) {
        case 'setLoginId': {
            window.sessionStorage.setItem('loginId', actions.data)
            return actions.data
        }
        default: return loginId
    }
}