$(document).ready(function () {
    console.log("read");

    function getSearch() {
        document.getElementById("searchButton").addEventListener('click', function () {
            var pattern = document.getElementById("pattern").value;
            window.location.href = "./result.html?pattern=" + pattern;
            //queryResultByCuisine(pattern);
        })
    }
    getSearch();

    function queryResultByName(pattern) {
        db.collection("restaurants")
            .where("name", "==", pattern)
            .get()
            .then(function (snap) {
                snap.forEach(function (doc) {

                })
            })

    }
})