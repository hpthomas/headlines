import React from 'react';
import {Link, Route} from 'react-router-dom';
import Landing from './Landing';
import Login from './Login';
import Signup from './Signup';
import {connect} from 'react-redux';
import NewsHome from './NewsHome';
import Newspaper from './Newspaper';
import Category from './Category';
import UserPage from './UserPage';
import NewPost from './NewPost';
import Detail from './Detail';
import AdminPanel from './AdminPanel';

function TopBar(props) {
	let logOut = ()=>{
		props.firebase.logOut();
		props.doLogout();
	};
	return (
			<div className="top">
				<div className="navigation">
					<div className="name">
						<Link to={'/'}>Bottom Shelf News</Link>
					</div>
					<div className="menu-list">
						<ul className="navbar-center">
							<li>
								<Link to={'/'}>
									Home	
								</Link>
							</li>
							<li>
								<Link to={'/newspaper'}>
									Newspaper
								</Link>
							</li>
							<li>
								<Link to={'/news'}>
									Archive
								</Link>
							</li>
						</ul>
					</div>
					<div className="menu-list-right">
						<ul>
							<li>
								{props.user? 
									<Link to={'/user/'+props.uid}>{props.user.displayName||'anonymous'}</Link>
									:<Link to='/signup'>Register</Link>
								}
							</li>
							<li>
								{props.user? <button type='button' onClick={logOut}>log out</button>
								: <Link to='/login'>Log In</Link>
								}
							</li>
						</ul>
					</div>
				</div>
				<Route exact path='/' component = {Landing} />
				<Route path='/news' component = {NewsHome} />
				<Route path='/newspaper' component = {Newspaper} />
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

function mstp(state, ownProps) {
	return {
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


