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


function changeDisplay(resList) {
    $("#queue-menu").html('<li><a class="dropdown-item" id = "clickLeast">Least busy</a></li><li><a class="dropdown-item" id = "clickMost">Most busy</a></li>');
    $("#price-menu").html('<li><a class="dropdown-item" id = "clickCheap">Low to High</a></li><li><a class="dropdown-item" id = "clickExpensive">High to low</a></li>');
    $("#distance").html('<button class="btn dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">Distance' +
        '</button><ul id = "distance-menu" class="dropdown-menu" aria-labelledby="dropdownMenuButton2"><li><a class="dropdown-item" id="clickNear">Nearest</a></li><li><a class="dropdown-item" id="clickFar">Farest</a></li></ul>');
    changeDefaultDisplay(resList);

    $("#clickLeast").on("click", function () {
        console.log(resList);
        resList.sort((a, b) => (a.queue > b.queue) ? 1 : -1);
        changeDefaultDisplay(resList);
    })

    $("#clickMost").on("click", function () {
        console.log(resList);
        resList.sort((a, b) => (a.queue < b.queue) ? 1 : -1);
        changeDefaultDisplay(resList);
    })

    $("#clickNear").on("click", function () {
        console.log(resList);
        resList.sort((a, b) => (a.dist > b.dist) ? 1 : -1);
        changeDefaultDisplay(resList);
    })

    $("#clickFar").on("click", function () {
        console.log(resList);
        resList.sort((a, b) => (a.dist < b.dist) ? 1 : -1);
        changeDefaultDisplay(resList);
    })

    $("#clickCheap").on("click", function () {
        console.log(resList);
        resList.sort((a, b) => (a.price > b.price) ? 1 : -1);
        changeDefaultDisplay(resList);
    })

    $("#clickExpensive").on("click", function () {
        console.log(resList);
        resList.sort((a, b) => (a.price < b.price) ? 1 : -1);
        changeDefaultDisplay(resList);
    })
}

/** Restaurants display after get geo location */
function changeDefaultDisplay(resList) {
    $("#restaurantsList").html("");
    resList.forEach(function (doc) {
        var image = doc.image;
        var name = doc.name;
        var dist = doc.dist;
        console.log("image " + image);
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
            '<div class="mt-1 mb-1 spec-1">' + cusineHtml + '</span></div><div class="mt-1 mb-1 spec-1">' + price + '<div class="mt-1 mb-1 spec-1">' + address + '</div>' + '<div class="mt-1 mb-1 spec-1">' + phone + '</div>'
            + '</div></div><div class="align-items-center align-content-center col-md-3 border-left mt-1"><div class="d-flex flex-row align-items-center">' +
            '<h4 class="mr-1">' + queueStatus + '</h4></div><h6  class=' + hourStatus);
            var starTotal = 5;
            var rating = doc.rating;
            const starPercentage = (rating / starTotal) * 100;
            const starPercentageRounded = `${(Math.round(starPercentage / 10) * 10)}%`;
            document.querySelector(`.${partName} .stars-inner`).style.width = starPercentageRounded;
        addRestaurantListener(doc.id);
        if (queueReady) {
            getUserQueueReady(doc.id);
        }
        pagination();
    })
}

function showDistance(pos) {
    var totalList = [];
    db.collection("restaurants")
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var resList = [];
                var restautantLat = doc.data().geometry.lat;
                var restautantLng = doc.data().geometry.lng;

                // console.log(restautantLat);
                // console.log(restautantLng);
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
                console.log(distInMeters);
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
                totalList.push(resList);
                console.log(totalList);
            })
            changeDisplay(totalList);
        })
}

/** Default restaurants display */
function displayRestautant() {
    db.collection("restaurants")
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
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
                console.log(doc.data().hours.start);
                var hourStatus = "";
                var queueReady = true;
                var queueStatus = "";
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
                console.log(star);
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

                addRestaurantListener(doc.id);
                if (queueReady) {
                    getUserQueueReady(doc.id);
                }
                pagination();
            })
        })
}

displayRestautant();

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

function orderRestaurantInTime(option) {
    if (option == "least") {
        $("#restaurantsList").html("");
        db.collection("restaurants")
            .orderBy("queueCount")
            .get()
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
                    console.log(doc.data().hours.start);
                    var hourStatus = "";
                    var queueReady = true;
                    var queueStatus = "";
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
                    console.log(star);
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
                    addRestaurantListener(doc.id);
                    if (queueReady) {
                        getUserQueueReady(doc.id);
                    }
                    pagination();
                })
            })
    } else if (option == "most") {
        $("#restaurantsList").html("");
        db.collection("restaurants")
            .orderBy("queueCount", "desc")
            .get()
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
                    console.log(doc.data().hours.start);
                    var hourStatus = "";
                    var queueReady = true;
                    var queueStatus = "";
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
                    console.log(star);
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
                    addRestaurantListener(doc.id);
                    if (queueReady) {
                        getUserQueueReady(doc.id);
                    }
                    pagination();
                })
            })
    }
}

