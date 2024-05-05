$(document).ready(function() {
    const amenitiesChecked = {}; 
    $('input[type="checkbox"]').change(function() {
        const amenityId = $(this).data('id');
        const amenityName = $(this).data('name');

        if ($(this).is(':checked')) {
            amenitiesChecked[amenityId] = amenityName;
        } else {
            delete amenitiesChecked[amenityId];
        }
        let amenitiesList = Object.values(amenitiesChecked).join(", ");
        if (Object.keys(amenitiesChecked).length > 3) {
            // If more than 3 amenities are checked, replace the list with the first 3 amenities followed by "..."
            const firstThreeAmenities = Object.values(amenitiesChecked).slice(0, 3).join(", ");
            amenitiesList = firstThreeAmenities + ", ...";
        }
        $('.amenities h4').text(amenitiesList);
    });
    const url = 'http://localhost:5001/api/v1/status/'
    $.get(url, function(response) {
        if (response.status === 'OK') {
            $('div#api_status').addClass('available');
        } else {
            $('div#api_status').removeClass('available');
        }
    });
    const urlPlaces = 'http://localhost:5001/api/v1/places_search/';
    $.post({
        url: urlPlaces,
        contentType: 'application/json',
        data: JSON.stringify({}),
        success: function(data) {
            for (const place of data) {
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
                $('section.places').append(article);
            }
        }
    });
});