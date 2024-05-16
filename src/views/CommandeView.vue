<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { StatutCommande } from '@/type/StatutCommande';
import axios from 'axios';
import type { CommandeClient } from '@/type/CommandeClient.ts';

const data = ref<CommandeClient[]>([]);

onBeforeMount(async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}commande`);
    data.value = response.data;
});

const getStatusClass = (statut : StatutCommande) => {
    switch (statut) {
        case StatutCommande.COMMANDE:
            return 'commandee';
        case StatutCommande.EN_PREPARATION:
            return 'en-preparation';
        case StatutCommande.TERMINEE:
            return 'terminee';
        default:
            return '';
    }
};

</script>

<template>
    <main class="text-center">
        <h1>Les commandes en cours</h1>
        <div v-for="commande in (data ? [...data].reverse(): [])" :key="commande.numero" :class="getStatusClass(commande.statut)" class="padding-top">
            <h2>#{{ commande.numero }} - {{ commande.statut }}</h2>
        </div>
    </main>
</template>

<style scoped>
    .commandee {
        color: var(--font-black);
    }

    .en-preparation {
        color: var(--tertiary);
    }

    .terminee {
        color: var(--primary);
    }   
</style>
