/**
 * Author: Man Sun
 */

 /**
  * This function get the search keyword stored in the url,
  * and pass the string to query function for searching.
  */
function getPattern() {
    const parsedUrl = new URL(window.location.href);
    var pattern = parsedUrl.searchParams.get("pattern");
    $('#resultPrompt').html("Your Search for " + pattern + ":");
    queryResultByName(pattern);
    queryResultByCuisine(pattern);
}
getPattern();

/**
 * This will pass the restaurant information based on search string
 * @param  pattern the string get from search 
 */
function queryResultByName(pattern) {
    db.collection("restaurants")
        .where("name", "==", pattern) // Find if there's match between user search and restaurant name
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                getRestaurantDetail(doc.data(), doc.id);
            })
        })
}

/**
 * This will pass the restaurant information based on search string
 * @param  pattern the string get from search 
 */
function queryResultByCuisine(pattern) {
    var type = [pattern];
    db.collection("restaurants")
        .where("cuisine", "array-contains-any", type) // Find if there's match between user search and cuisin type
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                getRestaurantDetail(doc.data(), doc.id);
            })
        })
}

/**
 * This function will display the restaurant information
 * @param data The array list that contain the restaurant data 
 * @param  id  the restaurant id
 */
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