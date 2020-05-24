import React, {useState} from "react";
import {Fragment} from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
class Rewrite extends React.Component {
	render() {
		
		let canVote = !!this.props.user;

		let vote = 0;
		if (canVote && this.props.rw.votes[this.props.user.uid] === true) {
			vote = 1;
		}
		else if (canVote && this.props.rw.votes[this.props.user.uid] === false){
			vote = -1;
		}

		let canDelete = canVote && this.props.user.uid===this.props.rw.user;

		return (
			<section className="submission main">
					<p>{this.props.rw.headline}</p>
					<div className="bottomBar">
						<span>
					  		<Link to={'/user/'+this.props.rw.user}>{this.props.rw.username || "anon"}</Link>
						</span>
						<span>
							&#8226;
						</span>
						<span>
							{this.props.rw.score + " points"}
						</span>
					    {canVote &&
					    	<Fragment>
								<span>
									&#8226;
								</span>
								<span>
									{this.buttons(vote)}
								</span>
							</Fragment>
					    }
					    {canDelete &&
					    	<Fragment>
								<span>
									&#8226;
								</span>
								<span>
					    			<DeleteHeadline delete={this.delete.bind(this)} />
								</span>
					    	</Fragment>
					    }
					</div>
			</section>);
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

let DeleteHeadline = (props) => {
  let [confirm, setConfirm] = useState(false);
  return confirm? 
          <Fragment>
          <button type='button' onClick={()=>props.delete(props.id)}>Confirm</button>
          <button type='button' onClick={()=>setConfirm(false)}>Cancel</button>
          </Fragment>
        : <button type='button' onClick={()=>setConfirm(true)}>Delete</button>;
}
let mstp = state=>({
	firebase:state.firebase, 
	user: state.user
});

export default connect(mstp)(Rewrite);
