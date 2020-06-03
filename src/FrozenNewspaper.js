import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import gotPostsAction from './actions/gotPostsAction';
import ItemList from './ItemList';
import {Link} from 'react-router-dom';
import NewspaperItem from './NewspaperItem';
import Landing from './Landing';
import uuid from 'uuid';
import processStories from './util/processStories';
import './Newspaper.css';

class FrozenNewspaper extends React.Component {
	constructor(props) {
		super(props);
		// 'stories' is array of keys, ordered
		// submissions is key:subs
		this.state = {submissions:null, welcome:true}
	}
	// we use DidMount for initial API call
	componentDidMount() {
		this.props.firebase.getFrozenStories()
		.then(res=>res.val())
		.then(story_results=> {
			let posts = processStories(story_results);
			this.props.gotPosts(posts);
		});
	}
	closeWelcome() {
		this.setState({welcome:false})
	}
	render() {
		return  (
			<div className='newsPaper'>
				{this.state.welcome && 
					<Fragment> 
						<div className='blocker' onClick={this.closeWelcome.bind(this)}></div>
						<div className='landing_overlay'>
							<div className='close_landing_overlay'>
								<span className='closebutton'></span> {/* this is a dummy span to center 'Welcome' w button right-aligned */}
								<span>Welcome!</span>
								<span className='closebutton' onClick={this.closeWelcome.bind(this)}>x</span>
							</div>
							<Landing />
						</div>
					</Fragment> 
				}
				 <div className='gridParent'>
					{this.props.posts.map((post,index)=><NewspaperItem num={index} post={post} key={uuid.v4()}/>)}
				 </div>
			</div>);
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
export default connect(mstp, mdtp)(FrozenNewspaper);

