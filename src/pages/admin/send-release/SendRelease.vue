<template>
  <div class="q-pa-md">
    <div class="card">
      <div class="card-header">Disparar Releases</div>

      <hr class="divider" />

      <div class="search-box">
        <input
          type="text"
          placeholder="Encontre a release desejada"
          v-model="searchTerm"
        />
      </div>
      <hr class="divider" />
      <div style="display: flex">
        <button
          class="btn-send-release bg-primary"
          @click="() => confirmSendRelease('sendReleaseToMe')"
        >
          Enviar para mim
        </button>

        <button
          class="btn-send-release bg-primary"
          @click="() => confirmSendRelease('sendRelease')"
        >
          Disparar Release
        </button>
      </div>
      <div class="release-list">
        <p class="title">Selecione a release</p>
        <div class="release-column">
          <div
            class="release-item"
            v-for="(release, index) in filteredReleases"
            :key="index"
          >
            <label class="release-label">
              <input
                class="release-radio"
                type="radio"
                name="selectedRelease"
                :checked="index === selectedReleaseIndex"
                @change="selectRelease(index)"
              />
              <span class="release-title">{{ release.title }}</span>
            </label>
          </div>
        </div>
      </div>

      <q-dialog v-model="confirmDialogVisible" persistent>
        <q-card>
          <q-card-section class="confirm-section">
            <q-card-title class="confirm-title">Confirmar Ação</q-card-title>
            <p class="confirm-message">
              Você quer enviar a release <b>"{{ releaseTitle }}"?</b>
            </p>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              label="Cancelar"
              color="negative"
              @click="cancelSendRelease"
            />
            <!-- Aqui está o botão para enviar a release -->
            <q-btn label="Confirmar" color="primary" @click="executeAction" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { onBeforeUnmount, onMounted, ref, computed } from 'vue'
import { Profile } from 'src/models'
import { Notify } from 'quasar'
import { useAuth } from 'src/stores/data'
import { UseAPI } from 'src/composables'
const api = new UseAPI()

const $q = useQuasar()
let timer: string | number | NodeJS.Timeout | undefined

const auth = useAuth()
const form = ref<Profile>({})
const checkUpload = ref(false)
const check = computed(() => checkUpload.value)
const isLoading = ref(false)

interface IRelease {
  title: string
}

const releases = ref<IRelease[]>([])

const fetchReleases = async () => {
  try {
    const response = await api.get<any>({
      endpoint: '/release'
    })
    releases.value = response.data.map((release: IRelease) => ({
      ...release
    }))
  } catch (error) {
    console.error('Erro ao buscar releases:', error)
  }
}

onMounted(() => {
  fetchReleases()
})

onBeforeUnmount(() => {
  if (timer !== void 0) {
    clearTimeout(timer)
    $q.loading.hide()
  }
})

let selectedReleaseIndex: number | null = null

const searchTerm = ref('')

const filteredReleases = computed(() => {
  if (!searchTerm.value.trim()) {
    return releases.value
  } else {
    return releases.value.filter((release) =>
      release.title
        .toLowerCase()
        .includes(searchTerm.value.trim().toLowerCase())
    )
  }
})

const selectRelease = (index: number) => {
  selectedReleaseIndex = index
}

const sendReleaseToMe = async () => {
  if (selectedReleaseIndex !== null) {
    $q.loading.show({
      message: 'Enviando release, aguarde...',
      boxClass: 'bg-grey-2 text-grey-9',
      spinnerColor: 'primary'
    })
    try {
      const selectedRelease = releases.value[selectedReleaseIndex]
      await api.post<any>({
        endpoint: '/sendReleaseToMe',
        data: selectedRelease
      })
      Notify.create({
        color: 'green',
        position: 'center',
        message: 'Release enviada com sucesso!',
        timeout: 3000
      })
    } catch (error) {
      console.error('Erro ao enviar a release:', error)
      Notify.create({
        color: 'negative',
        position: 'center',
        message: 'Erro ao enviar a release. Por favor, tente novamente.',
        timeout: 3000
      })
    } finally {
      $q.loading.hide()
      confirmDialogVisible.value = false
    }
  } else {
    console.error(
      'Nenhuma release selecionada. Por favor, selecione uma release antes de disparar.'
    )
  }
}

