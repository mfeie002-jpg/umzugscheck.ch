export { aargauConfig } from './aargauConfig';
export { appenzellConfig } from './appenzellConfig';
export { baselConfig } from './baselConfig';
export { bernConfig } from './bernConfig';
export { fribourgConfig } from './fribourgConfig';
export { geneveConfig } from './geneveConfig';
export { glarusConfig } from './glarusConfig';
export { graubuendenConfig } from './graubuendenConfig';
export { juraConfig } from './juraConfig';
export { luzernConfig } from './luzernConfig';
export { neuchatelConfig } from './neuchatelConfig';
export { nidwaldenConfig } from './nidwaldenConfig';
export { obwaldenConfig } from './obwaldenConfig';
export { schaffhausenConfig } from './schaffhausenConfig';
export { schwyzConfig } from './schwyzConfig';
export { solothurnConfig } from './solothurnConfig';
export { stgallenConfig } from './stgallenConfig';
export { tessinConfig } from './tessinConfig';
export { thurgauConfig } from './thurgauConfig';
export { uriConfig } from './uriConfig';
export { waadtConfig } from './waadtConfig';
export { wallisConfig } from './wallisConfig';
export { zuerichConfig } from './zuerichConfig';
export { zugConfig } from './zugConfig';

// Re-export all configs as an array for easy iteration
export const allCantonConfigs = [
  'aargau',
  'appenzell', 
  'basel',
  'bern',
  'fribourg',
  'geneve',
  'glarus',
  'graubuenden',
  'jura',
  'luzern',
  'neuchatel',
  'nidwalden',
  'obwalden',
  'schaffhausen',
  'schwyz',
  'solothurn',
  'stgallen',
  'tessin',
  'thurgau',
  'uri',
  'waadt',
  'wallis',
  'zuerich',
  'zug'
] as const;
