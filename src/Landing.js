import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import loginAction from './actions/loginAction'
class Landing extends React.Component {

	guestLogin() {
		this.props.firebase.login(null,null).then(res=>{
			this.props.setLogin(res.user);
			this.props.history.push("/");	
		});
	}
	render() {
		return (
	  <div className="container-fluid landing">
	    <div className="row">
      		<div className="col-lg-6">
				<h3>
					Bottom Shelf News is a crowd-sourced comedy news site!
				</h3>
				<p>
					The blue links are the titles of today's top news stories. 
					The black headlines are our user's funniest alternatives. 
					You can vote on your favorite submission, or write your own!
				</p>


				<p>
					Bottom Shelf News is in development, This demo page provides a preview of it's core functionality.
					You can view <Link to="/news">headlines and submissions</Link> now, 
					or <Link to="/login">Log In</Link> to vote and submit! 
				</p>
				<p>
					If you don't want to make an account, you can 
					<button onClick={this.guestLogin.bind(this)}>continue as a guest</button>
					. Guest accounts have full access to Bottom Shelf News features, 
					but if you log out and return you won't be able to access the account again.
				</p>
      </div>
    </div>
  </div> );

	}
}
let mstp = (state) => ({firebase:state.firebase});
let mdtp = (dispatch) => (  {setLogin : (user) => dispatch(loginAction(user)) }  );
export default connect(mstp,mdtp)(Landing);