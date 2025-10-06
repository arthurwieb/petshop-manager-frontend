import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhoneNumber(phoneNumberString: string, country: CountryCode = 'BR') {
  if (!phoneNumberString) return '';
  const phoneNumber = parsePhoneNumberFromString(phoneNumberString, country);
  if (phoneNumber) {
    return phoneNumber.formatNational();
  }
  return phoneNumberString;
}
