<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import type { BoissonDto } from '@/type/BoissonDto.ts';
import type { Liste } from '@/type/Liste.ts';
import axios from 'axios';

const isLoading = ref(true);
const categories = ref<Liste[]>([]);
const ingredients = ref<Liste[]>([]);
const router = useRouter();

const headers = {
            'auth-token': localStorage.getItem('token'),
            "Content-Type": "application/json"
        };

onBeforeMount(async () => {
    try {
        const responseCategories = await axios.get(`${import.meta.env.VITE_API_URL}categorie/liste`, {headers});
        categories.value = responseCategories.data;

        const responseIngredients = await axios.get(`${import.meta.env.VITE_API_URL}ingredient/liste`, {headers});
        ingredients.value = responseIngredients.data;

    } catch (error) {
        alert('Une erreur est survenue, vous devrez vous reconnecter');
        console.log(error);
        router.push({ name: 'login' });
        
    } finally {
        isLoading.value = false;
    }
});
const newBoisson = ref<BoissonDto>({
    nom: "",
    categorieId: null,
    prix: [0,0,0],
    ingredientsListId: []
});

const createBoisson = async () => {
    console.log(newBoisson.value);
    try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}admin/boisson`, newBoisson.value, {headers});
        router.push({ name: 'admin-boisson' });
    } catch (error) {
        alert('Une erreur est survenue lors de la création de la boisson');
    }
}
</script>

<template>
    <main v-if="isLoading">Chargement...</main>
    <main v-else>
        <section class="create-boisson">
            <form @submit.prevent="createBoisson">
                <div class="column">
                    <label for="nom">Nom</label>
                    <input type="text" id="nom" v-model="newBoisson.nom" required>
    
                    <label for="categorie">Catégorie</label>
                    <select id="categorie" v-model="newBoisson.categorieId" required>
                        <option v-for="categorie in categories" :value="categorie.id">{{ categorie.nom }}</option>
                    </select>
                    <div class="prix">
                        <div class="S">
                            <label>Prix S</label>
                            <input type="number" v-model.number="newBoisson.prix[0]" required>
                        </div>
                        
                        <div class="M">
                            <label>Prix M</label>
                            <input type="number" v-model.number="newBoisson.prix[1]" required>
                        </div>
                        <div class="L">
                            <label> Prix L </label>
                            <input type="number" v-model.number="newBoisson.prix[2]" required>
                        </div>
                    </div>

                    <button type="submit">Créer</button>
                </div>
                <div class="column-ingredients">
                    <label for="ingredients">Ingrédients</label>
                    <div v-for="ingredient in ingredients" :key="ingredient.id" class="checkbox-row">
                        <input type="checkbox" :value="ingredient.id" v-model="newBoisson.ingredientsListId" class="margin-right">
                        <label class="no-margin">{{ ingredient.nom }}</label>
                    </div>
                </div>
             

            </form>
        </section>
    </main>
</template>

<style scoped>
.create-boisson {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.create-boisson form {
    display: flex;
    flex-direction: row;
    width: 100%;
    max-width: 700px;
}

.create-boisson form .column {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
    padding: 1em;
}

.create-boisson form .prix {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    padding: 1em;
}

.S, .M, .L {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0.5em;
}

.create-boisson label {
    margin-top: 10px;
    margin-bottom: 5px;
    font-weight: bold;
    min-width: 100%;
}

.create-boisson input, .create-boisson select {
    padding: 10px;
    border-radius: 25px;
    border-color: var(--primary);
    font-size: 16px;
    width: 100%;
}

.create-boisson button {
    padding: 0.5em 1.5em;
    margin: 0.5em;
    font-size: 1.1em;
    border: none;
    border-radius: 15px;
    background-color: var(--primary);
    color: white;
    cursor: pointer;
}

.column-ingredients {
    display: flex;
    flex-direction: column;
    align-items: start;
    text-align: start;
    justify-content: start;
    width: 50%;
    padding: 1em;
}

.checkbox-row {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.margin-right {
    margin-right: 1em;
}

.no-margin {
    margin: 0 !important;
}

</style>