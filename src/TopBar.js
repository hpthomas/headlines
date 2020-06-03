import React from 'react';
import {Link, Route} from 'react-router-dom';
import Landing from './Landing';
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
								<Link to={'/active'}>
									Active	
								</Link>
							</li>
							<li>
								<Link to={'/archive'}>
									Archive
								</Link>
							</li>
							<li>
								<Link to={'/about'}>
									About
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
				<h1 className='news_header'> Bottom Shelf News </h1>
				<h2 className='news_header'> A comedy newspaper where the users write the headlines.</h2>
				<Route exact path='/' component = {FrozenNewspaper} />
				<Route path='/active' component = {Newspaper} />
				<Route path='/archive' component = {NewsHome} />
				<Route path='/about' component = {Landing} />
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


