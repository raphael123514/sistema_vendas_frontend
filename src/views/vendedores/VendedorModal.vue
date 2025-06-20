<template>
    <BaseModal :open="open" title="Novo Vendedor" @close="close">
        <form @submit.prevent="handleSubmit">
            <BaseInput label="Nome" id="name" v-model="name" required />
            <BaseInput label="Email" id="email" type="email" v-model="email" required />
        </form>
        <template #footer>
            <BaseButton type="button" @click="close">Cancelar</BaseButton>
            <BaseButton type="button" @click="handleSubmit">Salvar</BaseButton>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'

const emit = defineEmits(['close', 'save'])
const { open } = defineProps<{ open: boolean }>()
const name = ref('')
const email = ref('')

function handleSubmit() {
    emit('save', { name: name.value, email: email.value })
    name.value = ''
    email.value = ''
}
function close() {
    emit('close')
    name.value = ''
    email.value = ''
}
</script>
