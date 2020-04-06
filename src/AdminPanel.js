import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import uuid from 'uuid';
import articles from './articles';
import AdminVerifyStory from './AdminVerifyStory';

const isValidURL = function(str) {
    return true;//(str.substring(0,7)==='http://' || str.substring(0,8) === 'https://' || str[0]==='#')
}

class AdminPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tweets:null, to_submit:[]};
  }

  componentDidMount() {
    let score = (tweet) => tweet.favorite_count;
    this.props.firebase.getRecentTweets('ap')
    .then(result=>result.data)
    .then(tweets=>tweets.sort( (t1,t2)=>score(t2)-score(t1)) )
    .then(tweets=>{
      window.t=tweets;
      this.setState({tweets:tweets});
    })
  }
  cancel = (e )=> {
    e.preventDefault();
    this.props.history.push('/news');
  }

  submit = (e)=> {
    e.preventDefault();
    if (e.target.url.value && e.target.title.value) {
      if (!isValidURL(e.target.url.value)) {
        //TODO handle this
        console.log("invalid URL");
        return;
      }
      let [title,url,cat] = [e.target.title.value, e.target.url.value, e.target.category.value];
    }
    else {
      //tell the user to fill out the form properly
    }
  }
  render() {
      let categories = [ 
        "general","sports","politics"
      ];
      if (this.state.tweets) {
        return this.state.tweets.map(tweet =>
          <AdminVerifyStory 
              categories={categories} 
              full={tweet.full_text} 
              guess_url = {tweet.guess_url}
              guess_text = {tweet.guess_text}
              submit={this.submit.bind(this)} 
              cancel = {this.cancel.bind(this)} 
              key={uuid.v4()}
              />
          )
      }
      return (
        <AdminVerifyStory 
            categories={categories} 
            submit={this.submit.bind(this)} 
            cancel = {this.cancel.bind(this)} 
            />
      )
  }
}

const MapStateToProps = state => ({posts:state.posts, categories:state.categories, user:state.user, firebase:state.firebase});

export default withRouter(connect(MapStateToProps)(AdminPanel));
