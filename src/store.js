import { createStore } from 'redux';
import Firebase from './Firebase';

function mainReducer(state, action) {
	console.log('deucin');
	console.log(action);
	switch (action.type) {
		case 'LOGIN_ACTION':
			return {...state, user:action.user};
		case 'LOGOUT_ACTION':
			return {...state, user:null, userID:null};
		case 'GOT_POSTS_ACTION':
			return {...state, posts:action.data};
		case 'DELETE_ACTION':
			return {...state, posts: state.posts.filter(post=>post.postID!==action.postID)};
		case 'EDIT_ACTION':
			console.log(state);
			return {...state, posts: state.posts.map(oldPost => 
				oldPost.postID!==action.postID ? oldPost 
				 : {...oldPost, title:action.newTitle, url:action.newURL}
			)};
		default:
			return state
	}
}
function defaultState() {
	return {
		user: null,
		posts:[],
		firebase: new Firebase(),
		categories: ['general','sports','politics']
	}
}
export default createStore(
  mainReducer,
  defaultState()
 );

