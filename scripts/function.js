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
function writeProfile() {
    var profileRef = db.collection("PROFILE");
    profileRef.add({
        USERNAME: "donalllllld",
        NAME: "Donald Trump",
        PHONE: "(604)430-5000",
        PROFILE_IMG: "donald.jpg",
    });
}
writeProfile();

// let map;

// function initMap() {
//     var place = new google.maps.LatLng(49.2810718309468, -123.11683978616684);
//     map = new google.maps.Map(document.getElementById("map"), {
//         center: place,
//         zoom: 15,
//         mapTypeId: 'roadmap',
//         mapId:'fb878b6e50d10a04',
//         mapTypeControl: false,
//         streetViewControl: false,
//     });
//     infoWindow = new google.maps.InfoWindow();
//     const locationButton = document.createElement("button");
//     locationButton.textContent = "Pan to Current Location";
//     locationButton.classList.add("custom-map-control-button");
//     map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
//     locationButton.addEventListener("click", () => {
//         // Try HTML5 geolocation.
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const pos = {
//                         lat: position.coords.latitude,
//                         lng: position.coords.longitude,
//                     };
//                     place = pos;
//                     infoWindow.setPosition(pos);
//                     infoWindow.setContent("Location found.");
//                     infoWindow.open(map);
//                     map.setCenter(pos);
//                 },
//                 () => {
//                     handleLocationError(true, infoWindow, map.getCenter());
//                 }
//             );
//         } else {
//             // Browser doesn't support Geolocation
//             handleLocationError(false, infoWindow, map.getCenter());
//         }
//     });

//     var request = {
//         location: place,
//         radius: '500',
//         type: ['restaurant']
//       };

//       service = new google.maps.places.PlacesService(map);
//   service.nearbySearch(request, callback);
// }

// function callback(results, status) {
//     if (status == google.maps.places.PlacesServiceStatus.OK) {
//       for (var i = 0; i < results.length; i++) {
//         createMarker(results[i]);
//       }
//     }
//   }

// function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//     infoWindow.setPosition(pos);
//     infoWindow.setContent(
//       browserHasGeolocation
//         ? "Error: The Geolocation service failed."
//         : "Error: Your browser doesn't support geolocation."
//     );
//     infoWindow.open(map);
//   }

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

function initMap() {
    // Create the map.
    let place = { lat: 49.2810718309468, lng: -123.11683978616684 };
    const map = new google.maps.Map(document.getElementById("map"), {
        center: place,
        zoom: 16,
        mapId: "8d193001f940fde3",
    });


    // Create the places service.
    const service = new google.maps.places.PlacesService(map);
    let getNextPage;
    const moreButton = document.getElementById("more");

    moreButton.onclick = function () {
        moreButton.disabled = true;

        if (getNextPage) {
            getNextPage();
        }
    };

    infoWindow = new google.maps.InfoWindow();
    const locationButton = document.createElement("button");
    locationButton.textContent = "Pan to Current Location";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    place = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    infoWindow.setPosition(place);
                    infoWindow.setContent("Location found.");
                    infoWindow.open(map);
                    map.setCenter(place);
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

    // Perform a nearby search.
    service.nearbySearch(
        { location: place, radius: 500, type: "restaurant" },
        (results, status, pagination) => {
            if (status !== "OK" || !results) return;
            addPlaces(results, map);
            moreButton.disabled = !pagination || !pagination.hasNextPage;

            if (pagination && pagination.hasNextPage) {
                getNextPage = () => {
                    // Note: nextPage will call the same handler function as the initial call
                    pagination.nextPage();
                };
            }
        }
    );
}

function addPlaces(places, map) {
    const placesList = document.getElementById("places");

    for (const place of places) {
        if (place.geometry && place.geometry.location) {
            const image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25),
            };
            new google.maps.Marker({
                map,
                icon: image,
                title: place.name,
                position: place.geometry.location,
            });
            console.log(place.name);
            const li = document.createElement("li");
            li.textContent = place.name;
            placesList.appendChild(li);
            li.addEventListener("click", () => {
                map.setCenter(place.geometry.location);
            });
        }
    }
}

function createPhotoMarker(place) {
    var photos = place.photos;
    if (!photos) {
        return;
    }

    var marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
        title: place.name,
        icon: photos[0].getUrl({ maxWidth: 35, maxHeight: 35 })
    });
}