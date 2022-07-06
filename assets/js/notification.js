var firebase;
var Notification = {
  config: function () {
    const firebaseConfig = {
      //   apiKey: "AIzaSyA7bO12wekdhrlDxHxKCkgfg-a2PvfIG3c",
      //   authDomain: "demofcm-c0caa.firebaseapp.com",
      //   databaseURL: "https://demofcm-c0caa-default-rtdb.firebaseio.com",
      //   projectId: "demofcm-c0caa",
      //   storageBucket: "demofcm-c0caa.appspot.com",
      //   messagingSenderId: "16196139174",
      //   appId: "1:16196139174:web:c852e2fbfcd905a2db5c67",
      apiKey: "AIzaSyBUO9xOl0ZFw6XbH72d4iTTICCXZzPpvJo",
      authDomain: "hanoifoodbank.firebaseapp.com",
      databaseURL:
        "https://hanoifoodbank-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "hanoifoodbank",
      storageBucket: "hanoifoodbank.appspot.com",
      messagingSenderId: "306648236869",
      appId: "1:306648236869:web:40435617729e66b21df42c",
      measurementId: "G-RJMVSXMYET",
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    } else {
      firebase.app(); // if already initialized, use that one
    }
  },
  send: function (userId, notify) {
    firebase.database().ref(`notification/${userId}`).push().set(notify);
  },
  show: function (userId, callback) {
    var db = firebase.database();
    db.ref(`notification/${userId}`).on("value", function (snapshot) {
      callback(snapshot);
    });
  },
  update: function (userId, notifyID, notify) {
    firebase
      .database()
      .ref()
      .child(`notification/${userId}/${notifyID}`)
      .update(notify);
  },
  delete: function (userId, notifyID) {
    firebase
      .database()
      .ref()
      .child(`notification/${userId}/${notifyID}`)
      .remove();
  },
};
