import React from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
class Rewrite extends React.Component {
	render() {
		// if not logged in, props.uid==null. be more explicit??
		let temp = this.props.rw.votes[this.props.uid];
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
			    {this.props.uid &&
		    		<span style={{marginLeft:'4px'}} >
		    			<span>Vote!</span>
		    			{this.buttons(vote)}
			    	</span>
			    }
			</div>
		</div>
		);
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
	uid: state.user? state.user.uid :null
});

export default connect(mstp)(Rewrite);