function orderRestaurantInPrice(option) {
    if (option == "cheap") {
        $("#restaurantsList").html("");
        db.collection("restaurants")
            .orderBy("price")
            .get()
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
                    console.log(doc.data().hours.start);
                    var hourStatus = "";
                    var queueReady = true;
                    var queueStatus = "";
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
                    console.log(star);
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
                    addRestaurantListener(doc.id);
                    if (queueReady) {
                        getUserQueueReady(doc.id);
                    }
                    pagination();
                })
            })
    } else if (option == "expensive") {
        $("#restaurantsList").html("");
        db.collection("restaurants")
            .orderBy("price", "desc")
            .get()
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
                    console.log(doc.data().hours.start);
                    var hourStatus = "";
                    var queueReady = true;
                    var queueStatus = "";
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
                    console.log(star);
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
                    addRestaurantListener(doc.id);
                    if (queueReady) {
                        getUserQueueReady(doc.id);
                    }
                    pagination();
                })
            })
    }
}

function addRestaurantListener(id) {
    var restaurant = document.getElementById(id);
    restaurant.addEventListener("click", function () {
        window.location.href = "details.html?id=" + id;
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
        db.collection("users")
            .doc(userId)
            .get()
            .then(function (doc) {
                if (doc.data().currentQueue != "") {
                    Swal.fire('Aleady in Queue', 'Sorry, you can only queue up one restaurant at the same time.', 'error');
                } else {
                    Swal.fire({
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
                                .update({
                                    queue: firebase.firestore.FieldValue.arrayUnion({
                                        name: userName,
                                        id: userId,
                                        size: result.value,
                                    }),
                                    queueCount: firebase.firestore.FieldValue.increment(1),

                                }).then(function () {
                                    restaurantId = id;
                                    firebase.auth().onAuthStateChanged(function (user) {
                                        if (user) {
                                            db.collection("users")
                                                .doc(user.uid)
                                                .update({
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

function checkQueueReady() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("users")
                .doc(user.uid)
                .get()
                .then(function (doc) {
                    var queueId = doc.data().currentQueue;
                    var userName = doc.data().name;
                    var partySize = doc.data().partySize;
                    if (queueId != "") {
                        console.log(queueId);
                        db.collection("restaurants")
                            .doc(queueId)
                            .onSnapshot(function (doc) {
                                if (doc.data().queue[0]) {
                                    console.log(doc.data().queue[0]);
                                    if (doc.data().queue[0].id == user.uid) {
                                        Swal.fire({
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
                                            deleteUserQueue(queueId, user.uid, userName, partySize);
                                            if (result.isConfirmed) {
                                                Swal.fire('Thank you for using our App!', '', 'success');
                                                resetQueue(user.uid, true, queueId, userName);
                                            } else if (result.isDenied) {
                                                Swal.fire('Take your time, we will notify the host ~!', '', 'info')
                                                    .then(function () {
                                                        notifyOwner(queueId, user.uid, userName, partySize);
                                                    });
                                                //notifyOwner(queueId, user.uid, userName, partySize);
                                            } else {
                                                Swal.fire('Your resercation is cancled!', '', 'info');
                                                resetQueue(user.uid, false, queueId, userName)
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

function resetQueue(userId, confirmed, currentQueue, userName) {
    console.log(currentQueue);
    if (confirmed) {

        var updateInfo = db.collection("users")
            .doc(userId);

        var time = firebase.firestore.Timestamp.now();
        updateInfo.update({
            history: firebase.firestore.FieldValue.arrayUnion({
                id: currentQueue,
                visited: time,
            }),
            currentQueue: "",
        }).then(function () {
            updateConfirmList(currentQueue, true, userName);
        })
    } else {

        var updateInfo = db.collection("users")
            .doc(userId);
        updateInfo.update({
            currentQueue: "",
        }).then(function () {
            updateConfirmList(currentQueue, false, userName);
        })
    }

}

function deleteUserQueue(ownerId, userId, userName, partySize) {
    db.collection("restaurants")
        .doc(ownerId)
        .update({
            queue: firebase.firestore.FieldValue.arrayRemove({
                id: userId,
                name: userName,
                size: partySize
            }),
            queueCount: firebase.firestore.FieldValue.increment(-1),
        })
}

function updateConfirmList(ownerId, arrival, userName) {
    if (arrival) {
        var updateInfo = db.collection("restaurants")
            .doc(ownerId);

        var time = firebase.firestore.Timestamp.now();

        updateInfo.update({
            confirm: firebase.firestore.FieldValue.arrayUnion({
                name: userName,
                visited: time,
            }),
        })
    } else {
        var updateInfo = db.collection("restaurants")
            .doc(ownerId);

        var time = firebase.firestore.Timestamp.now();

        updateInfo.update({
            cancle: firebase.firestore.FieldValue.arrayUnion({
                name: userName,
                visited: time,
            }),
        })
    }
}

function notifyOwner(ownerId, userId, userName, partySize) {
    var time = firebase.firestore.Timestamp.now();
    db.collection("restaurants")
        .doc(ownerId)
        .update({
            hold: firebase.firestore.FieldValue.arrayUnion({
                name: userName,
                id: userId,
                size: partySize,
                visited: time,
            }),
        })
}