import React from 'react';
import {Link, Route} from 'react-router-dom';
import Landing from './Landing';
import Login from './Login';
import Signup from './Signup';
import {connect} from 'react-redux';
import NewsHome from './NewsHome';
import Category from './Category';
import UserPage from './UserPage';
import NewPost from './NewPost';
import Detail from './Detail';
import AdminPanel from './AdminPanel';

function TopBar(props) {
	window.u=props.user;
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
								<Link to={'/news'}>
									News
								</Link>
							</li>
							{ props.user? 
								<li>
									<Link to={'/user/' + props.uid}>
										Profile
									</Link>
								</li>  
							 : 
								<li>
									<Link to={'/login'}>
										Log In
									</Link>
								</li>
							}
						</ul>
					</div>
					<div className="menu-list-right">
						<ul>
			        		{props.user &&  <li><span className="navbar-text">{props.user.displayName || "anonymous"}</span></li>}
			        		{ props.user? 
				        		<li>
									<button className="btn btn-primary float-right" onClick={logOut}>Log Out</button>
				        		</li>
				        	 : 
				        		<li>
									<Link to={'/signup'}>
										Sign Up
									</Link>
				        		</li>
				        	}
						</ul>
					</div>
				</div>
				<Route exact path='/' component = {Landing} />
				<Route path='/news' component = {NewsHome} />
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


