/**
 * Author Man Sun, Set 1A
 */

/**
 * Google map initialize
 */
function initMap() {
    // Create the map.
    let place = {
        lat: 49.23907286232973,
        lng: -122.9648191551294
    };
    const map = new google.maps.Map(document.getElementById("map"), {
        center: place,
        zoom: 16,
        mapId: "8d193001f940fde3",
        mapTypeControl: false,
        streetViewControl: false,

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

                    // Call showDistance function do get the distance between each restaurant and user.
                    showDistance(pos);
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

    /**
     * Set the map marker based on busy time, green marker means not busy
     * red marker means at east 15 minutes waiting time
     */
    function mapDisplayRestautant() {
        db.collection("restaurants")
            .get() // Read the restaurant DB to get each information
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
                        const name = doc.data().name;
                        const loc = doc.data().geometry;
                        marker = new google.maps.Marker({
                            position: loc,
                            map: map,
                            icon: greenIcon,
                            title: name,
                        });
                    } else {
                        const loc = doc.data().geometry;
                        marker = new google.maps.Marker({
                            position: loc,
                            map: map,
                            icon: redIcon,

                        });
                    }

                    marker.addListener("click", () => { // If marker is clicked, show the info window
                        infowindow.open(map, marker);
                    });

                })
            })
    }
    mapDisplayRestautant();
};

/** 
 * Default restaurants display 
 * */
function displayRestautant() {
    db.collection("restaurants")
        .get() // Read the restaurant DB
        .then(function (snap) {
            snap.forEach(function (doc) { // Read every restaurant store in collection
                var image = doc.data().icon;
                var name = doc.data().name;
                var cusineHtml = "<span>";
                doc.data().cuisine.forEach(function (type) {
                    cusineHtml += "<span>&#8226" + type + "&nbsp;&nbsp;</span>";
                })
                var price = "";
                for (i = 0; i < doc.data().price; i++) {
                    price += "$";
                }
                var queue = doc.data().queue.length * 5;
                var day = new Date();
                var hour = day.getHours();
                var hourStatus = "";
                var queueReady = true;
                var queueStatus = "";
                // Check the restaurant open time, if close, disable the queue up button
                if (hour >= doc.data().hours.start && hour < doc.data().hours.end) {
                    if (queue == 0) {
                        hourStatus += '"text-success">Open' + '</h6><div class="d-flex flex-column mt-4">' + '<button id="' + doc.id + '" class="btn btn-primary btn-sm" type="button">Detail</button> <br>' +
                            '</div></div></div></div></div></div>';
                        queueReady = false;
                    } else {
                        hourStatus += '"text-success">Open' + '</h6><div class="d-flex flex-column mt-4">' + '<button id="' + doc.id + '" class="btn btn-primary btn-sm" type="button">Detail</button> <br>' +
                            '<button class="btn btn-primary btn-lg" type="button" id = "button' + doc.id + '">Queue UP</button></div></div></div></div></div></div>';
                        queueReady = true;
                    }
                    queueStatus = queue + " Minutes &#128337";
                } else {
                    hourStatus += '"text-danger">Close' + '</h6><div class="d-flex flex-column mt-4"><button id="' + doc.id + '" class="btn btn-primary btn-sm" type="button">Detail</button></div></div></div></div></div></div>';
                    queueReady = false;
                    queueStatus = "";
                }
                var address = doc.data().address;
                var phone = doc.data().phone;
                var partName = name.slice(0, 3);
                var star = '</h3><div class="stars-outer ' + partName + '"><div class="stars-inner"></div></div>';
                // Jquery call to display the information
                $("#restaurantsList").append('<div class="container mt-5 mb-5"><div class="d-flex justify-content-center row"><div class="col-md-15">' +
                    '<div class="row p-2 bg-white border rounded"><div class="col-md-3 mt-1"><img class="img-fluid img-responsive rounded" src="./images/' +
                    image + '"></div><div class="col-md-6 mt-1"><h3>' + name + star +
                    '<div class="mt-1 mb-1 spec-1">' + cusineHtml + '</span></div><div class="mt-1 mb-1 spec-1">' + price + '</div>' +
                    '<div class="mt-1 mb-1 spec-1">' + address + '</div>' + '<div class="mt-1 mb-1 spec-1">' + phone + '</div>' + '</div><div class="align-items-center align-content-center col-md-3 border-left mt-1"><div class="d-flex flex-row align-items-center">' +
                    '<h4 class="mr-1">' + queueStatus + '</h4></h4></div><h6 class=' + hourStatus);

                var starTotal = 5;
                var rating = doc.data().rating;
                const starPercentage = (rating / starTotal) * 100;
                const starPercentageRounded = `${(Math.round(starPercentage / 10) * 10)}%`;
                document.querySelector(`.${partName} .stars-inner`).style.width = starPercentageRounded;

                addRestaurantListener(doc.id); // Add a click listen to detail button
                if (queueReady) {
                    getUserQueueReady(doc.id); // If restaurant if not close, enable the queue up function
                }
                pagination(); // Pagination the restaurant
            })
        })
}

