<script setup lang="ts">
import { useRoute, RouterLink } from 'vue-router';

const route = useRoute();
const numero = route.params.numero;
</script>

<template>
    <main class="text-center">
        <img               
            src="/icons/utils/succes.png" 
            alt="Icone triste" 
            class="icon"> 
        <h1 class="padding-top">Votre commande porte le numéro {{ numero }}</h1>
        <p class="padding-top">
            Notre barmaker s'occupe de tout ! 
            <br>
            En attendant, vous pouvez retrouver l’avancée de sa préparation dans l’onglet “commandes”.
            Ou cliquez juste ici
        </p>
        <router-link :to="{ name: 'commande' }" class="padding-top">Voir les commande</router-link>
    </main>

</template>


<style scoped>



a {
    color: var(--primary);
    font-size: 1.2em;
    text-decoration: none;
}

</style>