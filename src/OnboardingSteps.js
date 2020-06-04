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
          content: <div><h2>Read the News!</h2><h3></h3></div>,
          target: ".home_top_link",
          placement: "auto",
          disableBeacon: true,
        },
        {
          content: <div><h2>Write the News!</h2><h3>Stories here need headlines.</h3></div>,
          target: ".active_top_link",
          placement: "auto",
          disableBeacon: true,
        },
        {
          content: <div><h2>This is our top submission of the day.</h2><h3>Can you do beter?</h3></div>,
          target: ".article1",
          disableOverlay:true,
          style:{zIndex:1005},
          disableBeacon: true,
        },
        {
          content:<div><h2>Click a story to participate.</h2><h3></h3></div>,
          target: ".itemcontainer",
          disableOverlay:true,
          styles:{zIndex:1005},
          disableBeacon: true,
        },
        {
          title: "LAST ...",
          target: ".about_top_link",
          content: <div><Link to='/active'>Active</Link></div>,
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
    if (type==EVENTS.STEP_AFTER && index==2 && action==ACTIONS.NEXT) {
      this.props.force_click();
    }
    // 3 to 4
    if (type==EVENTS.STEP_AFTER && index==3 && action==ACTIONS.NEXT) {
      this.props.force_click();
    }
    // 4 to 3
    else if (type==EVENTS.STEP_AFTER && index==4 && action==ACTIONS.PREV) {
      this.props.force_click();
    }
    // 3 to 2
    else if (type==EVENTS.STEP_AFTER && index==3 && action==ACTIONS.PREV) {
      this.props.force_click();
    }

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status) && this.state.run) {
      this.props.toggle_tour();
      this.setState({ run: false });
    } 
    //VERY IMPORTANT
    //To show across pages, you have to sent the run state to false. 
    // from step zero to step one
    else if (type==EVENTS.STEP_AFTER && index==0 && action==ACTIONS.NEXT) {
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
      console.log(data); 
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
      // Update state to advance the tour
      this.setState({ stepindex: index + (action === ACTIONS.PREV ? -1 : 1) });
    } 

    else if (type === EVENTS.TOOLTIP_CLOSE) {
      this.setState({ stepindex: index + 1 });
    }

  }
  render() {
    return (<React.Fragment>
      <ReactJoyride
        steps={this.state.steps}
        stepIndex={this.state.stepindex}
        run={this.state.run}
        callback={this.handleCallback.bind(this)}
        continuous={true}
        showProgress
        styles={{
            options: {
              zIndex: 1005,
            }
          }}

        showSkipButton />
    </React.Fragment>);
  };
}
let mstp = (state) => state;
let mdtp = dispatch => ({
  force_click: () => {dispatch(forceClickAction());},
  toggle_tour: () => {dispatch(toggleTourAction());},
})
export default connect(mstp,mdtp)(withRouter(OnboardingSteps));