displayRestautant();

/**
 * Set the different button listener, because we are not using firebase sorting function.
 * We are rewrite the array compareTo() function, so the list will be display in certain order
 * @param resList The restaurant list in array
 */
function changeDisplay(resList) {
    $("#queue-menu").html('<li><a class="dropdown-item" id = "clickLeast">Least busy</a></li><li><a class="dropdown-item" id = "clickMost">Most busy</a></li>');
    $("#price-menu").html('<li><a class="dropdown-item" id = "clickCheap">Low to High</a></li><li><a class="dropdown-item" id = "clickExpensive">High to low</a></li>');
    $("#distance").html('<button class="btn dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">Distance' +
        '</button><ul id = "distance-menu" class="dropdown-menu" aria-labelledby="dropdownMenuButton2"><li><a class="dropdown-item" id="clickNear">Nearest</a></li><li><a class="dropdown-item" id="clickFar">Farest</a></li></ul>');
    changeDefaultDisplay(resList);

    // Add event listener to different sort options, and pass the array to changeDefaultDisplay
    // to display the sorted restaurant
    $("#clickLeast").on("click", function () {

        resList.sort((a, b) => (a.queue > b.queue) ? 1 : -1);
        changeDefaultDisplay(resList);
    })

    $("#clickMost").on("click", function () {

        resList.sort((a, b) => (a.queue < b.queue) ? 1 : -1);
        changeDefaultDisplay(resList);
    })

    $("#clickNear").on("click", function () {

        resList.sort((a, b) => (a.dist > b.dist) ? 1 : -1);
        changeDefaultDisplay(resList);
    })

    $("#clickFar").on("click", function () {

        resList.sort((a, b) => (a.dist < b.dist) ? 1 : -1);
        changeDefaultDisplay(resList);
    })

    $("#clickCheap").on("click", function () {

        resList.sort((a, b) => (a.price > b.price) ? 1 : -1);
        changeDefaultDisplay(resList);
    })

    $("#clickExpensive").on("click", function () {

        resList.sort((a, b) => (a.price < b.price) ? 1 : -1);
        changeDefaultDisplay(resList);
    })
}

/**
 * Change Restaurants display after get user's geo location. This is called
 * when user get their geolocation, and try to sort the restaurant by time, price, or distance.
 * @param resList The restaurant array list
 */
function changeDefaultDisplay(resList) {
    $("#restaurantsList").html("");
    resList.forEach(function (doc) { // Iterate through the array list and display them to webpage
        var image = doc.image;
        var name = doc.name;
        var dist = doc.dist;
        var cusineHtml = "<span>";
        doc.cuisine.forEach(function (type) {
            cusineHtml += "<span>&#8226" + type + "</span>";
        })
        var price = "";
        for (i = 0; i < doc.price; i++) {
            price += "$";
        }
        var queue = doc.queue * 5;
        var day = new Date();
        var hour = day.getHours();
        var hourStatus = "";
        var queueReady = true;
        var queueStatus = "";
        // Check the restaurant open time, if close, disable the queue up button
        if (hour >= doc.hours.start && hour < doc.hours.end) {
            if (queue == 0) {
                hourStatus += '"text-success">Open' + '</h6><div class="d-flex flex-column mt-4">' + '<button id="' + doc.id + '" class="btn btn-primary btn-sm" type="button">Detail</button> <br>' +
                    '</div></div></div></div></div></div>';
                queueReady = false;
            } else {
                hourStatus += '"text-success">Open' + '</h6><div class="d-flex flex-column mt-4">' + '<button id="' + doc.id + '" class="btn btn-primary btn-sm" type="button">Detail</button> <br>' +
                    '<button class="btn btn-primary btn-lg" type="button" id = "button' + doc.id + '">Queue UP</button></div></div></div></div></div></div>';
                queueReady = true;
            }
            queueStatus = queue + " Minutes &#128337";
        } else {
            hourStatus += '"text-danger">Close' + '</h6><div class="d-flex flex-column mt-4"><button id="' + doc.id + '" class="btn btn-primary btn-sm" type="button">Detail</button></div></div></div></div></div></div>';
            queueReady = false;
            queueStatus = "";
        }
        var address = doc.address;
        var phone = doc.phone;
        var partName = name.slice(0, 3);
        var star = '</h3><div class="stars-outer ' + partName + '"><div class="stars-inner"></div></div>';
        $("#restaurantsList").append('<div class="container mt-5 mb-5"><div class="d-flex justify-content-center row"><div class="col-md-15">' +
            '<div class="row p-2 bg-white border rounded"><div class="col-md-3 mt-1"><img class="img-fluid img-responsive rounded" src="./images/' +
            image + '"></div><div class="col-md-6 mt-1"><h3>' + name + ' <span class="distance"> ' + dist + ' km</span>' + star +
            '<div class="mt-1 mb-1 spec-1">' + cusineHtml + '</span></div><div class="mt-1 mb-1 spec-1">' + price + '<div class="mt-1 mb-1 spec-1">' + address + '</div>' + '<div class="mt-1 mb-1 spec-1">' + phone + '</div>' +
            '</div></div><div class="align-items-center align-content-center col-md-3 border-left mt-1"><div class="d-flex flex-row align-items-center">' +
            '<h4 class="mr-1">' + queueStatus + '</h4></div><h6  class=' + hourStatus);
        var starTotal = 5;
        var rating = doc.rating;
        const starPercentage = (rating / starTotal) * 100;
        const starPercentageRounded = `${(Math.round(starPercentage / 10) * 10)}%`;
        document.querySelector(`.${partName} .stars-inner`).style.width = starPercentageRounded;
        addRestaurantListener(doc.id); // Add a click listen to detail button
        if (queueReady) {
            getUserQueueReady(doc.id); // If restaurant if not close, enable the queue up function
        }
        pagination(); // Pagination the restaurant
    })
}

