// define url to earthquakes over the last 7 days
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// create map centered around Los Angeles
let worldmap = L.map("map", {
    center: [34.05, -118.24],
    zoom:4
});

//Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(worldmap);

//Define function to determine color based on depth of earthquake
function chooseColor(depth) {
    if (depth < 10) return "lightyellow";
    else if (depth <30) return "yellow";
    else if (depth < 50) return "orange";
    else if (depth <70) return "red";
    else if (depth < 90) return "darkred";
    else return "black";
}

//Define function to determine radius based on magnitude of earthquake
function chooseSize(magnitude) {
    if (magnitude < 0.5) return 2;
    else if (magnitude <1.01) return 4;
    else if (magnitude < 2.51) return 10;
    else if (magnitude <4.51) return 15;
    else return 20;
}

//Add earthquake points to map.
d3.json(url).then(function(data) {
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                color: "white",
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.5,
                radius: chooseSize(feature.properties.mag)
            });
        },
        //Add popup when clicked to show depth and magnitude
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h1>" + "Magnitude: " + feature.properties.mag + "</h1> <hr> <h2>" + "Depth: " + feature.geometry.coordinates[2] + "</h2> <hr> <h3>" + "Lat and Long: " + feature.geometry.coordinates[0] + " , " + feature.geometry.coordinates[1] + "</h3>" )
        }
    // Create legend 
    }).addTo(worldmap);
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'legend');
        const depths = [-10, 10, 30, 50, 70, 90];
    
        for (let i = 0; i < depths.length - 1; i++) {
            const color = chooseColor(depths[i]);
            const label = i === 0 ? 'Depth < ' + depths[i + 1] : depths[i] + ' - ' + depths[i + 1];

        // Create a color swatch div
            const swatch = L.DomUtil.create('div', 'swatch');
            swatch.style.backgroundColor = color;

        // Append the color swatch and label to the legend
            div.appendChild(swatch);
            div.innerHTML += label + '<br>';
    }

        return div;
};

legend.addTo(worldmap);
});

