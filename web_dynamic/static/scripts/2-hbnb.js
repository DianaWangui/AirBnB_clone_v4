$(document).ready(init); 
const HOST = '54.237.118.67';
function init(){
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
    apiStatus();     
}

function apiStatus() {
    const url = `http://${HOST}:5001/api/v1/status/`
    $.get(url, function(response) {
        if (response.status === 'OK') {
            $('div#api_status').addClass('available');
        } else {
            $('div#api_status').removeClass('available');
        }
    });
}

