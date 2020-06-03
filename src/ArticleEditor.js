import React from 'react';
import {connect} from 'react-redux';
class ArticleEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {text:this.props.post.article_text || ""};
	}	

	change(event) {
		this.setState({text:event.target.value});
	}

	submit() {
		this.props.firebase.editArticle(this.props.post.postID, this.state.text);
	}

	save() {
		this.props.firebase.saveArticle(this.props.post.postID, this.state.text);
	}

	render() {
	return (<div>
		<div>
			<textarea className='article_editor' value={this.state.text} onChange={this.change.bind(this)} />
		</div>
		<div>
			<button type='button' onClick={this.submit.bind(this)}> submit </button>
			<button type='button' onClick={this.save.bind(this)}> save </button>
		</div>
	</div>);
	}
}
let mstp = state => {
	return {firebase:state.firebase}
}
export default connect(mstp)(ArticleEditor);