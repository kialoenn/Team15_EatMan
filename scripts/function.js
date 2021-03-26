<<<<<<< HEAD
var firebaseConfig = {
    apiKey: "AIzaSyAsS-NgdLNtD_wy0UGftvZ5O4dDeWn4cC8",
    authDomain: "man-s-eat.firebaseapp.com",
    projectId: "man-s-eat",
    storageBucket: "man-s-eat.appspot.com",
    messagingSenderId: "784972971331",
    appId: "1:784972971331:web:29d991281ede35e2e0c3f6",
    measurementId: "G-EE7LR9RRVM"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            //------------------------------------------------------------------------------------------
            // The code below is modified from default snippet provided by the FB documentation.
            //
            // If the user is a "brand new" user, then create a new "user" in your own database.
            // Assign this user with the name and email provided.
            // Before this works, you must enable "Firestore" from the firebase console.
            // The Firestore rules must allow the user to write.
            //------------------------------------------------------------------------------------------
            var user = authResult.user;
            if (authResult.additionalUserInfo.isNewUser) {         //if new user
                db.collection("users").doc(user.uid).set({         //write to firestore
                    name: user.displayName,                    //"users" collection
                    email: user.email                          //with authenticated user's ID (user.uid)
                }).then(function () {
                    console.log("New user added to firestore");
                    window.location.assign("main.html");       //re-direct to main.html after signup
                })
                    .catch(function (error) {
                        console.log("Error adding new user: " + error);
                    });
            } else {
                return true;
            }
            return false;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'main.html',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        //firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        //firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        //firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
};
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

function inputUser() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here. 
            console.log(user.uid);
            db.collection("users").doc(user.uid)
                .get()
                .then(function (doc) {
                    var n = doc.data().name;
                    console.log(n);
										//using jquery
                    $("#userName").text(n);
										//using vanilla javascript
                    //document.getElementById("username").innerText = n;
                })
        } else {
            // No user is signed in.
        }
    });
}
inputUser();
=======
function sayHello() {
    firebase.auth().onAuthStateChanged(function (hello) {
        if (hello) {
            console.log(hello.uid);
            db.collection("ACCOUNT")
                .doc(hello.uid)
                .get()
                .then(function (doc) {
                    console.log(doc.data().name);
                    var name = doc.data().name;
                    $("#username").text(name);
                })
        }
    })
}
sayHello();

function writeRestaurants() {
    var restaurantsRef = db.collection("RESTAURANT");
    restaurantsRef.add({
        RESTAURANT_ID: "CAT1",
        RESTAURANT_NAME: "Catcus Club Cafe",
        RESTAURANT_ID: "7320 Market Crossing",
        RESTAURANT_PHONE: "(604)430-5000",
        RESTAURANT_PICTURE: "CAT1.jpg",
        RESTAURANT_TIME: "8:00AM TO 10:30PM",
    });
    restaurantsRef.add({
        RESTAURANT_ID: "CAT2",
        RESTAURANT_NAME: "Catcus Club Cafe",
        RESTAURANT_ID: "6090 Silver Dr",
        RESTAURANT_PHONE: "(604)291-9339",
        RESTAURANT_PICTURE: "CAT2.jpg",
        RESTAURANT_TIME: "8:00AM TO 10:30PM",
    });
    restaurantsRef.add({
        RESTAURANT_ID: "CAT3",
        RESTAURANT_NAME: "Catcus Club Cafe",
        RESTAURANT_ID: "4219 B Lougheed Hwy",
        RESTAURANT_PHONE: "(604)291-6606",
        RESTAURANT_PICTURE: "CAT3.jpg",
        RESTAURANT_TIME: "8:00AM TO 10:30PM",
    });
    restaurantsRef.add({
        RESTAURANT_ID: "CAFE106",
        RESTAURANT_NAME: "Cafe 106",
        RESTAURANT_ID: "6588 Royal Oak Ave Unit 106",
        RESTAURANT_PHONE: "(604)438-1220",
        RESTAURANT_PICTURE: "CAFE106.jpg",
        RESTAURANT_TIME: "11:00AM TO 11:30PM",
    });
}
//writeRestaurants();
>>>>>>> c9b75fdd9f61049cdc913b1b6f0291aef8e2d044
