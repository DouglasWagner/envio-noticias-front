import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { LoginOutput } from '../../models'
import { UseAPI } from 'src/composables'

export const useAuth = defineStore('counter', () => {
  const api = new UseAPI()
  const user = ref<LoginOutput>({})

  async function login(email?: string, password?: string) {
    return await api.login<LoginOutput>({
      endpoint: '/authentication/login',
      data: { email, password }
    })
  }

  const isLoggedIn = computed(() => !!user.value.data)
  const accessToken = computed<string | undefined>(() => user.value.data?.token)

  return { user, login, isLoggedIn, accessToken }
})
