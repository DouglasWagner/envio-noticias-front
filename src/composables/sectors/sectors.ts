/* eslint-disable @typescript-eslint/no-unused-vars */
import { onBeforeMount, ref } from 'vue'
import { UseAPI } from '../api'

interface sectors {
  id_sector: number | string
  sector_name: string
}
export const sectorsComposables = () => {
  const api = new UseAPI()
  const sectors = ref<sectors[]>()
  onBeforeMount(async () => await getSectorsAll())

  const getSectorsAll = async () => {
    try {
      const resp: { data: [] } = await api.get({
        endpoint: 'sectors/get_all_sectors'
      })
      sectors.value = resp.data
    } catch (error) {
      console.error(error)
    }
  }

  return { getSectorsAll, sectors }
}
