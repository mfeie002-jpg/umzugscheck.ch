export interface WhatsAppMessageConfig {
  phone?: string;
  service?: string;
  from?: string;
  to?: string;
  date?: string;
  name?: string;
}

const DEFAULT_PHONE = "41765681302";

export const generateWhatsAppLink = (config: WhatsAppMessageConfig = {}): string => {
  const { phone = DEFAULT_PHONE, service, from, to, date, name } = config;
  
  let message = `Guten Tag Feierabend Umzüge,\n\n`;
  
  if (name) {
    message += `Mein Name ist ${name}.\n`;
  }
  
  if (service) {
    message += `Ich interessiere mich für ${service}.\n\n`;
  }
  
  if (from && to) {
    message += `Umzugsdetails:\n`;
    message += `Von: ${from}\n`;
    message += `Nach: ${to}\n`;
    if (date) {
      message += `Datum: ${date}\n`;
    }
    message += `\n`;
  }
  
  message += `Ich hätte gerne ein unverbindliches Angebot.\n\nMit freundlichen Grüssen`;
  
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};

export const openWhatsApp = (config: WhatsAppMessageConfig = {}): void => {
  const link = generateWhatsAppLink(config);
  window.open(link, '_blank');
};
