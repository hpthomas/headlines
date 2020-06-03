import React, {useState} from 'react';
import {connect} from 'react-redux';
import dateFormat from './util/dateFormat';
import {withRouter, Link} from 'react-router-dom';
import uuid from 'uuid';
class ArticleItem  extends React.Component{
	constructor(props) {
		super(props);
	}
	unfreeze(postID) {
	    this.props.firebase.unFreezeStory(postID)
	    .then(res=>{
	      this.props.history.push('/');
	    });
	}
	//hacky - we 'edit' the post without changing text
	unsave(postID) {
		this.props.firebase.editArticle(this.props.post.postID, this.props.post.article_text)
		.then(res=>{
	      this.props.history.push('/');
		})
	}
	render() {
		let best = this.props.post.headlines[0].headline;
		let original = this.props.post.title;
		let url = this.props.post.url;
		let source = this.props.post.source;

		let content = this.props.post.article_text
		.split('\n')
		.map(paragraph=>
			<p className='news_article_section' key={uuid.v4()}>{paragraph}</p>
		);

	    return (
	        <div className="itemcontainer">
	          <section className="date_above">{dateFormat(new Date(this.props.post.timestamp))}</section>

	          <section className="article_headline">
	              <p>
	              	{best}
	              </p>
	          </section>


	          <article className='news_article'>
	          	{content}
	          </article>
	          <div className="article_byline">
					<a href={url}><span className='code'>{source + ":"}</span>{original}</a>
	          </div>
	          {this.props.user && this.props.user.admin && 
	              <UnFreeze id={this.props.post.postID} f={this.unfreeze.bind(this)} />
	          }
	          {this.props.user && this.props.user.admin && 
	              <UnSave id={this.props.post.postID} f={this.unsave.bind(this)} />
	          }
	      </div>
	     );
	}
}
let UnSave = (props) => {
  let [confirm, setConfirm] = useState(false);
  return (
    <div>
      {
        confirm? 
          <div>
          <button type='button' onClick={()=>props.f(props.id)}>Confirm</button>
          <button type='button' onClick={()=>setConfirm(false)}>Cancel</button>
          </div>
        : <button type='button' onClick={()=>setConfirm(true)}>UnSave</button>
      }
    </div>
  )
}
let UnFreeze = (props) => {
  let [confirm, setConfirm] = useState(false);
  return (
    <div>
      {
        confirm? 
          <div>
          <button type='button' onClick={()=>props.f(props.id)}>Confirm</button>
          <button type='button' onClick={()=>setConfirm(false)}>Cancel</button>
          </div>
        : <button type='button' onClick={()=>setConfirm(true)}>UnFreeze</button>
      }
    </div>
  )
}
let mstp = state=>({firebase:state.firebase, user:state.user});
export default withRouter(connect(mstp)(ArticleItem));