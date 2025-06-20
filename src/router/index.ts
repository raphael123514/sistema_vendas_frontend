import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: 'vendedores',
          name: 'vendedores',
          component: () => import('../views/vendedores/VendedoresView.vue'),
        },
        {
          path: 'vendas',
          name: 'vendas',
          component: () => import('../views/vendas/VendasView.vue'),
        },
        {
          path: '',
          redirect: { name: 'vendedores' },
        },
      ],
    },
  ],
})

export default router
