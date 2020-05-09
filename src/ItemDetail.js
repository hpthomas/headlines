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
			<section className="original">
				<div className="main">
					<p>{this.props.post.title}</p>
				</div>
				<div className="right">
					<a href={this.props.post.url}>AP News &#8599;</a>
				</div>
			</section>
			{this.props.post.headlines? 
				this.props.post.headlines.map(hl=><Submission headline={hl} />)
				: null}
		 </div>);
	}
}
let Submission = (props) => (
<section className="submission">
	<div className="main">
		<p>{props.headline.headline}</p>
		<div className="bottomBar">
			<span>
		  		<Link to={'/user/'+props.headline.user}>{props.headline.username}</Link>
			</span>
			<span>
				&#8226;
			</span>
			<span>
				{props.headline.score + " points"}
			</span>
			<span>
				&#8226;
			</span>
			<span>
				<button className='vote-button'>+</button>
				<button className='vote-button'>-</button>
			</span>
		</div>
	</div>
	<div className="right">
	</div>
</section>);
export default ItemDetail;