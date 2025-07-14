export interface User {
  id: number;
  nom: string;
  prenom: string;
  login: string;
  typeUser: 'Admin' | 'caissier';
}

export interface Product {
  id: number;
  codeBar: string;
  referance: string;
  name: string;
  description: string;
  quantite: number;
  prixAchat: number;
  prixVente: number;
  remise: number;
  categoryId: number;
  category?: Category;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Client {
  id: number;
  name: string;
  cin: string;
  dateNaiss: string;
  phone: string;
  email: string;
  address: string;
  chiffre: number;
}

export interface Fournisseur {
  id: number;
  name: string;
  cp: string;
  libelle: string;
  ville: string;
  adresse: string;
  phone: string;
  chiffre: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  prix: number;
  remise: number;
}

export interface Sale {
  id: number;
  clientId?: number;
  items: CartItem[];
  total: number;
  tva: number;
  remiseGlobale: number;
  typePaiement: 'cash' | 'card' | 'check';
  dateVente: string;
}

export interface Dette {
  id: number;
  clientId: number;
  commandeId: number;
  dateEntree: string;
  montant: number;
  reste: number;
  client?: Client;
}

export interface Analytics {
  topProducts: Array<{ name: string; count: number; value: number }>;
  topClients: Array<{ name: string; count: number; value: number }>;
  topSellers: Array<{ name: string; count: number; value: number }>;
  topMonths: Array<{ name: string; count: number; value: number }>;
}