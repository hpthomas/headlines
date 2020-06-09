import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import gotPostsAction from './actions/gotPostsAction';
import toggleTourAction from './actions/toggleTourAction';
import ItemList from './ItemList';
import {Link} from 'react-router-dom';
import NewspaperItem from './NewspaperItem';
import Welcome from './Welcome';
import uuid from 'uuid';
import processStories from './util/processStories';
import OnboardingSteps from './OnboardingSteps';
import './Newspaper.css';

class FrozenNewspaper extends React.Component {
	constructor(props) {
		super(props);
		// TODO welcome only if new or not logged in
		let welcome = !this.props.tour;
		this.state = {submissions:null, welcome:welcome}
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
		this.setState({welcome:false});
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
								<span>Welcome</span>
								<span className='closebutton' onClick={this.closeWelcome.bind(this)}>x</span>
							</div>
							<Welcome close={this.closeWelcome.bind(this)} />
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
		tour:state.show_tour,
		firebase:state.firebase,
		posts:state.posts};
}
let mdtp = dispatch => ({
	gotPosts: (posts) => {dispatch(gotPostsAction(posts));},
})
export default connect(mstp, mdtp)(FrozenNewspaper);

