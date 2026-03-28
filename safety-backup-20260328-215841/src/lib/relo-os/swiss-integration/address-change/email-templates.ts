/**
 * Email Templates for Address Change Notifications
 */

import { EmailTemplate } from './types';

interface AddressInfo {
  oldStreet: string;
  oldPostalCode: string;
  oldCity: string;
  newStreet: string;
  newPostalCode: string;
  newCity: string;
  moveDate: string;
  fullName: string;
}

/**
 * Generate generic address change email
 */
export const generateAddressChangeEmail = (
  institutionName: string,
  addressInfo: AddressInfo
): EmailTemplate => {
  const subject = `Adressänderung - ${addressInfo.fullName}`;
  
  const body = `Sehr geehrte Damen und Herren

Hiermit teile ich Ihnen meine Adressänderung mit.

Alte Adresse:
${addressInfo.oldStreet}
${addressInfo.oldPostalCode} ${addressInfo.oldCity}

Neue Adresse (gültig ab ${addressInfo.moveDate}):
${addressInfo.newStreet}
${addressInfo.newPostalCode} ${addressInfo.newCity}

Bitte aktualisieren Sie meine Daten in Ihrem System.

Bei Fragen stehe ich Ihnen gerne zur Verfügung.

Freundliche Grüsse
${addressInfo.fullName}`;

  return { subject, body };
};

/**
 * Generate email for insurance address change
 */
export const generateInsuranceEmail = (
  insuranceType: string,
  policyNumber: string,
  addressInfo: AddressInfo
): EmailTemplate => {
  const subject = `Adressänderung - ${insuranceType} - Policen-Nr. ${policyNumber}`;
  
  const body = `Sehr geehrte Damen und Herren

Hiermit teile ich Ihnen meine Adressänderung mit.

Policen-Nummer: ${policyNumber}

Alte Adresse:
${addressInfo.oldStreet}
${addressInfo.oldPostalCode} ${addressInfo.oldCity}

Neue Adresse (gültig ab ${addressInfo.moveDate}):
${addressInfo.newStreet}
${addressInfo.newPostalCode} ${addressInfo.newCity}

Bitte aktualisieren Sie meine Versicherungspolice entsprechend. Falls sich durch den Wohnortwechsel Änderungen bei der Prämie ergeben, bitte ich um entsprechende Information.

Freundliche Grüsse
${addressInfo.fullName}`;

  return { subject, body };
};

/**
 * Generate email for employer
 */
export const generateEmployerEmail = (
  addressInfo: AddressInfo
): EmailTemplate => {
  const subject = `Adressänderung - ${addressInfo.fullName}`;
  
  const body = `Guten Tag

Ich möchte Ihnen mitteilen, dass sich meine Adresse per ${addressInfo.moveDate} ändert.

Neue Adresse:
${addressInfo.newStreet}
${addressInfo.newPostalCode} ${addressInfo.newCity}

Bitte aktualisieren Sie meine Personalakte entsprechend.

Freundliche Grüsse
${addressInfo.fullName}`;

  return { subject, body };
};

/**
 * Generate email for bank
 */
export const generateBankEmail = (
  accountNumber: string,
  addressInfo: AddressInfo
): EmailTemplate => {
  const subject = `Adressänderung - Konto ${accountNumber}`;
  
  const body = `Sehr geehrte Damen und Herren

Hiermit teile ich Ihnen meine Adressänderung mit.

Kontonummer: ${accountNumber}

Alte Adresse:
${addressInfo.oldStreet}
${addressInfo.oldPostalCode} ${addressInfo.oldCity}

Neue Adresse (gültig ab ${addressInfo.moveDate}):
${addressInfo.newStreet}
${addressInfo.newPostalCode} ${addressInfo.newCity}

Bitte aktualisieren Sie meine Kontodaten entsprechend.

Freundliche Grüsse
${addressInfo.fullName}`;

  return { subject, body };
};

/**
 * Generate cancellation email for subscriptions
 */
export const generateCancellationEmail = (
  serviceName: string,
  customerNumber: string,
  addressInfo: AddressInfo,
  reason?: string
): EmailTemplate => {
  const subject = `Kündigung - ${serviceName} - Kd-Nr. ${customerNumber}`;
  
  const body = `Sehr geehrte Damen und Herren

Hiermit kündige ich mein Abonnement/meinen Vertrag per ${addressInfo.moveDate} aufgrund meines Umzugs.

Kundennummer: ${customerNumber}
${reason ? `Grund: ${reason}` : ''}

Aktuelle Adresse:
${addressInfo.oldStreet}
${addressInfo.oldPostalCode} ${addressInfo.oldCity}

Bitte bestätigen Sie mir die Kündigung schriftlich an meine neue Adresse:
${addressInfo.newStreet}
${addressInfo.newPostalCode} ${addressInfo.newCity}

Freundliche Grüsse
${addressInfo.fullName}`;

  return { subject, body };
};
