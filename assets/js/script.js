var formHandlerEl = async function (event) {//added async keyword to formHandlerEl function to gicve API URL time to load
    event.preventDefault();
    restFoodData();
    var cityStateInputEl = document.getElementById("location-input").value;
    // run api call next

    var parksApiUrl = "https://developer.nps.gov/api/v1/parks?limit=50&start=0&q=" + cityStateInputEl + "&api_key=xG0N7G0NIR00rad6uzGstrePJgkPJ12OyeOMTr9q";


    //grabbing the state of the checkboxes no matter if they are checked or unchecked
    var parkCheck = document.getElementById("park-checkmark").checked;
    var diningCheck = document.getElementById("dining-checkmark").checked;
    //var lodgingCheck = document.getElementById("lodging-checkmark").checked;

    fetch(parksApiUrl).then(async function (response) {//added async keyword to anonymous function to allow time for the API to load
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data.data);
                for (i = 0; i < data.data.length; i++) {//using data.data.length instead of hardcoded 30 to eliminate uncaught reference in returns < 30
                    let name = data.data[i].name;//changed vars to lets to avoid hoisting issues
                    let zipCode = data.data[i].addresses[0].postalCode;
                    let descrip = data.data[i].description;

                    let parkNames = document.getElementById("park-list");
                    let parkNameList = document.createElement("li");
                    parkNameList.setAttribute("class", "text-xl")
                    parkNameList.setAttribute("class", "font-bold");
                    parkNameList.textContent = name;
                    parkNames.appendChild(parkNameList);

                    let parkLinks = document.createElement("button");//changed p to button to make it look like a button
                    parkLinks.innerHTML = "Nearby Dining";
                    parkLinks.setAttribute("id", name);//added id and class to help style restaurant buttons
                    parkLinks.setAttribute("class", "bg-gray-400 m-2 rounded p-2 font-semibold");//copied submit button style to make all buttone uniform
                    parkLinks.addEventListener("click", function () {
                        getRestaurantData(zipCode);
                    })
                    parkNames.appendChild(parkLinks);
                   
                    let parksDescrip = document.createElement("p");
                    parksDescrip.innerText = descrip;
                    parkNames.appendChild(parksDescrip);
                

                }
            })
        }
    });
}

async function getRestaurantData(zipCode) {//gets data from foodHandler to display on screen
    var restaurantData = await foodHandler(zipCode);
    displayFoodData(restaurantData);
}

function displayFoodData(foodData) {//created function to display restaurant data to page
    var oldDiningList = document.getElementById("dining-list");//grabbing existing element
    var newDiningList = document.createElement("ul");//creating new element
    newDiningList.setAttribute("id", "dining-list");
    newDiningList.setAttribute("class", "list-container");
    if (foodData.data.length === 0) {
        var noData = document.createElement("li");
        noData.innerHTML = "No Nearby Restaurants";
        newDiningList.appendChild(noData);
    }

    for (i = 0; i < foodData.data.length; i++) {//displaying individual restaurant data
        let name = foodData.data[i].restaurant_name;
        let address = foodData.data[i].address.formatted;
        let number = foodData.data[i].restaurant_phone;
        let webSite = foodData.data[i].restaurant_website;
        let descrip = foodData.data[i].cuisines;
        let infoDiv = document.createElement("div");
        infoDiv.innerHTML = `${name}<br>${address}<br>${number}<br>${webSite}<br>${descrip}<br>`;
        let listItem = document.createElement("li");
        listItem.setAttribute("class", "list-items");
        listItem.appendChild(infoDiv);
        newDiningList.appendChild(listItem);

}
    oldDiningList.parentElement.replaceChild(newDiningList, oldDiningList);//replacing existing element with new element
}

document.getElementById("park-list").addEventListener("click", foodHandler);

function restFoodData() {
    var oldFoodData = document.getElementById("dining-list");
    var newFoodData = document.createElement("ul");
    newFoodData.setAttribute("id", "dining-list");
    newFoodData.setAttribute("class", "list-container");
    oldFoodData.parentElement.replaceChild(newFoodData, oldFoodData);
}

async function foodHandler(zipCode) {//using axios(node stuff that we havent learned in class yet)to call ednPoint API
    var foodApiUrl = `https://api.documenu.com/v2/restaurants/zip_code/${zipCode}?size=5&key=0d461c352166be6cd4a1a1e0925996b4`;
    return new Promise(function (resolve, reject) {
        axios.get(foodApiUrl).then(
            (response) => {
                var result = response.data;
                console.log("Processing Restaurant Request");
                resolve(result);
                console.log(result);
            },
                (error) => {
                reject(error);
            }
        );
    });
}

document.getElementById("formInput").addEventListener("submit", formHandlerEl);