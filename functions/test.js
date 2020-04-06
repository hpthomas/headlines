const functions = require('firebase-functions');
const firebase = require('firebase');
let f = firebase.functions();
f.useFunctionsEmulator('http://localhost:5001'); // Or whatever the port is for your local emulator
