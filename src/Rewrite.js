import React from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
class Rewrite extends React.Component {
	render() {

		let canVote = !!this.props.user;
		let canDelete = canVote && this.props.user.uid===this.props.rw.user;
		
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
			    {canVote &&
		    		<span style={{marginLeft:'4px'}} >
		    			<span>Vote!</span>
		    			{this.buttons(vote)}
			    	</span>
			    }
			    {canDelete && 
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
			this.props.delete(this.props.rw.key);
		})
		.catch(err=>console.log('error:' + err));
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

export default connect(mstp)(Rewrite);
