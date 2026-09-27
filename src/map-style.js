/* Shared basemap for the Studio editor and Map Editor.
   One vector source: OpenFreeMap planet (OpenMapTiles / Liberty schema,
   no API key, HTTPS). https://tiles.openfreemap.org/planet
   Relief: Esri World Hillshade raster (CORS-enabled, no key). OpenFreeMap
   does not ship a DEM, and the public terrarium bucket does not send
   Access-Control-Allow-Origin, so a MapLibre hillshade layer cannot read it.
   One style object. Layer ids stay stable. KitMapStyle.layers is the
   setPaintProperty contract (also in docs/THEMES.md). A theme change
   recolors those properties only. Opacities and line widths stay at the
   quiet defaults below. No per-theme style JSON. Chrome is page tokens. */
(function () {
  var SOURCE = 'openfreemap';
  var HILLSHADE = 'hillshade';

  /* Draw order is array order (first = underneath). */
  var LAYERS = [
    { id: 'background', paint: 'background-color', token: '--map-land', role: 'Ground' },
    { id: 'landcover-wood', paint: 'fill-color', token: '--map-wood', role: 'Forest landcover' },
    { id: 'landuse-wood', paint: 'fill-color', token: '--map-wood', role: 'Forest landuse' },
    { id: 'landcover-grass', paint: 'fill-color', token: '--map-park', role: 'Grass and wetland' },
    { id: 'landcover-scrub', paint: 'fill-color', token: '--map-scrub', role: 'Scrub and farmland' },
    { id: 'landcover-sand', paint: 'fill-color', token: '--map-beach', role: 'Sand' },
    { id: 'landcover-glacier', paint: 'fill-color', token: '--map-glacier', role: 'Glacier, ice shelf, ice' },
    { id: 'park', paint: 'fill-color', token: '--map-park', role: 'Park polygons' },
    { id: 'landuse-park', paint: 'fill-color', token: '--map-park', role: 'Park, grass, and garden landuse' },
    { id: 'hillshade', paint: 'raster-opacity', token: '--map-hillshade-opacity', role: 'Relief strength' },
    { id: 'water', paint: 'fill-color', token: '--map-water', role: 'Water bodies' },
    { id: 'waterway', paint: 'line-color', token: '--map-water', role: 'Rivers and streams' },
    { id: 'building', paint: 'fill-color', token: '--map-building', role: 'Buildings' },
    { id: 'road-casing', paint: 'line-color', token: '--map-road-casing', role: 'Road casing' },
    { id: 'road', paint: 'line-color', token: '--map-road', role: 'Road fill' },
    { id: 'place-label', paint: 'text-color', token: '--map-label', role: 'Place names' },
    { id: 'place-label', paint: 'text-halo-color', token: '--map-land', role: 'Place-name halo' }
  ];

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
          paint: { 'fill-color': wood, 'fill-opacity': 0.5 }
        },
        {
          id: 'landuse-wood',
          type: 'fill',
          source: SOURCE,
          'source-layer': 'landuse',
          filter: ['match', ['get', 'class'], ['forest', 'wood'], true, false],
          paint: { 'fill-color': wood, 'fill-opacity': 0.5 }
        },
        {
          id: 'landcover-grass',
          type: 'fill',
          source: SOURCE,
          'source-layer': 'landcover',
          filter: ['match', ['get', 'class'], ['grass', 'wetland'], true, false],
          paint: { 'fill-color': park, 'fill-opacity': 0.45 }
        },
        {
          id: 'landcover-scrub',
          type: 'fill',
          source: SOURCE,
          'source-layer': 'landcover',
          filter: ['match', ['get', 'class'], ['scrub', 'farmland'], true, false],
          paint: { 'fill-color': scrub, 'fill-opacity': 0.4 }
        },
        {
          id: 'landcover-sand',
          type: 'fill',
          source: SOURCE,
          'source-layer': 'landcover',
          filter: ['==', ['get', 'class'], 'sand'],
          paint: { 'fill-color': beach, 'fill-opacity': 0.5 }
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
          paint: { 'fill-color': glacier, 'fill-opacity': 0.45 }
        },
        {
          id: 'park',
          type: 'fill',
          source: SOURCE,
          'source-layer': 'park',
          filter: ['match', ['geometry-type'], ['Polygon', 'MultiPolygon'], true, false],
          paint: { 'fill-color': park, 'fill-opacity': 0.4 }
        },
        {
          id: 'landuse-park',
          type: 'fill',
          source: SOURCE,
          'source-layer': 'landuse',
          filter: ['match', ['get', 'class'], ['park', 'grass', 'garden'], true, false],
          paint: { 'fill-color': park, 'fill-opacity': 0.35 }
        },
        {
          id: 'hillshade',
          type: 'raster',
          source: HILLSHADE,
          paint: {
            'raster-opacity': opacity(),
            'raster-saturation': -1,
            'raster-contrast': 0,
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
            'line-width': lineWidth(0.3, 1.6)
          }
        },
        {
          id: 'building',
          type: 'fill',
          source: SOURCE,
          'source-layer': 'building',
          minzoom: 13,
          paint: { 'fill-color': building, 'fill-opacity': 0.55 }
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
            'line-width': lineWidth(0.6, 5)
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
            'line-width': lineWidth(0.25, 2.6)
          }
        },
        {
          id: 'place-label',
          type: 'symbol',
          source: SOURCE,
          'source-layer': 'place',
          minzoom: 6,
          filter: ['match', ['get', 'class'], ['city', 'town', 'village'], true, false],
          layout: {
            'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name']],
            'text-font': ['Noto Sans Regular'],
            'text-size': ['interpolate', ['linear'], ['zoom'], 6, 10, 12, 12]
          },
          paint: {
            'text-color': label,
            'text-halo-color': land,
            'text-halo-width': 1
          }
        }
      ]
    };
  }

  function paint(map) {
    if (!map.getLayer('background')) return;
    for (var i = 0; i < LAYERS.length; i++) {
      var layer = LAYERS[i];
      if (!map.getLayer(layer.id)) continue;
      var value = layer.paint === 'raster-opacity' ? opacity() : read(layer.token);
      map.setPaintProperty(layer.id, layer.paint, value);
    }
  }

  window.KitMapStyle = { build: build, paint: paint, layers: LAYERS };
})();
