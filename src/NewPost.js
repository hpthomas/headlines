import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import uuid from 'uuid';
import articles from './articles';

const isValidURL = function(str) {
    return true;//(str.substring(0,7)==='http://' || str.substring(0,8) === 'https://' || str[0]==='#')
}

class NewPost extends React.Component {

  cancel = (e )=> {
    e.preventDefault();
    this.props.history.push('/news');
  }
  fakeVotes() {
    console.log("fake votes");
    this.props.posts.forEach(post => {
      console.log(post.submissions);
      if (!post.submissions) return;
      Object.keys(post.submissions).forEach(sub =>{
        this.props.firebase.fakeVotes(post.postID, sub, 10);
      });
    });
  }
  
  fakeSubs() {
    console.log("fake subs");
    this.props.posts.forEach(post => {
      console.log(post);
      [1,2,3].forEach(num => this.props.firebase.newHeadline(post.postID, "Fake Headline #" + num));
    });
  }
  
  fake_yesterday() {
      articles.forEach(a=>this.props.firebase.newArticle(a[0],a[1],a[2],true));
      this.props.history.push("/news");
  }
  fake() {
      articles.forEach(a=>this.props.firebase.newArticle(a[0],a[1],a[2]));
      this.props.history.push("/news");
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
      this.props.firebase.newArticle(title,url,cat);
      this.props.history.push("/news");
    }
    else {
      //tell the user to fill out the form properly
    }
  }

  render() {
      if (!this.props.user) {
        this.props.history.push('/login');
        return null;
      }
      var selector;

      //if props.params has a specific category to default to:
      if (this.props.params && this.props.params.category) {
        selector = (
            <select name='category'>
              <option value={this.props.params.category}>
                {this.props.params.category}
              </option>
              {
                this.props.categories
                .filter(name => name !== this.props.params.category)
                .map(name => <option key={uuid.v4()} value={name}>{name} </option>)
              }
            </select>
          )
      }

      //if no specific category - order is the default from [categories]
      else {
        selector = (
          <select name='category'>
                {this.props.categories.map(name => 
                  <option key={uuid.v4()} value={name}>{name}</option>
                  )}
          </select>
        )
      }

      return (
        <div className='new-post'>
          <h2>Submit a New Arcticle</h2>
          <form autoComplete='off' action='' onSubmit = {this.submit}>
            <fieldset className='form-group wrap'>
              <div className='input-name'>
                Title
              </div>
              <textarea className='form-control' autoFocus={true} name='title' placeholder='title' />
              <div className='byline'>
                Enter the original title of the article
              </div>
            </fieldset>
        
            <fieldset className='form-group wrap'>
              <div className='input-name'>
               URL
              </div>
              <textarea className='form-control' name='url' placeholder='URL' />
              <div className='byline'>
                Please submit a link to a valid news source
              </div>
            </fieldset>
            <fieldset className='form-group wrap'>
              <div className='input-name'>
              Article Category
              </div>
              {selector}
            </fieldset>
            <div className = 'new-post-buttons'>
              <button type='submit'>Submit</button>
              <button onClick={this.cancel}>Cancel</button>
            </div>
          </form>
        </div>
      )
  }
}

const MapStateToProps = state => ({posts:state.posts, categories:state.categories, user:state.user, firebase:state.firebase});

export default withRouter(connect(MapStateToProps)(NewPost));
