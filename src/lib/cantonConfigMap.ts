import { CantonConfig } from '@/components/canton/CantonTemplate';
import { aargauConfig } from '@/config/cantonConfigs/aargauConfig';
import { appenzellConfig } from '@/config/cantonConfigs/appenzellConfig';
import { baselConfig } from '@/config/cantonConfigs/baselConfig';
import { bernConfig } from '@/config/cantonConfigs/bernConfig';
import { fribourgConfig } from '@/config/cantonConfigs/fribourgConfig';
import { geneveConfig } from '@/config/cantonConfigs/geneveConfig';
import { glarusConfig } from '@/config/cantonConfigs/glarusConfig';
import { graubuendenConfig } from '@/config/cantonConfigs/graubuendenConfig';
import { juraConfig } from '@/config/cantonConfigs/juraConfig';
import { luzernConfig } from '@/config/cantonConfigs/luzernConfig';
import { neuchatelConfig } from '@/config/cantonConfigs/neuchatelConfig';
import { nidwaldenConfig } from '@/config/cantonConfigs/nidwaldenConfig';
import { obwaldenConfig } from '@/config/cantonConfigs/obwaldenConfig';
import { schaffhausenConfig } from '@/config/cantonConfigs/schaffhausenConfig';
import { schwyzConfig } from '@/config/cantonConfigs/schwyzConfig';
import { solothurnConfig } from '@/config/cantonConfigs/solothurnConfig';
import { stgallenConfig } from '@/config/cantonConfigs/stgallenConfig';
import { tessinConfig } from '@/config/cantonConfigs/tessinConfig';
import { thurgauConfig } from '@/config/cantonConfigs/thurgauConfig';
import { uriConfig } from '@/config/cantonConfigs/uriConfig';
import { waadtConfig } from '@/config/cantonConfigs/waadtConfig';
import { wallisConfig } from '@/config/cantonConfigs/wallisConfig';
import { zuerichConfig } from '@/config/cantonConfigs/zuerichConfig';
import { zugConfig } from '@/config/cantonConfigs/zugConfig';

// Map of canton slugs to their configs for easy lookup
export const cantonConfigMap: Record<string, CantonConfig> = {
  aargau: aargauConfig,
  appenzell: appenzellConfig,
  basel: baselConfig,
  bern: bernConfig,
  fribourg: fribourgConfig,
  geneve: geneveConfig,
  glarus: glarusConfig,
  graubuenden: graubuendenConfig,
  jura: juraConfig,
  luzern: luzernConfig,
  neuchatel: neuchatelConfig,
  nidwalden: nidwaldenConfig,
  obwalden: obwaldenConfig,
  schaffhausen: schaffhausenConfig,
  schwyz: schwyzConfig,
  solothurn: solothurnConfig,
  stgallen: stgallenConfig,
  tessin: tessinConfig,
  thurgau: thurgauConfig,
  uri: uriConfig,
  waadt: waadtConfig,
  wallis: wallisConfig,
  zuerich: zuerichConfig,
  zug: zugConfig,
};

// Get config by slug
export const getCantonConfig = (slug: string): CantonConfig | undefined => {
  return cantonConfigMap[slug.toLowerCase()];
};

// Get all canton configs as array
export const getAllCantonConfigs = (): CantonConfig[] => {
  return Object.values(cantonConfigMap);
};

// Get all canton slugs
export const getAllCantonSlugs = (): string[] => {
  return Object.keys(cantonConfigMap);
};

// Check if a slug is a valid canton
export const isValidCanton = (slug: string): boolean => {
  return slug.toLowerCase() in cantonConfigMap;
};

// Get canton by name (fuzzy match)
export const getCantonByName = (name: string): CantonConfig | undefined => {
  const normalized = name.toLowerCase().trim();
  return Object.values(cantonConfigMap).find(
    config => config.name.toLowerCase() === normalized || config.slug === normalized
  );
};
