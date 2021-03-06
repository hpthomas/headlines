import React from 'react';
import {connect} from 'react-redux';
import gotPostsAction from './actions/gotPostsAction';
import ItemList from './ItemList';
import {Link} from 'react-router-dom';
import NewspaperItem from './NewspaperItem';
import uuid from 'uuid';
import './Newspaper.css';
import processStories from './util/processStories';

class NewsHome extends React.Component {
	constructor(props) {
		super(props);
		// 'stories' is array of keys, ordered
		// submissions is key:subs
		this.state = {submissions:null}
	}
	// we use DidMount for initial API call
	componentDidMount() {
		this.props.firebase.getTopPosts()
		.then(res=>res.val())
		.then(story_results=> {
			let posts = processStories(story_results);
			this.props.gotPosts(posts);
		});
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

