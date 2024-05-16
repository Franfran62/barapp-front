<script setup lang="ts">

import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { LoginData } from '@/type/LoginData.ts';
import axios from 'axios';

const router = useRouter();


const username = ref('');
const password = ref('');
const showPasswordRequirements = ref(false);

const validateUsernameClass = computed(() => {
    if (username.value === '') {
        return '';
    } else {
        return username.value ? 'validate' : "";
    }
});

const validatePasswordClass = computed(() => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (password.value === '') {
        return '';
    } else {
        return passwordRegex.test(password.value) ? 'validate' : 'not-validate';
    }
});

const isFormValid = computed(() => {
    return validateUsernameClass.value === 'validate' && validatePasswordClass.value === 'validate';
});

const login = () => {

    const data: LoginData = {
        username: username.value,
        password: password.value
    };

    axios.post(`${import.meta.env.VITE_API_URL}auth`, data)
        .then(response => {
            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error('Vos identifiants sont incorrects');
            }
        })
        .then(data => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('loginTime', Date.now().toString());
            router.push({ name: 'admin-commande' });
        })
        .catch(error => {
            console.log(error);
            throw new Error('Vos identifiants sont incorrects ou il y a eu une erreur');
        });
};


</script>

<template>
    <main>
        <form @submit.prevent="login" class="login-form">
            <div>
                <div :class="validateUsernameClass">
                    <label for="username">Username</label>
                    <input type="text" id="username" placeholder="Username" v-model="username" class="login-form input " />
                    <div class="validate-message"></div>
                </div>
                <div :class="validatePasswordClass" >
                    <label for="password">Password</label>
                    <input type="password" id="password" placeholder="Password" v-model="password" @input="showPasswordRequirements = true" />
                    <small class="password-requirements extralight">Le mot de passe doit contenir au moins 8 caractères, dont au moins 1 chiffre, 1 lettre minuscule et 1 lettre majuscule.</small>
                </div>
            </div>
            <div>
                <button class="btn btn-primary" type="submit" :disabled="!isFormValid">Se connecter</button>
            </div>
        </form>
    </main>
</template>

<style scoped>

main {
    margin-top: 15%;
}

.login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80%;
    margin: 0 auto;
    padding: 20px;
    border-radius: 8px;
  }

  .login-form input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 2px solid var(--primary);
    border-radius: 15px;
  }


  button {
    margin-top: 0.5em;
  }
</style>