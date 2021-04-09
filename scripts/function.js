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
        queue: ['in-house', 'in-house', 'in-house', 'in-house', 'in-house', 'in-house'],
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
        queue: ['in-house', 'in-house', 'in-house', 'in-house', 'in-house', 'in-house'],
    });
    restaurantsRef.add({
        name: "Gotham Steakhouse & Cocktail Bar",
        geometry: {
            lat: 49.283054656776784,
            lng: -123.11594818363048
        },
        phone: "(604)605-8282",
        address: "615 Seymour St, Vancouver, BC V6B 3K3",
        time: "8:00AM TO 11:30PM",
        queue: ['in-house', 'in-house', 'in-house', 'in-house', 'in-house', 'in-house'],
    });
    restaurantsRef.add({
        name: "Bacchus Restaurant & Lounge",
        geometry: {
            lat: 49.28238334581804,
            lng:  -123.12260272731261
        },
        phone: "(604)608-5319",
        address: "845 Hornby St, Vancouver, BC V6Z 1V1",
        time: "8:00AM TO 10:30PM",
        queue: ['in-house', 'in-house', 'in-house', 'in-house', 'in-house', 'in-house'],
    });
    restaurantsRef.add({
        name: "Earls Kitchen + Bar",
        geometry: {
            lat: 49.281720192945016, 
            lng: -123.12371034640614
        },
        phone: "(604)682-6700",
        address: "905 Hornby St, Vancouver, BC V6Z 1V3",
        time: "8:00AM TO 10:30PM",
        queue: ['in-house', 'in-house', 'in-house', 'in-house', 'in-house', 'in-house'],
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
            db.collection("users")
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
                var newdom = "<p> " + name + " " + date + "</p>";
                $("#history-goes-here").append(newdom);
            })
        })
}
viewHistory();