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
	window.u=props.user;
	let logOut = ()=>{
		props.firebase.logOut();
		props.doLogout();
	};
	return (
			<div className="top">
		        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
		        	<ul className="nav navbar-nav">
		        		<li>
							<Link to={'/'}>
								<button className="btn btn-primary">Home</button>
							</Link>
						</li>
						<li>
							<Link to={'/news'}>
								<button className="btn btn-primary">News</button>
							</Link>
							{ true &&
							<Link to={'/newspaper'}>
								<button className="btn btn-primary">The Paper</button>
							</Link>
							}
						</li>
						{ props.user? 
							<li>
								<Link to={'/user/' + props.uid}>
									<button className="btn btn-primary">Profile</button>
								</Link>
							</li>  
						 : 
							<li>
								<Link to={'/login'}>
									<button className="btn btn-primary">Log In</button>
								</Link>
							</li>
						}
					</ul>
		        	<ul className="nav navbar-nav ml-auto">
		        		{props.user &&  <li><span className="navbar-text">{props.user.displayName || "anonymous"}</span></li>}
		        		{ props.user? 
			        		<li>
								<button className="btn btn-primary float-right" onClick={logOut}>Log Out</button>
			        		</li>
			        	 : 
			        		<li>
								<Link to={'/signup'}>
									<button className="btn btn-primary">Sign Up</button>
								</Link>
			        		</li>
			        	}
					</ul>
				</nav>
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


