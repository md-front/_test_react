import React from 'react';
import {connect} from 'react-redux';

const initialState = {
    posts: [],
}

const Post = ({ post }) => {
    if(!post)
    return initialState
}

export default connect(null, null)(Post);