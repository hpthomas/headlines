import React from 'react';
import {Link} from 'react-router-dom';
import Item from './Item';
import dateFormat from './util/dateFormat';
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
		/*
		if (props.num==0) this.state={hovering:false, big:true};
		else this.state={hovering:false, big:false}; 
		*/
		this.state={hovering:false, big:false};
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
		let date = dateFormat(new Date(this.props.post.timestamp));
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
		// display Item instead of NewspaperItem
		if (this.state.big) {
			return (
			 	<div> 
			        <div className="blocker" onClick={this.click.bind(this)}></div>
			        <div className="big" >
				         <Item 
				            post = {this.props.post}
				            show={4}
				         />
				 	</div>
			 	</div>);
		}	
		/*
		 We show more detail if hovering 
		All detail elements are in the DOM as visibility:hidden otherwise, 
		so the grid container is fixed size.

		TODO: Mobile tap should show this, second tap = desktop click 
		TODO: Just set hide variable and remove if */
		let hide = "hide";
		if (num_headlines<1) {
			hide="dim";
		}
		if (this.state.hovering) {
			hide="";
		}
		let below_content = null;


		//TODO this should check for completeed, not just frozen, articles.
		if (this.props.post.frozen) {
			let below_text = this.props.post.article_text;
			if(!below_text) {
				below_text = '';
			}
			if (below_text.length > 100){
				below_text = below_text.substring(0,100) + "...";
			}
			below_content = 
				<h3 className={"article_below_medium " + hide}> 
					{below_text}
				</h3>;
		}
		else {
			below_content = 
				<h3 className={"article_below_medium " + hide}> 
	 				<span className="code">
	 					<a href={this.props.post.url}>{this.props.post.source }</a>:  
	 				</span>
	 				{this.props.post.title}
				</h3>;
		}


		return (
	 	<article className={css_class} onClick={this.click.bind(this)} onTouchStart={this.mouseEnter.bind(this)} onTouchEnd={this.mouseLeave.bind(this)} onMouseEnter={this.mouseEnter.bind(this)} onMouseLeave={this.mouseLeave.bind(this)} >
	 		<h2> 
	 			{best ? best.headline : "?"}
	 		</h2>
	 		<h3 className="article_below_medium ">
	 			{best?<Link to={'/user/'+best.user}>{best.username}</Link>:"no submissions"}
	 		</h3>
	 		{below_content}
 			<h4 className={"article_below_small "} >
 				{date}
 			</h4>
	 	</article>);
	}
}

export default NewspaperItem;
