<template>
    <div class="header-vendas">
        <BaseTitle>Vendas</BaseTitle>
        <BaseButton type="button" @click="openModal = true" class="btn-nova-venda">
            <IconDocumentation style="margin-right: 6px; vertical-align: middle;" /> Nova Venda
        </BaseButton>
    </div>

    <BaseMessage v-if="showSuccess" type="success" :message="messageSuccess" :duration="5000"
        @close="showSuccess = false" />
    <BaseMessage v-if="showError" type="error" :message="apiErrorMessage" :errors="apiErrors" :duration="5000"
        @close="showError = false" />

    <div class="container-entitys">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;width: 100%;">
            <div style="max-width: 350px; margin-bottom: 1.5rem; width: 100%;">
                <BaseSelectSearch label="Filtrar por vendedor" v-model="vendedorSelecionado" :options="sellersOptions"
                    placeholder="Selecione um vendedor" clearable />
            </div>
            <BaseWhiteButton
                :disabled="!vendedorSelecionado"
                @click="enviarRelatorio"
                tooltip="Selecione um vendedor"
            >
                Enviar Relatório
            </BaseWhiteButton>

        </div>

        <vue-good-table :columns="columns" :rows="vendas" :pagination-options="paginationOptions"
            :total-rows="totalItems" :current-page="page" :per-page="perPage" :loading="loading"
            v-on:page-change="onPageChange" v-on:per-page-change="onPerPageChange" style="margin-top: 2rem;" />
    </div>

    <VendaModal :open="openModal" @close="openModal = false" @save="handleSave" />
    
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { VueGoodTable } from 'vue-good-table-next'
import axios from 'axios'
import moment from 'moment';

import BaseButton from '@/components/base/BaseButton.vue'
import BaseTitle from '@/components/base/BaseTitle.vue'
import BaseMessage from '@/components/base/BaseMessage.vue'
import VendaModal from './VendaModal.vue'
import IconDocumentation from '@/components/icons/IconDocumentation.vue'
import BaseSelectSearch from '@/components/base/BaseSelectSearch.vue'
import BaseWhiteButton from '@/components/base/BaseWhiteButton.vue'

import { translateApiErrors } from '@/utils/translateErrors'
import { useSellers } from '@/composables/useSellers'

const openModal = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const messageSuccess = ref('')
const apiErrorMessage = ref('')
const apiErrors = ref<Record<string, string[]>>({})
const vendas = ref<{ venda: string; valor: string; vendedor: string }[]>([])
const loading = ref(false)
const page = ref(1)
const perPage = ref(10)
const totalItems = ref(0)

const { sellersOptions, fetchSellers } = useSellers()

const vendedorSelecionado = ref<string | null>(null)

const columns = [
    {
        label: 'Data',
        field: 'date',
        formatFn: (value: string) => {
            return value ? moment(value).format('DD/MM/YYYY') : '';
        }
    },
    { 
        label: 'Valor', 
        field: 'amount',
        formatFn: (value: number) => {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value);
        }
    },
    { 
        label: 'Vendedor', 
        field: 'sellerName' 
    }
];

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
        const params: any = { page: page.value, per_page: perPage.value }
        let res: any = {}

        if (vendedorSelecionado.value) {
            params.seller_id = vendedorSelecionado.value
            res = await axios.get(`/sellers/${vendedorSelecionado.value}/sales`, {
                params,
                headers: { Authorization: `Bearer ${token}` }
            })
        } else {
            res = await axios.get('/sales', {
                params,
                headers: { Authorization: `Bearer ${token}` }
            })
        }

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
            messageSuccess.value = 'Venda salva com sucesso!'
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

async function enviarRelatorio() {
  if (!vendedorSelecionado.value) return;
  try {
    const token = localStorage.getItem('auth_token')
    await axios.post(`/sellers/${vendedorSelecionado.value}/resend-commission`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    showSuccess.value = true
    apiErrorMessage.value = ''
    showError.value = false
    messageSuccess.value = 'Relatório enviado com sucesso, em instante você recebera o e-mail!'
  } catch (e) {
    showError.value = true
    showSuccess.value = false
    apiErrorMessage.value = 'Erro ao enviar relatório.'
  }
}

function onPageChange(params: { currentPage: number }) {
    page.value = params.currentPage
}
function onPerPageChange(params: { currentPerPage: number }) {
    perPage.value = params.currentPerPage
    page.value = 1
}

onMounted(() => {
    fetchSellers()
    fetchVendas()
})
watch([page, perPage, vendedorSelecionado], fetchVendas)
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
.container-entitys{
    background: #23232b;
    border-radius: 1.2rem;
    padding: 2rem 2.5rem 2.5rem 2.5rem;
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.10);
    margin-bottom: 2rem;
}
</style>
