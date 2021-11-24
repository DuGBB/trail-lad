var formHandlerEl = function(event) {
    event.preventDefault();
    var cityStateInputEl = document.getElementById("location-input").value;
    // run api call next

    var parksApiUrl = "https://developer.nps.gov/api/v1/parks?limit=50&start=0&q=" + cityStateInputEl + "&api_key=xG0N7G0NIR00rad6uzGstrePJgkPJ12OyeOMTr9q";
    var foodApiUrl = "https://api.documenu.com/v2/restaurants/search/fields?state=" + cityStateInputEl + "&key=0d461c352166be6cd4a1a1e0925996b4";
    
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

    fetch(parksApiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data.data);
                for (i = 0; i < 4; i++) {
                    var lon = data.data[i].longitude;
                    var lat = data.data[i].latitude;
                    var name = data.data[i].name;
                    var zipCode = data.data[i].addresses[0].postalCode;
                    var descrip = data.data[i].description;

                    var parkNames = document.getElementById("park-list");
                    var parkNameList = document.createElement("div");
                    parkNameList.textContent = name;
                    parkNames.appendChild(parkNameList);

                   var parkLinks = document.createElement("p");
                   parkLinks.innerHTML = "<a href=https://api.documenu.com/v2/restaurants/" + zipCode + "&key=0d461c352166be6cd4a1a1e0925996b4> Link here </a>";
                   parkNames.appendChild(parkLinks);

                }
            })
        }
    });

    fetch(foodApiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
            })
        }

    });

    // when data comes in save in localStorage

    // display results in appropriate list

}

// if (document.getElementById("park-checkmark").checked = true) {
//     console.log(cityStateInputEl)
// }

document.getElementById("location").addEventListener("submit", formHandlerEl);