import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import loginAction from './actions/loginAction';
import NewspaperItem from './NewspaperItem';
import OnboardingSteps from './OnboardingSteps';
import toggleTourAction from './actions/toggleTourAction';

let Welcome = (props) => (
	<Fragment>
		<p>
			Welcome to bottom shelf news. 
			This is a comedy newspaper where the headlines are written by the users! 
		</p>
      <button
      	type='button'
        onClick={()=>{props.close();props.setTour();}}
        style={{ backgroundColor: "#ff0044", color: "white", border: "none", fontSize: "24px", padding: "15px 32px", cursor: "pointer", borderRadius: "10px" }}>Take The Tour</button>
	</Fragment>);
let mstp = state => {
	return {
		firebase:state.firebase,
		posts:state.posts};
}
let mdtp = dispatch => ({
	setTour: (posts) => {dispatch(toggleTourAction());},
})
export default connect(mstp,mdtp)(Welcome);
