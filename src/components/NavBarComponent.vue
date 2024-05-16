<template>
    <nav>
        <div class="cache-head"></div>

        <div class="navbar"> 
            <RouterLink :to="{ name: 'home' }" v-if="!isAdminRoute">Accueil</RouterLink>
            <RouterLink :to="{ name: 'panier' }" v-if="!isAdminRoute">Panier</RouterLink>
            <RouterLink :to="{ name: 'commande' }" v-if="!isAdminRoute">Commandes</RouterLink>

            <RouterLink :to="{ name: 'admin-commande' }" v-if="isAdminRoute">Commandes</RouterLink>
            <RouterLink :to="{ name: 'admin-categorie' }" v-if="isAdminRoute">Catégorie</RouterLink>
            <RouterLink :to="{ name: 'admin-boisson' }" v-if="isAdminRoute">Boisson</RouterLink>
            <RouterLink :to="{ name: 'admin-ingredient' }" v-if="isAdminRoute">Ingrédient</RouterLink>
        </div>
    </nav>
</template>

<script setup>
    import { RouterLink, useRoute } from 'vue-router';
    import { ref, watch } from 'vue';

    const $route = useRoute();
    const isAdminRoute = ref($route.path.includes('/admin'));

    watch($route, () => {
        isAdminRoute.value = $route.path.includes('/admin');
    });
</script>

<style scoped>
 nav {
    width:100%;
    height: 100px;
    margin-bottom: 1em;
 }
 .cache-head {
     height: 50%;
     background-color: var(--primary) !important;
 }

 .navbar {
     background-color: var(--secondary);
     height: 50%;
     display: flex;
     justify-content: space-around;
     align-items: center;
 }

 a {
     color: white;
     text-decoration: none;
     font-size: clamp(12px, 1em, 24px);
 }
</style>