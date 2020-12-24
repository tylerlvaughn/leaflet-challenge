// Store the given API endpoint inside queryUrl
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Get Request for Data
d3.json(earthquakeURL, function(data) {
    createFeatures(data.features);
});
// Function to Run "onEach" Feature 
function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +"</h3><h3>Location: "+ feature.properties.place +
              "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
          },

          pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
              {radius: getRadius(feature.properties.mag),
              fillColor: getColor(feature.properties.mag),
              fillOpacity: .5,
              color: "black",
              stroke: true,
              weight: .8
          })
        }
        });

    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define Map Layers 
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mfatih72/ck30r72r818te1cruud5wk075/tiles/256/{z}/{x}/{y}?" + 
    "access_token=pk.eyJ1IjoibXVkaXRnIiwiYSI6ImNraWk2bDJvNTA2YnIyeG4wM3lnNXR6b2sifQ.7rTvaZN2pVRIl7QTb4vhMQ");

        
    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mfatih72/ck30rkku519fu1drmiimycohl/tiles/256/{z}/{x}/{y}?" + 
    "access_token=pk.eyJ1IjoibXVkaXRnIiwiYSI6ImNraWk2bDJvNTA2YnIyeG4wM3lnNXR6b2sifQ.7rTvaZN2pVRIl7QTb4vhMQ");
    
      // Base Maps
    var baseMaps = {
        "Light Map": lightMap,
        "Satellite": satellite
    };

    // Create Overlay Object
    var overlayMap = {
        "Earthquakes": earthquakes,
    };

    // Create Map
    var myMap = L.map("map", {
        center: [40.7, -94.5],
        zoom: 5,
        layers: [lightMap, earthquakes]
    });

    //Add Layer Control to Map
    L.control.layers(baseMaps, overlayMap, {
        collapsed: false
    }).addTo(myMap);

    // Create Legend
    var legend = L.control({
        position: "bottomleft"
    });

    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "info legend"),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
    };
    legend.addTo(myMap);
}

// Create Color Function
function getColor(magnitude) {
    if (magnitude > 5) {
        return 'purple'
    } else if (magnitude > 4) {
        return 'blue'
    } else if (magnitude > 3) {
        return 'green'
    } else if (magnitude > 2) {
        return 'orange'
    } else if (magnitude > 1) {
        return 'yellow'
    } else {
        return 'white'
    }
};

//Create Radius Function
function getRadius(magnitude) {
    return magnitude * 20000;
};