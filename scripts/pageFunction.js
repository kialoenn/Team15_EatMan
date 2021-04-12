// $(document).ready(function () {
//     var items = $("#restaurantsList .container");
//     var numItems = items.length;
//     console.log(numItems);
//     var perPage = 4;

//     items.slice(perPage).hide();

//     $('#pagination-container').pagination({
//         items: numItems,
//         itemsOnPage: perPage,
//         prevText: "&laquo;",
//         nextText: "&raquo;",
//         onPageClick: function (pageNumber) {
//             var showFrom = perPage * (pageNumber - 1);
//             var showTo = showFrom + perPage;
//             items.hide().slice(showFrom, showTo).show();
//         }
//     });
// })