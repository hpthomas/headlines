import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class NewPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {title:"",url:"",source:""};
  }
  submit(ev) {
    ev.preventDefault();
      this.props.firebase.newArticle(this.state.title, this.state.url, this.state.source)
      .then(res=>this.props.history.push("/news"));
  }

  change(event) {
    console.log(event);
    console.log(this.state);
    this.setState({[event.target.name]:event.target.value});
  }

  render() {

      return (
        <div className='submit_one'>
              <div className='input-name'>
                Title
              </div>
              <textarea onChange={this.change.bind(this)} className='' name='title' placeholder='title' />
        
              <div className='input-name'>
               URL
              </div>
              <textarea onChange={this.change.bind(this)} className='' name='url' placeholder='URL' />

              <div className='input-name'>
                Source Name 
              </div>
              <textarea onChange={this.change.bind(this)} className='' name='source' placeholder='source' />

              <button type='button' onClick={this.submit.bind(this)}>Submit One Article</button>
        </div>
      )
  }
}

const MapStateToProps = state => ({posts:state.posts, categories:state.categories, firebase:state.firebase});

export default withRouter(connect(MapStateToProps)(NewPost));
