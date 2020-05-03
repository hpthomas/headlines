import React from 'react';
import {connect} from 'react-redux';
import gotPostsAction from './actions/gotPostsAction';
import ItemList from './ItemList';
import sortHeadlines from './util/sortHeadlines';
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
		.then(postsObject=> {
			if (!postsObject) return;
			stories = postsObject;
			keys = Object.keys(postsObject);
			let subs = keys.map(k=>this.props.firebase.getSubmissionsForPost(k));
			return Promise.all(subs);
		})
		.then(results => results.map(r=>r.val()))
		.then(submissions=>{
			let subs = submissions.map( (sub,index) => {
				return {[keys[index]]:sub};
			});
			let posts = keys.map((key,index) => {
				let s = stories[key];
				s.postID=key;
				if (subs[index]) {
					let headlines = subs[index][Object.keys(subs[index])[0]];
					s.headlines = sortHeadlines(headlines);
				}
				else {
					s.headlines = [];
				}
				return s;
			});
			this.props.gotPosts(posts);
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
		if (!this.state.paperView) {
			return  (
				<div>
		    		<button type='button' onClick={this.togglePaperView.bind(this)}>Show Newspaper View</button>
			        {this.props.firebase.auth.currentUser? <p><Link to='/new'>Submit Article  </Link></p> : null }
			        {this.props.firebase.auth.currentUser? <p><Link to='/admin'>Admin Panel</Link></p> : null }
					<ItemList items={this.props.posts} />
				</div>
			);
		}
		else {
			return  (
				<div className='newsPaper'>
		    		<button type='button' onClick={this.togglePaperView.bind(this)}>Show ItemList</button>
					 <div className='gridParent'>
						{this.props.posts.map((post,index)=><NewspaperItem num={index} post={post} key={uuid.v4()}/>)}
					 </div>
				</div>);
		}
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

