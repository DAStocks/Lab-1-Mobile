mapboxgl.accessToken = 'pk.eyJ1IjoiZGFzMjY0IiwiYSI6ImNrdXl4NXpxYTc3Mmsyd3E2ZDZ6bm55b3cifQ.o7GVvvktEJvo_MAGbb8MCw'
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/satellite-v9', // style URL
center: [-103.2502, 29.2498], // starting position [lng, lat]
zoom: 10.5, // starting zoom
pitch: 55,
bearing: 60,
});

map.on('load', () => {

map.addSource('trails', {
          type: 'geojson',
          data: 'data/Big_Bend_Trails.geojson'
});

map.addLayer({
        'id': 'trails-layer',
        'type': 'line',
        'source': 'trails',
        'paint': {
            'line-width': 3,
            'line-color': ['match', ['get', 'TRLCLASS'],
              'Class 1: Minimally Developed', 'red',
              'Class 2: Moderately Developed', 'orange',
              'Class 3: Developed', 'yellow',
              /*else,*/ 'blue'
          ]
        }
});

// map.on('load', function () {
   map.addSource('mapbox-dem', {
       "type": "raster-dem",
       "url": "mapbox://mapbox.mapbox-terrain-dem-v1",
       'tileSize': 512,
       'maxzoom': 14

});

map.addSource('bounds', {
        type: 'geojson',
        data: 'data/BigBendBounds.geojson'// note again, you may need to change this.
    });

    map.addLayer({
      'id': 'boundary-layer',
      'type': 'line',
      'source': 'bounds',
      'paint': {
          'line-width': 4,
          'line-color': 'black',
          'line-opacity': .6
      }
    });

map.on('click', 'trails-layer', (e) => {
    const coordinates = e.lngLat;
        let feature = e.features[0].properties;
    const description = "<b>Trail name:</b> " + feature.TRLNAME + "<br><b>Trail class:</b> " + feature.TRLCLASS + "<br><b>Trail Length: </b> " + feature.Miles.toFixed(2) + "miles";

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);
});

map.on('mouseenter', 'trails-layer', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

map.on('mouseleave', 'trails-layer', () => {
      map.getCanvas().style.cursor = '';
    });

map.setTerrain({"source": "mapbox-dem", "exaggeration": 1.0
}
);

map.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
        }
});
});

const navControl = new mapboxgl.NavigationControl({
        visualizePitch: true
});

map.addControl(navControl, 'top-right');

const scale = new mapboxgl.ScaleControl({
maxWidth: 80,
unit: 'imperial'
});

map.addControl(scale, 'bottom-left');

scale.setUnit('imperial');

map.addControl(new mapboxgl.FullscreenControl());
