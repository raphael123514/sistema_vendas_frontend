<template>
    <div class="login-container">
        <div class="login-card">
            <h1 class="login-title">Bem-vindo</h1>
            <form @submit.prevent="login">
                <div class="input-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="email" required />
                </div>
                <div class="input-group">
                    <label for="password">Senha</label>
                    <input type="password" id="password" v-model="password" required />
                </div>
                <button class="login-btn" type="submit">Entrar</button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')

function login() {
    // Aqui você pode adicionar a lógica de autenticação
    alert(`Email: ${email.value}\nSenha: ${password.value}`)
}
</script>

<style scoped>
.login-container {
    min-height: 100vh;
    min-width: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    
}

.login-card {
    background: #23272f;
    padding: 2.5rem 2rem;
    border-radius: 1.5rem;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 350px;
}

.login-title {
    color: #fff;
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: 1px;
}

.input-group {
    width: 100%;
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
}

.input-group label {
    color: #b5b5b5;
    margin-bottom: 0.5rem;
    font-size: 1rem;
}

.input-group input {
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    border: none;
    background: #18181b;
    color: #fff;
    font-size: 1rem;
    outline: none;
    transition: box-shadow 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.input-group input:focus {
    box-shadow: 0 0 0 2px #6366f1;
}

.login-btn {
    width: 100%;
    padding: 0.75rem 0;
    border: none;
    border-radius: 0.75rem;
    background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
    color: #fff;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
}

.login-btn:hover {
    background: linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%);
    transform: translateY(-2px) scale(1.03);
}
</style>
