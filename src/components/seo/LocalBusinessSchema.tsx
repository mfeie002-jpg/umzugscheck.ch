/**
 * LocalBusinessSchema - Sprint 3 Component
 * Schema.org structured data for POIs to enable rich snippets
 */
import { Helmet } from 'react-helmet';

export interface LocalBusinessData {
  name: string;
  type: 'School' | 'Hospital' | 'Restaurant' | 'TransitStation' | 'LocalBusiness' | 'Store' | 'MedicalClinic';
  address?: {
    streetAddress?: string;
    addressLocality: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  telephone?: string;
  url?: string;
  openingHours?: string[];
  priceRange?: string;
  rating?: {
    ratingValue: number;
    reviewCount: number;
  };
  image?: string;
  description?: string;
}

interface LocalBusinessSchemaProps {
  businesses: LocalBusinessData[];
}

const getSchemaType = (type: LocalBusinessData['type']) => {
  const typeMap: Record<LocalBusinessData['type'], string> = {
    School: 'School',
    Hospital: 'Hospital',
    Restaurant: 'Restaurant',
    TransitStation: 'TrainStation',
    LocalBusiness: 'LocalBusiness',
    Store: 'Store',
    MedicalClinic: 'MedicalClinic',
  };
  return typeMap[type] || 'LocalBusiness';
};

export const LocalBusinessSchema = ({ businesses }: LocalBusinessSchemaProps) => {
  if (!businesses || businesses.length === 0) return null;

  const schemas = businesses.map((business) => ({
    '@context': 'https://schema.org',
    '@type': getSchemaType(business.type),
    name: business.name,
    ...(business.description && { description: business.description }),
    ...(business.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.address.streetAddress,
        addressLocality: business.address.addressLocality,
        postalCode: business.address.postalCode,
        addressCountry: business.address.addressCountry || 'CH',
      },
    }),
    ...(business.geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: business.geo.latitude,
        longitude: business.geo.longitude,
      },
    }),
    ...(business.telephone && { telephone: business.telephone }),
    ...(business.url && { url: business.url }),
    ...(business.openingHours && { openingHours: business.openingHours }),
    ...(business.priceRange && { priceRange: business.priceRange }),
    ...(business.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: business.rating.ratingValue,
        reviewCount: business.rating.reviewCount,
      },
    }),
    ...(business.image && { image: business.image }),
  }));

  // If multiple businesses, wrap in ItemList
  const schemaData = businesses.length > 1
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `Local Services in ${businesses[0]?.address?.addressLocality || 'Switzerland'}`,
        itemListElement: schemas.map((schema, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: schema,
        })),
      }
    : schemas[0];

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

// Helper to convert POI data to LocalBusinessData
export const poiToLocalBusiness = (poi: {
  name: string;
  poi_type: string;
  city_name: string;
  canton_code: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  description?: string;
}): LocalBusinessData => {
  const typeMap: Record<string, LocalBusinessData['type']> = {
    school: 'School',
    hospital: 'Hospital',
    restaurant: 'Restaurant',
    transit: 'TransitStation',
    supermarket: 'Store',
    doctor: 'MedicalClinic',
  };

  return {
    name: poi.name,
    type: typeMap[poi.poi_type] || 'LocalBusiness',
    address: {
      addressLocality: poi.city_name,
      addressCountry: 'CH',
    },
    ...(poi.latitude && poi.longitude && {
      geo: {
        latitude: poi.latitude,
        longitude: poi.longitude,
      },
    }),
    ...(poi.rating && {
      rating: {
        ratingValue: poi.rating,
        reviewCount: 1,
      },
    }),
    ...(poi.description && { description: poi.description }),
  };
};

export default LocalBusinessSchema;
