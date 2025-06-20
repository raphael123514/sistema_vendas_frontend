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

    <vue-good-table :columns="columns" :rows="sellers" :pagination-options="paginationOptions" :total-rows="totalItems"
        :current-page="page" :per-page="perPage" :search-options="{ enabled: false }" :loading="loading"
        v-on:page-change="onPageChange" v-on:per-page-change="onPerPageChange" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { VueGoodTable } from 'vue-good-table-next'

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

const sellers = ref<{ name: string; email: string }[]>([])
const loading = ref(false)
const page = ref(1)
const perPage = ref(10)
const totalItems = ref(0)

const columns = [
    {
        label: 'Nome',
        field: 'name',
        sortable: true
    },
    {
        label: 'E-mail',
        field: 'email',
        sortable: true
    }
]

const paginationOptions = computed(() => ({
    enabled: true,
    mode: 'pages',
    perPage: perPage.value,
    perPageDropdown: [5, 10, 20, 50],
    dropdownAllowAll: false,
    server: true,
    nextLabel: 'Próximo',
    prevLabel: 'Anterior',
    rowsPerPageLabel: 'Linhas por página',
    ofLabel: 'de',
    pageLabel: 'página',
    allLabel: 'Todos'
}))

function fetchSellers() {
    loading.value = true
    const token = localStorage.getItem('auth_token')

    axios.get('/sellers', {
        params: { page: page.value, per_page: perPage.value },
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => {
            sellers.value = Array.isArray(response.data.data)
                ? response.data.data.map((v: any) => ({
                    name: String(v?.name || ''),
                    email: String(v?.email || '')
                }))
                : []
            totalItems.value = response.data.meta?.total || 0
        })
        .catch(error => {
            console.error('Erro ao buscar vendedores:', error)
            sellers.value = []
            totalItems.value = 0
        })
        .finally(() => {
            loading.value = false
        })
}

function onPageChange(params: { currentPage: number }) {
    page.value = params.currentPage
}

function onPerPageChange(params: { currentPerPage: number }) {
    perPage.value = params.currentPerPage
    page.value = 1
}

watch([page, perPage], fetchSellers)

function handleSave(data: { name: string; email: string }) {
    const token = localStorage.getItem('auth_token')

    axios.post('/sellers', data, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(() => {
            showSuccess.value = true
            showError.value = false
            apiErrorMessage.value = ''
            apiErrors.value = {}
            openModal.value = false
            fetchSellers()
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

onMounted(fetchSellers)
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
