import {combineReducers} from "redux"
import * as Login from './login'
import * as siderBarMenu from './siderBarMenu'
import * as tags from './tags'

const rootReducer = combineReducers(Object.assign(Login, siderBarMenu, tags))
export default rootReducer