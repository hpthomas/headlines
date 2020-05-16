const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors')({origin:true});
const Twitter = require('twitter');

const config = require('./twitter_secrets');

admin.initializeApp();

//methods for basic server-side filtering of tweets
let hours_ago = (created_at) => {
    return (Date.now() - new Date(created_at)) / 3600000.0; 
}

let newish = (tweet) => {
    return hours_ago(tweet.created_at)<=25;
}

exports.topNews = functions.https.onCall((data, context) => {
	// will be undefined for now	
	let handle = data.handle;
	let sources = {
		"ap" : "AP News"
	};
	let source_name = sources[handle] || handle.toUpperCase();


	if (!context.auth) {
		return(null);
	}
	var client = new Twitter(config);

    var params = {screen_name: handle, 'count': 150, 'tweet_mode':'extended'};

	return new Promise( (resolve,reject) => {
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
			if (!error) {
				tweets = tweets.filter(newish);
				tweets.forEach(t=>t.hours_ago = hours_ago(t.created_at));
				tweets.forEach(t=>{
					if (t.entities.urls.length>0) {
						let url = t.entities.urls[0];
						t.guess_url = url.expanded_url;
						t.guess_text = t.full_text.substr(0, url.indices[0]);
						t.source_name = source_name;
					}
				})
				resolve(tweets);
			}
			else {
				reject(error);
			}
		});
	});
});
