import React from 'react';
import {Link} from 'react-router-dom';
class ItemDetail extends React.Component {
	render() {
		let num_headlines = this.props.post.headlines.length;
		let best = null;
		let remaining = null;
		if (num_headlines>0){
			best = this.props.post.headlines[0];
			remaining = this.props.post.headlines.slice(1);
		}
		return (<div>
	 		<h2> 
	 			<Link to={'/detail/' + this.props.post.postID}> 
		 			<span className="code">original:</span>
	 			</Link>
	 			{this.props.post.title}
	 		</h2>
	 		{best?
		 		<h2>
		 			<span className="code">best:</span>
		 			{this.props.post.headlines[0].headline}
		 		</h2>
		 		:null
		 	}
		 	{remaining? remaining.map(hl=>(
		 		<h2>
		 			<span className="code">runner up:</span>
		 			{hl.headline}
		 		</h2>))
		 		: null
		 	}
		 </div>);
	}
}
export default ItemDetail;