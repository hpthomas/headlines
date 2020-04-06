import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
class SignupForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {email:"", pass:"", displayName:""};
	}
	submit(event) {
		event.preventDefault();
		console.log("submit");
		console.log(this.props.firebase);
		this.props.firebase
			.createUser(this.state.email, this.state.pass, this.state.displayName)
				.then(authUser => {
					console.log("signup success");
					this.setState({email:"", pass:"", error:null});
					this.props.history.push("/home");
				})
			.catch(error => {
					this.setState({ error });
				});
	}
	change(event) {
		this.setState({[event.target.name]:event.target.value});
	}
	render() {
		return (
		<div className="container">
			<div className="row">
			<h3 className="col-sm-6 text-center">Register New Account</h3>
			</div> 
			<form className="form-group col-6" onSubmit={this.submit.bind(this)}>
				<label> Display Name: </label>
				<input name="displayName" className="form-control" value={this.state.displayName} onChange={this.change.bind(this)}/>
				<label> Email: </label>
				<input name="email" className="form-control" value={this.state.email} onChange={this.change.bind(this)}/>
				<label> Password: </label>
				<input type="password" name="pass" className="form-control" value={this.state.pass} onChange={this.change.bind(this)}/>
				<p></p>
				<button className="form-control">submit</button>
			</form>
			{this.state.error? 
				<div>
					<h5>error!</h5>
					{this.state.error.message}
				</div> 
			: null}
		</div>);
	}
}
let mapStateToProps = (state) => ({firebase:state.firebase});
const SignupPage = connect(mapStateToProps)(withRouter(SignupForm));
export default SignupPage;