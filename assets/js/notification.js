var firebase;
var Notification = {
    config: function () {
        const firebaseConfig = {
            apiKey: "AIzaSyA7bO12wekdhrlDxHxKCkgfg-a2PvfIG3c",
            authDomain: "demofcm-c0caa.firebaseapp.com",
            databaseURL: "https://demofcm-c0caa-default-rtdb.firebaseio.com",
            projectId: "demofcm-c0caa",
            storageBucket: "demofcm-c0caa.appspot.com",
            messagingSenderId: "16196139174",
            appId: "1:16196139174:web:c852e2fbfcd905a2db5c67"
        };
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
         }else {
            firebase.app(); // if already initialized, use that one
         }
        // firebase.initializeApp(firebaseConfig);
    },
    send: function (userId, notify) {
        firebase.database().ref(`notification/${userId}`).push().set(notify);
    },
    show: function (userId, callback) {
        var db = firebase.database();
        db.ref(`notification/${userId}`).on("value", function (snapshot) {
            callback(snapshot)
        });
    },
    update: function (userId, idNotify, notify) {
        firebase.database().ref().child(`notification/${userId}/${idNotify}`).update(notify);
    },
    delete: function (userId, idNotify, notify) {
        firebase.database().ref().child(`notification/${userId}/${idNotify}`).remove();
    }
}