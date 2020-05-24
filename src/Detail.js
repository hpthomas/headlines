import React from 'react';
import {connect} from 'react-redux';
import Item from './Item';
import sortHeadlines from './util/sortHeadlines';
class Detail extends React.Component {
	/*
	Fetch all for this.props.match.params.postID from server
	Display expanded version of Item
	*/
	constructor(props){
		super(props);
		this.state = {item:null}
	}
	componentDidMount() {
		let storyID = this.props.match.params.postID;
		Promise.all(
			[this.props.firebase.getSubmissionsForPost(storyID,100),
			this.props.firebase.getStoryByID(storyID)]
		)
		.then(res=>{
			let subs = res[0].val();
			let story = res[1].val();
			if (subs) {
				story.headlines=sortHeadlines(subs);
			}
			else {
				story.headlines = [];
			}
			this.setState({item:story});
		})
	}
	render() {
		if (!this.state.item) return <div>hi</div>;
		let item = this.state.item;
		return (<Item 
            postID = {this.props.match.params.postID}
            category={item.category} 
            orTitle={item.title} 
            timestamp={item.timestamp}
            headlines={item.headlines}
            show={100}
            source={item.source}
            url={item.url} 
            frozen={item.frozen} 
	        />);
	}
}
let mstp = state => {
	return {
		firebase:state.firebase
	};
}
export default connect(mstp)(Detail);