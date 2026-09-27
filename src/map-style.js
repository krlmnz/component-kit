/* Theme basemap for the map specimen.
   Vector tiles: OpenFreeMap (OpenMapTiles schema, no API key).
   https://tiles.openfreemap.org/planet
   Relief: Esri World Hillshade raster (CORS-enabled, no key). OpenFreeMap
   does not ship a DEM, and the public terrarium bucket does not send
   Access-Control-Allow-Origin, so a MapLibre hillshade layer cannot read it.
   Colors come from the --map-* custom properties on the active theme. */
(function () {
  var SOURCE = 'openfreemap';
  var HILLSHADE = 'hillshade';

  function read(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function opacity() {
    var value = parseFloat(read('--map-hillshade-opacity'));
    return Number.isFinite(value) ? value : 0.25;
  }

  function lineWidth(min, max) {
    return ['interpolate', ['linear'], ['zoom'], 8, min, 13, (min + max) / 2, 16, max];
  }

  function build() {
    var land = read('--map-land');
    var water = read('--map-water');
    var park = read('--map-park');
    var wood = read('--map-wood');
    var beach = read('--map-beach');
    var scrub = read('--map-scrub');
    var glacier = read('--map-glacier');
    var road = read('--map-road');
    var casing = read('--map-road-casing');
    var building = read('--map-building');
    var label = read('--map-label');
    var theme = document.documentElement.dataset.theme || 'light';

    return {
      version: 8,
      name: 'component-kit-' + theme,
      glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
      sources: {
        openfreemap: {
          type: 'vector',
          url: 'https://tiles.openfreemap.org/planet',
          attribution: '© OpenFreeMap © OpenMapTiles © OpenStreetMap'
        },
        hillshade: {
          type: 'raster',
          tiles: [
            'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256,
          maxzoom: 16,
          attribution: 'Hillshade © Esri'
        }
      },
      layers: [
        { id: 'background', type: 'background', paint: { 'background-color': land } },
        {
          id: 'landcover-wood',
          type: 'fill',
          source: SOURCE,
          'source-layer': 'landcover',
          filter: ['==', ['get', 'class'], 'wood'],
          paint: { 'fill-color': wood, 'fill-opacity': 0.9 }
        },
        {
          id: 'landuse-wood',
          type: 'fill',
          source: SOURCE,
          'source-layer': 'landuse',
          filter: ['match', ['get', 'class'], ['forest', 'wood'], true, false],
          paint: { 'fill-color': wood, 'fill-opacity': 0.9 }
        },
        {
          id: 'landcover-grass',
          type: 'fill',
          source: SOURCE,
          'source-layer': 'landcover',
          filter: ['match', ['get', 'class'], ['grass', 'wetland'], true, false],
          paint: { 'fill-color': park, 'fill-opacity': 0.85 }
        },
        {
          id: 'landcover-scrub',
          type: 'fill',
          source: SOURCE,
          'source-layer': 'landcover',
          filter: ['match', ['get', 'class'], ['scrub', 'farmland'], true, false],
          paint: { 'fill-color': scrub, 'fill-opacity': 0.85 }
        },
        {
          id: 'landcover-sand',
          type: 'fill',
          source: SOURCE,
          'source-layer': 'landcover',
          filter: ['==', ['get', 'class'], 'sand'],
          paint: { 'fill-color': beach, 'fill-opacity': 0.95 }
        },
        {
          id: 'landcover-glacier',
          type: 'fill',
          source: SOURCE,
          'source-layer': 'landcover',
          filter: ['any',
            ['==', ['get', 'subclass'], 'glacier'],
            ['==', ['get', 'subclass'], 'ice_shelf'],
            ['==', ['get', 'class'], 'ice']
          ],
          paint: { 'fill-color': glacier, 'fill-opacity': 0.95 }
        },
        {
          id: 'park',
          type: 'fill',
          source: SOURCE,
          'source-layer': 'park',
          filter: ['match', ['geometry-type'], ['Polygon', 'MultiPolygon'], true, false],
          paint: { 'fill-color': park, 'fill-opacity': 0.8 }
        },
        {
          id: 'landuse-park',
          type: 'fill',
          source: SOURCE,
          'source-layer': 'landuse',
          filter: ['match', ['get', 'class'], ['park', 'grass', 'garden'], true, false],
          paint: { 'fill-color': park, 'fill-opacity': 0.75 }
        },
        {
          id: 'hillshade',
          type: 'raster',
          source: HILLSHADE,
          paint: {
            'raster-opacity': opacity(),
            'raster-saturation': -0.85,
            'raster-contrast': 0.15,
            'raster-fade-duration': 0
          }
        },
        {
          id: 'water',
          type: 'fill',
          source: SOURCE,
          'source-layer': 'water',
          filter: ['!=', ['get', 'brunnel'], 'tunnel'],
          paint: { 'fill-color': water }
        },
        {
          id: 'waterway',
          type: 'line',
          source: SOURCE,
          'source-layer': 'waterway',
          filter: ['!=', ['get', 'brunnel'], 'tunnel'],
          paint: {
            'line-color': water,
            'line-width': lineWidth(0.6, 3)
          }
        },
        {
          id: 'building',
          type: 'fill',
          source: SOURCE,
          'source-layer': 'building',
          minzoom: 13,
          paint: { 'fill-color': building, 'fill-opacity': 0.95 }
        },
        {
          id: 'road-casing',
          type: 'line',
          source: SOURCE,
          'source-layer': 'transportation',
          filter: ['all',
            ['match', ['geometry-type'], ['LineString', 'MultiLineString'], true, false],
            ['!=', ['get', 'brunnel'], 'tunnel'],
            ['match', ['get', 'class'], ['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'minor', 'service'], true, false]
          ],
          paint: {
            'line-color': casing,
            'line-width': lineWidth(1.2, 9)
          }
        },
        {
          id: 'road',
          type: 'line',
          source: SOURCE,
          'source-layer': 'transportation',
          filter: ['all',
            ['match', ['geometry-type'], ['LineString', 'MultiLineString'], true, false],
            ['!=', ['get', 'brunnel'], 'tunnel'],
            ['match', ['get', 'class'], ['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'minor', 'service'], true, false]
          ],
          paint: {
            'line-color': road,
            'line-width': lineWidth(0.5, 6)
          }
        },
        {
          id: 'place-label',
          type: 'symbol',
          source: SOURCE,
          'source-layer': 'place',
          minzoom: 5,
          filter: ['match', ['get', 'class'], ['city', 'town', 'village'], true, false],
          layout: {
            'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name']],
            'text-font': ['Noto Sans Regular'],
            'text-size': ['interpolate', ['linear'], ['zoom'], 5, 11, 12, 14]
          },
          paint: {
            'text-color': label,
            'text-halo-color': land,
            'text-halo-width': 1.25
          }
        }
      ]
    };
  }

  function paint(map) {
    if (!map.getLayer('background')) return;
    var land = read('--map-land');
    map.setPaintProperty('background', 'background-color', land);
    map.setPaintProperty('landcover-wood', 'fill-color', read('--map-wood'));
    map.setPaintProperty('landuse-wood', 'fill-color', read('--map-wood'));
    map.setPaintProperty('landcover-grass', 'fill-color', read('--map-park'));
    map.setPaintProperty('landcover-scrub', 'fill-color', read('--map-scrub'));
    map.setPaintProperty('landcover-sand', 'fill-color', read('--map-beach'));
    map.setPaintProperty('landcover-glacier', 'fill-color', read('--map-glacier'));
    map.setPaintProperty('park', 'fill-color', read('--map-park'));
    map.setPaintProperty('landuse-park', 'fill-color', read('--map-park'));
    map.setPaintProperty('hillshade', 'raster-opacity', opacity());
    map.setPaintProperty('water', 'fill-color', read('--map-water'));
    map.setPaintProperty('waterway', 'line-color', read('--map-water'));
    map.setPaintProperty('building', 'fill-color', read('--map-building'));
    map.setPaintProperty('road-casing', 'line-color', read('--map-road-casing'));
    map.setPaintProperty('road', 'line-color', read('--map-road'));
    map.setPaintProperty('place-label', 'text-color', read('--map-label'));
    map.setPaintProperty('place-label', 'text-halo-color', land);
  }

  window.KitMapStyle = { build: build, paint: paint };
})();
