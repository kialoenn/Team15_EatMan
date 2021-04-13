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

function displayQueue(id) {
    firebase.auth().onAuthStateChanged(function (owner) {
        if (owner) {
            db.collection("restaurants")
                .doc(id)
                .onSnapshot(function (doc) {
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

function confirmListener() {
    firebase.auth().onAuthStateChanged(function (owner) {
        if (owner) {
            db.collection("restaurants")
                .doc(owner.uid)
                .onSnapshot(function (doc) {
                    var confirm = doc.data().hold;
                    console.log(confirm.name);
                    var info = "<ol>";
                    if (confirm.length > 0) {
                        confirm.forEach(function (guest){
                            console.log(guest.name);
                            info += "<li>" + guest.name + " is on the way!</li>";
                        }) 
                    }
                    info += "</ol>";
                    $("#holdList").html(info);
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
                    queue: firebase.firestore.FieldValue.arrayUnion({name: "Guest waiting outside", id: Date.now(), size: "N/A"}),
                    queueCount: firebase.firestore.FieldValue.increment(1),
                })
                .then(function() {
                    displayQueue(id);
                    confirmListener();
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
            var newQueue = [];
            if (old.length > 1) {
                newQueue = old.slice(1);
            }
            
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
                    confirmListener();
                })
            }



        })
    })
}