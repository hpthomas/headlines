import { createStore } from 'redux';
import Firebase from './Firebase';

function mainReducer(state, action) {
	switch (action.type) {
		case 'LOGIN_ACTION':
			return {...state, user:action.user};
		case 'LOGOUT_ACTION':
			return {...state, user:null, userID:null};
		case 'GOT_POSTS_ACTION':
			return {...state, posts:action.data};
		case 'DELETE_SUBMISSION_ACTION':
			return {...state, posts: deleteOneHeadlineFromPosts(state.posts,action.postID, action.subID)};
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
// TODO: move this to another file, try to do without mutations? 
// we have to copy the posts array, returning the same object does not force a state change
let deleteOneHeadlineFromPosts = (posts, postID, subID) => {
	let p = posts.slice();
	p.forEach(post=>{
		if (post.postID==postID) {
			post.headlines=post.headlines.filter(hl=>hl.key!=subID);
		}
	});
	return p;
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

