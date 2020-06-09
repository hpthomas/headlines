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
// 'production' means demo on bottonshelfnews.github.io, database filled with demo data
if (process.env.NODE_ENV === 'production') {
	firebaseConfig.databaseURL = "https://bottomshelfnews-demodata.firebaseio.com";
}
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

	saveArticle(storyID, text) {
		let updates = {};
		updates['frozen/' + storyID + '/article_text'] = text;
		updates['frozen/' + storyID + '/article_saved'] = true;
		return this.db.ref().update(updates);
	}

	editArticle(storyID, text) {
		let updates = {};
		updates['frozen/' + storyID + '/article_text'] = text;
		updates['frozen/' + storyID + '/article_saved'] = null;
		return this.db.ref().update(updates);
	}
	
	freezeStory(storyID) {
		let story = this.db.ref('stories/' + storyID);
		return story.once('value')
		.then(res=>res.val())
		.then(story_data=>{
			if (!story_data) {
				return;
			}
			story_data['frozen'] = true;
			let updates = {};
			updates['/stories/' + storyID] = null;
			updates['/frozen/' + storyID] = story_data;
			let headlines = story_data.headlines || {};
			for (var key in headlines) {
				let uid = headlines[key].user;
				updates['/users/' + uid + '/stories/' + storyID + '/status'] = 'frozen';
			}
			return this.db.ref().update(updates);
		})
	}
	unFreezeStory(storyID) {
		console.log('unfreeze');
		console.log(storyID);
		let frozen_story = this.db.ref('frozen/' + storyID);
		return frozen_story.once('value')
		.then(res=>res.val())
		.then(story_data=>{
			if (!story_data) {
				return;
			}
			story_data['frozen'] = null;
			let updates = {};
			updates['/frozen/' + storyID] = null;
			updates['/stories/' + storyID] = story_data;
			let headlines = story_data.headlines || {};
			for (var key in headlines) {
				let uid = headlines[key].user;
				updates['/users/' + uid + '/stories/' + storyID + '/status'] = 'active';
			}
			return this.db.ref().update(updates);
		})
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
		let post = this.db.ref("stories/" + storyID + '/headlines');
		let newHeadlineKey = post.push().key;
		let uid = this.auth.currentUser.uid;
		let name = this.auth.currentUser.displayName;
		let updates = {};
		let ts = firebase.database.ServerValue.TIMESTAMP;

		// Logging user's vote in 2 places: /submissions and /users 

		updates['/stories/' + storyID + '/headlines/' + newHeadlineKey] =
			{headline:headline, user:uid, username:name, votes: {[uid]:true}, key:newHeadlineKey, timestamp:ts};

			
		updates['/users/' + uid + '/stories/' + storyID + '/submissions/' + newHeadlineKey ] = true;
		updates['/users/' + uid + '/stories/' + storyID + '/status'] = 'active';
		console.log(updates);
		this.db.ref().update(updates);
		return newHeadlineKey;
	}

	// v can be true, false or null
	vote = (storyID, headlineID, v) => {
		if (!this.auth.currentUser) return; //should not happen
		//console.log(this.auth.currentUser, postID, headlineID);
		let post = this.db.ref("/stories/" + storyID + "/headlines/" + headlineID + "/votes");
		let uid = this.auth.currentUser.uid;
		post.update({[uid]:v});
	}

	getFrozenStories = () => {
		/* TODO: Filter to most recent 10ish? */
		let stories = this.db.ref('frozen')
		.orderByChild('timestamp')
		.once('value');
		return stories;
	}

	getFrozenStoryByID = (postID) => {
		// Get a list of {postID:subID} for all user submissions
		return this.db.ref('/frozen/' + postID).once('value');
	}

	getTopPosts = () => {
		/* TODO: Filter to most recent 10ish? */
		let stories = this.db.ref('stories')
		.orderByChild('timestamp')
		.once('value');
		return stories;
	}

	//TODO IMPORTANT: When updated to use num, no num arg = all subs
	getSubmissionsForPost(storyID, num) {
		return this.db.ref('stories/' + storyID + '/headlines/').once('value');
	}

	getSubmissionsByUser = (uid) => {
		// Get a list of {postID:subID} for all user submissions
		return this.db.ref('users/' + uid).orderByChild('timestamp').once('value');
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
		console.log(updates);
		return this.getSubmissionsForPost(storyID)
		.then(res=>res.val())
		.then(headlines => {
			for (var hl in headlines){
				let user = headlines[hl].user;
				updates['users/' + user + '/stories/' + storyID] = null;	
			}
			console.log(updates);
			return this.db.ref().update(updates);
		});
	}

	deleteSubmission(storyID, submissionID, userID) {
		let updates = {};
		updates['users/' + userID + '/stories/' + storyID+'/submissions/' + submissionID] = null;
		updates['stories/' + storyID + '/headlines/' + submissionID] = null;
		console.log(updates);
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