import app from 'firebase/app';
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
let yesterday = () => 
	(new Date(new Date().setDate(new Date().getDate()-1))).toJSON().slice(0,10);

class Firebase {
	// onAuthStateChange is a funciton called whenever a successful login/out occurs
	constructor() {
		console.log('hi from fb');
		console.log(process.env.NODE_ENV);
		app.initializeApp(firebaseConfig);
		this.auth = app.auth();
		this.db = app.database();
		this.functions = app.functions();
		this.unsub = this.auth.onAuthStateChanged(user=>{
			if (user) {
				store.dispatch(loginAction(user));
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
			return this.auth.signInAnonymously();
		}
		return this.auth.signInWithEmailAndPassword(email, pass);
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
	newArticle = (title,url,category, old) => {
		if (!this.auth.currentUser) return; //should not happen
		let posts = this.db.ref("stories");
		let newPost = posts.push();
		// TODO add timestamp maybe? encoded in fb auto-generated key but cryptic
		let d = old ? yesterday() : date();
		return newPost.set( {
			title:title,
			url:url,
			category:category,
			date: d
		});
	}

	newHeadline = (storyID,headline) => {
		console.log(storyID, headline);
		if (!this.auth.currentUser) return; //should not happen
		// TODO  This was originally storysubmissions/storyID/newkey
		// Moved to submissions to guarantee uniqueness - needed??
		let post = this.db.ref("submissions/");
		let newHeadlineKey = post.push().key;
		console.log("push done");
		console.log(newHeadlineKey);
		let uid = this.auth.currentUser.uid;
		let name = this.auth.currentUser.displayName;
		let updates = {};

		// Logging user's vote in 2 places: /submissions and /users 

		updates['/storysubmissions/' + storyID + '/' + newHeadlineKey] =
			{headline:headline, user:uid, username:name, votes: {[uid]:true}, key:newHeadlineKey};

		updates['/storysubmissions/' + storyID + '/' + newHeadlineKey] =
			{headline:headline, user:uid, username:name, votes: {[uid]:true}, key:newHeadlineKey};
			
		updates['/users/' + uid + '/stories/' + storyID + '/submissions/' + newHeadlineKey ] = true;

		updates['/submissions/' + newHeadlineKey] = 
			{headline:headline, user:uid, username:name, key:newHeadlineKey, story:storyID};

		console.log(updates);
		this.db.ref().update(updates);
		return newHeadlineKey;
	}

	fakeVotes = (postID, headlineID, count) => {
		let post = this.db.ref("items/" + postID + "/submissions/" + headlineID + "/votes");
		let updates = {};
		for (var i=0;i<count;i++) {
			var fakeUID = uuid.v4().substr(0,10);
			var up = Math.random() >= 0.3;
			updates[fakeUID] = up;
		}
		console.log(updates);
		post.update(updates);
	}

	// v can be true, false or null
	vote = (storyID, headlineID, v) => {
		console.log(storyID, headlineID, v);
		if (!this.auth.currentUser) return; //should not happen
		//console.log(this.auth.currentUser, postID, headlineID);
		let post = this.db.ref("storysubmissions/" + storyID + "/" + headlineID + "/votes");
		let uid = this.auth.currentUser.uid;
		post.update({[uid]:v});
	}

	getTopPosts = () => {
		/* TODO: Filter to most recent 10ish? */
		let stories = this.db.ref('stories')
		.orderByChild('date')
		.equalTo(date())
		.once('value');
		return stories;
	}

	//TODO IMPORTANT: When you update this to use num, no num arg = all subs
	getSubmissionsForPost(postID, num) {
		return this.db.ref('storysubmissions/' + postID).once('value');
	}

	getSubmissionsByUser = (uid) => {
		// Get a list of {postID:subID} for all user submissions
		return this.db.ref('users/' + uid).once('value');
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

	clearToday = () => {
		let story_keys = null;

		return this.getTopPosts()
		.then(res=>res.val())
		.then(children=>{
			story_keys = Object.keys(children);
			let submissions = story_keys.map(k => this.getSubmissionsForPost(k));
			return Promise.all(submissions)
		})
		.then(res => res.map(r=>r.val()))
		.then(submissions => {
			let updates = {};
			for (var i = 0; i < submissions.length; i++) {
				let story_key = story_keys[i];
				let submission = submissions[i];
				updates['stories/' + story_key] = null;
				for (var submission_key in submission) {
					let uid = submission[submission_key].user;
					updates['users/' + uid + '/stories/' + story_key] = null;
					updates['submissions/' + submission_key] = null;
				}
			}
			console.log(updates);
			return this.db.ref().update(updates)
		})	
		.catch(e=>{
			console.log(e);
		})
	}
}

export default Firebase;