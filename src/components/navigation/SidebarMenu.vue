<template>
    <nav :class="styles.sidebar">
        <div :class="styles['sidebar-header']">
            <span :class="styles['sidebar-title']">Sistema de Vendas</span>
        </div>
        <ul :class="styles['sidebar-menu']">
            <li>
                <RouterLink :to="'/vendedores'" v-slot="{ isActive }">
                    <span :class="[styles['sidebar-link'], isActive && styles['sidebar-link-active']]"
                        style="text-decoration: none !important; box-shadow: none !important;">
                        <IconCommunity style="margin-right: 8px; vertical-align: middle;" />
                        Vendedores
                    </span>
                </RouterLink>
            </li>
            <li>
                <RouterLink :to="'/vendas'" v-slot="{ isActive }">
                    <span :class="[styles['sidebar-link'], isActive && styles['sidebar-link-active']]"
                        style="text-decoration: none !important; box-shadow: none !important;">
                        <IconDocumentation style="margin-right: 8px; vertical-align: middle;" />
                        Vendas
                    </span>
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
