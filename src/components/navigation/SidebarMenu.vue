<template>
    <nav :class="styles.sidebar">
        <div :class="styles['sidebar-header']">
            <span :class="styles['sidebar-title']">Sistema de Vendas</span>
        </div>
        <ul :class="styles['sidebar-menu']">
            <li>
                <RouterLink :to="'/home/vendedores'" :class="styles['sidebar-link']" active-class="active">
                  <IconCommunity style="margin-right: 8px; vertical-align: middle;" />
                  Vendedores
                </RouterLink>
            </li>
            <li>
                <RouterLink :to="'/home/vendas'" :class="styles['sidebar-link']" active-class="active">
                  <IconDocumentation style="margin-right: 8px; vertical-align: middle;" />
                  Vendas
                </RouterLink>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import styles from './SidebarMenu.module.css'
import IconCommunity from '@/components/icons/IconCommunity.vue'
import IconDocumentation from '@/components/icons/IconDocumentation.vue'
</script>

<style scoped></style>
