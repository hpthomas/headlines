import React from 'react';
import {connect} from 'react-redux';
let Profile = (props)=>(
	<div>
		<p>This is the profile page. Welcome.</p>
	</div>
	);
let mstp = state => {
	console.log("Drawing profile with state:");
	console.log(state);
	return {};
}
export default connect(mstp)(Profile);