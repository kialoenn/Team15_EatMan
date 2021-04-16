/**
 * Author: Man Sun
 */

$(document).ready(function () {
    /**
     * This function will direct user to search result page is user click the search button
     */
    function getSearch() {
        document.getElementById("searchButton").addEventListener('click', function () {
            var pattern = document.getElementById("pattern").value;
            window.location.href = "./result.html?pattern=" + pattern;
            //queryResultByCuisine(pattern);
        })
    }
    getSearch();
})