<template>
    <div class="header-vendas">
        <BaseTitle>Vendas</BaseTitle>
        <BaseButton type="button" @click="openModal = true" class="btn-nova-venda">
            <IconDocumentation style="margin-right: 6px; vertical-align: middle;" /> Nova Venda
        </BaseButton>
    </div>

    <VendaModal :open="openModal" @close="openModal = false" @save="handleSave" />
    
    <BaseMessage v-if="showSuccess" type="success" message="Venda cadastrada com sucesso!" :duration="5000"
        @close="showSuccess = false" />

    <BaseMessage v-if="showError" type="error" :message="apiErrorMessage" :errors="apiErrors" :duration="5000"
        @close="showError = false" />
    
    <vue-good-table :columns="columns" :rows="vendas" :pagination-options="paginationOptions" :total-rows="totalItems"
        :current-page="page" :per-page="perPage" :loading="loading" v-on:page-change="onPageChange" 
        v-on:per-page-change="onPerPageChange" style="margin-top: 2rem;" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTitle from '@/components/base/BaseTitle.vue'
import BaseMessage from '@/components/base/BaseMessage.vue'
import VendaModal from './VendaModal.vue'
import IconDocumentation from '@/components/icons/IconDocumentation.vue'
import { VueGoodTable } from 'vue-good-table-next'
import axios from 'axios'
import { translateApiErrors } from '@/utils/translateErrors'

const openModal = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const apiErrorMessage = ref('')
const apiErrors = ref<Record<string, string[]>>({})
const vendas = ref<{ venda: string; valor: string; vendedor: string }[]>([])
const loading = ref(false)
const page = ref(1)
const perPage = ref(10)
const totalItems = ref(0)

const columns = [
    { 
        label: 'Data', 
        field: 'date',
        formatFn: (value: string) => {
            if (!value) return '';
            const date = new Date(value);
            return date.toLocaleDateString('pt-BR');
        }
    },
    { label: 'Valor', field: 'amount' },
    { label: 'Vendedor', field: 'sellerName' }
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

async function fetchVendas() {
    loading.value = true
    try {
        const token = localStorage.getItem('auth_token')
        const res = await axios.get('/sales', {
            params: { page: page.value, per_page: perPage.value },
            headers: { Authorization: `Bearer ${token}` }
        })
        vendas.value = (res.data.data || []).map((v: any) => ({
            date: v.date,
            amount: v.amount,
            sellerName: v.seller?.name || ''
        }))
        totalItems.value = res.data.meta?.total || 0
        showError.value = false
        apiErrorMessage.value = ''
    } catch (e) {
        vendas.value = []
        totalItems.value = 0
        showError.value = true
        showSuccess.value = false
        apiErrorMessage.value = 'Erro ao buscar vendas.'
    } finally {
        loading.value = false
    }
}

async function handleSave(data: { date: string; amount: string; seller_id: BigInteger }) {
    const token = localStorage.getItem('auth_token')
     axios.post('/sales', data, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(() => {
            showSuccess.value = true
            showError.value = false
            apiErrorMessage.value = ''
            apiErrors.value = {}
            openModal.value = false
            fetchVendas()
        })
        .catch(error => {
            console.error('Erro ao salvar venda:', error)
            showSuccess.value = false
            showError.value = true
            apiErrorMessage.value = 'Erro ao salvar venda. Verifique os campos obrigatórios.'
            apiErrors.value = translateApiErrors(error.response?.data?.errors || {})
            openModal.value = false
        })
}

function onPageChange(params: { currentPage: number }) {
    page.value = params.currentPage
}
function onPerPageChange(params: { currentPerPage: number }) {
    perPage.value = params.currentPerPage
    page.value = 1
}

onMounted(fetchVendas)
watch([page, perPage], fetchVendas)
</script>

<style scoped>
.header-vendas {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
}

.btn-nova-venda {
    font-size: 0.95rem;
    padding: 0.4rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    width: fit-content;
}
</style>
