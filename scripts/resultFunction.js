function getPattern() {
    const parsedUrl = new URL(window.location.href);
    var pattern = parsedUrl.searchParams.get("pattern");
    $('#resultPrompt').html("Your Search for " + pattern + ":");
    queryResultByName(pattern);
    queryResultByCuisine(pattern);
}
getPattern();


function queryResultByName(pattern) {
    db.collection("restaurants")
        .where("name", "==", pattern)
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                getRestaurantDetail(doc.data(), doc.id);
            })
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
    console.log(data.hours.end);
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

    displayRestautant(image, name, cusineHtml, price, hourStatus, queueStatus, queueReady, id);
}

function displayRestautant(image, name, cusineHtml, price, hourStatus, queueStatus, queueReady, id) {
    $("#result").append('<div class="container mt-5 mb-5"><div class="d-flex justify-content-center row"><div class="col-md-15">' +
        '<div class="row p-2 bg-white border rounded"><div class="col-md-3 mt-1"><img class="img-fluid img-responsive rounded" src="./images/' +
        image + '"></div><div class="col-md-6 mt-1"><h3>' + name + '</h3><div class="stars-outer"><div class="stars-inner"></div></div>' +
        '<div class="mt-1 mb-1 spec-1">' + cusineHtml + '</span></div><div class="mt-1 mb-1 spec-1">' + price + '</div></div><div class="align-items-center align-content-center col-md-3 border-left mt-1"><div class="d-flex flex-row align-items-center">' +
        '<h4 class="mr-1">' + queueStatus + '</h4></div><h6 class=' + hourStatus);
    addRestaurantListener(id);
    if (queueReady) {
        getUserQueueReady(id);
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
                    if (queueId != "") {
                        console.log(queueId);
                        db.collection("restaurants")
                            .doc(queueId)
                            .onSnapshot(function (doc) {
                                if (doc.data().queue[0]) {
                                    console.log(doc.data().queue[0]);
                                    if (doc.data().queue[0].id == user.uid) {
                                        var partySize = doc.data().queue[0].size;
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