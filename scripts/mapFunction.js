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
                    console.log(doc.data().geometry);
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
                $("#restaurantsList").append("<div id='" + doc.id + "'>" + "<p>" + name + "</p>" + "<p>Estimated time: " + queue + "minutes</p>"
                    + "<div class = 'hide' id = 'detail" + doc.id + "'><p>Address: " + address + "</p>" + "<p>phone: " + phone + "</p></div></div>");
                addRestaurantListener(doc.id);
            })
        })
}

displayRestautant();

function addRestaurantListener(id) {
    var detailId = "detail" + id;
    var detail = document.getElementById(detailId);
    var restaurant = document.getElementById(id);
    restaurant.addEventListener("click", function() {
        console.log("clicked");
        console.log(detailId);
        detail.classList.toggle('active');
    })
}
