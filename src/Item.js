import React, {useState} from "react";
import {connect} from "react-redux";
import {Link} from 'react-router-dom';
import deleteAction from './actions/deleteAction';
import editAction from './actions/editAction';
import Rewrite from './Rewrite';
import {withRouter} from 'react-router-dom';
import uuid from 'uuid';


class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {headlines:this.props.headlines.slice(0,this.props.show)};
  }

  submit(title) {
    if (!title) return;
    let newkey = this.props.firebase.newHeadline(this.props.postID, title);
    //console.log(this.props.headlines[0]);
    let newhl = {headline:title, 
                 user:this.props.user.uid, 
                 username:this.props.user.displayName, 
                 key:newkey,
                 score:1,
                 votes: {[this.props.user.uid]:true}};
    this.setState({headlines:this.state.headlines.concat([newhl])});
  }
  vote(headlineID, v) {
    let newhl = this.state.headlines.slice(0);
    for (var i=0; i<this.state.headlines.length; i++) {
      if (this.state.headlines[i].key === headlineID) {
        let temp = this.state.headlines[i];
        temp.votes[this.props.user.uid] = v;
        let reducer = (score, cur)=> score + (cur===true?1:(cur===false?-1:0));
        let score = Object.values(temp.votes).reduce(reducer,0);
        temp.score=score;
        newhl[i] = temp;
      }
    }
    this.setState({headlines:newhl});
  }
  render() {
    //console.log(this.props.headlines);
    return (
      <li className='news-item'>
        <p>
          <Link to={'/detail/' + this.props.postID} className='original-title' >{this.props.orTitle}</Link>
        </p>
        {this.state.headlines.map(headline =>
            <Rewrite
              key={uuid.v4()}
              className="best-rewrite" 
              postID={this.props.postID} 
              rw={headline}
              vote={this.vote.bind(this, headline.key) }
            />
          )
        }
        
        {
        this.props.user && 
          <NewSubmission submit={this.submit.bind(this)}/>
        }

      </li>
     );
  }
}

let NewSubmission = (props) => {
  let [inEdit, setInEdit] = useState(false);
  return (
    <div>
      {
        inEdit? <Editor submit={props.submit} cancel={()=>setInEdit(false)} /> 
        : <button onClick={()=>setInEdit(true)}>New Submission</button>
      }
    </div>
  )
}

let Editor = props=> {
  let text_ref = React.createRef();
  return (
      <div>
        <fieldset>
          <textarea ref={text_ref} name='title' style={{width:'80%', height: '2em'}} />
        </fieldset>
        <button onClick={()=>{props.submit(text_ref.current.value);props.cancel();}}>Submit</button>
        <button onClick={props.cancel}>Cancel</button>
      </div>
    );
}

let mstp = state=>({
  firebase:state.firebase,
  user: state.user,
});
let mdtp = dispatch =>({
  deleteSuccess: (id)=> dispatch(deleteAction(id)),
  editSuccess: (id,title,url)=>dispatch(editAction(id,title,url))
});
export default withRouter(connect(mstp,mdtp)(Item));