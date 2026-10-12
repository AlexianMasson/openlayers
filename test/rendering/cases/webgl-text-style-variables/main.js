import Feature from '../../../../src/ol/Feature.js';
import Map from '../../../../src/ol/Map.js';
import View from '../../../../src/ol/View.js';
import Point from '../../../../src/ol/geom/Point.js';
import WebGLVectorLayer from '../../../../src/ol/layer/WebGLVector.js';
import VectorSource from '../../../../src/ol/source/Vector.js';

const layer = new WebGLVectorLayer({
  source: new VectorSource({
    features: [new Feature(new Point([0, 0]))],
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
    center: [0, 0],
    resolution: 1,
  }),
});

// the labels are built along with the render buffers, so they are only
// shown with the new variables once the layer has finished rendering again
map.once('rendercomplete', () => {
  layer.updateStyleVariables({label: 'after', background: 'red'});
  map.once('rendercomplete', () => {
    render({
      message: 'Labels updated with new style variables',
      tolerance: 0.02,
    });
  });
});
