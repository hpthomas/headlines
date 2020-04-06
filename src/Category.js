import React from 'react';
import ItemList from './ItemList';
import gotPostsAction from './actions/gotPostsAction';
import {connect} from 'react-redux';

class Category extends React.Component {
	componentDidMount() {
		//let category = this.props.match.params.category;
		/*
	    axios.get("http://localhost:8080/api/posts/category/" + category)
	    .then( response => {
	    	this.props.gotPosts(response.data);
	    })
	    .catch(err => {
	    	console.log("Error Fetching Posts:");
	    	console.log(err);
	    }); */
	}

	render() {
		return  (
			<div>
				<h2>News Articles</h2>
				{/* HERE is where to conditionally show plus to add new post */}
				<ItemList show_category={true} items={this.props.posts} />
			</div>
		);
	}
}
let mstp = state => {
	return {posts:state.posts};
}
let mdtp = dispatch => ({
	gotPosts: (posts) => dispatch(gotPostsAction(posts))
})
export default connect(mstp, mdtp)(Category);
