var formHandlerEl = async function (event) {//added async keyword to formHandlerEl function to gicve API URL time to load
    event.preventDefault();
    restFoodData();
    var cityStateInputEl = document.getElementById("location-input").value;
    // run api call next

    var parksApiUrl = "https://developer.nps.gov/api/v1/parks?limit=10&start=0&q=" + cityStateInputEl + "&api_key=xG0N7G0NIR00rad6uzGstrePJgkPJ12OyeOMTr9q";


    //grabbing the state of the checkboxes no matter if they are checked or unchecked
    //var parkCheck = document.getElementById("park-checkmark").checked;
    //var diningCheck = document.getElementById("dining-checkmark").checked;
    //var lodgingCheck = document.getElementById("lodging-checkmark").checked;

    fetch(parksApiUrl).then(async function (response) {//added async keyword to anonymous function to allow time for the API to load
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data.data);
                var oldParkList = document.getElementById("park-list");//created to avoid apending bug(it didn't reset list of parks when new state was chosen)
                let parkNames = document.createElement("ul");//moved outside for loop to create list container once, instead of repeatedly
                parkNames.setAttribute("class", "list-container");//set attributes to style correctly
                parkNames.setAttribute("id", "park-list");
                for (i = 0; i < data.data.length; i++) {//using data.data.length instead of hardcoded 30 to eliminate uncaught reference in returns < 30
                    let name = data.data[i].name;//changed vars to lets to avoid hoisting issues
                    let zipCode = data.data[i].addresses[0].postalCode;
                    let descrip = data.data[i].description;
                    let parkNameList = document.createElement("li");
                    parkNameList.setAttribute("class", "text-xl italic")
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
                oldParkList.parentElement.replaceChild(parkNames, oldParkList);//resets park list
            })
        } else {//The NPS API does not return information on Oregon, so I put this here to be able to capture errors and provide feedback to the National Parks API 
            var errorEvent = localStorage.getItem("Error Event");
            if (errorEvent === null) {
                errorEvent = [];
            } else {
                errorEvent = JSON.parse(errorEvent);
            }
            errorEvent.push(cityStateInputEl);
            localStorage["stateError"] = JSON.stringify(errorEvent);
            var oldParkList = document.getElementById("park-list");
            let parkNames = document.createElement("ul");
            var listItem = document.createElement("li");
            listItem.innerHTML = "Due to circumstances beyond our control, we can not display the requested information.";
            parkNames.appendChild(listItem);
            parkNames.setAttribute("class", "list-container");
            parkNames.setAttribute("id", "park-list");
            oldParkList.parentElement.replaceChild(parkNames, oldParkList);
        }
    });
}

function dropDownSetup() {//created function to create drop down menu of states instead of using input method
    var stateInitials = ["AL",
    "AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
    localStorage["stateAbbr"] = JSON.stringify(stateInitials);
    var oldDropDown = document.getElementById("location-input");
    var dropDown = document.createElement("select");
    dropDown.setAttribute("id", "location-input");
    dropDown.setAttribute("class", "bg-gray-400 m-2 rounded p-2 font-semibold");
    for (let index = 0; index < stateInitials.length; index++) {
        const stateInitialsEl = stateInitials[index];
        let optionEl = document.createElement("option");
        optionEl.textContent = stateInitialsEl;
        optionEl.value = stateInitialsEl;
        dropDown.appendChild(optionEl);
    }
    oldDropDown.parentElement.replaceChild(dropDown, oldDropDown);
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
        infoDiv.innerHTML = `<strong>${name}</strong><br>${address}<br>${number}<br><a href=${webSite}>Visit Website</a><br>${descrip}<br>`;
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

dropDownSetup();