/**
 * First this will take the user geo location, and calculte the distance between each
 * restaurants and user.
 * Then This will copy information of restaurants stored in firebase into an array.
 * Because we cannot use OrderBy function to sort distance, since each user
 * will have different distance. The distance is then added to the array, so 
 * I can use the array sort function to sort the distance.
 * @param pos the geolocation of user
 */
function showDistance(pos) {
    var totalList = [];
    db.collection("restaurants")
        .get() // Read the restaurant DB to get each information
        .then(function (snap) {
            snap.forEach(function (doc) {
                var resList = []; // Initialize the array list
                var restautantLat = doc.data().geometry.lat;
                var restautantLng = doc.data().geometry.lng;
                var radlat1 = Math.PI * pos.lat / 180;
                var radlat2 = Math.PI * restautantLat / 180;
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
                resList.id = doc.id;
                resList.name = doc.data().name;
                resList.dist = distInMeters;
                resList.review = doc.data().review;
                resList.hours = doc.data().hours;
                resList.queue = doc.data().queue.length;
                resList.cuisine = doc.data().cuisine;
                resList.image = doc.data().icon;
                resList.price = doc.data().price;
                resList.address = doc.data().address;
                resList.phone = doc.data().phone;
                resList.rating = doc.data().rating;
                totalList.push(resList); //Store the information to the array list
            })
            changeDisplay(totalList);
        })
}



/**
 * The pagination function provided by simplePagination.js.
 * Maximum 2 restaurant per page allowed. In real world, the
 * maximum should be set to 20 or more.
 */
function pagination() {
    var items = $("#restaurantsList .container");
    var numItems = items.length;
    var perPage = 2;

    items.slice(perPage).hide();

    $('#pagination-container').pagination({
        items: numItems,
        itemsOnPage: perPage,
        prevText: "&laquo;",
        nextText: "&raquo;",
        onPageClick: function (pageNumber) {
            document.body.scrollTop = 500; // For Safari
            document.documentElement.scrollTop = 500; // For Chrome, Firefox, IE and Opera
            var showFrom = perPage * (pageNumber - 1);
            var showTo = showFrom + perPage;
            items.hide().slice(showFrom, showTo).show();
        }
    });
}

/**
 * This function sort the restauratn in queue time by using the orderby function.
 * And change the html display accordingly
 * @param option The String object that either is least or most 
 */
