import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import uuid from 'uuid';
import AdminVerifyStory from './AdminVerifyStory';

let Status = {NONE:"bg1",SELECTED:"bg2",REJECTED:"bg3"};


let TweetPreview = (props) =>
     (
      <div className="tweetpreview">
        <p><strong>{props.tweet.cat}</strong></p>
        <p>{props.tweet.title}</p>
        <p><a href={props.tweet.url}>{props.tweet.url}</a></p>
      </div>
      );

class AdminPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {handle: "", tweets:null, to_submit:[], submitting: false};
  }


  fetchTweets(handle, num) {
    let score = (tweet) => tweet.favorite_count;
    this.props.firebase.getRecentTweets(handle, num)
    .then(result=>result.data)
    .then(tweets=>tweets.sort( (t1,t2)=>score(t2)-score(t1)) )
    .then(tweets=>{
      tweets.forEach(tweet=>{
        tweet.status=Status.NONE;
        tweet.id=uuid.v4();
      });
      this.setState({tweets:tweets});
    });
  }
  fetchCustomTweets(event) {
    event.preventDefault();
    this.fetchTweets(this.state.handle, 50);
  }

  handleChange(event) {
    this.setState({handle:event.target.value});
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
        this.props.firebase.newArticle(tweet.title, tweet.url, tweet.cat, false)
        .then(res=>this.props.history.push("/news"));
      }
    });
  }
  show(e) {
    this.setState({submitting: !this.state.submitting})
  }

  killDB() {
    this.props.firebase.clearToday()
    .then(res=>{
      this.props.history.push('/news');
    })
  }
  render() {
      let categories = [ 
        "general","sports","politics"
      ];
      if (this.state.submitting) {
        return (
          <div>
            <button onClick={this.submit.bind(this)}>submit</button>
            <button onClick={this.show.bind(this)}>edit</button>
            {
              this.state.tweets.filter(tweet=>tweet.status===Status.SELECTED)
              .map(tweet=> <TweetPreview tweet={tweet} key={uuid.v4()} />)
            }
          </div>)
      }
      else if (this.state.tweets) {
        return (
        <div> 
          <button style={{margin:"10px"}} onClick={()=>this.setState({tweets:null})}>Clear</button>
          <button onClick={this.show.bind(this)}>show selections</button>
          <button onClick={this.killDB.bind(this)}>kill database</button>
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
        return (
        <div>


          <form onSubmit={this.fetchCustomTweets.bind(this)}>
            <button type="button" style={{margin:"10px"}} onClick={()=>this.fetchTweets("ap",50)}>Fetch AP Tweets</button>
            <button type="button" style={{margin:"10px"}} onClick={()=>this.fetchTweets("abc",50)}>Fetch ABC News Tweets</button>

            <input type='text' placeholder="@handle" value={this.state.handle} onChange={this.handleChange.bind(this)} />
            <button type='submit'>Fetch Custom Tweets</button>

          </form>

          <button style={{margin:"10px"}} onClick={this.killDB.bind(this)}>kill database</button>
        </div> );
      }
  }
}

const MapStateToProps = state => ({posts:state.posts, categories:state.categories, user:state.user, firebase:state.firebase});

export default withRouter(connect(MapStateToProps)(AdminPanel));
