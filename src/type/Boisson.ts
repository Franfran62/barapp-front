import type { Categorie } from "./Categorie";
import type { Ingredient } from "./Ingredient";

export interface Boisson {  
    id: number; 
    nom: string;
    honneur: boolean;
    categorie: Categorie;
    ingredients: Ingredient[];
    prix: number[];
}