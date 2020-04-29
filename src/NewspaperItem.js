import React from 'react';
import uuid from 'uuid';
import {Link} from 'react-router-dom';
/* 
The core purpose of this class is to display a news article 
in newspaper format, to a reader.
By default this only shows top headline. 
On hover, will maybe show original title
On click, will be centered in page and show
the original and several top headlines.

This should default to original if no submissions, and 
titles without submissions should be highlighted.
*/
class NewspaperItem extends React.Component {
	constructor(props){
		super(props);
		this.state={hovering:false, big:false}
	}
	mouseEnter(){
		this.setState({hovering:true});
	}
	mouseLeave(){
		this.setState({hovering:false});
	}
	click() {
		this.setState({big:!this.state.big});
	}
	render() {
		let num_headlines = this.props.post.headlines.length;
		let best = null;
		let remaining = null;
		if (num_headlines>0){
			best = this.props.post.headlines[0];
			remaining = this.props.post.headlines.slice(1);
		}
		if (this.state.big) {
			return (
			 	<div> 
			        <div className="blocker" onClick={this.click.bind(this)}></div>
			        <div className="big" onClick={this.click.bind(this)}>
				 		<h2> 
				 			<span className="code">original:</span>
				 			{false && <Link to={'/detail/' + this.props.post.postID}> {this.props.post.title} </Link> }
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
				 	</div>
			 	</div>);
		}	
		else if (this.state.hovering) {
			return (
			 	<figure onMouseEnter={this.mouseEnter.bind(this)} onMouseLeave={this.mouseLeave.bind(this)} >
			        <div onClick={this.click.bind(this)}>
				 		<h2> 
				 			{best ? best.headline : this.props.post.title}
				 		</h2>
				 	</div>
			 	</figure>);
		}
		else {
			return (
			 	<figure onMouseEnter={this.mouseEnter.bind(this)} onMouseLeave={this.mouseLeave.bind(this)} >
			        <div onClick={this.click.bind(this)}>
				 		<h2> 
				 			{best ? best.headline : this.props.post.title}
				 		</h2>
				 	</div>
			 	</figure>);
		}
	}
}

export default NewspaperItem;
