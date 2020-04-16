import React from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import deleteSubmissionAction from './actions/deleteSubmissionAction';
class Rewrite extends React.Component {
	render() {
		// if not logged in, props.uid==null. be more explicit??
		let temp = this.props.rw.votes[this.props.user.uid];
		let vote = 
			(temp===true)? 1 : 
			(temp===false)? -1 : 0;
		return (
		  <div>
		  	<div className='headlinebar'>
			    <span>{"("+this.props.rw.score+")  "}</span>
			    <span>{this.props.rw.headline}</span>
			</div>
		  	<div className='headlineinfo'>
		  		<Link to={'/user/'+this.props.rw.user}>{this.props.rw.username}</Link>
			    {this.props.user &&
		    		<span style={{marginLeft:'4px'}} >
		    			<span>Vote!</span>
		    			{this.buttons(vote)}
			    	</span>
			    }
			    {this.props.user && this.props.rw.user===this.props.user.uid && 
		    		<span style={{marginLeft:'4px'}} >
		    			<button type='button' onClick={this.delete.bind(this)}>delete</button>
			    	</span>
			    }
			</div>
		</div>
		);
	}
	delete() {
		this.props.firebase.deleteSubmission(this.props.postID, this.props.rw.key, this.props.rw.user)
		.then(res=>{
			this.props.deleteSuccess(this.props.postID, this.props.rw.key);
		})
	}
	buttons(vote) {
		if (vote===0) {
			return (
			<span>	
				<button onClick={()=>this.vote(true)} className='vote-button'>+</button>
				<button onClick={()=>this.vote(false)} className='vote-button'>-</button>
			</span>);
		}	
		else if (vote===1) {
			return (
			<span>	
				<button onClick={()=>this.vote(null)} className='vote-button voted' >+</button>
				<button onClick={()=>this.vote(false)} className='vote-button'>-</button>
			</span>);
		}
		else {
			return (
			<span>	
				<button onClick={()=>this.vote(true)} className='vote-button'>+</button>
				<button onClick={()=>this.vote(null)} className='vote-button voted'>-</button>
			</span>);
		}
	}
	vote = (v) => {
		this.props.firebase.vote(this.props.postID, this.props.rw.key, v);
		this.props.vote(v)
	}
}

let mstp = state=>({
	firebase:state.firebase, 
	user: state.user
});
let mdtp = dispatch =>({
  deleteSuccess: (storyID, submissionID)=> dispatch(deleteSubmissionAction(storyID, submissionID)),
});

export default connect(mstp, mdtp)(Rewrite);
