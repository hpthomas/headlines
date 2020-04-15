var admin = require("firebase-admin");
var serviceAccount = require("./googleCredentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bottomshelfnews.firebaseio.com"
});

function makeAdmin(uid) {
	admin.auth().setCustomUserClaims(uid, {admin: true}).then((res) => {
		console.log('done');
		console.log(res);
	});
}

exports.makeAdmin=makeAdmin;