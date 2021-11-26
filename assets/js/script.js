var global = {};
var formHandlerEl = function (event) {
    console.log("hello");
    event.preventDefault();
    var cityStateInputEl = document.getElementById("location-input").value;
    // run api call next

    var parksApiUrl = "https://developer.nps.gov/api/v1/parks?limit=50&start=0&q=" + cityStateInputEl + "&api_key=xG0N7G0NIR00rad6uzGstrePJgkPJ12OyeOMTr9q";


    //grabbing the state of the checkboxes no matter if they are checked or unchecked
    var parkCheck = document.getElementById("park-checkmark").checked;
    var diningCheck = document.getElementById("dining-checkmark").checked;
    var lodgingCheck = document.getElementById("lodging-checkmark").checked;

    fetch(parksApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data.data);
                for (i = 0; i < 30; i++) {
                    var name = data.data[i].name;
                    global.zipCode = data.data[i].addresses[0].postalCode;
                    var descrip = data.data[i].description;

                    var parkNames = document.getElementById("park-list");
                    var parkNameList = document.createElement("li");
                    parkNameList.setAttribute("class", "text-xl")
                    parkNameList.setAttribute("class", "font-bold");
                    parkNameList.textContent = name;
                    parkNames.appendChild(parkNameList);

                    var parkLinks = document.createElement("p");
                    parkLinks.innerHTML = "<button data-zipcode = '" + global.zipCode + "'>Click To See Nearby Dining</button>";
                    parkNames.appendChild(parkLinks);
                   
                    var parksDescrip = document.createElement("p");
                    parksDescrip.innerText = descrip;
                    parkNames.appendChild(parksDescrip);
                

                }
            })
        }
    });
}

function displayFoodData(foodData) {//created function to display restaurant data to page
    var oldDiningList = document.getElementById("dining-list");//grabbing existing element
    var newDiningList = document.createElement("ul");//creating new element
    newDiningList.setAttribute("id", "dining-list");
    newDiningList.setAttribute("class", "list-container");
    for (i = 0; i < foodData.data.length; i++) {//displaying individual restaurant data
        let name = foodData.data[i].restaurant_name;
        let address = foodData.data[i].address.formatted;
        let number = foodData.data[i].restaurant_phone;
        let webSite = foodData.data[i].restaurant_website;
        let descrip = foodData.data[i].cuisines;
        let infoDiv = document.createElement("div");
        infoDiv.innerHTML = name + "<br>" + address + "<br>" + number + "<br>" + webSite + "<br>" + descrip;
        let listItem = document.createElement("li");
        listItem.setAttribute("class", "list-items");
        listItem.appendChild(infoDiv);
        newDiningList.appendChild(listItem);

}
    oldDiningList.parentElement.replaceChild(newDiningList, oldDiningList);//replacing existing element with new element
}

document.getElementById("park-list").addEventListener("click", foodHandler);
function foodHandler (event) {
    var button = event.target;
    var zipCode = button.getAttribute("data-zipcode");
    console.log(zipCode);
    event.preventDefault();
    
    var foodApiUrl = `https://api.documenu.com/v2/restaurants/zip_code/${zipCode}?size=5&key=0d461c352166be6cd4a1a1e0925996b4`;
    fetch(foodApiUrl).then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);

                })
            }
        }


    )

};



document.getElementById("formInput").addEventListener("submit", formHandlerEl);