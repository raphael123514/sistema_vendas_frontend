<template>
    <div :class="styles['login-container']">
        <div :class="styles['login-card']">
            <h1 :class="styles['login-title']">Bem-vindo</h1>
            <form @submit.prevent="login">
                <BaseInput label="Email" id="email" type="email" v-model="email" required />
                <BaseInput label="Senha" id="password" type="password" v-model="password" required />
                <BaseButton type="submit">Entrar</BaseButton>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import styles from '@/assets/login.module.css'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

const email = ref('')
const password = ref('')
const router = useRouter()

function login() {
    axios.post('/login', {
        email: email.value,
        password: password.value
    })
        .then(response => {
            const token = response.data.token
            if (token) {
                localStorage.setItem('auth_token', token)
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                router.push('/home')
            } else {
                alert('Login falhou: token não recebido.')
            }
        })
        .catch(error => {
            alert('Erro no login: ' + (error.response?.data?.message || error.message))
        })
}
</script>
