import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import loginAction from './actions/loginAction';
import NewspaperItem from './NewspaperItem';
import OnboardingSteps from './OnboardingSteps';
import toggleTourAction from './actions/toggleTourAction';

let Welcome = (props) => (
	<div className='landing_overlay'>
		<div className='close_landing_overlay'>
			<span className='closebutton'></span> {/* this is a dummy span to center 'Welcome' w button right-aligned */}
			<span>Welcome</span>
			<span className='closebutton' onClick={props.close.bind(this)}>x</span>
		</div>
			<h2> Bottom Shelf News is a comedy newspaper where the users write the headlines.</h2>
			<p>
				Everybody thinks they can write comedy. Let's try! 
			</p>
			<p>
				
			</p>
	      <button
	      	type='button'
	        onClick={()=>{props.close();props.setTour();}}
	        style={{ backgroundColor: "#ff0044", color: "white", border: "none", fontSize: "24px", padding: "15px 32px", cursor: "pointer", borderRadius: "10px" }}>Take The Tour</button>
	</div>);
let mstp = state => {
	return {
		firebase:state.firebase,
		posts:state.posts};
}
let mdtp = dispatch => ({
	setTour: (posts) => {dispatch(toggleTourAction());},
})
export default connect(mstp,mdtp)(Welcome);