function orderRestaurantInTime(option) {
    if (option == "least") { //Sort by least busy
        $("#restaurantsList").html("");
        db.collection("restaurants")
            .orderBy("queueCount") // Query the restaurant by the queueCount, which is a number represent how many people in the quque
            .get() // Read the restaurant DB to get each information
            .then(function (snap) { 
                snap.forEach(function (doc) {
                    // Get the information of restaurant
                    var image = doc.data().icon;
                    var name = doc.data().name;
                    var cusineHtml = "<span>";
                    doc.data().cuisine.forEach(function (type) {
                        cusineHtml += "<span>&#8226" + type + "</span>";
                    })
                    var price = "";
                    for (i = 0; i < doc.data().price; i++) {
                        price += "$";
                    }
                    var queue = doc.data().queue.length * 5;
                    var day = new Date();
                    var hour = day.getHours();
                    var hourStatus = "";
                    var queueReady = true;
                    var queueStatus = "";
                    // Check the restaurant open time, if close, disable the queue up button
                    if (hour >= doc.data().hours.start && hour < doc.data().hours.end) {
                        if (queue == 0) {
                            hourStatus += '"text-success">Open' + '</h6><div class="d-flex flex-column mt-4">' + '<button id="' + doc.id + '" class="btn btn-primary btn-sm" type="button">Detail</button> <br>' +
                                '</div></div></div></div></div></div>';
                            queueReady = false;
                        } else {
                            hourStatus += '"text-success">Open' + '</h6><div class="d-flex flex-column mt-4">' + '<button id="' + doc.id + '" class="btn btn-primary btn-sm" type="button">Detail</button> <br>' +
                                '<button class="btn btn-primary btn-lg" type="button" id = "button' + doc.id + '">Queue UP</button></div></div></div></div></div></div>';
                            queueReady = true;
                        }
                        queueStatus = queue + " Minutes &#128337";
                    } else {
                        hourStatus += '"text-danger">Close' + '</h6><div class="d-flex flex-column mt-4"><button id="' + doc.id + '" class="btn btn-primary btn-sm" type="button">Detail</button></div></div></div></div></div></div>';
                        queueReady = false;
                        queueStatus = "";
                    }
                    var address = doc.data().address;
                    var phone = doc.data().phone;
                    var partName = name.slice(0, 3);
                    var star = '</h3><div class="stars-outer ' + partName + '"><div class="stars-inner"></div></div>';
                    // Use jquery to write the data to page
                    $("#restaurantsList").append('<div class="container mt-5 mb-5"><div class="d-flex justify-content-center row"><div class="col-md-15">' +
                        '<div class="row p-2 bg-white border rounded"><div class="col-md-3 mt-1"><img class="img-fluid img-responsive rounded" src="./images/' +
                        image + '"></div><div class="col-md-6 mt-1"><h3>' + name + star +
                        '<div class="mt-1 mb-1 spec-1">' + cusineHtml + '</span></div><div class="mt-1 mb-1 spec-1">' + price + '</div>' +
                        '<div class="mt-1 mb-1 spec-1">' + address + '</div>' + '<div class="mt-1 mb-1 spec-1">' + phone + '</div>' + '</div><div class="align-items-center align-content-center col-md-3 border-left mt-1"><div class="d-flex flex-row align-items-center">' +
                        '<h4 class="mr-1">' + queueStatus + '</h4></h4></div><h6 class=' + hourStatus);

                    var starTotal = 5;
                    var rating = doc.data().rating;
                    const starPercentage = (rating / starTotal) * 100;
                    const starPercentageRounded = `${(Math.round(starPercentage / 10) * 10)}%`;
                    document.querySelector(`.${partName} .stars-inner`).style.width = starPercentageRounded;
                    addRestaurantListener(doc.id); // Add a click listen to detail button
                    if (queueReady) {
                        getUserQueueReady(doc.id); // If restaurant if not close, enable the queue up function
                    }
                    pagination(); // Pagination the restaurant
                })
            })
    } else if (option == "most") { // Sort by most busy
        $("#restaurantsList").html("");
        db.collection("restaurants")
            .orderBy("queueCount", "desc") // Query the restaurant by queueCount in reverse direction
            .get() // Read the restaurant info
            .then(function (snap) {
                snap.forEach(function (doc) { 
                    var image = doc.data().icon;
                    var name = doc.data().name;
                    var cusineHtml = "<span>";
                    doc.data().cuisine.forEach(function (type) {
                        cusineHtml += "<span>&#8226" + type + "</span>";
                    })
                    var price = "";
                    for (i = 0; i < doc.data().price; i++) {
                        price += "$";
                    }
                    var queue = doc.data().queue.length * 5;
                    var day = new Date();
                    var hour = day.getHours();
                    var hourStatus = "";
                    var queueReady = true;
                    var queueStatus = "";
                    // Check the restaurant open time, if close, disable the queue up button
                    if (hour >= doc.data().hours.start && hour < doc.data().hours.end) {
                        if (queue == 0) {
                            hourStatus += '"text-success">Open' + '</h6><div class="d-flex flex-column mt-4">' + '<button id="' + doc.id + '" class="btn btn-primary btn-sm" type="button">Detail</button> <br>' +
                                '</div></div></div></div></div></div>';
                            queueReady = false;
                        } else {
                            hourStatus += '"text-success">Open' + '</h6><div class="d-flex flex-column mt-4">' + '<button id="' + doc.id + '" class="btn btn-primary btn-sm" type="button">Detail</button> <br>' +
                                '<button class="btn btn-primary btn-lg" type="button" id = "button' + doc.id + '">Queue UP</button></div></div></div></div></div></div>';
                            queueReady = true;
                        }
                        queueStatus = queue + " Minutes &#128337";
                    } else {
                        hourStatus += '"text-danger">Close' + '</h6><div class="d-flex flex-column mt-4"><button id="' + doc.id + '" class="btn btn-primary btn-sm" type="button">Detail</button></div></div></div></div></div></div>';
                        queueReady = false;
                        queueStatus = "";
                    }
                    var address = doc.data().address;
                    var phone = doc.data().phone;
                    var partName = name.slice(0, 3);
                    var star = '</h3><div class="stars-outer ' + partName + '"><div class="stars-inner"></div></div>';
                    $("#restaurantsList").append('<div class="container mt-5 mb-5"><div class="d-flex justify-content-center row"><div class="col-md-15">' +
                        '<div class="row p-2 bg-white border rounded"><div class="col-md-3 mt-1"><img class="img-fluid img-responsive rounded" src="./images/' +
                        image + '"></div><div class="col-md-6 mt-1"><h3>' + name + star +
                        '<div class="mt-1 mb-1 spec-1">' + cusineHtml + '</span></div><div class="mt-1 mb-1 spec-1">' + price + '</div>' +
                        '<div class="mt-1 mb-1 spec-1">' + address + '</div>' + '<div class="mt-1 mb-1 spec-1">' + phone + '</div>' + '</div><div class="align-items-center align-content-center col-md-3 border-left mt-1"><div class="d-flex flex-row align-items-center">' +
                        '<h4 class="mr-1">' + queueStatus + '</h4></h4></div><h6 class=' + hourStatus);

                    var starTotal = 5;
                    var rating = doc.data().rating;
                    const starPercentage = (rating / starTotal) * 100;
                    const starPercentageRounded = `${(Math.round(starPercentage / 10) * 10)}%`;
                    document.querySelector(`.${partName} .stars-inner`).style.width = starPercentageRounded;
                    addRestaurantListener(doc.id); // Add a click listener to detail button
                    if (queueReady) {
                        getUserQueueReady(doc.id); // If restaurant if not close, enable the queue up function
                    }
                    pagination(); // Pagination the restaurant
                })
            })
    }
}

