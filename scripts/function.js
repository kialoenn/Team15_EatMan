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
    var restaurantsRef = db.collection("restaurants");
    restaurantsRef.add({
        RESTAURANT_ID: "CAT1",
        RESTAURANT_NAME: "Catcus Club Cafe",
        RESTAURANT_ID: "7320 Market Crossing",
        RESTAURANT_PHONE: "(604)430-5000",
        RESTAURANT_PICTURE: "CAT1.jpg",
        RESTAURANT_TIME: "8:00AM TO 10:30PM",
    });
}
writeRestaurants();