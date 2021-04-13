function getPattern() {
    const parsedUrl = new URL(window.location.href);
    var id = parsedUrl.searchParams.get("id");
    queryDetail(id);
}
getPattern();

function queryDetail(id) {
    db.collection("restaurants")
        .doc(id)
        .get()
        .then(function (doc) {
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
                    hourStatus += '"text-success">Open' + '</h6><div class="d-flex flex-column mt-4">' + 
                        '</div></div></div></div></div></div>';
                    queueReady = false;
                } else {
                    hourStatus += '"text-success">Open' + '</h6><div class="d-flex flex-column mt-4">' +
                        '</div></div></div></div></div></div>';
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
            $("#restaurantDetail").append('<div class="container mt-5 mb-5"><div class="d-flex justify-content-center row"><div class="col-md-15">' +
                '<div class="row p-2 bg-white border rounded"><div class="col-md-3 mt-1"><img class="img-fluid img-responsive rounded" src="./images/' +
                image + '"></div><div class="col-md-6 mt-1"><h3>' + name + star +
                '<div class="mt-1 mb-1 spec-1">' + cusineHtml + '</span></div><div class="mt-1 mb-1 spec-1">' + price + '</div>' +
                '<div class="mt-1 mb-1 spec-1">' + address + '</div>' + '<div class="mt-1 mb-1 spec-1">' + phone + '</div>' + '</div><div class="align-items-center align-content-center col-md-3 border-left mt-1"><div class="d-flex flex-row align-items-center">' +
                '<h4 class="mr-1">' + queueStatus + '</h4></h4></div><h6 class=' + hourStatus);
            $('#restaurantDetail').append("<h1 class = 'display-4'>Reviews:</h1>");
            db.collection("reviews")
            .get()
            .then(function(snap) {
                snap.forEach(function( doc) {
                    $('#restaurantDetail').append("<hr><h1 class = 'display-6'>"+ doc.data().review +"</h1>");
                })                                
            })
            var starTotal = 5;
            var rating = doc.data().rating;
            const starPercentage = (rating / starTotal) * 100;
            const starPercentageRounded = `${(Math.round(starPercentage / 10) * 10)}%`;
            document.querySelector(`.${partName} .stars-inner`).style.width = starPercentageRounded;
            if (queueReady) {
                //getUserQueueReady(doc.id);
            }
        })
}

