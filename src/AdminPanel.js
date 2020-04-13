import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import uuid from 'uuid';
import AdminVerifyStory from './AdminVerifyStory';

let Status = {NONE:"bg1",SELECTED:"bg2",REJECTED:"bg3"};

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
      tweets.forEach(tweet=>{
        tweet.status=Status.NONE;
        tweet.id=uuid.v4();
      });
      window.t=tweets;
      this.setState({tweets:tweets, submitting: false});
    })
  }
  cancel(id) {
    let tweets = this.state.tweets;
    tweets = tweets.slice(); 
    tweets.forEach(t=>{
      if (t.id===id) {
        t.status = Status.REJECTED;
      }
    })
    this.setState({tweets : tweets});
  }

  save(id, cat, url, title) {

    let tweets = this.state.tweets;
    tweets = tweets.slice(); 
    tweets.forEach(t=>{
      if (t.id===id) {
        t.url=url;
        t.title=title;
        t.cat=cat;
        t.status = Status.SELECTED;
      }
    })
    this.setState({tweets : tweets});
  }

  submit(e) {
    e.preventDefault();
    this.state.tweets.forEach(tweet => {
      if (tweet.status===Status.SELECTED) {
        this.props.firebase.newArticle(tweet.title, tweet.url, tweet.cat, false);
      }
    });
  }
  show(e) {
    this.setState({submitting: !this.state.submitting})
  }

  preview(tweet) {
    return (
      <div className="tweetpreview">
        <p><strong>{tweet.cat}</strong></p>
        <p>{tweet.title}</p>
        <p><a href={tweet.url}>{tweet.url}</a></p>
      </div>
      );
  }
  render() {
      let categories = [ 
        "general","sports","politics"
      ];
      if (this.state.submitting) {
        return (
          <div>
            <button onClick={this.submit.bind(this)}>submit</button>
            <button onClick={this.show.bind(this)}>show</button>
            {
              this.state.tweets.filter(tweet=>tweet.status===Status.SELECTED)
              .map(tweet=>this.preview(tweet))
            }
          </div>)
      }
      else if (this.state.tweets) {
        return (
        <div> 
          <button onClick={this.submit.bind(this)}>submit</button>
          <button onClick={this.show.bind(this)}>show</button>
          {this.state.tweets.map(tweet =>
            <AdminVerifyStory 
                categories={categories} 
                full={tweet.full_text} 
                guess_url = {tweet.guess_url}
                guess_text = {tweet.guess_text}
                status={tweet.status}
                save={this.save.bind(this, tweet.id)} 
                cancel = {this.cancel.bind(this, tweet.id)} 
                key={tweet.id} />)
            }
            </div>
          );
      }
      else {
        return <div>no tweets fetched </div>;
      }
  }
}

const MapStateToProps = state => ({posts:state.posts, categories:state.categories, user:state.user, firebase:state.firebase});

export default withRouter(connect(MapStateToProps)(AdminPanel));
