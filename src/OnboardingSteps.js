import React, { useState } from 'react';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import ReactJoyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import forceClickAction from './actions/forceClickAction';
import toggleTourAction from './actions/toggleTourAction';
let GoToActive = (props) => (<div>
    <button type='button' onClick={props.f}>go somewhere </button>
  </div>
);
/*

ORDER

FIRST POPUP NEWSPAPER
Welcome/its comedy news 

WHOLE NEWSPAPER 
These are our stories

-> ACTIVE 
ACTIVE BUTTON
These stories need headlines!

ONE STORY
Click to see what we've got so far. 
The winning headline 

TODO Tomorrow:
Make 3rd step dive down into the active page
figure out a way to show Item
MAYBE: THrough URL re-render but big changes
ELSE: auto-click for the user annd unnclick inn callback

*/


class OnboardingSteps extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      stepindex:0,
      loading:false,
      run: true,
      steps: [
        {
          content: <div className='intro_tour'><h2>Read the News!</h2><h3></h3></div>,
          target: ".home_top_link",
          placement: "auto",
          disableBeacon: true,
        },
        {
          content: <div className='intro_tour'><h2>Write the News!</h2><h3>We're still writing and voting on these stories.</h3></div>,
          target: ".active_top_link",
          placement: "auto",
          disableBeacon: true,
        },
        {
          content: <div className='intro_tour'><h2>Can you do better?</h2><h3>Click to expand.</h3></div>,
          target: ".article1",
          style:{zIndex:1005},
          disableBeacon: true,
        },
        {
          content:<div className='intro_tour'><h2>Vote or write a headline.</h2><h3></h3></div>,
          target: ".itemcontainer",
           styles: {
              options: {
                overlayColor:"rgba(0,0,0,0)",
                spotlightShadow:"",
              },
              spotlight:{
                backgroundColor:"rgba(0,0,0,0)"
              }
            },
          disableBeacon: true,
        },
        {
          content:<div className='intro_tour'><h2>Explore!</h2><h3></h3></div>,
          target: "body",
          placement:"center",
          disableBeacon: true,
        },
      ]
    }
  }
  start() {
    this.setState({run:true});
  }
  next() {
    this.setState({stepindex:this.state.stepindex+1});
  }
  handleCallback(data) {
    let wait_time=100;

    const { action, index, type, status } = data;

    // 2 to 3
    if (type==EVENTS.STEP_AFTER && index==2 && (action==ACTIONS.NEXT || action==ACTIONS.CLOSE)) {
      this.props.force_click(true);
    }
    // 3 to 4
    if (type==EVENTS.STEP_AFTER && index==3 && (action==ACTIONS.NEXT || action==ACTIONS.CLOSE)) {
      this.props.force_click(false);
    }
    // 4 to 3
    if (type==EVENTS.STEP_AFTER && index==4 && action==ACTIONS.PREV) {
      this.props.force_click(true);
    }
    // 3 to 2
    if (type==EVENTS.STEP_AFTER && index==3 && action==ACTIONS.PREV) {
      this.props.force_click(false);
    }
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status) && this.state.run) {
      this.props.toggle_tour();
    } 
    //VERY IMPORTANT
    //To show across pages, you have to sent the run state to false. 
    // from step zero to step one
    // this is 0 to 1
    else if (type==EVENTS.STEP_AFTER && index==0 && (action==ACTIONS.NEXT || action==ACTIONS.CLOSE)) {
      this.setState({loading:true,run:false})
      this.props.history.push('/active');
      setTimeout(() => {
        this.setState({
          loading:false,
          run: true,
          stepindex:1
        });
      }, wait_time);
    }

    // from step 1 back to step 0
    else if (type==EVENTS.STEP_AFTER && index==1 && action==ACTIONS.PREV) {
      this.setState({loading:true,run:false})
      this.props.history.push('/');
      setTimeout(() => {
        this.setState({
          loading:false,
          run: true,
          stepindex:0
        });
      }, wait_time);
    }

    else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      console.log('doing a normal index update');
      // Update state to advance the tour
      this.setState({ stepindex: index + (action === ACTIONS.PREV ? -1 : 1) });
    } 

    else if (type === EVENTS.TOOLTIP_CLOSE) {
      this.setState({ stepindex: index + 1 });
    }

  }
  
  render() {
    let styles = {
        options: {
          primaryColor: '#000',
          textColor: '#333',
          zIndex: 1005,
        },
        tooltip: {
          padding:5
        },
        tooltipContent: {
          padding: '10px 5px',
       },

    };
    return (<React.Fragment>
      <ReactJoyride
        callback={this.handleCallback.bind(this)}
        stepIndex={this.state.stepindex}
        steps={this.state.steps}
        run={this.state.run}
        continuous={true}
        showProgress
        styles={styles}
        showSkipButton />
    </React.Fragment>);
  };
}
let mstp = (state) => state;
let mdtp = dispatch => ({
  force_click: (target) => {dispatch(forceClickAction(target));},
  toggle_tour: () => {dispatch(toggleTourAction());},
})
export default connect(mstp,mdtp)(withRouter(OnboardingSteps));
