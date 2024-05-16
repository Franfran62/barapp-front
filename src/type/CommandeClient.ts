import type { StatutCommande } from "./StatutCommande";

export interface CommandeClient {
    numero: number;
    statut: StatutCommande; 
}