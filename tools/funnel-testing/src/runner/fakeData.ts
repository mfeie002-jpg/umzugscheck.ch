import { faker } from '@faker-js/faker';
import { Persona } from '../shared/schemas.js';

export function generateFakeEmail(persona: Persona, seed: number): string {
  faker.seed(seed);
  return `${persona.email_prefix}+test${seed}@example.com`;
}

export function generateFakeName(): string {
  return `[TEST] ${faker.person.firstName()} ${faker.person.lastName()}`;
}

export function generateFakePhone(): string {
  return faker.phone.number('+41 ## ### ## ##');
}

export function generateFakeAddress(): string {
  return faker.location.streetAddress();
}

export function generateFakeCity(): string {
  return faker.location.city();
}

export function generateFakeZip(): string {
  return faker.location.zipCode('####');
}

export function generateFakeData(persona: Persona, seed: number) {
  return {
    firstName: persona.first_name || generateFakeName(),
    lastName: persona.last_name || generateFakeName(),
    email: generateFakeEmail(persona, seed),
    phone: persona.phone || generateFakePhone(),
    address: generateFakeAddress(),
    city: generateFakeCity(),
    zip: generateFakeZip(),
  };
}
