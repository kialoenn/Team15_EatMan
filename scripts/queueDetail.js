/**
 * Author: Man Sun
 */

/**
 * Check if user is login or not, direct to login page if not.
 */
function checkUserStatus() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            checkUserQueue(user.uid);
        } else {
            window.location.href = "./login.html";
        }
    })
}

checkUserStatus();

/**
 * This function check if user is currently in any queue. Prompt meeage if not
 * @param uid user id 
 */
function checkUserQueue(uid) {
    db.collection("users")
        .doc(uid)
        .get()
        .then(function (doc) {
            var queueRestaurant = doc.data().currentQueue;
            if (queueRestaurant != "") {
                displayUserQueue(queueRestaurant, uid, doc.data().name, doc.data().partySize);
            } else {
                $('#queueStatus').html("<h1 class = 'display-4'>You do not have any active queue at this time</h1>");
            }
        })
}

/**
 * This function display the active user queue status, and provide user two buttons that can 
 * cancel or confirm the queue.
 * @param ownerId restaurant id
 * @param  userId user id
 * @param  userName  user name
 * @param  partySize party size in integer
 */
function displayUserQueue(ownerId, userId, userName, partySize) {
    db.collection("restaurants")
        .doc(ownerId)
        .get() // Read the restaurant 
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
            var queueStatus = "";
            hourStatus += '"text-success">Open' + '</h6><div class="d-flex flex-column mt-4">' + '<button id="cancel" class="btn btn-primary btn-sm" type="button">Cancel</button> <br>' +
                '<button class="btn btn-primary btn-lg" type="button" id = "confirm">Confirm</button></div></div></div></div></div></div>';

            queueStatus = queue + " Minutes &#128337";

            var address = doc.data().address;
            var phone = doc.data().phone;
            var partName = name.slice(0, 3);
            var star = '</h3><div class="stars-outer ' + partName + '"><div class="stars-inner"></div></div>';
            $("#queueStatus").append('<div class="container mt-5 mb-5"><div class="d-flex justify-content-center row"><div class="col-md-15">' +
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

            /**
             * This function check if user click cancel or confirm
             * and Prompt user, and delete user in queue and add them to either cancel or confirm of restaurant
             */
            async function checkConfirmStatus() {
                $('#cancel').on('click', function () {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert the reversion!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, cancle it!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            deleteUserQueue(ownerId, userId, userName, partySize); // Delete user in queue
                            resetQueue(userId, false, ownerId, userName); // reset user queue status
                            Swal.fire(
                                'Cancled!',
                                'Your reservation has been cancled.',
                                'success'
                            ).then(function() {
                                window.location.reload();
                            })
                        }
                    })
                })

                $('#confirm').on('click', function () {
                    Swal.fire({
                        title: 'Have you arrived at the restaurant?',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes!',
                        cancelButtonText: "Not Yet...",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            deleteUserQueue(ownerId, userId, userName, partySize); // Delete user in queue
                            resetQueue(userId, true, ownerId, userName); // reset user queue status
                            Swal.fire(
                                'Arrived',
                                'Thank you for using our App!',
                                'success'
                            ).then(function() {
                                window.location.reload();
                            })
                        }
                    })
                })
            }
            checkConfirmStatus();

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
                            .onSnapshot(function (doc) {  // Check the DB when it's changed
                                if (doc.data().queue[0]) { 
                                    console.log(doc.data().queue[0]);
                                    if (doc.data().queue[0].id == user.uid) { // If user is at first of queue list
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
                                            deleteUserQueue(queueId, user.uid, userName, partySize); // Delete user in queue
                                            if (result.isConfirmed) { // If user click confirm ,the queue is completed
                                                Swal.fire('Thank you for using our App!', '', 'success');
                                                resetQueue(user.uid, true, queueId, userName); // reset user queue status
                                                $('#queueStatus').html("<h1 class = 'display-4'>You do not have any active queue at this time</h1>");
                                            } else if (result.isDenied) { // If user click on the way, notify the restaurant owner
                                                Swal.fire('Take your time, we will notify the host ~!', '', 'info')
                                                    .then(function () {
                                                        notifyOwner(queueId, user.uid, userName, partySize); // Notify the owner that user in on the way
                                                    });
                                            } else { // If user click cancle, delete the user in the queue
                                                Swal.fire('Your resercation is cancled!', '', 'info');
                                                resetQueue(user.uid, false, queueId, userName); // reset user queue status
                                                $('#queueStatus').html("<h1 class = 'display-4'>You do not have any active queue at this time</h1>");
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
    } else {

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

        updateInfo.update({ // Update the confirm array
            cancle: firebase.firestore.FieldValue.arrayUnion({
                name: userName,
                visited: time,
            }),
            hold: firebase.firestore.FieldValue.arrayRemove({
                id: userId,
                name: userName,
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
function notifyOwner(ownerId, userId, userName, partySize) {
    var time = firebase.firestore.Timestamp.now();
    db.collection("restaurants")
        .doc(ownerId)
        .update({ // Update the hold array
            hold: firebase.firestore.FieldValue.arrayUnion({ // Notice that the queueCount is not updated, because user is still in the queue
                name: userName,
                id: userId,
                size: partySize,
                visited: time,
            }),
        })
}