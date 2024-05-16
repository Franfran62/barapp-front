import type { Produit } from './Produit'; 

export interface Commande {
    prix: number;
    produits: Produit[];
}
