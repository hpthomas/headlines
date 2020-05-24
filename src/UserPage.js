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

			if (!posts || !posts.stories) return;

			let story_keys = Object.keys(posts.stories);
			let promises = story_keys.map(k=>this.props.firebase.getStoryByID(k));
			Promise.all(promises)
			.then(res=>res.map(item=>item.val()))
			.then(stories=>{
				stories.forEach((story,i)=>{
					for (var headline in story.headlines){
						if (story.headlines[headline].user != user) {
							delete story.headlines[headline];
						}
					}
					story.headlines = sortHeadlines(story.headlines);
					story.postID=story_keys[i];
				})
				console.log(stories);
				this.setState({postsAndUserSubmissions:stories});
			})
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
