function reviews() {
    var reviewsRef = db.collection("reviews");
    reviewsRef.add({
        review: "Wait was very long, don't know if I will visit again"
    })
}
reviews();

function showReviews() {
    db.collection("reviews")
    .get()
    .then(function (snap) {
        snap.forEach(function(doc) {
            var review = doc.data().review;

            var codestring = '<div class="card">' + '<div class="card-body">' +
              review + '</div>' + '</div>';

              //append with jquery to DOM
              $("$reviewsHere").append(codestring);
        })
    })
}

showReviews();

function getReviews() {
    document.getElementById("submit").addEventListener('click', function() {
        firebase.auth().onAuthStateChanged(function (user) {
            var review = document.getElementById("submission").value;


            db.collection("reviews")
            .add({
                "review": review
            })
        })
    })
}

getReviews();