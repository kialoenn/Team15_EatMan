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
    infoWindow = new google.maps.InfoWindow();
    const locationButton = document.createElement("button");
    locationButton.textContent = "Current Location";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    showDistance(pos);
                    //   infoWindow.setPosition(pos);
                    //   infoWindow.setContent("Location found.");
                    //   infoWindow.open(map);
                    var userPos = {
                        url: "./images/radar.png",
                        scaledSize: new google.maps.Size(50, 50),
                    }
                    map.setCenter(pos);
                    new google.maps.Marker({
                        position: pos,
                        map: map,
                        icon: userPos
                    });
                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                }
            );
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });

    var greenIcon = {
        url: "./images/greenIcon.png",
        scaledSize: new google.maps.Size(30, 50),
    }

    var redIcon = {
        url: "./images/redIcon.png",
        scaledSize: new google.maps.Size(30, 50),
    }

    function mapDisplayRestautant() {
        db.collection("restaurants")
            .get()
            .then(function (snapcollection) {
                snapcollection.forEach(function (doc) {
                    var time = doc.data().queue.length * 5;
                    var contentString = '<div class="infoContent">' +
                        '<div class="siteNotice">' +
                        "</div>" +
                        '<h5 class="firstHeading">' + doc.data().name + '</h5>' +
                        '<div class="bodyContent">' +
                        '<p>Wait time: <b>' + time + "</b> minutes" +
                        "</div>" +
                        "</div>";
                    var marker;
                    const infowindow = new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 250,
                    });
                    if (doc.data().queue.length <= 3) {

                        const loc = doc.data().geometry;
                        marker = new google.maps.Marker({
                            position: loc,
                            map: map,
                            icon: greenIcon,

                        });
                    } else {
                        const loc = doc.data().geometry;
                        marker = new google.maps.Marker({
                            position: loc,
                            map: map,
                            icon: redIcon,

                        });
                    }

                    marker.addListener("click", () => {
                        console.log("on");
                        infowindow.open(map, marker);
                    });

                })
            })
    }
    mapDisplayRestautant();
};

function showDistance(pos) {
    var resList = {};
    db.collection("restaurants")
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var restautantLat = doc.data().geometry.lat;
                var restautantLng = doc.data().geometry.lng;

                // console.log(restautantLat);
                // console.log(restautantLng);
                var radlat1 = Math.PI * pos.lat / 180;
                var radlat2 = Math.PI * restautantLat  / 180;
                var theta = pos.lng - restautantLng;
                var radtheta = Math.PI * theta / 180;
                var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                if (dist > 1) {
                    dist = 1;
                }
                dist = Math.acos(dist);
                dist = dist * 180 / Math.PI;
                dist = dist * 60 * 1.1515;
                distInMeters = Math.round(dist * 1.609344 * 10) / 10;
                console.log(distInMeters);
                resList.name = doc.data().name;
                resList.dist = distInMeters;
                resList.address = doc.data().address;
                console.log(resList);
            })

        })
}

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

function orderRestaurantInTime(option) {
    if (option == "least") {
        $("#restaurantsList").html("");
        db.collection("restaurants")
            .orderBy("queueCount")
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
    } else if (option == "most") {
        $("#restaurantsList").html("");
        db.collection("restaurants")
            .orderBy("queueCount", "desc")
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
}

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

                    queue: firebase.firestore.FieldValue.arrayUnion({
                        name: userName,
                        id: userId
                    }),
                }).then(function () {
                    restaurantId = id;
                    firebase.auth().onAuthStateChanged(function (user) {
                        if (user) {
                            db.collection("users")
                                .doc(user.uid)
                                .update({
                                    currentQueue: restaurantId
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
                .then(function (doc) {
                    var queueId = doc.data().currentQueue;
                    if (queueId != "") {
                        console.log(queueId);
                        db.collection("restaurants")
                            .doc(queueId)
                            .onSnapshot(function (doc) {
                                if (doc & doc.data().queue) {
                                    console.log(doc.data().queue[0]);
                                    if (doc.data().queue[0].id == userId) {
                                        console.log("time");
                                        prompt("time to eat!");
                                    }
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