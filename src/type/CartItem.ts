import type { Produit } from "./Produit";

export interface CartItem {
    id: number;
    produit: Produit; 
    quantity: number;
  }