/**
 * This fucntion query the restaurant by using orderBy function in firebase.
 * And change the html accordingly.
 * @param option The string object that is either cheap or expensive
 */
function orderRestaurantInPrice(option) {
    if (option == "cheap") {
        $("#restaurantsList").html("");
        db.collection("restaurants")
            .orderBy("price") // Query the restaurant by price
            .get() // Read the restaurant info
            .then(function (snap) { 
                snap.forEach(function (doc) {
                    var image = doc.data().icon;
                    var name = doc.data().name;
                    var cusineHtml = "<span>";
                    doc.data().cuisine.forEach(function (type) {
                        cusineHtml += "<span>&#8226" + type + "</span>";
                    })
                    var price = "";
                    for (i = 0; i < doc.data().price; i++) {
                        price += "$";
                    }
                    var queue = doc.data().queue.length * 5;
                    var day = new Date();
                    var hour = day.getHours();
                    var hourStatus = "";
                    var queueReady = true;
                    var queueStatus = "";
                    // Check the restaurant open time, if close, disable the queue up button
                    if (hour >= doc.data().hours.start && hour < doc.data().hours.end) {
                        if (queue == 0) {
                            hourStatus += '"text-success">Open' + '</h6><div class="d-flex flex-column mt-4">' + '<button id="' + doc.id + '" class="btn btn-primary btn-sm" type="button">Detail</button> <br>' +
                                '</div></div></div></div></div></div>';
                            queueReady = false;
                        } else {
                            hourStatus += '"text-success">Open' + '</h6><div class="d-flex flex-column mt-4">' + '<button id="' + doc.id + '" class="btn btn-primary btn-sm" type="button">Detail</button> <br>' +
                                '<button class="btn btn-primary btn-lg" type="button" id = "button' + doc.id + '">Queue UP</button></div></div></div></div></div></div>';
                            queueReady = true;
                        }
                        queueStatus = queue + " Minutes &#128337";
                    } else {
                        hourStatus += '"text-danger">Close' + '</h6><div class="d-flex flex-column mt-4"><button id="' + doc.id + '" class="btn btn-primary btn-sm" type="button">Detail</button></div></div></div></div></div></div>';
                        queueReady = false;
                        queueStatus = "";
                    }
                    var address = doc.data().address;
                    var phone = doc.data().phone;
                    var partName = name.slice(0, 3);
                    var star = '</h3><div class="stars-outer ' + partName + '"><div class="stars-inner"></div></div>';
                    // Jquery call to display the restaurant information
                    $("#restaurantsList").append('<div class="container mt-5 mb-5"><div class="d-flex justify-content-center row"><div class="col-md-15">' +
                        '<div class="row p-2 bg-white border rounded"><div class="col-md-3 mt-1"><img class="img-fluid img-responsive rounded" src="./images/' +
                        image + '"></div><div class="col-md-6 mt-1"><h3>' + name + star +
                        '<div class="mt-1 mb-1 spec-1">' + cusineHtml + '</span></div><div class="mt-1 mb-1 spec-1">' + price + '</div>' +
                        '<div class="mt-1 mb-1 spec-1">' + address + '</div>' + '<div class="mt-1 mb-1 spec-1">' + phone + '</div>' + '</div><div class="align-items-center align-content-center col-md-3 border-left mt-1"><div class="d-flex flex-row align-items-center">' +
                        '<h4 class="mr-1">' + queueStatus + '</h4></h4></div><h6 class=' + hourStatus);

                    var starTotal = 5;
                    var rating = doc.data().rating;
                    const starPercentage = (rating / starTotal) * 100;
                    const starPercentageRounded = `${(Math.round(starPercentage / 10) * 10)}%`;
                    document.querySelector(`.${partName} .stars-inner`).style.width = starPercentageRounded;
                    addRestaurantListener(doc.id); // Add a click listener to detail button
                    if (queueReady) {
                        getUserQueueReady(doc.id); // If restaurant if not close, enable the queue up function
                    }
                    pagination(); // Pagination the restaurant
                })
            })
    } else if (option == "expensive") { // Order the restaurant by price
        $("#restaurantsList").html("");
        db.collection("restaurants")
            .orderBy("price", "desc") // Query the restaurant by price
            .get() // Read the restaurant info
            .then(function (snap) { 
                snap.forEach(function (doc) {
                    var image = doc.data().icon;
                    var name = doc.data().name;
                    var cusineHtml = "<span>";
                    doc.data().cuisine.forEach(function (type) {
                        cusineHtml += "<span>&#8226" + type + "</span>";
                    })
                    var price = "";
                    for (i = 0; i < doc.data().price; i++) {
                        price += "$";
                    }
                    var queue = doc.data().queue.length * 5;
                    var day = new Date();
                    var hour = day.getHours();
                    var hourStatus = "";
                    var queueReady = true;
                    var queueStatus = "";
                    // Check the restaurant open time, if close, disable the queue up button
                    if (hour >= doc.data().hours.start && hour < doc.data().hours.end) {
                        if (queue == 0) {
                            hourStatus += '"text-success">Open' + '</h6><div class="d-flex flex-column mt-4">' + '<button id="' + doc.id + '" class="btn btn-primary btn-sm" type="button">Detail</button> <br>' +
                                '</div></div></div></div></div></div>';
                            queueReady = false;
                        } else {
                            hourStatus += '"text-success">Open' + '</h6><div class="d-flex flex-column mt-4">' + '<button id="' + doc.id + '" class="btn btn-primary btn-sm" type="button">Detail</button> <br>' +
                                '<button class="btn btn-primary btn-lg" type="button" id = "button' + doc.id + '">Queue UP</button></div></div></div></div></div></div>';
                            queueReady = true;
                        }
                        queueStatus = queue + " Minutes &#128337";
                    } else {
                        hourStatus += '"text-danger">Close' + '</h6><div class="d-flex flex-column mt-4"><button id="' + doc.id + '" class="btn btn-primary btn-sm" type="button">Detail</button></div></div></div></div></div></div>';
                        queueReady = false;
                        var queueStatus = "";
                    }
                    var address = doc.data().address;
                    var phone = doc.data().phone;
                    var partName = name.slice(0, 3);
                    var star = '</h3><div class="stars-outer ' + partName + '"><div class="stars-inner"></div></div>';
                    // Jquery call to display the restaurant information
                    $("#restaurantsList").append('<div class="container mt-5 mb-5"><div class="d-flex justify-content-center row"><div class="col-md-15">' +
                        '<div class="row p-2 bg-white border rounded"><div class="col-md-3 mt-1"><img class="img-fluid img-responsive rounded" src="./images/' +
                        image + '"></div><div class="col-md-6 mt-1"><h3>' + name + star +
                        '<div class="mt-1 mb-1 spec-1">' + cusineHtml + '</span></div><div class="mt-1 mb-1 spec-1">' + price + '</div>' +
                        '<div class="mt-1 mb-1 spec-1">' + address + '</div>' + '<div class="mt-1 mb-1 spec-1">' + phone + '</div>' + '</div><div class="align-items-center align-content-center col-md-3 border-left mt-1"><div class="d-flex flex-row align-items-center">' +
                        '<h4 class="mr-1">' + queueStatus + '</h4></h4></div><h6 class=' + hourStatus);

                    var starTotal = 5;
                    var rating = doc.data().rating;
                    const starPercentage = (rating / starTotal) * 100;
                    const starPercentageRounded = `${(Math.round(starPercentage / 10) * 10)}%`;
                    document.querySelector(`.${partName} .stars-inner`).style.width = starPercentageRounded;
                    addRestaurantListener(doc.id); // Add the detial button listener
                    if (queueReady) {
                        getUserQueueReady(doc.id); // Add queue up button listener
                    }
                    pagination(); // Pagination the restaurant
                })
            })
    }
}

