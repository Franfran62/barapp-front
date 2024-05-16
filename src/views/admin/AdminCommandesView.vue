<script setup lang="ts">
import { ref, onBeforeMount, watchEffect, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import commandAdminStore from '@/store/commandAdminStore';
import * as Webstomp from 'webstomp-client';
import type { CommandeAdmin } from '@/type/CommandeAdmin';

const socket = new WebSocket(import.meta.env.VITE_SOCKET_URL);
const client = Webstomp.over(socket);

socket.onclose = function(event) {
  alert('La connection est perdue, la page va se rafraichir');
  location.reload();
};

socket.onerror = function(error) {
  alert('La connection est perdue, vous devez vous reconnecter');
  router.push({ name: 'login' });
};

client.connect({}, function(frame) {
    client.subscribe('/socket/admin', function(update) {
        let newCommande: CommandeAdmin = JSON.parse(update.body);
        commandAdminStore.addCommandAdmin(newCommande);
        
    });
});

const router = useRouter();

const isLoading = ref(true);
const commandes = ref<CommandeAdmin[]>([]);

watchEffect(() => {
  commandes.value = commandAdminStore.getCommandAdmin();
});


const formatDate = (date: string) => {
      const d = new Date(date);
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
      return `${hours}h${minutes}`;
    }

const redirectToCommande = (id: number) => {
  router.push({ name: 'admin-commande-detail', params: { id } });
};

onBeforeMount(async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}admin/commande`, {
      headers: {
        'auth-token': localStorage.getItem('token'),
        "Content-Type": "application/json"
      }
    });
    commandAdminStore.setCommandeAdmin(response.data);

  } catch (error) {
    alert('Une erreur est survenue, vous devrez vous reconnecter');
    router.push({ name: 'login' });
  } finally {
    isLoading.value = false;
  }
});   

onBeforeUnmount(() => {
  client.disconnect();
});

</script>
<template>
    <main v-if="isLoading">Chargement...</main>
    <main v-else>
      <ul>
        <li>
          <span class="headers">Numéro</span>
          <span class="headers">Nombre de Boisson</span>
          <span class="headers">Statut</span>
          <span class="headers">Prix</span>
          <span class="headers">Heure</span>
        </li>
        <li v-for="commande in commandes" :key="commande.id" @click="redirectToCommande(commande.id)">
          <span>#{{ commande.numero }}</span>
          <span>{{ commande.nbProduit }} boisson{{ commande.nbProduit > 1 ? 's' : '' }} </span>
          <span>{{ commande.statut }} </span>
          <span>{{ commande.prix }}€</span>
          <span>{{ formatDate(commande.date) }}</span>
        </li>
      </ul>
        <ul >
        </ul>
    </main>
</template>


<style scoped>
main {
  margin-top: 5%;
}
ul {
    width: 100%;
}

ul > li {
    display: flex;
    padding: 1rem;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
}

ul > li > span {
    width: 20%;
}
</style>