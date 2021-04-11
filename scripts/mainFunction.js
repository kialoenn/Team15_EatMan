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

    function mapDisplayRestautant() {
        db.collection("restaurants")
            .get()
            .then(function (snapcollection) {
                snapcollection.forEach(function (doc) {
                    const loc = doc.data().geometry;
                    new google.maps.Marker({
                        position: loc,
                        map: map,
                    });
                })
            })
    }
    mapDisplayRestautant();
};

function displayRestautant() {
    db.collection("restaurants")
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var name = doc.data().name;
                var queue = doc.data().queue.length * 5;
                var address = doc.data().address;
                var phone = doc.data().phone;
                $("#restaurantsList").append("<div id='" + doc.id + "'>" + "<p>" + name + "</p>" + "<p>Estimated time: " + queue + "minutes</p>" +
                    "<button id='button" + doc.id + "'> Queue Up</button>" + "<div class = 'hide' id = 'detail" + doc.id + "'><p>Address: " + address + "</p>" + "<p>phone: " + phone + "</p></div></div>");
                addRestaurantListener(doc.id);
                getUserQueueReady(doc.id);
            })
        })
}

displayRestautant();



function addRestaurantListener(id) {
    var detailId = "detail" + id;
    var detail = document.getElementById(detailId);
    var restaurant = document.getElementById(id);
    restaurant.addEventListener("click", function () {
        console.log("clicked");
        console.log(detailId);
        detail.classList.toggle('active');
    })
}

function getUserQueueReady(id) {
    
    var userName;
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("users")
                .doc(user.uid)
                .get()
                .then(function (doc) {
                    userName = doc.data().name;
                    userId = user.uid;
                    addQueueListener(userName, id, userId);
                    //addReadyListener(userId);
                })
        }
    })
    
}

function addQueueListener(userName, id, userId) {
    var buttonId = "button" + id;
    var button = document.getElementById(buttonId);
    button.addEventListener("click", function () {
        var r = confirm("It's about time to get in the restaurant!");
        if (r == true) {
            db.collection("restaurants")
            .doc(id)
            .update({

                queue: firebase.firestore.FieldValue.arrayUnion({name : userName, id: userId}),
            }).then(function () {
                restaurantId = id;
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        db.collection("users")
                        .doc(user.uid)
                        .update({
                            currentQueue : restaurantId
                        })
                    }
                })
            })
        }
        

    })
}

// function addReadyListener(userId) {
//     db.collection("users")
//     .doc(userId)
//     .get()
//     .then(function(doc) {
//         var queueId = doc.data().currentQueue;
//         console.log(queueId);
//         db.collection("restaurants")
//         .doc(queueId)
//         .get()
//         .then(function(doc) {
//             console.log(doc.data().queue[0]);
//             if (doc.data().queue[0].id == userId) {
//                 console.log("time");
//                 prompt("time to eat!");
//             }
//         })
//     })

// }

function checkReady() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("users")
                .doc(user.uid)
                .get()
                .then(function(doc) {
                    var queueId = doc.data().currentQueue;
                    if (queueId != "") {
                        console.log(queueId);
                        db.collection("restaurants")
                        .doc(queueId)
                        .onSnapshot(function(doc) {
                            console.log(doc.data().queue[0]);
                            if (doc.data().queue[0].id == userId) {
                                console.log("time");
                                prompt("time to eat!");
                            }
                        })
                        // .get()
                        // .then(function(doc) {
                        //     console.log(doc.data().queue[0]);
                        //     if (doc.data().queue[0].id == userId) {
                        //         console.log("time");
                        //         prompt("time to eat!");
                        //     }
                        // })
                    }
                    
                })
        }
    })
}

checkReady();