/**
 * When the detail button of certain restaurant with unique id is clicked,
 * go the detail.html page
 * @param id the restaurant id 
 */
function addRestaurantListener(id) {
    var restaurant = document.getElementById(id);
    restaurant.addEventListener("click", function () {
        window.location.href = "details.html?id=" + id;
    })
}

/**
 * Check if user is login, if so, add the button listener to it.
 * @param id the restaurant id 
 */
function getUserQueueReady(id) {
    var userName;
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("users")
                .doc(user.uid)
                .get() // Read the user info
                .then(function (doc) { 
                    userName = doc.data().name;
                    userId = user.uid;
                    addQueueListener(userName, id, userId);
                })
        }
    })

}

/**
 * When user click the queue up button, this function will first check whether
 * user is in another queue. Then prompt the party size for user to select, then 
 * pass all the user input to the restaurant DB, store them in queue array of user
 * selected restaurant
 * @param  userName the name of user
 * @param  id the restaurant id
 * @param  userId the user id
 */
function addQueueListener(userName, id, userId) {
    var buttonId = "button" + id;
    var button = document.getElementById(buttonId);
    button.addEventListener("click", function () {
        db.collection("users")
            .doc(userId)
            .get() // Read user collection
            .then(function (doc) { 
                if (doc.data().currentQueue != "") { //Check if user is in another queue
                    Swal.fire('Aleady in Queue', 'Sorry, you can only queue up one restaurant at the same time.', 'error');
                } else {
                    Swal.fire({ // Prompt for party size
                        title: 'Select Party Size',
                        input: 'select',
                        inputOptions: {
                            "1": "1",
                            "2": "2",
                            "3": "3",
                            "4": "4",
                            "5": "5",
                            "6+": "6+",
                        },
                        inputPlaceholder: 'Select a number',
                        showCancelButton: true,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire('Queue UP!', 'You are now in the queue.', 'success');
                            db.collection("restaurants")
                                .doc(id)
                                .update({ // update the restauratn queue array, add the user information, so owner can see who's coming
                                    queue: firebase.firestore.FieldValue.arrayUnion({
                                        name: userName,
                                        id: userId,
                                        size: result.value,
                                    }),
                                    queueCount: firebase.firestore.FieldValue.increment(1), // increase the queue time

                                }).then(function () {
                                    restaurantId = id;
                                    firebase.auth().onAuthStateChanged(function (user) {
                                        if (user) {
                                            db.collection("users")
                                                .doc(user.uid)
                                                .update({ // Update the user collection, set user quque status
                                                    currentQueue: restaurantId,
                                                    partySize: result.value,
                                                })
                                        }
                                    })
                                })
                        }

                    })
                }
            })



    })
}

