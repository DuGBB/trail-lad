var formHandlerEl = function(event) {
    event.preventDefault();
    var cityStateInputEl = document.getElementById("location-input").value;
    // run api call next

    var apiUrl = "https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=xG0N7G0NIR00rad6uzGstrePJgkPJ12OyeOMTr9q";
    //grabbing users search input
    var searchLocation = document.getElementById("location-input").value;
    console.log(searchLocation);
    //grabbing the state of the checkboxes no matter if they are checked or unchecked
    var parkCheck = document.getElementById("park-checkmark").checked;
    var diningCheck = document.getElementById("dining-checkmark").checked;
    var lodgingCheck = document.getElementById("lodging-checkmark").checked;
    console.log(parkCheck);
    console.log(diningCheck);
    console.log(lodgingCheck);

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