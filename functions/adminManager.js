const admin = require("firebase-admin");
admin.initializeApp();
function makeAdmin(uid) {
	admin.auth().setCustomUserClaims(uid, {admin: true}).then((res) => {
		console.log('done');
		console.log(res);
	});
}

module.exports=makeAdmin;