/**
 * This function check the restaurant queue list of user queued, 
 * prompt the user when the user is in the first of queue list,
 * and wait for user selection for further action.
 * If user select confirm, delete the user in queue list, decrement the queue count, add user info to confirm list, and add this restauratn to user viewed history
 * If user select cancle, delete the user in queue list, decrement the queue count, add user infor to cancel list
 * If user select cancle, move the user info to hold list, delete user in queue list
 */
function checkQueueReady() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("users")
                .doc(user.uid)
                .get() // Read the user info
                .then(function (doc) { 
                    var queueId = doc.data().currentQueue;
                    var userName = doc.data().name;
                    if (queueId != "") { // If there's queue
                        db.collection("restaurants")
                            .doc(queueId) // Read the restaurant info
                            .onSnapshot(function (doc) { // Check the DB when it's changed
                                if (doc.data().queue[0]) {
                                    if (doc.data().queue[0].id == user.uid) { // If user is at first of queue list
                                        var partySize = doc.data().queue[0].size;
                                        Swal.fire({ // Prompt the user 
                                            title: "Your table is ready!",
                                            text: "Please arrive and check with our host!",
                                            icon: 'info',
                                            showDenyButton: true,
                                            showCancelButton: true,
                                            allowOutsideClick: false,
                                            confirmButtonText: `Confirm Arrival`,
                                            denyButtonText: `On My Way`,
                                            cancelButtonText: "Cancle Wait",
                                            confirmButtonColor: '#5DBB63',
                                            denyButtonColor: '#A2D2FF',
                                            cancelButtonColor: '#B80F0A',
                                        }).then((result) => {
                                            deleteUserQueue(queueId, user.uid, userName, partySize); // Delete user in queue
                                            if (result.isConfirmed) { // If user click confirm ,the queue is completed
                                                Swal.fire('Thank you for using our App!', '', 'success')
                                                    .then(function () {
                                                        resetQueue(user.uid, true, queueId, userName);  // reset user queue status
                                                    });

                                            } else if (result.isDenied) { // If user click on the way, notify the restaurant owner
                                                Swal.fire('Take your time, we will notify the host ~!', '', 'info')
                                                    .then(function () {
                                                        notifyOwner(queueId, user.uid, userName); // Notify the owner that user in on the way
                                                    });
                                            } else { // If user click cancle, delete the user in the queue
                                                Swal.fire('Your resercation is cancled!', '', 'info')
                                                    .then(function () {
                                                        resetQueue(user.uid, false, queueId, userName); // reset user queue status
                                                    });

                                            }
                                        })
                                    }
                                }
                            })
                    }
                })
        }
    })
}

