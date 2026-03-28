/**
 * Central contact information - Single Source of Truth
 */

export const CONTACT = {
  // Official phone number
  phone: "+41446880404",
  phoneDisplay: "+41 44 688 04 04",
  phoneClean: "41446880404", // For WhatsApp/tel links
  
  // Email
  email: "info@umzugscheck.ch",
  
  // WhatsApp
  whatsapp: "41446880404",
  
  // Address (if needed)
  address: {
    street: "",
    city: "Zürich",
    zip: "",
    country: "Schweiz",
  },
} as const;

/**
 * Generate tel: link
 */
export const getTelLink = () => `tel:${CONTACT.phone}`;

/**
 * Generate WhatsApp link with optional message
 */
export const getWhatsAppLink = (message?: string) => {
  const baseUrl = `https://wa.me/${CONTACT.whatsapp}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
};
