import type { Produit } from './Produit'; 

export interface CommandeAdmin {
    id: number;
    nbProduit: number,
    numero: number,
    statut: String;
    date: string;
    prix: number;
    produits: string;
}