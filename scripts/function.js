/**
 * Author: Man Sun
 */


/** 
 * Write database functions, please do not call this function, this will overwrite the existing DB
 * */
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
        cancle: [],
        confirm: [],
        cuisine: ["Asian", "Japanese"],
        hole: [],
        hours: {end: 20, start: 8},
        icon: "japadog.jpg",
        price: 1,
        queue: [],
        queueCount: 0,
        rating: 4.5,
    });
    restaurantsRef.add({
        name: "NoodleBox",
        geometry: {
            lat: 49.279134,
            lng: -123.11768
        },
        phone: "(604)430-5000",
        address: "839 Homer St, Vancouver, BC V6B 2W2",
        cancle: [],
        confirm: [],
        cuisine: ["Asian", "Chinese"],
        hole: [],
        hours: {end: 20, start: 8},
        icon: "noodlebox.jpg",
        price: 2,
        queue: [],
        queueCount: 0,
        rating: 3.5,
    });
    restaurantsRef.add({
        name: "Gotham Steakhouse & Cocktail Bar",
        geometry: {
            lat: 49.283054656776784,
            lng: -123.11594818363048
        },
        phone: "(604)605-8282",
        address: "615 Seymour St, Vancouver, BC V6B 3K3",
        cancle: [],
        confirm: [],
        cuisine: ["Steak"],
        hole: [],
        hours: {end: 21, start: 11},
        icon: "japadog.jpg",
        price: 4,
        queue: [],
        queueCount: 0,
        rating: 4.5,
    });
    restaurantsRef.add({
        name: "Bacchus Restaurant & Lounge",
        geometry: {
            lat: 49.28238334581804,
            lng:  -123.12260272731261
        },
        phone: "(604)608-5319",
        address: "845 Hornby St, Vancouver, BC V6Z 1V1",
        cancle: [],
        confirm: [],
        cuisine: ["French"],
        hole: [],
        hours: {end: 22, start: 11},
        icon: "bacchus.jpg",
        price: 3,
        queue: [],
        queueCount: 0,
        rating: 4.3,
    });
    restaurantsRef.add({
        name: "Earls Kitchen + Bar",
        geometry: {
            lat: 49.281720192945016, 
            lng: -123.12371034640614
        },
        phone: "(604)682-6700",
        address: "905 Hornby St, Vancouver, BC V6Z 1V3",
        cancle: [],
        confirm: [],
        cuisine: ["Asian", "Japanese"],
        hole: [],
        hours: {end: 21, start: 12},
        icon: "japadog.jpg",
        price: 1,
        queue: [],
        queueCount: 0,
        rating: 4.5,
    });
}

/** User interact functions */
function sayHello() {
    firebase.auth().onAuthStateChanged(function (hello) {
        if (hello) {
            db.collection("users")
                .doc(hello.uid)
                .get()
                .then(function (doc) {
                    var name = doc.data().name;
                    $("#username").text(name);
                })
        }
    })
}
sayHello();
