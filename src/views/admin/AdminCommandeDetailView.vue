<script setup lang="ts">
import { ref, watchEffect, computed, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import commandAdminStore from '@/store/commandAdminStore';
import type { CommandeAdmin } from '@/type/CommandeAdmin.ts';
import axios from 'axios';
import type { Produit } from '@/type/Produit.ts';

const router = useRouter();
const commandeId = useRoute().params.id;
if (commandeId == null) {
    router.push({ name: 'admin-commande' });
}

const commande = ref<CommandeAdmin | undefined>(commandAdminStore.getCommandAdminById(Number(commandeId)));
if (commande.value === undefined) {
    router.push({ name: 'admin-commande' });
}

const produitsArray = ref<Produit[]>([]);
const statuts = ['Préparation des Ingrédients', 'Assemblage', 'Dressage', 'Terminée'];


watchEffect(() => {
    if (commande.value) {
        produitsArray.value = JSON.parse(commande.value.produits);
    }
});

const formatDate = (date: string) => {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}h${minutes}`;
};

const updateStatut = (produit: Produit, index: number) => {
    if (produit.statut == "" || produit.statut == null) {
        produitsArray.value[index].statut = statuts[0];
    } else {     
        const currentIndex = statuts.indexOf(produit.statut);
        const nextIndex = (currentIndex + 1) % statuts.length;
        produitsArray.value[index].statut = statuts[nextIndex];
    }
    sendUpdate ();
}

const sendUpdate = () => {
    if (commande.value) {
        let data = {
            "id": commande.value.id,
            "produits": produitsArray.value
        };
        axios.patch(`${import.meta.env.VITE_API_URL}admin/commande`, data, {
            headers: {
                "auth-token": localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (true == response.data) {

                }
            })
            .catch(error => {
                alert('La connection est perdue, vous devez vous reconnecter');
                router.push({ name: 'login' });
            });
    }
};  

</script>

<template>
<main>
    <section class="big-headers">
        <div class="flex">
            <router-link :to="{ name: 'admin-commande' }" class="margin-right">
            <img src="/icons/utils/back.png" alt="Icone de retour arrière" class="very-small-icon">
            </router-link>
            <h2 v-if="commande"> #{{ commande.numero }}</h2>
        </div>
        <h2 v-if="commande">{{ commande.nbProduit }} Boisson{{ commande.nbProduit > 1 ? 's' : '' }}</h2>
        <h2 v-if="commande">{{ formatDate(commande.date) }}</h2>
    </section>

    <section v-for="(produit, index) in produitsArray" :key="index">
        <div class="row">
            <article class="produits" :class="{ 'produit-termine': produit.statut == 'Terminée' }">
                <div class="flex">
                    <button v-if="produit.statut != 'Terminée'" @click="updateStatut(produit, index)">
                        <img               
                            src="/icons/utils/plus.png" 
                            alt="Icone ajouter" 
                            class="small-icon">
                    </button>
    
                    <button v-else>
                        <img               
                            src="/icons/utils/succes.png" 
                            alt="Icone ajouter" 
                            class="small-icon">
                    </button>
                </div>
                <div class="flex text-center">
                    <h3>1 {{ produit.taille }} {{ produit.nom }}</h3>
                </div>
            </article>
            <article class="produit-statut">
                <div id="statut1"class="width-25" :class="{ 'hidden': statuts.indexOf(produit.statut) < 0 }">Préparation des Ingrédients</div>
                <div id="statut2"class="width-25" :class="{ 'hidden': statuts.indexOf(produit.statut) < 1 }">Assemblage</div>
                <div id="statut3"class="width-25" :class="{ 'hidden': statuts.indexOf(produit.statut) < 2 }">Dressage</div>
                <div id="statut4"class="width-25" :class="{ 'hidden': statuts.indexOf(produit.statut) < 3 }">Terminée</div>
            </article>
        </div>
    </section>
</main>
</template>


<style scoped>

main {
    margin-top: 5%;
    margin-left: 10%;
    margin-right: 10%;
}

.flex {
    display: flex;
    align-items: center;
}

.row {
    display: flex;
    justify-content: center;
    margin-bottom: 1em;
}

.margin-right {
    margin-right: 1em;
}

.very-small-icon {
    width: 1.8em;
}

.width-25 {
    flex-grow: 1;
    width: 25%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.big-headers {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5%;
}

article {
    width: 50%;
    margin-bottom: 0 !important; 
}

.produits {
    background-color: var(--secondary);
    display: flex;
    justify-content: space-around;
    margin-bottom: 5%;
    font-size: 1.2em;
    padding: 1em;
}

.produit-termine {
    background-color: var(--success);

}

.produit-statut {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1em;
    margin: 0;
}

button {
    background-color: transparent;
    border: none;
    cursor: pointer;

}

.hidden {
    visibility: hidden;
}

#statut1 {
    background-color: rgba(var(--quaternary-rgba), 0.5);
    height: 100%;
}

#statut2 {
    background-color: var(--quaternary);
}

#statut3 {
    background-color: rgba(var(--success-rgba), 0.5);
}


#statut4 {
    background-color: var(--success);
}
</style>