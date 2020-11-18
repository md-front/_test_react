import {combineReducers} from "redux";
import post from "./post";

export const rootReducer = combineReducers({
    posts: post
})