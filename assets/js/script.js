var formHandlerEl = function(event) {
    event.preventDefault();
    var cityStateInputEl = document.getElementById("location-input").value;
    // run api call next
    

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(response);
            })
        }
    })
    // when data comes in save in localStorage

    // display results in appropriate list

}

// if (document.getElementById("park-checkmark").checked = true) {
//     console.log(cityStateInputEl)
// }

document.getElementById("location").addEventListener("submit", formHandlerEl);