checkQueueReady();

/**
 * This functino delete the user information in the certain restaurant DB
 * @param  userId user id
 * @param confirmed boolean value that determine user confirm or cancel
 * @param currentQueue this is the restaurant id, indicating user is queuing this restaurant
 * @param userName user name
 */
function resetQueue(userId, confirmed, currentQueue, userName) {
    if (confirmed) { // If user confirm the queue ready call

        var updateInfo = db.collection("users")
            .doc(userId);

        var time = firebase.firestore.Timestamp.now();
        updateInfo.update({ // Update the history array of user, showing that user went to this restaurant
            history: firebase.firestore.FieldValue.arrayUnion({
                id: currentQueue,
                visited: time,
            }),
            currentQueue: "",
        }).then(function () {
            updateConfirmList(currentQueue, true, userName, userId); // Add this restaurant to confirm array
        })
    } else { // If user cancle the queue

        var updateInfo = db.collection("users")
            .doc(userId);
        updateInfo.update({ // Update the user currentqueue, indicating that they are not waiting any restaurant
            currentQueue: "",
        }).then(function () {
            updateConfirmList(currentQueue, false, userName, userId); // Add this user to cancel array
        })
    }

}

/**
 * This function delete the user in the queue array of certain restaurant.
 * @param  ownerId the restauratn id
 * @param  userId the user id
 * @param  userName the user name
 * @param  partySize the party size of user queue
 */
function deleteUserQueue(ownerId, userId, userName, partySize) {
    db.collection("restaurants")
        .doc(ownerId)
        .update({ // Delete the user info in queue of restaurant
            queue: firebase.firestore.FieldValue.arrayRemove({
                id: userId,
                name: userName,
                size: partySize
            }),
        })
}

/**
 * This add the user information either to confirm or cancel, indicating that user queue history.
 * @param  ownerId the restauratn id
 * @param  userId the user id
 * @param  userName the user name
 * @param  arrival the boolean value
 */
function updateConfirmList(ownerId, arrival, userName, userId) {
    if (arrival) {
        var updateInfo = db.collection("restaurants")
            .doc(ownerId);

        var time = firebase.firestore.Timestamp.now();

        updateInfo.update({ // Update the confirm array
            confirm: firebase.firestore.FieldValue.arrayUnion({
                name: userName,
                visited: time,
            }),
            hold: firebase.firestore.FieldValue.arrayRemove({
                id: userId,
                name: userName,
            }),
            queueCount: firebase.firestore.FieldValue.increment(-1),
        })
    } else {
        var updateInfo = db.collection("restaurants")
            .doc(ownerId);

        var time = firebase.firestore.Timestamp.now();

        updateInfo.update({ // Update the cancel array
            cancle: firebase.firestore.FieldValue.arrayUnion({
                name: userName,
                visited: time,
            }),
            queueCount: firebase.firestore.FieldValue.increment(-1),
        })
    }
}

/**
 * This function is called when user clilck on my way button, this will
 * update user's information to hold array of restaurant DB, and owner'side
 * Application will catch the information, and notify the owner.
 * @param  ownerId restaurant id
 * @param  userId user id
 * @param  userName user name
 */
function notifyOwner(ownerId, userId, userName) {
    db.collection("restaurants")
        .doc(ownerId)
        .update({ // Update the hold array
            hold: firebase.firestore.FieldValue.arrayUnion({ // Notice that the queueCount is not updated, because user is still in the queue
                name: userName,
                id: userId,
            }),
        })
}