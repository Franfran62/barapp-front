import type { CommandeAdmin } from '@/type/CommandeAdmin';
import { reactive } from 'vue';

const state = reactive({
  commandAdmin: [] as CommandeAdmin[],
});

function setCommandeAdmin(commandes: CommandeAdmin[]) {
    state.commandAdmin = commandes;
} 

function addCommandAdmin(commande: CommandeAdmin) {
    state.commandAdmin.push(commande);
    console.log(state.commandAdmin);
}

function getCommandAdmin() {
  return state.commandAdmin;
}

function getCommandAdminById(id: string | number) {
  return state.commandAdmin.find((commande) => commande.id == id);
}

function updateCommandAdmin(commande: CommandeAdmin) {
  const index = state.commandAdmin.findIndex((commande) => commande.id === commande.id);
  state.commandAdmin[index] = commande;
}

function deleteCommandAdmin(id: number) {
  state.commandAdmin = state.commandAdmin.filter((commande) => commande.id !== id);
}   

function clearCommandAdmin() {
    state.commandAdmin = [];
}       

export default {
    state,
    setCommandeAdmin,
    addCommandAdmin,
    getCommandAdmin,
    getCommandAdminById,
    updateCommandAdmin,
    deleteCommandAdmin,
    clearCommandAdmin
  };




