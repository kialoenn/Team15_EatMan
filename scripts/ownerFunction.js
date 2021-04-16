/**
 * Author Man Sun
 */

/**
 * This will check owner login status and display the information that owner need
 */
function displayOwner() {
    firebase.auth().onAuthStateChanged(function (owner) {
        if (owner) {
            db.collection("restaurants")
                .doc(owner.uid)
                .get()
                .then(function (doc) {
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

/**
 * This will display the customer queue list dynamically.
 * @param id restaurant id
 */
function displayQueue(id) {
    firebase.auth().onAuthStateChanged(function (owner) {
        if (owner) {
            db.collection("restaurants")
                .doc(id)
                .onSnapshot(function (doc) { // User onSnapshot to check the queue every time the DB is changed
                    var queue = doc.data().queue;
                    var info = "<ol>";
                    queue.forEach(function (guest) {
                        if (guest.size != "N/A") {
                            info += "<li><pre>" + guest.name + "                   PartySize: " + guest.size + "     </pre></li>";
                        } else {
                            info += "<li>" + guest.name + "</li>";
                        }
                        
                    })
                    info += "</ol>";
                    $("#queueList").html(info);
                    
                })
        }
    })
}

/**
 * This will notify the owner if user clicked on the way.
 */
function confirmListener() {
    firebase.auth().onAuthStateChanged(function (owner) {
        if (owner) {
            db.collection("restaurants")
                .doc(owner.uid)
                .onSnapshot(function (doc) {
                    var confirm = doc.data().hold;
                    var info = "<ol>";
                    if (confirm.length > 0) {
                        confirm.forEach(function (guest){
                            info += "<li>" + guest.name + " is on the way!</li>";
                        }) 
                    }
                    info += "</ol>";
                    $("#holdList").html(info);
                })
        }
    })
}

/**
 * This will add a button listener, when there's someone waiting outside of
 * restaurant in person, owner will click the add queue button to increment
 * the queue size. The data will be written to the database.
 * Since there's no need to record the in person customer data, I set the
 * default name, and set the id ad the date that owner click the button. 
 * Since array cannot take same value, the id must be unique, use date()
 * is a good option here.
 * @param id restaurant id 
 */
function addInHouseQueueListener(id) {
    var add = document.getElementById("addQueue");
    add.addEventListener("click", function() {
        db.collection("restaurants")
                .doc(id)
                .update({
                    queue: firebase.firestore.FieldValue.arrayUnion({name: "Guest waiting outside", id: Date.now(), size: "N/A"}),
                    queueCount: firebase.firestore.FieldValue.increment(1),
                })
                .then(function() {
                    displayQueue(id);
                    confirmListener();
                })
    })
}

/**
 * This will add a button listener, when it is time for the first guest
 * waiting in the queue to get into the restaurant, owner will need to click
 * this button to pop out the first guest.
 * @param id restaurant id
 */
function addRemoveQueueListener(id) {
    var remove = document.getElementById("removeQueue");
    remove.addEventListener("click", function() {
        var old;
        db.collection("restaurants")
        .doc(id)
        .get() // Read the restaurant DB
        .then(function(doc) {
            
            // Since firebase does not support remove the element by index
            // I have to copy the data into temporary array, and slice the temp array to 
            // actually remove the first guest.
            old = doc.data().queue;
            var newQueue = [];
            if (old.length > 1) {
                newQueue = old.slice(1);
            }
            
            var count = doc.data().queueCount;
            if (count > 0) {
                db.collection("restaurants")
                .doc(id)
                .update({ // Remove the first guest in queue
                    queue: newQueue,
                    queueCount: firebase.firestore.FieldValue.increment(-1)
                })
                .then(function() {
                    displayQueue(id);
                    confirmListener();
                })
            }
        })
    })
}