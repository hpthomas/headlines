import React from 'react';
import {Link, Route} from 'react-router-dom';
import About from './About';
import Login from './Login';
import Signup from './Signup';
import {connect} from 'react-redux';
import NewsHome from './NewsHome';
import Newspaper from './Newspaper';
import FrozenNewspaper from './FrozenNewspaper';
import Category from './Category';
import UserPage from './UserPage';
import NewPost from './NewPost';
import Detail from './Detail';
import AdminPanel from './AdminPanel';
import OnboardingSteps from './OnboardingSteps';

class TopBar extends React.Component{
	constructor(props) {
		super(props);
	}

	logOut(){
		this.props.firebase.logOut();
		this.props.doLogout();
	}
	render() {
		return (
			<div className="top">
				{this.props.show_tour && 
					<OnboardingSteps />
				}

				<div className="navigation">
					<div className="name bsnewslogo">
						<Link to={'/'}>Bottom Shelf News</Link>
					</div>
					<div className="menu-list">
						<ul className="navbar-center">
							<li className='home_top_link'>
								<Link to={'/'}>
									Home	
								</Link>
							</li>
							<li className='active_top_link'>
								<Link to={'/active'}>
									Active	
								</Link>
							</li>
							<li>
								<Link to={'/archive'}>
									Archive
								</Link>
							</li>
							<li className='about_top_link'>
								<Link to={'/about'}>
									About
								</Link>
							</li>
						</ul>
					</div>
					<div className="menu-list-right">
						<ul>
							<li>
								{this.props.user? 
									<Link to={'/user/'+this.props.uid}>{this.props.user.displayName||'anonymous'}</Link>
									:<Link to='/signup'>Register</Link>
								}
							</li>
							<li>
								{this.props.user? <button type='button' onClick={this.logOut.bind(this)}>log out</button>
								: <Link to='/login'>Log In</Link>
								}
							</li>
						</ul>
					</div>
				</div>
				<h1 className='news_header'> Bottom Shelf News </h1>
				<Route exact path='/' component = {FrozenNewspaper} />
				<Route path='/active' component = {Newspaper} />
				<Route path='/archive' component = {NewsHome} />
				<Route path='/about' component = {About} />
				<Route path='/login' component = {Login} />
				<Route path='/signup' component = {Signup} />
				<Route path='/detail/:postID' component = {Detail} />
				<Route path='/category/:category' component = {Category} />
				<Route path='/user/:user' component = {UserPage} />
				<Route path='/new' component = {NewPost} />
				<Route path='/admin' component = {AdminPanel} />
			</div>
		);
	}
}

function mstp(state, ownProps) {
	return {
		show_tour:state.show_tour,
		firebase:state.firebase, 
		user: state.user,
		uid:state.user?state.user.uid:null};
}
function mdtp(disp) {
	return {
		doLogout: ()=>disp({type:'LOGOUT_ACTION'})
	}
}
export default connect(mstp,mdtp)(TopBar);


