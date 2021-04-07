/** Write database functions, only need to call one time */
function writeRestaurants() {
    var restaurantsRef = db.collection("restaurants");
    restaurantsRef.add({
        name: "JapaDog",
        geometry: {
            lat: 49.2802458,
            lng: -123.1183486
        },
        phone: "(604)430-5000",
        address: "530 Robson St, Vancouver, BC V6B 2B7",
        time: "8:00AM TO 10:30PM",
        queue: 15,
    });
    restaurantsRef.add({
        name: "NoodleBox",
        geometry: {
            lat: 49.279134,
            lng: -123.11768
        },
        phone: "(604)430-5000",
        address: "839 Homer St, Vancouver, BC V6B 2W2",
        time: "8:00AM TO 10:30PM",
        queue: 10,
    });
    restaurantsRef.add({
        name: "JapaDog",
        geometry: {
            lat: 49.2802458,
            lng: -123.1183486
        },
        phone: "(604)430-5000",
        address: "530 Robson St, Vancouver, BC V6B 2B7",
        time: "8:00AM TO 10:30PM",
        queue: 15,
    });
    estaurantsRef.add({
        name: "JapaDog",
        geometry: {
            lat: 49.2802458,
            lng: -123.1183486
        },
        phone: "(604)430-5000",
        address: "530 Robson St, Vancouver, BC V6B 2B7",
        time: "8:00AM TO 10:30PM",
        queue: 15,
    });
    estaurantsRef.add({
        name: "JapaDog",
        geometry: {
            lat: 49.2802458,
            lng: -123.1183486
        },
        phone: "(604)430-5000",
        address: "530 Robson St, Vancouver, BC V6B 2B7",
        time: "8:00AM TO 10:30PM",
        queue: 15,
    });
}
function pastQueues() {
    var restaurantsRef = db.collection("history");
    restaurantsRef.add({
        Restaurant_Name: "Milestone",
        Date: "2021-02-27",
    })
}

function writeProfile() {
    var profileRef = db.collection("PROFILE");
    profileRef.add({
        USERNAME: "donalllllld",
        NAME: "Donald Trump",
        PHONE: "(604)430-5000",
        PROFILE_IMG: "donald.jpg",
    });
}

/** User interact functions */
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

/**
 * Google map initialize
 */
function initMap() {
    // Create the map.
    let place = {
        lat: 49.2810718309468,
        lng: -123.11683978616684
    };
    const map = new google.maps.Map(document.getElementById("map"), {
        center: place,
        zoom: 16,
        mapId: "8d193001f940fde3",
    });

    function displayRestautant() {
        db.collection("restaurants")
            .get()
            .then(function (snapcollection) {
                snapcollection.forEach(function (doc) {
                    console.log(doc.data().geometry);
                    const loc = doc.data().geometry;
                    new google.maps.Marker({
                        position: loc,
                        map: map,
                    });
                })
            })
    }
    displayRestautant();
};