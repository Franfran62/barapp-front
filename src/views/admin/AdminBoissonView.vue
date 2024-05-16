<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import type { Boisson } from '@/type/Boisson';

const isLoading = ref(true);
const boissons = ref<Boisson[]>([]);;
const router = useRouter();

onBeforeMount(async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}boisson`, {
            headers: {
                'auth-token': localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        });
        boissons.value = response.data;
    } catch (error) {
        alert('Une erreur est survenue, vous devrez vous reconnecter');
        router.push({ name: 'login' });
        
    } finally {
        isLoading.value = false;
    }
});

const redirectToCreateBoissonView = () => {
  router.push({ name: 'admin-boisson-create' });
};

const removeBoisson = async (id: number) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}admin/boisson/${id}`, {
                headers: {
                    'auth-token': localStorage.getItem('token'),
                    "Content-Type": "application/json"
                }
            });
            boissons.value = boissons.value.filter(boisson => boisson.id !== id);
        } catch (error) {
            alert('Une erreur est survenue lors de la suppression de la catégorie');
        }
}
</script>

<template>
    <main v-if="isLoading">Chargement...</main>
    <main v-else>
        
        <section class="create-boisson">
                <button @click="redirectToCreateBoissonView()">Créer une boisson</button>
        </section>

        <section class="show-boissons">
            <div class="headers">
                <h2>Nom</h2>
                <h2>Catégorie</h2>
            </div>

            <article v-for="boisson in boissons">
                <p>{{ boisson.nom }}</p>
                <p>{{ boisson.categorie.nom}}</p>
                <button @click="removeBoisson(boisson.id)">
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

.create-boisson {
    display: flex;
    justify-content: center;
    margin: 2em 0;
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

.show-boissons {
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


</style>