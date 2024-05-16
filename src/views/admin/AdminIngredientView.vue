<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import type { Ingredient } from '@/type/Ingredient';

const isLoading = ref(true);
const ingredients = ref<Ingredient[]>([]);;
const router = useRouter();

onBeforeMount(async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}ingredient`, {
            headers: {
                'auth-token': localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        });
        ingredients.value = response.data;
    } catch (error) {
        alert('Une erreur est survenue, vous devrez vous reconnecter');
        router.push({ name: 'login' });
        
    } finally {
        isLoading.value = false;
    }
});

const removeIngredient = async (id: number) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}admin/ingredient/${id}`, {
                headers: {
                    'auth-token': localStorage.getItem('token'),
                    "Content-Type": "application/json"
                }
            });
            ingredients.value = ingredients.value.filter(ingredient => ingredient.id !== id);
        } catch (error) {
            alert("Une erreur est survenue lors de la suppression de l'ingrédient");
        }
}


const newIngredientName = ref(''); 

const createIngredient = async () => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}admin/ingredient`, {
            nom: newIngredientName.value
        }, {
            headers: {
                'auth-token': localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        });
        ingredients.value.push(response.data);
        newIngredientName.value = ''; 
    } catch (error) {
        alert("Une erreur est survenue lors de la création de l'ingrédient");
    }
}
</script>

<template>
    <main v-if="isLoading">Chargement...</main>
    <main v-else>
        
        <section class="create-ingredient">
            <form @submit.prevent="createIngredient">
                <input v-model="newIngredientName" type="text" placeholder="Nom du nouvel ingrédient" required>
                <button type="submit">Créer</button>
            </form>
        </section>

        <section class="show-ingredients">
            <div class="headers">
                <h2>Nom</h2>
                <h2>Nb Boissons</h2>
            </div>

            <article v-for="ingredient in ingredients">
                <p>{{ ingredient.nom }}</p>
                <p>{{ ingredient.boissonsAttached ? ingredient.boissonsAttached.length : 0 }}</p>
                <button v-if="ingredient.id" @click="removeIngredient(ingredient.id)">
                    <img               
                        src="/icons/utils/remove.png" 
                        alt="Icone ajouter" 
                        class="small-icon"> 
                </button>
            </article>
        </section>
    </main>
</template>

<style scoped>
.show-ingredients {
    margin:auto;
    width: 80%;
}
.headers {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
    font-size: 1.5em;
}

.headers h2 {
    flex-basis: 0;
    flex-grow: 1;
    text-align: center;
}

article {
    display: flex;
    justify-content:space-around;
    padding: 10px 0;
    border-top: 1px solid #ccc;
}

article p {
    flex-basis: 0;
    flex-grow: 1;
    text-align: center;
    font-size: 1.2em;
    display: flex;
    align-items: center;
    justify-content: center;

}

button {
    background: none;
    border: none;
    cursor: pointer;
}

.create-ingredient {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border:none;
}

.create-ingredient form {
    display: flex;
    justify-content: center;
    margin-bottom: 2em;
}

.create-ingredient input {
    flex-grow: 0.5;
    padding: 1em 1.5em;
    margin: 0.5em;
    border-radius: 25px;
    border-color: var(--primary);
}

.create-ingredient button {
    padding: 0.5em 1.5em;
    margin: 0.5em;
    font-size: 1.1em;
    border: none;
    border-radius: 15px;
    background-color: var(--primary);
    color: white;
    cursor: pointer;
}

</style>