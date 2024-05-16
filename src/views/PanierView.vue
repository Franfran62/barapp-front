<script setup lang="ts">
import cart from '@/store/cart';
import axios from 'axios';
import { RouterLink, useRouter } from 'vue-router';
import { ref } from 'vue';
import type { Produit } from '@/type/Produit.ts';
import type { Commande } from '@/type/Commande.ts';

const router = useRouter();
const numero = ref(null);
const showModal = ref(false);

const command = () => {
    const command: Commande = {
        prix: cart.getTotal(),
        produits: cart.getCartItems().flatMap((cartItem) => {
            const produits = [];
            for (let i = 0; i < cartItem.quantity; i++) {
                produits.push({
                    idBoisson: cartItem.produit.idBoisson,
                    nom: cartItem.produit.nom,
                    taille: cartItem.produit.taille,
                    prix: cartItem.produit.prix
                }as Produit);
            }
            return produits;
        })
    };
    
    axios.put(`${import.meta.env.VITE_API_URL}commande`, command)
        .then(response => {
            numero.value = response.data;
            cart.clearCart();
            router.push({ name: 'commande-success' , params: { numero: numero.value }});
        })
        .catch(error => {
           showModal.value = true;
        });
};

</script>

<template>
    <main v-if="cart.getCartCount() == 0">
        <div class="panier-vide">
            <img               
                src="/icons/cart/triste.png" 
                alt="Icone triste" 
                class="icon"> 

            <h1 class="padding-top">Votre panier est vide ...</h1>
            <router-link :to="{ name: 'home' }">Commander ! </router-link>
        </div>
    </main>
    <main v-else>

        <h1 class="text-center">Votre panier</h1>
        <br>

        <article v-for="cartItem in cart.getCartItems()" :key="cartItem.id" >
            <div class="row">
                <h3>
                    {{ cartItem.quantity }} {{ cartItem.produit.taille }}
                </h3>
                <h3>
                    {{ cartItem.produit.nom }}
                </h3>
                <span class="legende">
                    {{ cartItem.produit.prix * cartItem.quantity }} €
                </span>
            </div>
            <div class="buttons">
                <button @click="cart.addOne(cartItem.id)">
                    <img               
                        src="/icons/utils/plus.png" 
                        alt="Icone ajouter" 
                        class="small-icon">
                </button>
                <button @click="cart.removeOne(cartItem.id)">
                    <img               
                        src="/icons/utils/moins.png" 
                        alt="Icone ajouter" 
                        class="small-icon">
                </button>
                <button @click="cart.removeFromCart(cartItem.id)">
                    <img               
                        src="/icons/utils/remove.png" 
                        alt="Icone ajouter" 
                        class="small-icon"> 
                </button>
            </div>
        </article>

        <br>

        <div class="text-center">
            <h2 >Total TTC : {{ cart.getTotal() }} €</h2>
            <br>
            <a class="btn btn-primary" @click="command()">Valider le panier</a>
        </div>

        <transition name="modal">
        <div v-if="showModal" class="modal-background" @click.self="showModal = false">
          <div class="modal">
            <h3>Il y a eu une erreur lors de la validation de la commande. Merci de vous adresser au personnel du bar.</h3>
          </div>
        </div>
      </transition>      
    </main>
</template>

<style scoped>
main {
    margin: 0;  
}
article {
    display: flex;
    flex-direction: column;
    background-color: var(--quaternary);
    justify-content: space-between;
    padding: 1em 3em;
}

.row {
    display: flex;
    justify-content: space-around;
}

button {
    background-color: transparent;
    border: none;
    border-radius: 50%;
    cursor: pointer;
}

.buttons {
    display: flex;
    justify-content:end ;
}

.panier-vide {
    min-height: 40%;
    display: flex;
    flex-direction: column;
    justify-content:center;
    align-items:center;
    margin-top: 5em;
}

a {
    text-decoration: none ;
    color: var(--primary);
    font-size: 1.8em;
}

</style>