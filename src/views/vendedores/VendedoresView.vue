<template>
    <div class="header-vendedores">
        <BaseTitle>Vendedores</BaseTitle>
        <BaseButton type="button" @click="openModal = true" class="btn-novo-vendedor">
            <IconCommunity style="margin-right: 6px; vertical-align: middle;" /> Novo Vendedor
        </BaseButton>
    </div>
    <BaseMessage v-if="showSuccess" type="success" message="Vendedor cadastrado com sucesso!" :duration="5000"
        @close="showSuccess = false" />
    <BaseMessage v-if="showError" type="error" :message="apiErrorMessage" :errors="apiErrors" :duration="5000"
        @close="showError = false" />
    <VendedorModal :open="openModal" @close="openModal = false" @save="handleSave" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import VendedorModal from './VendedorModal.vue'
import IconCommunity from '@/components/icons/IconCommunity.vue'
import BaseTitle from '@/components/base/BaseTitle.vue'
import BaseMessage from '@/components/base/BaseMessage.vue'
import axios from 'axios'
import { translateApiErrors } from '@/utils/translateErrors'

const openModal = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const apiErrorMessage = ref('')
const apiErrors = ref<Record<string, string[]>>({})

function handleSave(data: { name: string; email: string }) {
    console.log('Salvar Vendedor:', data)
    const token = localStorage.getItem('auth_token')
    axios.post('/sellers', data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(() => {
            showSuccess.value = true
            showError.value = false
            apiErrorMessage.value = ''
            apiErrors.value = {}
            openModal.value = false
        })
        .catch(error => {
            console.error('Erro ao salvar vendedor:', error)
            showSuccess.value = false
            showError.value = true
            apiErrorMessage.value = 'Erro ao salvar vendedor. Verifique os campos obrigatórios.'
            apiErrors.value = translateApiErrors(error.response?.data?.errors || {})
            openModal.value = false
        })
}
</script>

<style scoped>
.header-vendedores {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
}

.btn-novo-vendedor {
    font-size: 0.95rem;
    padding: 0.4rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    width: fit-content;
}
</style>
