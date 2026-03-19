const isPlaceholderValue = (value?: string) => {
  if (!value) return true;
  return value.includes('XXXX');
};

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
export const GTM_CONTAINER_ID = import.meta.env.VITE_GTM_CONTAINER_ID;

export const isGaEnabled = !isPlaceholderValue(GA_MEASUREMENT_ID);
export const isGtmEnabled = !isPlaceholderValue(GTM_CONTAINER_ID);

