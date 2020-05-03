import React from 'react';
import uuid from 'uuid';
import {Link} from 'react-router-dom';
import ItemDetail from './ItemDetail';
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
		let css_class = "article ";
		if (this.props.num<5) {
			css_class += 'article'+(this.props.num + 1);
		}
		else {
			css_class += 'articleN';
		}
		console.log('hi');
		console.log(this.props.num, css_class);
		if (this.state.big) {
			return (
			 	<div> 
			        <div className="blocker" onClick={this.click.bind(this)}></div>
			        <div className="big" onClick={this.click.bind(this)}>
			        	<ItemDetail post={this.props.post} />
				 	</div>
			 	</div>);
		}	
		/*
		 We show more detail if hovering 
		All detail elements are in the DOM as visibility:hidden otherwise, 
		so the grid container is fixed size.

		TODO: Mobile tap should show this, second tap = desktop click 
		TODO: Just set hide variable and remove if */
		let hide = !this.state.hovering? "hide" : "";
			return (
			 	<article className={css_class} onClick={this.click.bind(this)} onMouseEnter={this.mouseEnter.bind(this)} onMouseLeave={this.mouseLeave.bind(this)} >
			 		<h2> 
			 			{best ? best.headline : "?"}
			 		</h2>
			 		<h3 className="article_below">
			 			{best?<Link to={'/user/'+best.user}>{best.username}</Link>:"no submissions"}
			 		</h3>
		 			<h3 className={"article_below " + hide} >
		 				<span className="code">original:</span>
		 				{this.props.post.title}
		 			</h3>
			 	</article>);
	}
}

export default NewspaperItem;
