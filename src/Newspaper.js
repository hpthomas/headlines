import React from 'react';
import {connect} from 'react-redux';
import gotPostsAction from './actions/gotPostsAction';
import ItemList from './ItemList';
import sortHeadlines from './util/sortHeadlines';
import {Link} from 'react-router-dom';
import './Newspaper.css';
/*
TODO
componentDidMount() is copied from NewsHome.js, this should be changed. 
Either make headline fetching logic into separate utility, or make Newspaper a child of NewsHome??
(actually this whole file is copied with news css display instead of  ItemList)
*/
class Newspaper extends React.Component {
	constructor(props) {
		super(props);
		this.state = {submissions:null}
	}
	componentDidMount() {
		let stories = null;
		let keys = null; 
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
	/*
	<section>
		<figure>
			<a href='url'>
				<h2> text </h2>
			</a>
			<img src='image' alt='text'>
		</figure>
	</section>
	*/
	render() {
		return  (
			<div className='newsPaper'>
				<h2>News Articles</h2>
				 <section className='last-posts'>
				{this.props.posts.map(post=>
					 	<figure>
					        <Link to={'/detail/' + post.postID}>
						 		<h2> {post.title} </h2>
						 	</Link>
					 	</figure>
				)}
				 </section>
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
export default connect(mstp, mdtp)(Newspaper);

