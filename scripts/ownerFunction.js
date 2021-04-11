function displayOwner() {
    firebase.auth().onAuthStateChanged(function (owner) {
        if (owner) {
            db.collection("restaurants")
                .doc(owner.uid)
                .get()
                .then(function (doc) {
                    console.log();
                    var name = doc.data().name;
                    $("#restaurantName").text(name);
                    displayQueue(owner.uid);
                    addInHouseQueueListener(owner.uid);
                    addRemoveQueueListener(owner.uid);
                })
        }
    })
}
displayOwner();

function displayQueue(id) {
    firebase.auth().onAuthStateChanged(function (owner) {
        if (owner) {
            db.collection("restaurants")
                .doc(id)
                .onSnapshot(function (doc) {
                    var queue = doc.data().queue;
                    var t1 = "<ol>";
                    queue.forEach(function (guest) {
                        t1 += "<li>" + guest.name + "</li>";
                    })
                    t1 += "</ol>";
                    $("#queueList").html(t1);
                    
                })
        }
    })
}

function addInHouseQueueListener(id) {
    var add = document.getElementById("addQueue");
    add.addEventListener("click", function() {
        console.log("click");
        db.collection("restaurants")
                .doc(id)
                .update({
                    queue: firebase.firestore.FieldValue.arrayUnion({name: "guest", id: Date.now()}),
                    queueCount: firebase.firestore.FieldValue.increment(1)
                })
                .then(function() {
                    displayQueue(id);
                })
    })
}

function addRemoveQueueListener(id) {
    var remove = document.getElementById("removeQueue");
    remove.addEventListener("click", function() {
        console.log("click");
        var old;
        db.collection("restaurants")
        .doc(id)
        .get()
        .then(function(doc) {
            
            old = doc.data().queue;
            var newQueue = old.slice(1);
            var count = doc.data().queueCount;
            if (count > 0) {
                db.collection("restaurants")
                .doc(id)
                .update({
                    queue: newQueue,
                    queueCount: firebase.firestore.FieldValue.increment(-1)
                })
                .then(function() {
                    displayQueue(id);
                })
            }



        })

        // db.collection("restaurants")
        //         .doc(id)
        //         .update({
        //             queue: firebase.firestore.FieldValue.delete(),
        //         })
        //         .then(function() {
        //             displayQueue(id);
        //         })
    })
}