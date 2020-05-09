import React from 'react';
import gotPostsAction from './actions/gotPostsAction';
import {connect} from 'react-redux';
import ItemList from './ItemList';
import sortHeadlines from './util/sortHeadlines';

class UserPage extends React.Component {
	constructor() {
		super();
		this.state = {postsAndUserSubmissions:null}
	}
	/* 
	TODO this is roundabout fuckery
	first get all posts WITH user subs
	retrieve each individually
	filter subs to target user & display
	this is garbage
	*/ 
	componentDidMount() {
		let user = this.props.match.params.user;
		this.props.firebase.getSubmissionsByUser(user)
		.then(res => res.val())
		.then(posts => {
			console.log(posts);

			if (!posts || !posts.stories) return;

			let storiesWithUserSubs = posts.stories;
			let story_keys = Object.keys(storiesWithUserSubs);
			story_keys.reverse();

			let subPromises = story_keys.map(key => {
				let subs = Object.keys(storiesWithUserSubs[key].submissions);
				return subs.map(subID => key + "/" + subID);
			})
			.flat()
			.map(k=>this.props.firebase.getStorySubmissionByID(k));

			Promise.all(subPromises)
			.then(res => res.map(sub=>{
				let path = sub.ref.path.toString().split('/');
				let storyID = path[path.length-2];
				return [storyID, sub.val()];
			}))
			.then(submissions=>{
				let stories = {};
				submissions.forEach(sub => {
					if (!stories[sub[0]]) {
						stories[sub[0]] = [sub[1]];
					}
					else {
						stories[sub[0]].push(sub[1]);
					}
				})
				let story_promises = story_keys.map(k=>this.props.firebase.getStoryByID(k))
				Promise.all(story_promises)
				.then(res=>res.map(story=>[story.key, story.val()]))
				.then(story_data=>{
					console.log(story_data);
					let items = [];
					story_data.forEach(story=>{
						let key = story[0];
						let temp = stories[key];
						stories[key] = story[1];
						stories[key].headlines = sortHeadlines(temp);
						stories[key].postID=key;
						items.push(stories[key]);
					})
					this.setState({postsAndUserSubmissions:items});
				})
			});
		})
	}

	render() {
		if (!this.state.postsAndUserSubmissions) return <div></div>;
		return <ItemList items={this.state.postsAndUserSubmissions} show={100}/>
	}
}
let mstp = state => {
	return {firebase:state.firebase};
}
let mdtp = dispatch => ({
	gotPosts: (posts) => dispatch(gotPostsAction(posts))
})
export default connect(mstp, mdtp)(UserPage);
