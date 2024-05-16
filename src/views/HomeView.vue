<script setup lang="ts">

import { ref, onBeforeMount } from 'vue';
import axios from 'axios';
import cart from '@/store/cart';
import type { Produit } from '@/type/Produit.ts';
import type { Boisson } from '@/type/Boisson.ts';
import type { Ingredient } from '@/type/Ingredient.ts';
import type { Categorie } from '@/type/Categorie.ts';

const isLoading = ref(true);
const categorie = ref<Categorie[]>([]);
const boissonSuggestion = ref<Boisson[]>([]);
const selectedBoisson = ref<Boisson>();
const SizeEnum = Object.freeze({ "S": 0, "M": 1, "L": 2 });
const showModal = ref(false);

onBeforeMount(async () => {
  try {
    const responseCategorie = await axios.get(`${import.meta.env.VITE_API_URL}categorie`);
    categorie.value = responseCategorie.data;

    const responseSuggestion = await axios.get(`${import.meta.env.VITE_API_URL}boisson/suggestion`);
    boissonSuggestion.value = responseSuggestion.data;

  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});

const chooseSize = (boisson: Boisson) => {
  selectedBoisson.value = boisson;
  showModal.value = true;    
};

const addToCart = (boisson: Boisson, prix: number, size: string) => {
  const produit: Produit = {
    idBoisson: boisson.id,
    nom: boisson.nom,
    statut: "",
    taille: size,
    prix: prix
  };
  cart.addToCart(produit);
  showModal.value = false;
};

const randomImage = () => {
    const images = ['icon1.png', 'icon2.png', 'icon3.png', 'icon4.png', 'icon5.png', 'icon6.png']; 
    const randomIndex = Math.floor(Math.random() * images.length);
    return '/icons/cocktails/' + images[randomIndex];
  }

</script>

<template >
    <main v-if="isLoading">Chargement...</main>
    <main v-else>
      <div class="text-center">
        <img 
                src="/logo.png" 
                alt="Logo Bar'App" 
                class="logo"
                >
      </div>
      <div v-if="boissonSuggestion.length > 0">
        <section>
        <h2>Notre suggestion du jour</h2>
            <article  v-for="(boisson, index) in boissonSuggestion" :key="index" @click="chooseSize(boisson)" :class="index % 2 === 1 ? 'reverse' : ''">
            <img 
              src="/icons/suggestion-icon.png" 
              alt="Icone Suggestion du jour" 
              class="small-icon"
              >
            <div>
              <h3 v-if="boisson">{{ boisson.nom }}</h3>
              <p>{{ boisson.ingredients.map((ingredient: Ingredient) => ingredient.nom).join(', ') }}</p>
            </div>
          </article>
        </section>
      </div>

      <br>

      <div v-for="cat in categorie">
        <section  v-if="cat && cat.boissonsAttached && cat.boissonsAttached.length > 0">
          <h2 >{{ cat.nom }}</h2>
            <article v-for="(boisson, index) in cat.boissonsAttached" :key="boisson.id" @click="chooseSize(boisson)" :class="index % 2 === 1 ? 'reverse' : ''">
              <img 
              :src="randomImage()" 
              alt="Icone de la catégorie" 
              class="small-icon"
              >
            <div>
              <h3>{{ boisson.nom }}</h3>
              <p>{{ boisson.ingredients.map((ingredient: Ingredient) => ingredient.nom).join(', ') }}</p>
            </div>
          </article>
        </section>
        <br>
      </div>

      <transition name="modal">
        <div v-if="showModal" class="modal-background" @click.self="showModal = false">
          <div class="modal" v-if="selectedBoisson">
            <button class="size" v-for="(value, key) in SizeEnum" :key="key" @click="addToCart(selectedBoisson, selectedBoisson.prix[value], key)">
              <h3>{{ key }} </h3>
              <h3> {{ selectedBoisson.prix[value] }} €</h3>
            </button>
          </div>
        </div>
      </transition>

      <div class="panier" v-if="cart.getCartCount() > 0" @click="$router.push({ name: 'panier' })">
        <img 
              src="/icons/cart/cart.png" 
              alt="Icone du panier" 
              class="small-icon"
              >
        <p class="panier-quantity"> {{ cart.getCartCount() }} </p>
      </div>

    </main>
</template>

<style scoped>

.logo {
  width: 80%;
  margin: auto 0; 
}
section {
  margin: 1em 0;
  display: flex;
  flex-direction: column;
}

section > article {
  margin: 1em 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.reverse {
  flex-direction: row-reverse;
}

section > article > div {
  padding: 0 1em;
}

.size {
  min-width:25%;
  margin: 0.5em;
  padding: 1.0em;
  border-radius: 15px;
  border: none;
  background-color: var(--tertiary);
  display: flex ;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
}

.panier {
  position: fixed;
  bottom: 0;
  right: 0;
  margin-right: 20px; 
  margin-bottom: 20px;
  background-color: var(--primary);
  border-radius: 100%;
  width: 100px;
  height: 100px;
  padding: 10px;
  display: flex;
  align-items: center;
}

.panier-quantity {
  color: white;
  font-size: 1.5em;
  margin-left: 10px;
}

</style>
