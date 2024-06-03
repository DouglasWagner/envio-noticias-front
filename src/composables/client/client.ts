import { onBeforeMount, ref } from 'vue'
import { UseAPI } from '../api'

interface client {
  name: string
  email: string
  sector: number
  about: string
  image: File
}
export const clientComposables = () => {
  const api = new UseAPI()

  const createClient = async (data: any) => {
    try {
      const resp = await api.post({
        endpoint: 'profile',
        data,
        multipart: true
      })
      return resp
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return { createClient }
}