const sendRelease = async () => {
  if (selectedReleaseIndex !== null) {
    $q.loading.show({
      message: 'Enviando release, aguarde...',
      boxClass: 'bg-grey-2 text-grey-9',
      spinnerColor: 'primary'
    })
    try {
      const selectedRelease = releases.value[selectedReleaseIndex]
      await api.post<any>({
        endpoint: '/sendRelease',
        data: selectedRelease
      })
      Notify.create({
        color: 'green',
        position: 'center',
        message: 'Release enviada com sucesso!',
        timeout: 3000
      })
    } catch (error) {
      console.error('Erro ao enviar a release:', error)
      Notify.create({
        color: 'negative',
        position: 'center',
        message: 'Erro ao enviar a release. Por favor, tente novamente.',
        timeout: 3000
      })
    } finally {
      $q.loading.hide()
      confirmDialogVisible.value = false
    }
  } else {
    console.error(
      'Nenhuma release selecionada. Por favor, selecione uma release antes de disparar.'
    )
  }
}

const confirmDialogVisible = ref(false)
let releaseTitle = ''
let actionToExecute: (() => void) | null = null

const cancelSendRelease = () => {
  confirmDialogVisible.value = false
}

const openConfirmDialog = (title: string, action: () => void) => {
  releaseTitle = title
  actionToExecute = action
  confirmDialogVisible.value = true
}

const confirmSendRelease = (action: string) => {
  if (selectedReleaseIndex !== null) {
    const releaseTitle = releases.value[selectedReleaseIndex].title
    openConfirmDialog(releaseTitle, () => {
      // Determinar qual ação chamar com base no parâmetro 'action'
      switch (action) {
        case 'sendReleaseToMe':
          sendReleaseToMe()
          break
        case 'sendRelease':
          sendRelease()
          break
        default:
          console.error('Ação desconhecida:', action)
      }
    })
  } else {
    $q.notify({
      type: 'negative',
      message:
        'Nenhuma release selecionada. Por favor, selecione uma release antes de disparar.'
    })
  }
}

const executeAction = () => {
  if (actionToExecute) {
    actionToExecute()
  }
}
</script>

<style lang="scss" scoped>
label {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.release-column {
  display: flex;
  flex-direction: column;
}

.release-item {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  transition: background-color 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.release-list {
  margin-top: 20px;
}

.title {
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 20px;
}

.release-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.release-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.release-item {
  padding: 10px;
  border: 1px solid #ccc;
  transition: background-color 0.3s ease;
}

.release-item:hover {
  background-color: #f0f0f0;
}

.release-item:nth-child(even) {
  background-color: #e8e8e8;
}
.title-pages {
  padding: 0;
  margin: 0;
}
.icon-button {
  padding: 5px;
  margin-right: 5px;
}

.card {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 20px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.divider {
  margin: 15px 0;
  border: none;
  border-top: 1px solid #ccc;
}

.btn-send-release {
  padding: 10px 20px;
  color: #fff;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  margin-right: 10px;
}

.search-box {
  display: flex;
  align-items: center;
  border: 1px solid #b8b6b6;
  border-radius: 4px;
  padding: 5px;
  height: 50px;
}

.search-box input[type='text'] {
  border: none;
  outline: none;
  width: 100%;
}

.release-item input[type='checkbox'] {
  margin-right: 8px;
  cursor: pointer;
}
.release-label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.release-radio {
  margin-right: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #2196f3;
  outline: none;
  cursor: pointer;
}

.release-radio:checked {
  background-color: #2196f3;
}

.confirm-section {
  .confirm-title {
    font-size: 20px;
    font-weight: bold;
  }
  .confirm-message {
    font-size: 16px;
    font-weight: 100px;
    margin-top: 10px;
  }
}
</style>
