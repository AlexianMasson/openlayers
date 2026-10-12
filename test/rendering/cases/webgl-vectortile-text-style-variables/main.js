import Map from '../../../../src/ol/Map.js';
import View from '../../../../src/ol/View.js';
import WebGLVectorTileLayer from '../../../../src/ol/layer/WebGLVectorTile.js';
import Projection from '../../../../src/ol/proj/Projection.js';
import RenderFeature from '../../../../src/ol/render/Feature.js';
import VectorTileSource from '../../../../src/ol/source/VectorTile.js';
import {createXYZ} from '../../../../src/ol/tilegrid.js';

const projection = new Projection({
  code: 'tiles',
  units: 'pixels',
  extent: [-128, -128, 128, 128],
});

const layer = new WebGLVectorTileLayer({
  source: new VectorTileSource({
    projection,
    tileGrid: createXYZ({extent: projection.getExtent(), maxZoom: 0}),
    tileUrlFunction: (tileCoord) => tileCoord.join('/'),
    tileLoadFunction: (tile) =>
      tile.setFeatures([new RenderFeature('Point', [0, 0], [], 2, {}, 1)]),
  }),
  style: {
    'circle-radius': 4,
    'circle-fill-color': 'blue',
    'text-value': ['var', 'label'],
    'text-font': 'bold 24px Ubuntu',
    'text-fill-color': 'white',
    'text-background-fill-color': ['var', 'background'],
    'text-padding': [20, 20, 20, 20],
    'text-offset-y': -40,
  },
  variables: {
    label: 'before',
    background: 'blue',
  },
});

const map = new Map({
  pixelRatio: 1,
  layers: [layer],
  target: 'map',
  view: new View({
    projection,
    center: [0, 0],
    resolution: 1,
  }),
});

// the labels of a tile are built along with its buffers, so they are only
// shown with the new variables once the layer has finished rendering again
map.once('rendercomplete', () => {
  layer.updateStyleVariables({label: 'after', background: 'red'});
  map.once('rendercomplete', () => {
    render({
      message: 'Tile labels updated with new style variables',
      tolerance: 0.02,
    });
  });
});
