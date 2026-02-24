// src/app/interfaces/merchant.ts

export interface Currency {
  id: string;
  name: string;
  email?: string | null;
}

export interface Country {
  id: string;
  name: string;
  email?: string | null;
}

export interface Merchant {
  id: number;
  code: string;
  name: string;
  commercialName: string;
  legalName: string;
  email?: string | null;
  status: string;
  logo?: string | null;
  defaultCurrency: Currency;
  country: Country;
}
export interface MerchantResponse {
  content: Merchant[];
  totalElements: number;
  totalPages: number;
}