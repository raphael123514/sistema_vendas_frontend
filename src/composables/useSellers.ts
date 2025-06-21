import { ref } from 'vue'
import axios from 'axios'

export function useSellers() {
  const sellersOptions = ref<{ label: string; value: string }[]>([])
  const loadingSellers = ref(false)
  const errorSellers = ref<string | null>(null)
  const totalItemsSellers = ref(0)

  async function fetchSellers() {
    loadingSellers.value = true
    errorSellers.value = null
    try {
      const token = localStorage.getItem('auth_token')
      const res = await axios.get('/sellers', { headers: { Authorization: `Bearer ${token}` } })
      sellersOptions.value = (res.data.data || []).map((v: any) => ({
        label: v.name,
        value: v.id,
      }))
      totalItemsSellers.value = res.data.meta?.total || 0

    } catch (e) {
      sellersOptions.value = []
      errorSellers.value = 'Erro ao buscar vendedores'
      totalItemsSellers.value = 0
    } finally {
      loadingSellers.value = false
    }
  }
  return { sellersOptions, loadingSellers, errorSellers, totalItemsSellers, fetchSellers }
}
