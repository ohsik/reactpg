//https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
window.initMap = function() {

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.0778738, lng: -118.3780315},
    zoom: 8
  });

  var input = /** @type {!HTMLInputElement} */(document.getElementById('pac-input'));

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindow.setContent('<div class="infowindow"><h2>' + place.name + '</h2><p>' + address + '</p><p><button onclick="save_it()">Save it as your favorite restaurant</button></p></div>');
    infowindow.open(map, marker);

    // test | add a save button
    var user_place = place;
    window.save_it = function(){
      enterEmail();
      console.log(user_place);
    }

    // Append email form to save data with email address
    // TODO: save it on DB firebase
    window.enterEmail = function(){
      var getEmail = document.createElement('div');
      getEmail.id = 'get_email';
      getEmail.className = 'get-email';

      // Create the inner div before appending to the body
      var input = document.createElement("input");
      input.type = "email";
      input.name = "user_email";
      input.id = "user_email";
      input.placeholder = "Enter your email address";

      var submit = document.createElement("input");
      submit.type = "button";
      submit.id = "email_submit";
      submit.value = "Save";

      // The variable getEmail is still good... Just append to it.
      getEmail.appendChild(input);
      getEmail.appendChild(submit);

      // Then append the whole thing onto the body
      document.getElementById('content_wrap').appendChild(getEmail);
    }


  }); //autocomplete

} //initMap
