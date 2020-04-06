import React from 'react';
import uuid from 'uuid';
class AdminVerifyStory extends React.Component {
	constructor(props) {
		super(props);
		console.log(props);
		this.state = {url:props.guess_url,title:props.guess_text};
	}

	linkAndText(tweet_text) {
		return [];
	}
	submit(category) {
		console.log(category);
		console.log(this.state.title);
		console.log(this.state.url);
	}

	change(event) {
		this.setState({[event.target.name]:event.target.value});
	}

	render() {
      return (
        <div className='adminPanel'>
          <form autoComplete='off' action=''>

            <fieldset className='form-group wrap '>
              <div className='input-name'>
              	<h2>{this.props.full}</h2>
              </div>
              <textarea 
              	spellCheck={false}
              	value={this.state.title} 
              	onChange={this.change.bind(this)} 
              	className='adminPanel' 
              	name='title'/>
              <textarea 
              	spellCheck={false}
              	className='adminPanel' 
              	value={this.state.url} 
              	onChange={this.change.bind(this)} 
              	name='url' />
            </fieldset>
            <div className = 'new-post-buttons'>
              <button onClick={this.props.cancel}>Cancel</button>
              {
              	this.props.categories.map( category => 
              		<button key={uuid.v4()} type="button" onClick={this.submit.bind(this,category)}>{category}</button> )
              }
            </div>
          </form>
        </div>
        );
	}
}

export default AdminVerifyStory;