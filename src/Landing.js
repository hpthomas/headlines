import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import loginAction from './actions/loginAction'
import NewspaperItem from './NewspaperItem'


class Landing extends React.Component {
	constructor(props){
		super(props);
		this.state = {expand:true}
	}
	guestLogin() {
		this.props.firebase.login(null,null).then(user=>{
			this.props.setLogin(user);
			this.props.history.push("/newspaper");	
		});
	}
	toggle() {
		this.setState({expand:!this.state.expand})
	}
	render() {
		return (
	<div className='landing'>
		<h1> Bottom Shelf News </h1>
		<h2> A comedy newspaper where the users write the headlines.</h2>
		<div className='dummy_newspaper'>
				<NewspaperItem num={0} post={dummy_1} />	
				<NewspaperItem num={1} post={dummy_2} />	
				<NewspaperItem num={2} post={dummy_4} />	
		</div>
		<div className='buttons'>
			<Link to='/newspaper' className='buttonLink'>
				<button className='landing_button' type='button'>
					See the paper
				</button>
			</Link>
			<button className='landing_button' type='button' onClick={this.toggle.bind(this)}>
				Learn More {this.state.expand?"▼":"►"}
			</button>
		</div>
		{this.state.expand && 
		<div className='faq'>

			<h3 className='faq-q'>
				How does it work?
			</h3>
			<p className='faq-a'>
				We take a news story with a regular, not-funny headline:
			</p>
			<div className='dummy_newspaper'>
				<NewspaperItem post={dummy_3} />	
			</div>				
			<p className='faq-a'>
				...and our users think of a funnier way to say the same thing:
			</p>
			<div className='dummy_newspaper'>
				<NewspaperItem post={dummy_1} />	
			</div>				
			<p className='faq-a'>
				That's it! You can vote on your favorite headlines or submit your own.
			</p>

			<h3 className='faq-q'>
				So there are no actual stories, it's just the headlines?
			</h3>
			<p className='faq-a'>
				Correct.
			</p>

			<h3 className='faq-q'>
				Do I need an account?
			</h3>
			<p className='faq-a'>
				Nope, but it's helpful! You can make an anonymous Guest Account instantly and start to vote and submit right now:
			</p>
			<button onClick={this.guestLogin.bind(this)}>Log In Anonymously</button>

			<p></p>
		</div>}

</div> );

	}
}
let dummy_1 = {
	"source":"CBS News",
	"timestamp":1589475333790,
	"title":"Wisconsin bars packed with patrons almost immediately after court strikes down stay-at-home order",
	"url":"https://www.cbsnews.com/news/wisconsin-bars-opened-packed-supreme-court-stay-at-home-strikes-down/",
	"postID":"-M7J6CP0WwFhL4HqBL5y","headlines":[{"headline":"Wisconsinites exercise constitutional right to alcoholism",
	"key":"-M7J8h7_597oh6URo9T4","timestamp":1589475988052,
	"user":"eN7piCRiXON5xRt7SCVHGqAngBP2",
	"username":"hugh",
	"votes":{"Dt0zmo7rdKTYQteiMmJ46KgI7vB2":true,"eN7piCRiXON5xRt7SCVHGqAngBP2":true,"fRx1U5clgEddY9fscGwjzYEzgmf1":true},
	"score":3}]};

let dummy_2={ "source": "ABC", "timestamp": 1589403851444, "title": "Four-legged robot patrols Singapore park to promote social distancing during the coronavirus outbreak. ", "url": "https://abcn.ws/2WuQfyt", "postID": "-M7EqWe5DgD2Y3dazszO", "headlines": [ { "headline": "Singapore to automate loneliness!", "key": "-M7TaKxfy7E9dRUwDtA-", "timestamp": 1589651267468, "user": "eN7piCRiXON5xRt7SCVHGqAngBP2", "username": "hugh", "votes": { "eN7piCRiXON5xRt7SCVHGqAngBP2": true }, "score": 1 } ] }
let dummy_3 = {
	"source":"CBS News",
	"timestamp":1589475333790,
	"title":"Wisconsin bars packed with patrons almost immediately after court strikes down stay-at-home order",
	"url":"https://www.cbsnews.com/news/wisconsin-bars-opened-packed-supreme-court-stay-at-home-strikes-down/",
	"postID":"-M7J6CP0WwFhL4HqBL5y",
	"headlines":[]};
let dummy_4 = {
  "source": "ABC",
  "timestamp": 1589662321739,
  "title": "Therapy dog to receive an honorary degree from Virginia Tech. ",
  "url": "https://abcn.ws/2TaNgJo",
  "postID": "-M7UFVkdkRhpIMq-5EMV",
  "headlines": [
    {
      "headline": "You don't need student loans to become a therapist - just be a dog!",
      "key": "-M7UFmHwID3enTjBn69G",
      "timestamp": 1589662393578,
      "user": "eN7piCRiXON5xRt7SCVHGqAngBP2",
      "username": "hugh",
      "votes": {
        "C53ykWdF7vQMwh3d3N1JwFzOVBg2": true,
        "LyRx7aPivSYx7m7c9QeIxXZ4HCw2": true,
        "b5A1zyXxIfWZD3GUQcmb1yJlYzD3": true,
        "eN7piCRiXON5xRt7SCVHGqAngBP2": true
      },
      "score": 4
    }
  ]
};
let mstp = (state) => ({firebase:state.firebase});
let mdtp = (dispatch) => (  {setLogin : (user) => dispatch(loginAction(user)) }  );
export default connect(mstp,mdtp)(Landing);