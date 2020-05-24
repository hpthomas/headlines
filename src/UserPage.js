import React from 'react';
import gotPostsAction from './actions/gotPostsAction';
import {connect} from 'react-redux';
import ItemList from './ItemList';
import sortHeadlines from './util/sortHeadlines';

class UserPage extends React.Component {
	constructor() {
		super();
		this.state = {active:null, frozen:null}
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
			let active = story_keys.filter(k=>posts.stories[k].status==='active');
			let frozen = story_keys.filter(k=>posts.stories[k].status==='frozen');

			let active_promises = active.map(k=>this.props.firebase.getStoryByID(k));
			Promise.all(active_promises)
			.then(res=>res.map(item=>item.val()))
			.then(stories=>{
				stories.forEach((story,i)=>{
					for (var headline in story.headlines){
						if (story.headlines[headline].user != user) {
							delete story.headlines[headline];
						}
					}
					story.headlines = sortHeadlines(story.headlines);
					story.postID=active[i];
				})
				this.setState({active:stories});
			})

			let frozen_promises = frozen.map(k=>this.props.firebase.getFrozenStoryByID(k));
			Promise.all(frozen_promises)
			.then(res=>res.map(item=>item.val()))
			.then(stories=>{
				stories.forEach((story,i)=>{
					for (var headline in story.headlines){
						if (story.headlines[headline].user != user) {
							delete story.headlines[headline];
						}
					}
					story.headlines = sortHeadlines(story.headlines);
					story.postID=frozen[i];
				})
				this.setState({frozen:stories});
			})
		})
	}

	render() {
		return( <div>
			<h1>active posts </h1>
			<ItemList items={this.state.active} show={100}/>
			<h1>frozen posts </h1>
			<ItemList items={this.state.frozen} show={100}/>
		</div>);
	}
}
let mstp = state => {
	return {firebase:state.firebase};
}
let mdtp = dispatch => ({
	gotPosts: (posts) => dispatch(gotPostsAction(posts))
})
export default connect(mstp, mdtp)(UserPage);
