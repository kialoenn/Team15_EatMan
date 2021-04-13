$(document).ready(function () {
    function getPattern() {
        const parsedUrl = new URL(window.location.href);
        var pattern = parsedUrl.searchParams.get("pattern");
        $('#resultPrompt').html("Your Search for " + pattern + ":");
        queryResultByName(pattern);
        queryResultByCuisine(pattern);
    }
    getPattern()

    function checkEmpty() {
        if ($('#result').html().length == 0) {
            console.log("enmm");
        }
    }
    function queryResultByName(pattern) {
        db.collection("restaurants")
            .where("name", "==", pattern)
            .get()
            .then(function (snap) {
                snap.forEach(function (doc) {
                    getRestaurantDetail(doc.data(), doc.id);
                })
            }).then(function() {

            })
    }

    function queryResultByCuisine(pattern) {
        var type = [pattern];
        db.collection("restaurants")
            .where("cuisine", "array-contains-any", type)
            .get()
            .then(function (snap) {
                snap.forEach(function (doc) {
                    getRestaurantDetail(doc.data(), doc.id);
                })
            })
    }

    function getRestaurantDetail(data, id) {
        var image = data.icon;
        var name = data.name;
        var cusineHtml = "<span>";
        data.cuisine.forEach(function (type) {
            cusineHtml += "<span>&#8226" + type + "&nbsp;&nbsp;</span>";
        })
        var price = "";
        for (i = 0; i < data.price; i++) {
            price += "$";
        }
        var queue = data.queue.length * 5;
        var day = new Date();
        var hour = day.getHours();
        console.log(data.hours.start);
        var hourStatus = "";
        var queueReady = true;
        var queueStatus = "";
        if (hour >= data.hours.start && hour < data.hours.end) {
            if (queue == 0) {
                hourStatus += '"text-success">Open' + '</h6><div class="d-flex flex-column mt-4">' + '<button id="' + id + '" class="btn btn-primary btn-sm" type="button">Detail</button> <br>' +
                    '</div></div></div></div></div></div>';
                queueReady = false;
            } else {
                hourStatus += '"text-success">Open' + '</h6><div class="d-flex flex-column mt-4">' + '<button id="' + id + '" class="btn btn-primary btn-sm" type="button">Detail</button> <br>' +
                    '<button class="btn btn-primary btn-lg" type="button" id = "button' + id + '">Queue UP</button></div></div></div></div></div></div>';
                queueReady = true;
            }
            queueStatus = queue + " Minutes &#128337";
        } else {
            hourStatus += '"text-danger">Close' + '</h6><div class="d-flex flex-column mt-4"><button id="' + id + '" class="btn btn-primary btn-sm" type="button">Detail</button></div></div></div></div></div></div>';
            queueReady = false;
            queueStatus = "";
        }

        displayRestautant(image, name, cusineHtml, price, queue, hourStatus, queueStatus, queueReady);
    }

    function displayRestautant(image, name, cusineHtml, price, queue, hourStatus, queueStatus, queueReady) {
        $("#result").append('<div class="container mt-5 mb-5"><div class="d-flex justify-content-center row"><div class="col-md-15">' +
            '<div class="row p-2 bg-white border rounded"><div class="col-md-3 mt-1"><img class="img-fluid img-responsive rounded" src="./images/' +
            image + '"></div><div class="col-md-6 mt-1"><h3>' + name + '</h3><div class="stars-outer"><div class="stars-inner"></div></div>' +
            '<div class="mt-1 mb-1 spec-1">' + cusineHtml + '</span></div><div class="mt-1 mb-1 spec-1">' + price + '</div></div><div class="align-items-center align-content-center col-md-3 border-left mt-1"><div class="d-flex flex-row align-items-center">' +
            '<h4 class="mr-1">' + queueStatus + '</h4></div><h6 class=' + hourStatus);
            if ($('#result').html().length == 0) {
                console.log("enmm");
            }
        //addRestaurantListener(doc.id);
        if (queueReady) {
            //getUserQueueReady(doc.id);
        }
    }
})