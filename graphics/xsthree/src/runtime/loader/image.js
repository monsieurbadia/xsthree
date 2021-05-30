export const imagefn = src => (
  image(src)
);

const image = src => (
  fetch(src)
    .then(resolve_or_reject)
    .then(returns_blob_data)
    .then(createImageBitmap)
);

const resolve_or_reject = res => res.ok ? res : Promise.reject(res);
const returns_blob_data = res => res.blob();

/*
import { AssetLoader } from "./asset-loader.js";

const BASE_PATH = "/software-normal-map/assets/materials";

const setKeyValuePair = (obj, [key, value]) => {
  obj[key] = value;
  return obj;
};

const Material = (name, pairs) => ({
  name,
  features: pairs.flatMap(([name]) => name),
  textures: pairs.reduce(setKeyValuePair, {})
});

const load = ({ name, features }) => {
  const textures = features
    .map(feature => AssetLoader.loadImageBuffer(`${BASE_PATH}/${name}/${name}.${feature}.jpg`))

  return Promise.all(textures)
    .then(buffers => buffers.map((buffer, i) => [features[i], buffer]))
    .then(pairs => Material(name, pairs));
};

export const MaterialLoader = {
  load
};
*/
