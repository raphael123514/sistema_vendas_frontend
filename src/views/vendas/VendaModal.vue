<template>
    <BaseModal :open="open" title="Nova Venda" @close="close">
        <form @submit.prevent="handleSubmit">
            <BaseInput label="Data" id="date" v-model="date" required type="date"/>
            <BaseInput label="Valor" id="amount" v-model="amount" type="number" min="0" step="0.01" required />
            <BaseSelectSearch label="Vendedor" id="seller" v-model="seller" :options="sellersOptions" required />
        </form>
        <template #footer>
            <BaseButton type="button" @click="close">Cancelar</BaseButton>
            <BaseButton type="button" @click="handleSubmit">Salvar</BaseButton>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps, onMounted } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseSelectSearch from '@/components/base/BaseSelectSearch.vue'
import axios from 'axios'


const emit = defineEmits(['close', 'save'])
const { open } = defineProps<{ open: boolean }>()
const date = ref('')
const amount = ref('')
const seller = ref('')
const sellersOptions = ref<{ label: string, value: string }[]>([])

onMounted(async () => {
    try {
        const token = localStorage.getItem('auth_token')
        const res = await axios.get('/sellers', { headers: { Authorization: `Bearer ${token}` } })
        sellersOptions.value = (res.data.data || []).map((v: any) => ({
            label: v.name,
            value: v.id
        }))
    } catch (e) {
        sellersOptions.value = []
    }
})

function handleSubmit() {
    emit('save', { date: date.value, amount: amount.value, seller_id: seller.value })
    date.value = ''
    amount.value = ''
    seller.value = ''
}
function close() {
    emit('close')
    date.value = ''
    amount.value = ''
    seller.value = ''
}
</script>
