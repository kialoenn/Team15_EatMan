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

function displayUserQueue(ownerId, userId, userName, partySize) {
    db.collection("restaurants")
        .doc(ownerId)
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
            var queueStatus = "";
            hourStatus += '"text-success">Open' + '</h6><div class="d-flex flex-column mt-4">' + '<button id="cancel" class="btn btn-primary btn-sm" type="button">Cancle</button> <br>' +
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

            async function checkConfirmStatus() {
                $('#cancle').on('click', function () {
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
                            deleteUserQueue(ownerId, userId, userName, partySize);
                            resetQueue(userId, false, ownerId, userName);
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
                            deleteUserQueue(ownerId, userId, userName, partySize);
                            resetQueue(userId, true, ownerId, userName);
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
                                                $('#queueStatus').html("<h1 class = 'display-4'>You do not have any active queue at this time</h1>");
                                            } else if (result.isDenied) {
                                                Swal.fire('Take your time, we will notify the host ~!', '', 'info')
                                                    .then(function () {
                                                        notifyOwner(queueId, user.uid, userName, partySize);
                                                    });
                                            } else {
                                                Swal.fire('Your resercation is cancled!', '', 'info');
                                                resetQueue(user.uid, false, queueId, userName);
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
            updateConfirmList(currentQueue, true, userName, userId);
        })
    } else {

        var updateInfo = db.collection("users")
            .doc(userId);
        updateInfo.update({
            currentQueue: "",
        }).then(function () {
            updateConfirmList(currentQueue, false, userName, userId);
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

function updateConfirmList(ownerId, arrival, userName, userId) {
    if (arrival) {
        var updateInfo = db.collection("restaurants")
            .doc(ownerId);

        var time = firebase.firestore.Timestamp.now();

        updateInfo.update({
            confirm: firebase.firestore.FieldValue.arrayUnion({
                name: userName,
                visited: time,
            }),
            hold: firebase.firestore.FieldValue.arrayRemove({
                id: userId,
                name: userName,
            })
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
            hold: firebase.firestore.FieldValue.arrayRemove({
                id: userId,
                name: userName,
            })
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