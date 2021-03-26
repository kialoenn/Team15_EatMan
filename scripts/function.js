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

function pastQueues() {
    var restaurantsRef = db.collection("history");
    restaurantsRef.add({
        Restaurant_Name: "Milestone",
        Date: "2021-02-27",
    })
}

function viewHistory() {
    db.collection("history")
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var name = doc.data().Restaurant_Name;
                var date = doc.data().Date;
                console.log(n);
                var newdom = "<p> " + name + " " + date + "</p>";
                    $("#history-goes-here").append(newdom);
            })
        })
}
viewHistory();
