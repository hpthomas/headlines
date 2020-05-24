import React, {useState} from "react";
import {connect} from "react-redux";
import {Link} from 'react-router-dom';
import deleteAction from './actions/deleteAction';
import deleteSubmissionAction from './actions/deleteSubmissionAction';
import editAction from './actions/editAction';
import Rewrite from './Rewrite';
import dateFormat from './util/dateFormat';
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
  delete(postID) {
    this.props.firebase.deleteStory(postID)
    .then(()=>{
      this.props.deleteSuccess(postID);
      this.props.history.push('/news');
    });
  }
  deleteSubmission(subID) {
    this.setState({headlines: this.state.headlines.filter(hl=>hl.key!==subID)});
  }
  archive() {
    console.log('archive');
  } 
  render() {
    return (
        <div className="itemcontainer">
          <section className="date_above">{dateFormat(new Date(this.props.timestamp))}</section>

          <section className="original main">
              <p>
                <Link to={'/detail/' + this.props.postID}> {this.props.orTitle} </Link>
              </p>
          </section>

          <div className="right">
            <a href={this.props.url}>{this.props.source || "unknown"} &#8599;</a>
          </div>

          {this.state.headlines.map(headline =>
              <Rewrite
                key={uuid.v4()}
                className="best-rewrite" 
                postID={this.props.postID} 
                rw={headline}
                vote={this.vote.bind(this, headline.key) }
                delete={this.deleteSubmission.bind(this)}
              />
            )  }

          <section className="itembuttons"> 
            {this.props.user && 
              <NewSubmission submit={this.submit.bind(this)}/>  }
            {this.props.user && this.props.user.admin && 
              <DeleteStory id={this.props.postID} delete={this.delete.bind(this)} /> }
            {this.props.user && this.props.user.admin && 
              <ArchiveStory archive={this.archive.bind(this)} /> }
          </section> 
      </div>
     );
  }
}

let ArchiveStory = (props) => {
  let [confirm, setConfirm] = useState(false);
  return (
    <div>
      {
        confirm? 
          <div>
          <button type='button' onClick={()=>props.archive(props.id)}>Confirm</button>
          <button type='button' onClick={()=>setConfirm(false)}>Cancel</button>
          </div>
        : <button type='button' onClick={()=>setConfirm(true)}>Archive</button>
      }
    </div>
  )
}

let DeleteStory = (props) => {
  let [confirm, setConfirm] = useState(false);
  return (
    <div>
      {
        confirm? 
          <div>
          <button type='button' onClick={()=>props.delete(props.id)}>Confirm</button>
          <button type='button' onClick={()=>setConfirm(false)}>Cancel</button>
          </div>
        : <button type='button' onClick={()=>setConfirm(true)}>Delete Story</button>
      }
    </div>
  )
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
  deleteSubmissionSuccess: (storyID, submissionID)=> dispatch(deleteSubmissionAction(storyID, submissionID)),
  editSuccess: (id,title,url)=>dispatch(editAction(id,title,url))
});
export default withRouter(connect(mstp,mdtp)(Item));