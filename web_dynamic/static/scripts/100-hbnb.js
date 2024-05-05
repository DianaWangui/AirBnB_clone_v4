$(document).ready(function() {
    const amenitiesChecked = {}; 
    const locationChecked = {};

    // Function to update amenities list
    function updateAmenityList() {
        let amenitiesList = Object.values(amenitiesChecked).join(", ");
        if (Object.keys(amenitiesChecked).length > 3) {
            // If more than 3 amenities are checked, replace the list with the first 3 amenities followed by "..."
            const firstThreeAmenities = Object.values(amenitiesChecked).slice(0, 3).join(", ");
            amenitiesList = firstThreeAmenities + ", ...";
        }
        $('.amenities h4').text(amenitiesList);
    }

    // Function to update location list
    function updateLocationList() {
        let locationList = "";
        for (const stateId in locationChecked) {
            locationList += locationChecked[stateId].stateName + ": ";
            locationList += locationChecked[stateId].cities.join(", ") + ", ";
        }
        locationList = locationList.slice(0, -2); // Remove the last comma and space
        $('.locations h4').text(locationList);


        // let locationList = Object.values(locationChecked).join(", ");
        // if (Object.keys(locationChecked).length > 2) {
        //     // If more than 2 locations are checked, replace the list with the first 2 location followed by "..."
        //     const firstTwoLocation = Object.values(locationChecked).slice(0, 2).join(", ");
        //     locationList = firstTwoLocation + ", ...";
        // }
        // $('.locations h4').text(locationList);
    }

    // checkbox change event hadler for amenity
    $('.amenities input[type="checkbox"]').change(function() {
        const amenityId = $(this).data('id');
        const amenityName = $(this).data('name');

        if ($(this).is(':checked')) {
            amenitiesChecked[amenityId] = amenityName;
            // console.log(amenitiesChecked);
        } else {
            delete amenitiesChecked[amenityId];
        }
        updateAmenityList();  
    });

    // checkbox change event hadler for location
    $('.locations .state-checkbox').change(function() {
        const stateId = $(this).data('id');
        const stateName = $(this).data('name');

        

        if ($(this).is(':checked')) {
            locationChecked[stateId] = { stateName: stateName, cities: [] };
        } else {
            delete locationChecked[stateId];
        }
        updateLocationList();
        console.log("State ID:", stateId);
        console.log("State Name:", stateName);
        console.log("locationChecked:", locationChecked);
    });

    // checkbox change event hadler for city
    $('.locations .city-checkbox').change(function() {
        const stateId = $(this).data('state-id');
        const cityId = $(this).data('id');
        const cityName = $(this).data('name');

        if (!(stateId in locationChecked)) {
            locationChecked[stateId] = { stateName: '', cities: [] };
        }

        if ($(this).is(':checked')) {
            locationChecked[stateId].cities.push(cityName);
        } else {
            const index = locationChecked[stateId].cities.indexOf(cityName);
            locationChecked[stateId].cities.splice(index, 1);
        }
        updateLocationList();
        // debugging
        console.log("State ID:", stateId);
        console.log("City ID:", cityId);
        console.log("City Name:", cityName);
        console.log("locationChecked:", locationChecked);
    });

    //Lets fetch data from backend
    function fetchPlaces() {
        const urlPlaces = 'http://localhost:5001/api/v1/places_search/'
        const amenities = Object.keys(amenitiesChecked);
        const locations = Object.keys(locationChecked);
        console.log(amenities);
        console.log(locations);

        return $.ajax({
            url: urlPlaces,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({amenities: amenities, locations: locations }),
            success: function(data) {
                renderPlaces(data);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    //Render places on the frontend
    function renderPlaces(places) {
        const placesSection = $('section.places');
        placesSection.empty(); // Clear places

        places.forEach(function(place) {
            const article = $('<article></article>');
            const titleBox = $('<div class="title_box"></div>');
            const title = `<h2>${place.name}</h2><div class="price_by_night">$${place.price_by_night}</div>`;
            titleBox.append(title);
            const information = $('<div class="information"></div>');
            const maxGuest = `<div class="max_guest">${place.max_guest} Guest(s)</div>`;
            const numberRooms = `<div class="number_rooms">${place.number_rooms} Bedroom(s)</div>`;
            const numberBathrooms = `<div class="number_bathrooms">${place.number_bathrooms} Bathroom(s)</div>`;
            information.append(maxGuest).append(numberRooms).append(numberBathrooms);
            const description = `<div class="description">${place.description}</div>`;
            article.append(titleBox).append(information).append(description);
            placesSection.append(article);
        });
    }

    //Click on search button
    $('.button').click(function() {
        fetchPlaces();
        console.log('clicked');
    });
    // check api status
    const url = 'http://localhost:5001/api/v1/status/'
    $.get(url, function(response) {
        if (response.status === 'OK') {
            $('div#api_status').addClass('available');
        } else {
            $('div#api_status').removeClass('available');
        }
    });
    // fetch all places at first
    fetchPlaces();
});
