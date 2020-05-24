import React from 'react';
import {connect} from 'react-redux';
import gotPostsAction from './actions/gotPostsAction';
import ItemList from './ItemList';
import sortHeadlines from './util/sortHeadlines';
import sortStories from './util/sortStories';
import {Link} from 'react-router-dom';
import NewspaperItem from './NewspaperItem';
import uuid from 'uuid';
import './Newspaper.css';

class NewsHome extends React.Component {
	constructor(props) {
		super(props);
		// 'stories' is array of keys, ordered
		// submissions is key:subs
		this.state = {submissions:null, paperView:true}
	}
	// we use DidMount for initial API call
	componentDidMount() {
		let stories = null; // save story data as a [key:data] object
		let keys = null;  // save story keys in sorted order
		this.props.firebase.getTopPosts()
		.then(res=>res.val())
		.then(story_results=> {
			if (!story_results) return;
			let keys = Object.keys(story_results);
			let stories = keys.map((key) => {
				let story= story_results[key];
				story.postID=key;
				if (story.headlines) {
					story.headlines = sortHeadlines(story.headlines);
				}
				else {
					story.headlines = [];
				}
				return story;
			});
			stories = sortStories(stories);	
			this.props.gotPosts(stories);
		})
		.catch(e=>{
			console.log(e);
			this.props.gotPosts([]);
		});
	}

	togglePaperView(){
		this.setState({paperView:!this.state.paperView});
	}

	render() {
		return  (
			<div>
		        {this.props.firebase.auth.currentUser? <p><Link to='/admin'>Admin Panel</Link></p> : null }
				<ItemList items={this.props.posts} />
			</div>
		);
	}
}


let mstp = state => {
	return {
		firebase:state.firebase,
		posts:state.posts};
}
let mdtp = dispatch => ({
	gotPosts: (posts) => {dispatch(gotPostsAction(posts));}
})
export default connect(mstp, mdtp)(NewsHome);

