function profile() {
    var profile = db.collection("profile");


}
profile();
function editProfile() {
        document.getElementById("update").addEventListener('click', function() {
            firebase.auth().onAuthStateChanged(function (user) {

                var firstName = document.getElementById("firstName").value;
                var lastName = document.getElementById("lastName").value;
                var email = document.getElementById("email").value;
                var number = document.getElementById("number").value;

                db.collection("profile").doc("editProfile")
                .set({
                    "first": firstName,
                    "last": lastName,
                    "email": email,
                    "number": number
                }, {
                    merge: true
                })
                .then(location.reload())
            })
        })
}
editProfile();
