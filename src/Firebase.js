import app from 'firebase/app';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';
import store from './store';
import loginAction from './actions/loginAction';
import uuid from 'uuid';

  var firebaseConfig = {
    apiKey: "AIzaSyD9hWSw27OO_qk9eRKm2TMJ_09JcdeZdm8",
    authDomain: "bottomshelfnews.firebaseapp.com",
    databaseURL: "https://bottomshelfnews.firebaseio.com",
    projectId: "bottomshelfnews",
    storageBucket: "",
    messagingSenderId: "924993359943",
    appId: "1:924993359943:web:99b6abdc71d38c4316e162",
    measurementId: "G-LRJS1QWZZR"
  };

let date = () => (new Date()).toJSON().slice(0,10);

// 'production' means demo on bottonshelfnews.github.io, frozen to Jan 8th
if (process.env.NODE_ENV === 'production') {
	date = () => "2020-01-08";
}
let yesterday = () => (new Date(new Date().setDate(new Date().getDate()-1))).getTime();

class Firebase {
	// onAuthStateChange is a funciton called whenever a successful login/out occurs
	constructor() {
		app.initializeApp(firebaseConfig);
		this.auth = app.auth();
		this.db = app.database();
		this.functions = app.functions();
		// handle user being already logged in
		this.unsub = this.auth.onAuthStateChanged(user=>{
			if (user) {
				user.getIdTokenResult().then(result=>{
					user.admin = !!result.claims.admin; // set user.admin property for easier access
					store.dispatch(loginAction(user));
				});
			}
			this.unsub(); //unsubscribe to auth change - only want this to run once 
		});
	}

	email() {
		return this.auth.currentUser ? this.auth.currentUser.email : null;
	}

	createUser = (email, pass, name) => {
		return this.auth.createUserWithEmailAndPassword(email,pass)
		.then(res=> res.user.updateProfile({displayName:name}));
	}

	login = (email, pass)=> {
		if (!email || !pass) {
			return this.auth.signInAnonymously()
			.then(res=>res.user)
			.then(user=>{
				user.admin=false;
				return user;
			});
		}
		let user = null;
		return this.auth.signInWithEmailAndPassword(email, pass)
		.then(res=>{
			user = res.user;
			return user.getIdTokenResult();
		})
		.then(token=>{
			user.admin = token.claims.admin;
			console.log(user);
			return user;
		});
	}

	logOut = ()=> {
		return this.auth.signOut();
	}

	resetPass = (email) => {
		return this.auth.sendPasswordResetEmail(email);
	}

	updatePass = (newPass) => {
	    return this.auth.currentUser.updatePassword(newPass);
	}

	//TODO get rid of old
	newArticle = (title,url,source) => {
		if (!this.auth.currentUser) return; //should not happen
		let posts = this.db.ref("stories");
		let newPost = posts.push();
		let ts = firebase.database.ServerValue.TIMESTAMP;
		return newPost.set( {
			title:title,
			url:url,
			source:source,
			timestamp: ts
		});
	}

	newHeadline = (storyID,headline) => {
		if (!this.auth.currentUser) return; //should not happen
		// TODO  This was originally storysubmissions/storyID/newkey
		// Moved to submissions to guarantee uniqueness - needed??
		let post = this.db.ref("submissions/");
		let newHeadlineKey = post.push().key;
		let uid = this.auth.currentUser.uid;
		let name = this.auth.currentUser.displayName;
		let updates = {};
		let ts = firebase.database.ServerValue.TIMESTAMP;

		// Logging user's vote in 2 places: /submissions and /users 

		updates['/storysubmissions/' + storyID + '/' + newHeadlineKey] =
			{headline:headline, user:uid, username:name, votes: {[uid]:true}, key:newHeadlineKey, timestamp:ts};

			
		updates['/users/' + uid + '/stories/' + storyID + '/submissions/' + newHeadlineKey ] = true;

		updates['/submissions/' + newHeadlineKey] = 
			{headline:headline, user:uid, username:name, key:newHeadlineKey, story:storyID, timestamp:ts};

		this.db.ref().update(updates);
		return newHeadlineKey;
	}

	// v can be true, false or null
	vote = (storyID, headlineID, v) => {
		if (!this.auth.currentUser) return; //should not happen
		//console.log(this.auth.currentUser, postID, headlineID);
		let post = this.db.ref("storysubmissions/" + storyID + "/" + headlineID + "/votes");
		let uid = this.auth.currentUser.uid;
		post.update({[uid]:v});
	}

	getTopPosts = () => {
		/* TODO: Filter to most recent 10ish? */
		let stories = this.db.ref('stories')
		.orderByChild('timestamp')
		.once('value');
		return stories;
	}

	getTodayPosts = () => {
		let cutoff = yesterday();
		let stories = this.db.ref('stories')
		.orderByChild('timestamp')
		.startAt(cutoff)
		.once('value');
		return stories;
	}

	//TODO IMPORTANT: When updated to use num, no num arg = all subs
	getSubmissionsForPost(storyID, num) {
		return this.db.ref('storysubmissions/' + storyID).once('value');
	}

	getSubmissionsByUser = (uid) => {
		// Get a list of {postID:subID} for all user submissions
		return this.db.ref('users/' + uid).orderByChild('timestamp').once('value');
	}

	getSubmissionByID = (subID) => {
		// Get a list of {postID:subID} for all user submissions
		return this.db.ref('/submissions/' + subID).once('value');
	}

	// storyAndSubID looks like "storyID/subID"
	getStorySubmissionByID = (storyAndSubID) => {
		return this.db.ref('/storysubmissions/' + storyAndSubID).once('value');
	}

	getStoryByID = (postID) => {
		// Get a list of {postID:subID} for all user submissions
		return this.db.ref('/stories/' + postID).once('value');
	}

	// TODO num is not implemented on server, fetches 50(?) by default
	getRecentTweets = (handle, num) => {
		let params = {handle:handle};
		return this.functions.httpsCallable('topNews')(params);
	}

	// this deletes a story including all associated headline submissions
	deleteStory = (storyID) => {
		let updates = {};
		updates['stories/' + storyID] = null;
		updates['storysubmissions/' + storyID] = null;
		console.log(updates);
		return this.getSubmissionsForPost(storyID)
		.then(res=>res.val())
		.then(headlines => {
			for (var hl in headlines){
				let user = headlines[hl].user;
				updates['submissions/' + hl] = null;
				updates['users/' + user + '/stories/' + storyID] = null;	
			}
			console.log(updates);
			return this.db.ref().update(updates);
		});
	}

	deleteSubmission(storyID, submissionID, userID) {
		let updates = {};
		updates['storysubmissions/' + storyID + '/' + submissionID] = null;
		updates['submissions/' + submissionID] = null;
		updates['users/' + userID + '/stories/' + storyID+'/submissions/' + submissionID] = null;
		return this.db.ref().update(updates);
	}

	// this deletes everything added to the database today
	clearToday = () => {
		return this.getTopPosts()
		.then(res=>res.val())
		.then(res=>{
			console.log(res);return res;
		})
		.then(posts=>Object.keys(posts || {}))
		.then(postIDs=>  Promise.all(postIDs.map(this.deleteStory)));
	}
}

export default Firebase;